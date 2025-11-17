'use client';

import { useState, useEffect } from 'react';
import { Zap, AlertTriangle, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface QuotaIndicatorProps {
  userId: string;
  projectId?: string;
  compact?: boolean;
}

interface QuotaData {
  used: number;
  limit: number;
  period: 'monthly' | 'daily';
  resetDate: string;
}

export function QuotaIndicator({ userId, projectId, compact = false }: QuotaIndicatorProps) {
  const [quota, setQuota] = useState<QuotaData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (userId) {
      fetchQuota();
    }
  }, [userId, projectId]);

  const fetchQuota = async () => {
    try {
      setLoading(true);
      const { auth } = await import('@/lib/firebase/config');
      const idToken = await auth.currentUser?.getIdToken();

      if (!idToken) return;

      const params = new URLSearchParams();
      if (projectId) params.append('projectId', projectId);

      const response = await fetch(`/api/quota?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${idToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setQuota(data);
      }
    } catch (error) {
      console.error('Failed to fetch quota:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !quota) {
    return null;
  }

  const percentage = (quota.used / quota.limit) * 100;
  const remaining = quota.limit - quota.used;

  // Determine status and color
  let status: 'good' | 'warning' | 'critical' = 'good';
  let color = 'text-green-600 bg-green-50';
  let Icon = CheckCircle;

  if (percentage >= 90) {
    status = 'critical';
    color = 'text-red-600 bg-red-50';
    Icon = AlertTriangle;
  } else if (percentage >= 75) {
    status = 'warning';
    color = 'text-orange-600 bg-orange-50';
    Icon = AlertTriangle;
  }

  if (compact) {
    return (
      <div
        className="relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <button
          className={cn(
            'flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium transition-all',
            color
          )}
        >
          <Zap className="h-3.5 w-3.5" />
          <span>{remaining}</span>
        </button>

        {/* Tooltip on hover */}
        {isHovered && (
          <div className="absolute top-full right-0 mt-2 bg-white border border-slate-200 rounded-lg shadow-xl p-3 w-64 z-50">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="text-xs font-semibold text-slate-900">Generation Quota</p>
                <p className="text-xs text-slate-500 mt-0.5">
                  {quota.period === 'monthly' ? 'Monthly' : 'Daily'} limit
                </p>
              </div>
              <Icon className={cn('h-4 w-4', status === 'critical' ? 'text-red-600' : status === 'warning' ? 'text-orange-600' : 'text-green-600')} />
            </div>

            {/* Progress bar */}
            <div className="mb-2">
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={cn(
                    'h-full transition-all',
                    status === 'critical' ? 'bg-red-500' : status === 'warning' ? 'bg-orange-500' : 'bg-green-500'
                  )}
                  style={{ width: `${Math.min(percentage, 100)}%` }}
                />
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600">
                {quota.used.toLocaleString()} / {quota.limit.toLocaleString()} used
              </span>
              <span className="font-medium text-slate-900">
                {remaining.toLocaleString()} left
              </span>
            </div>

            {status === 'critical' && (
              <div className="mt-2 pt-2 border-t">
                <p className="text-xs text-red-600 font-medium">
                  You're running low on credits
                </p>
                <button className="text-xs text-lmo-dark-600 hover:text-lmo-dark-700 font-medium mt-1">
                  Upgrade plan →
                </button>
              </div>
            )}

            {quota.resetDate && (
              <p className="text-xs text-slate-500 mt-2">
                Resets on {new Date(quota.resetDate).toLocaleDateString()}
              </p>
            )}
          </div>
        )}
      </div>
    );
  }

  // Full display mode
  return (
    <div className={cn('rounded-lg border p-3', color)}>
      <div className="flex items-start justify-between mb-2">
        <div>
          <p className="text-sm font-semibold">Generation Quota</p>
          <p className="text-xs opacity-80 mt-0.5">
            {quota.period === 'monthly' ? 'Monthly' : 'Daily'} limit
          </p>
        </div>
        <Icon className="h-5 w-5" />
      </div>

      {/* Progress bar */}
      <div className="mb-2">
        <div className="h-2 bg-white/50 rounded-full overflow-hidden">
          <div
            className={cn(
              'h-full transition-all',
              status === 'critical' ? 'bg-red-600' : status === 'warning' ? 'bg-orange-600' : 'bg-green-600'
            )}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between text-sm">
        <span className="opacity-80">
          {quota.used.toLocaleString()} / {quota.limit.toLocaleString()} used
        </span>
        <span className="font-medium">
          {remaining.toLocaleString()} remaining
        </span>
      </div>

      {status === 'critical' && (
        <div className="mt-3 pt-3 border-t border-current/20">
          <p className="text-sm font-medium mb-2">You're running low on credits</p>
          <button className="text-sm font-medium underline">
            Upgrade your plan
          </button>
        </div>
      )}

      {quota.resetDate && (
        <p className="text-xs opacity-70 mt-2">
          Resets on {new Date(quota.resetDate).toLocaleDateString()}
        </p>
      )}
    </div>
  );
}
