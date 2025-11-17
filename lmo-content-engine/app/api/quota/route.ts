import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase/admin';
import { COLLECTIONS } from '@/lib/firebase/schema';

export async function GET(request: NextRequest) {
  try {
    // Get authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized - Missing or invalid token' },
        { status: 401 }
      );
    }

    const idToken = authHeader.split('Bearer ')[1];

    // Verify the token
    let userId;
    try {
      const { auth: clientAuth } = await import('@/lib/firebase/config');
      const userCredential = await clientAuth.signInWithCustomToken(idToken);
      userId = userCredential.user.uid;
    } catch (error) {
      return NextResponse.json(
        { error: 'Unauthorized - Invalid token' },
        { status: 401 }
      );
    }

    const adminDb = getAdminDb();
    if (!adminDb) {
      return NextResponse.json(
        { error: 'Firebase Admin not initialized' },
        { status: 500 }
      );
    }

    // Get customer document to check usage and quota
    const customerDoc = await adminDb.collection(COLLECTIONS.CUSTOMERS).doc(userId).get();

    if (!customerDoc.exists) {
      // Return default free tier quota
      return NextResponse.json({
        used: 0,
        limit: 100, // Free tier default
        period: 'monthly',
        resetDate: getNextMonthFirstDay().toISOString(),
        tier: 'free',
      });
    }

    const customerData = customerDoc.data();
    const subscription = customerData?.subscription;

    // Determine quota based on subscription tier
    let limit = 100; // Free tier
    let tier = 'free';

    if (subscription?.status === 'active') {
      const planId = subscription.planId;

      // Map plan IDs to quotas (adjust based on your Stripe plans)
      const quotaMap: Record<string, number> = {
        'starter': 500,
        'professional': 2000,
        'business': 10000,
        'enterprise': 50000,
      };

      limit = quotaMap[planId] || 100;
      tier = planId;
    }

    // Get current usage from jobs or content generated this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const jobsSnapshot = await adminDb
      .collection(COLLECTIONS.JOBS)
      .where('userId', '==', userId)
      .where('status', '==', 'completed')
      .where('createdAt', '>=', startOfMonth)
      .get();

    const used = customerData?.usage?.monthly || jobsSnapshot.size;

    // Calculate reset date (first day of next month)
    const resetDate = getNextMonthFirstDay();

    return NextResponse.json({
      used,
      limit,
      period: 'monthly',
      resetDate: resetDate.toISOString(),
      tier,
      percentage: (used / limit) * 100,
    });
  } catch (error: any) {
    console.error('Get quota error:', error);
    return NextResponse.json(
      {
        error: error.message || 'Failed to get quota',
        details: error.toString(),
      },
      { status: 500 }
    );
  }
}

function getNextMonthFirstDay(): Date {
  const date = new Date();
  date.setMonth(date.getMonth() + 1);
  date.setDate(1);
  date.setHours(0, 0, 0, 0);
  return date;
}
