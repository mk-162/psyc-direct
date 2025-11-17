'use client';

import { useState, useEffect, useRef } from 'react';
import { Zap, X, CheckCircle2, AlertCircle, Folder, FileText, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { Button } from '@/components/ui/button';
import type { JobProgress } from '@/lib/services/queue-manager';
import { db } from '@/lib/firebase/config';
import { collection, query, where, onSnapshot, orderBy, limit } from 'firebase/firestore';
import { COLLECTIONS } from '@/lib/firebase/schema';

interface QueueHeaderProps {
  userId: string;
  projectId?: string;
}


type QueueState = 'idle' | 'processing' | 'error' | 'success';

export function QueueHeader({ userId, projectId }: QueueHeaderProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [jobs, setJobs] = useState<JobProgress[]>([]);
  const [queueState, setQueueState] = useState<QueueState>('idle');
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Close panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    };

    if (isExpanded) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isExpanded]);

  // Subscribe to real-time job updates
  useEffect(() => {
    if (!userId) return;

    let q = query(
      collection(db, COLLECTIONS.JOBS),
      where('userId', '==', userId),
      where('status', 'in', ['queued', 'processing']),
      orderBy('createdAt', 'desc'),
      limit(10)
    );

    // Filter by project if provided
    if (projectId) {
      q = query(
        collection(db, COLLECTIONS.JOBS),
        where('userId', '==', userId),
        where('projectId', '==', projectId),
        where('status', 'in', ['queued', 'processing']),
        orderBy('createdAt', 'desc'),
        limit(10)
      );
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const activeJobs = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          jobId: doc.id,
          status: data.status,
          progress: data.progress || 0,
          processedCount: data.processedCount || 0,
          totalCount: data.totalCount || data.input?.length || 0,
          errors: data.error ? [data.error] : undefined,
          estimatedTimeRemaining: estimateTimeRemaining(data),
        } as JobProgress;
      });

      // Update queue state based on jobs
      const prevJobCount = jobs.length;
      const newJobCount = activeJobs.length;

      setJobs(activeJobs);

      if (newJobCount === 0 && prevJobCount > 0) {
        // Jobs just completed
        setQueueState('success');
        setShowSuccessNotification(true);
        setTimeout(() => {
          setQueueState('idle');
          setShowSuccessNotification(false);
        }, 3000);
      } else if (newJobCount > 0) {
        // Check for errors
        const hasErrors = activeJobs.some((job) => job.errors && job.errors.length > 0);
        if (hasErrors) {
          setQueueState('error');
        } else {
          setQueueState('processing');
        }
      } else {
        setQueueState('idle');
      }
    });

    return () => unsubscribe();
  }, [userId, projectId]);

  const estimateTimeRemaining = (jobData: any): number | undefined => {
    if (!jobData.startedAt || jobData.processedCount === 0) {
      return undefined;
    }

    const startTime = jobData.startedAt.toMillis();
    const elapsed = Date.now() - startTime;
    const avgTimePerItem = elapsed / jobData.processedCount;
    const remaining = (jobData.totalCount || 0) - jobData.processedCount;

    return Math.round((avgTimePerItem * remaining) / 1000); // Convert to seconds
  };

  const handleCancelJob = async (jobId: string) => {
    try {
      const { auth } = await import('@/lib/firebase/config');
      const idToken = await auth.currentUser?.getIdToken();

      await fetch(`/api/queue/jobs/${jobId}/cancel`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${idToken}` },
      });
    } catch (error) {
      console.error('Failed to cancel job:', error);
    }
  };

  const getJobTypeIcon = (job: JobProgress) => {
    // Determine icon based on job metadata
    return <Folder className="h-4 w-4" />;
  };

  const getJobTypeLabel = (job: JobProgress) => {
    // You can enhance this with actual job metadata
    return 'Content generation';
  };

  const formatTimeRemaining = (seconds?: number) => {
    if (!seconds) return 'Calculating...';
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    return `${minutes}m ${seconds % 60}s`;
  };

  const activeJobCount = jobs.length;
  const failedJobCount = jobs.filter((job) => job.errors && job.errors.length > 0).length;

  // Badge configuration based on state
  const badgeConfig = {
    idle: {
      bgColor: 'bg-slate-100',
      textColor: 'text-slate-600',
      icon: Zap,
      pulse: false,
    },
    processing: {
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-700',
      icon: Zap,
      pulse: true,
    },
    error: {
      bgColor: 'bg-red-100',
      textColor: 'text-red-700',
      icon: AlertCircle,
      pulse: false,
    },
    success: {
      bgColor: 'bg-green-100',
      textColor: 'text-green-700',
      icon: CheckCircle2,
      pulse: false,
    },
  };

  const config = badgeConfig[queueState];
  const BadgeIcon = config.icon;

  if (activeJobCount === 0 && queueState === 'idle') {
    return null; // Don't show anything when idle with no jobs
  }

  return (
    <div className="relative" ref={panelRef}>
      {/* Collapsed Badge */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          'flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium text-sm transition-all',
          config.bgColor,
          config.textColor,
          'hover:opacity-80',
          config.pulse && 'animate-pulse'
        )}
      >
        <BadgeIcon className="h-4 w-4" />
        {queueState === 'success' ? (
          <span>Complete!</span>
        ) : queueState === 'error' ? (
          <span>{failedJobCount} failed</span>
        ) : (
          <span>{activeJobCount} generating</span>
        )}
      </button>

      {/* Success Notification (auto-dismiss) */}
      {showSuccessNotification && !isExpanded && (
        <div className="absolute top-full right-0 mt-2 bg-green-50 border border-green-200 rounded-lg p-3 shadow-lg min-w-[250px] z-50">
          <div className="flex items-start gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-green-900">Generation complete!</p>
              <p className="text-xs text-green-700 mt-0.5">Your content is ready for review</p>
            </div>
          </div>
        </div>
      )}

      {/* Expanded Panel */}
      {isExpanded && activeJobCount > 0 && (
        <div className="absolute top-full right-0 mt-2 bg-white border border-slate-200 rounded-lg shadow-xl w-96 z-50">
          {/* Panel Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Generation Queue</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {activeJobCount} {activeJobCount === 1 ? 'job' : 'jobs'} in progress
              </p>
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              className="p-1 hover:bg-slate-100 rounded transition-colors"
            >
              <X className="h-4 w-4 text-slate-500" />
            </button>
          </div>

          {/* Job List */}
          <div className="max-h-[300px] overflow-y-auto">
            {jobs.map((job) => (
              <div
                key={job.jobId}
                className="p-4 border-b last:border-b-0 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-start gap-3">
                  {/* Icon */}
                  <div className="p-2 bg-lmo-dark-600 text-white rounded">
                    {getJobTypeIcon(job)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-medium text-slate-900">
                          {getJobTypeLabel(job)}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {job.processedCount} / {job.totalCount} items
                        </p>
                      </div>
                      <button
                        onClick={() => handleCancelJob(job.jobId)}
                        className="p-1 hover:bg-slate-200 rounded transition-colors flex-shrink-0"
                        title="Cancel job"
                      >
                        <X className="h-3.5 w-3.5 text-slate-500" />
                      </button>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-2">
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={cn(
                            'h-full transition-all duration-300',
                            job.errors && job.errors.length > 0
                              ? 'bg-red-500'
                              : 'bg-lmo-dark-600'
                          )}
                          style={{ width: `${job.progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Status/Time */}
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-slate-500">
                        {job.status === 'queued' ? (
                          'Queued'
                        ) : job.errors && job.errors.length > 0 ? (
                          <span className="text-red-600 font-medium">Error occurred</span>
                        ) : (
                          <span className="flex items-center gap-1">
                            <Loader2 className="h-3 w-3 animate-spin" />
                            Processing...
                          </span>
                        )}
                      </span>
                      {job.estimatedTimeRemaining !== undefined && (
                        <span className="text-xs text-slate-500">
                          ~{formatTimeRemaining(job.estimatedTimeRemaining)} remaining
                        </span>
                      )}
                    </div>

                    {/* Errors */}
                    {job.errors && job.errors.length > 0 && (
                      <div className="mt-2 p-2 bg-red-50 rounded text-xs text-red-700">
                        {job.errors[0]}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Panel Footer */}
          <div className="p-3 border-t bg-slate-50">
            <a
              href="/queue"
              className="text-xs text-lmo-dark-600 hover:text-lmo-dark-700 font-medium"
            >
              View full queue →
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
