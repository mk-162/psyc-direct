import { getAdminDb } from '../firebase/admin';
import { COLLECTIONS, type Customer, type GenerationHistoryEntry, type SubscriptionTier } from '../firebase/schema';
import { FieldValue, Timestamp } from 'firebase-admin/firestore';

// Tier limits configuration
const TIER_LIMITS: Record<SubscriptionTier, number> = {
  free: 10,
  pro: 100,
  enterprise: -1, // Unlimited
};

export interface UsageCheckResult {
  allowed: boolean;
  remaining: number;
  limit: number;
  tier: SubscriptionTier;
  message?: string;
}

export class UsageTracker {
  private db = getAdminDb();

  /**
   * Check if user can perform X generations
   */
  async checkLimit(userId: string, requestedCount: number): Promise<UsageCheckResult> {
    const customerDoc = await this.db
      .collection(COLLECTIONS.CUSTOMERS)
      .doc(userId)
      .get();

    if (!customerDoc.exists) {
      // Create default free tier customer
      await this.initializeCustomer(userId);
      return this.checkLimit(userId, requestedCount);
    }

    const customer = customerDoc.data() as Customer;
    const { subscription } = customer;

    // Enterprise has unlimited
    if (subscription.tier === 'enterprise' || subscription.generationsLimit === -1) {
      return {
        allowed: true,
        remaining: -1,
        limit: -1,
        tier: subscription.tier,
      };
    }

    const used = subscription.generationsThisMonth;
    const limit = subscription.generationsLimit;
    const remaining = limit - used;

    if (requestedCount > remaining) {
      return {
        allowed: false,
        remaining,
        limit,
        tier: subscription.tier,
        message: `Not enough credits. You need ${requestedCount} but only have ${remaining} remaining.`,
      };
    }

    return {
      allowed: true,
      remaining: remaining - requestedCount, // Remaining after this operation
      limit,
      tier: subscription.tier,
    };
  }

  /**
   * Consume credits after generation
   */
  async consumeCredits(
    userId: string,
    count: number,
    type: GenerationHistoryEntry['type'],
    jobId?: string
  ): Promise<void> {
    const customerRef = this.db.collection(COLLECTIONS.CUSTOMERS).doc(userId);

    await customerRef.update({
      'subscription.generationsThisMonth': FieldValue.increment(count),
      generationHistory: FieldValue.arrayUnion({
        timestamp: Timestamp.now(),
        type,
        count,
        jobId,
      } as GenerationHistoryEntry),
      updatedAt: FieldValue.serverTimestamp(),
    });
  }

  /**
   * Get remaining credits for current period
   */
  async getRemainingCredits(userId: string): Promise<UsageCheckResult> {
    const customerDoc = await this.db
      .collection(COLLECTIONS.CUSTOMERS)
      .doc(userId)
      .get();

    if (!customerDoc.exists) {
      return {
        allowed: true,
        remaining: TIER_LIMITS.free,
        limit: TIER_LIMITS.free,
        tier: 'free',
      };
    }

    const customer = customerDoc.data() as Customer;
    const { subscription } = customer;

    if (subscription.tier === 'enterprise' || subscription.generationsLimit === -1) {
      return {
        allowed: true,
        remaining: -1,
        limit: -1,
        tier: subscription.tier,
      };
    }

    const remaining = subscription.generationsLimit - subscription.generationsThisMonth;

    return {
      allowed: remaining > 0,
      remaining: Math.max(0, remaining),
      limit: subscription.generationsLimit,
      tier: subscription.tier,
    };
  }

  /**
   * Reset monthly usage (called by cron job)
   */
  async resetMonthlyUsage(userId: string): Promise<void> {
    const customerRef = this.db.collection(COLLECTIONS.CUSTOMERS).doc(userId);
    const now = Timestamp.now();
    const nextMonth = new Date(now.toDate());
    nextMonth.setMonth(nextMonth.getMonth() + 1);

    await customerRef.update({
      'subscription.generationsThisMonth': 0,
      'subscription.periodStart': now,
      'subscription.periodEnd': Timestamp.fromDate(nextMonth),
      updatedAt: FieldValue.serverTimestamp(),
    });
  }

  /**
   * Initialize new customer with free tier
   */
  private async initializeCustomer(userId: string): Promise<void> {
    const now = Timestamp.now();
    const nextMonth = new Date(now.toDate());
    nextMonth.setMonth(nextMonth.getMonth() + 1);

    const customer: Partial<Customer> = {
      id: userId,
      subscription: {
        tier: 'free',
        generationsThisMonth: 0,
        generationsLimit: TIER_LIMITS.free,
        periodStart: now,
        periodEnd: Timestamp.fromDate(nextMonth),
        status: 'active',
      },
      usage: {
        questionsThisMonth: 0,
        questionsTotal: 0,
        billingCycleStart: now,
      },
      generationHistory: [],
      createdAt: now,
      updatedAt: now,
    };

    await this.db.collection(COLLECTIONS.CUSTOMERS).doc(userId).set(customer);
  }

  /**
   * Upgrade user tier
   */
  async upgradeTier(userId: string, newTier: SubscriptionTier): Promise<void> {
    const customerRef = this.db.collection(COLLECTIONS.CUSTOMERS).doc(userId);

    await customerRef.update({
      'subscription.tier': newTier,
      'subscription.generationsLimit': TIER_LIMITS[newTier],
      'subscription.status': 'active',
      updatedAt: FieldValue.serverTimestamp(),
    });
  }

  /**
   * Get usage statistics
   */
  async getUsageStats(userId: string): Promise<{
    thisMonth: { categories: number; questions: number; drafts: number; total: number };
    allTime: number;
    tier: SubscriptionTier;
    limit: number;
  }> {
    const customerDoc = await this.db
      .collection(COLLECTIONS.CUSTOMERS)
      .doc(userId)
      .get();

    if (!customerDoc.exists) {
      return {
        thisMonth: { categories: 0, questions: 0, drafts: 0, total: 0 },
        allTime: 0,
        tier: 'free',
        limit: TIER_LIMITS.free,
      };
    }

    const customer = customerDoc.data() as Customer;
    const history = customer.generationHistory || [];

    // Get current month's history
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);

    const thisMonthHistory = history.filter(
      (entry) => entry.timestamp.toDate() >= monthStart
    );

    const categories = thisMonthHistory
      .filter((e) => e.type === 'category' || e.type === 'subcategory')
      .reduce((sum, e) => sum + e.count, 0);

    const questions = thisMonthHistory
      .filter((e) => e.type === 'question')
      .reduce((sum, e) => sum + e.count, 0);

    const drafts = thisMonthHistory
      .filter((e) => e.type === 'draft')
      .reduce((sum, e) => sum + e.count, 0);

    const allTime = history.reduce((sum, e) => sum + e.count, 0);

    return {
      thisMonth: {
        categories,
        questions,
        drafts,
        total: customer.subscription.generationsThisMonth,
      },
      allTime,
      tier: customer.subscription.tier,
      limit: customer.subscription.generationsLimit,
    };
  }
}

// Singleton instance
export const usageTracker = new UsageTracker();
