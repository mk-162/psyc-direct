import { getAdminDb } from '../firebase/admin';
import { COLLECTIONS, type Job, type JobType, type JobStatus } from '../firebase/schema';
import { FieldValue, Timestamp } from 'firebase-admin/firestore';

export interface EnqueueOptions {
  priority?: number; // Higher number = higher priority
  metadata?: Record<string, any>;
  retryConfig?: {
    maxRetries?: number;
    retryDelay?: number; // milliseconds
  };
}

export interface JobProgress {
  jobId: string;
  status: JobStatus;
  progress: number; // 0-100
  processedCount: number;
  totalCount: number;
  errors?: string[];
  estimatedTimeRemaining?: number; // seconds
}

export class QueueManager {
  private db = getAdminDb();
  private readonly BATCH_LIMIT = 25; // User-facing limit per batch

  /**
   * Enqueue a new job
   */
  async enqueueJob(
    type: JobType,
    userId: string,
    projectId: string,
    items: any[],
    options: EnqueueOptions = {}
  ): Promise<string> {
    // Split into batches if exceeds limit
    if (items.length > this.BATCH_LIMIT) {
      const jobIds: string[] = [];
      for (let i = 0; i < items.length; i += this.BATCH_LIMIT) {
        const batch = items.slice(i, i + this.BATCH_LIMIT);
        const jobId = await this.createJob(type, userId, projectId, batch, options);
        jobIds.push(jobId);
      }
      return jobIds[0]; // Return first job ID as parent
    }

    return this.createJob(type, userId, projectId, items, options);
  }

  /**
   * Create a single job document
   */
  private async createJob(
    type: JobType,
    userId: string,
    projectId: string,
    items: any[],
    options: EnqueueOptions
  ): Promise<string> {
    const now = Timestamp.now();
    const expiresAt = new Date(now.toDate());
    expiresAt.setHours(expiresAt.getHours() + 24); // Jobs expire after 24 hours

    const job: Omit<Job, 'id'> = {
      type,
      status: 'queued',
      priority: options.priority || 0,
      userId,
      projectId,

      input: items,
      output: null,

      progress: 0,
      processedCount: 0,
      totalCount: items.length,

      error: null,
      retryCount: 0,
      maxRetries: options.retryConfig?.maxRetries || 3,
      retryDelay: options.retryConfig?.retryDelay || 5000,

      metadata: options.metadata || {},

      createdAt: now,
      updatedAt: now,
      expiresAt: Timestamp.fromDate(expiresAt),
    };

    const jobRef = await this.db.collection(COLLECTIONS.JOBS).add(job);
    return jobRef.id;
  }

  /**
   * Get next job to process (FIFO with priority)
   */
  async getNextJob(): Promise<(Job & { id: string }) | null> {
    const snapshot = await this.db
      .collection(COLLECTIONS.JOBS)
      .where('status', '==', 'queued')
      .orderBy('priority', 'desc')
      .orderBy('createdAt', 'asc')
      .limit(1)
      .get();

    if (snapshot.empty) {
      return null;
    }

    const doc = snapshot.docs[0];
    const job = { id: doc.id, ...doc.data() } as Job & { id: string };

    // Mark as processing
    await doc.ref.update({
      status: 'processing',
      startedAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    return job;
  }

  /**
   * Update job progress
   */
  async updateJobProgress(
    jobId: string,
    progress: number,
    processedCount: number,
    partialOutput?: any
  ): Promise<void> {
    const updates: any = {
      progress,
      processedCount,
      updatedAt: FieldValue.serverTimestamp(),
    };

    if (partialOutput) {
      updates.output = FieldValue.arrayUnion(...(Array.isArray(partialOutput) ? partialOutput : [partialOutput]));
    }

    await this.db
      .collection(COLLECTIONS.JOBS)
      .doc(jobId)
      .update(updates);
  }

  /**
   * Mark job as completed
   */
  async completeJob(jobId: string, output: any): Promise<void> {
    const now = Timestamp.now();
    const jobDoc = await this.db.collection(COLLECTIONS.JOBS).doc(jobId).get();
    const job = jobDoc.data() as Job;

    const startTime = job.startedAt?.toMillis() || now.toMillis();
    const processingTime = now.toMillis() - startTime;

    await jobDoc.ref.update({
      status: 'completed',
      progress: 100,
      processedCount: job.totalCount,
      output,
      completedAt: now,
      processingTime,
      updatedAt: now,
    });
  }

  /**
   * Mark job as failed
   */
  async failJob(jobId: string, error: string, shouldRetry: boolean = true): Promise<void> {
    const jobDoc = await this.db.collection(COLLECTIONS.JOBS).doc(jobId).get();
    const job = jobDoc.data() as Job;

    // Check if should retry
    if (shouldRetry && job.retryCount < job.maxRetries) {
      await jobDoc.ref.update({
        status: 'queued', // Re-queue for retry
        retryCount: FieldValue.increment(1),
        error,
        updatedAt: FieldValue.serverTimestamp(),
      });
      return;
    }

    // Mark as permanently failed
    await jobDoc.ref.update({
      status: 'failed',
      error,
      updatedAt: FieldValue.serverTimestamp(),
    });
  }

  /**
   * Cancel a job
   */
  async cancelJob(jobId: string): Promise<void> {
    await this.db
      .collection(COLLECTIONS.JOBS)
      .doc(jobId)
      .update({
        status: 'cancelled',
        updatedAt: FieldValue.serverTimestamp(),
      });
  }

  /**
   * Get user's active jobs
   */
  async getUserJobs(userId: string, limit: number = 10): Promise<JobProgress[]> {
    const snapshot = await this.db
      .collection(COLLECTIONS.JOBS)
      .where('userId', '==', userId)
      .where('status', 'in', ['queued', 'processing'])
      .orderBy('createdAt', 'desc')
      .limit(limit)
      .get();

    return snapshot.docs.map((doc) => {
      const job = doc.data() as Job;
      return {
        jobId: doc.id,
        status: job.status,
        progress: job.progress,
        processedCount: job.processedCount,
        totalCount: job.totalCount,
        errors: job.error ? [job.error] : undefined,
        estimatedTimeRemaining: this.estimateTimeRemaining(job),
      };
    });
  }

  /**
   * Get job history for analytics
   */
  async getJobHistory(
    userId: string,
    limit: number = 50,
    status?: JobStatus
  ): Promise<(Job & { id: string })[]> {
    let query = this.db
      .collection(COLLECTIONS.JOBS)
      .where('userId', '==', userId);

    if (status) {
      query = query.where('status', '==', status);
    }

    const snapshot = await query
      .orderBy('createdAt', 'desc')
      .limit(limit)
      .get();

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    } as Job & { id: string }));
  }

  /**
   * Clean up expired jobs (called by cron)
   */
  async cleanupExpiredJobs(): Promise<number> {
    const now = Timestamp.now();
    const snapshot = await this.db
      .collection(COLLECTIONS.JOBS)
      .where('expiresAt', '<', now)
      .get();

    const batch = this.db.batch();
    snapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });

    await batch.commit();
    return snapshot.size;
  }

  /**
   * Estimate time remaining for a job
   */
  private estimateTimeRemaining(job: Job): number | undefined {
    if (!job.startedAt || job.processedCount === 0) {
      return undefined;
    }

    const elapsed = Date.now() - job.startedAt.toMillis();
    const avgTimePerItem = elapsed / job.processedCount;
    const remaining = job.totalCount - job.processedCount;

    return Math.round((avgTimePerItem * remaining) / 1000); // Convert to seconds
  }

  /**
   * Get queue statistics
   */
  async getQueueStats(): Promise<{
    queued: number;
    processing: number;
    completed: number;
    failed: number;
  }> {
    const [queued, processing, completed, failed] = await Promise.all([
      this.db.collection(COLLECTIONS.JOBS).where('status', '==', 'queued').count().get(),
      this.db.collection(COLLECTIONS.JOBS).where('status', '==', 'processing').count().get(),
      this.db.collection(COLLECTIONS.JOBS).where('status', '==', 'completed').count().get(),
      this.db.collection(COLLECTIONS.JOBS).where('status', '==', 'failed').count().get(),
    ]);

    return {
      queued: queued.data().count,
      processing: processing.data().count,
      completed: completed.data().count,
      failed: failed.data().count,
    };
  }
}

// Singleton instance
export const queueManager = new QueueManager();
