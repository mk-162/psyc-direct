'use client';

import { useState, useEffect } from 'react';
import { Sparkles, AlertCircle, CheckCircle2, Loader2, Crown, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export type GenerationType = 'category' | 'subcategory' | 'question' | 'draft';

interface GenerationConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  type: GenerationType;
  count: number;
  userId: string;
  existingCount?: number; // Number of existing items that will be overwritten
}

interface UsageInfo {
  allowed: boolean;
  remaining: number;
  limit: number;
  tier: 'free' | 'pro' | 'enterprise';
  message?: string;
}

export function GenerationConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  type,
  count,
  userId,
  existingCount = 0,
}: GenerationConfirmationModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [usageInfo, setUsageInfo] = useState<UsageInfo | null>(null);

  // Check usage limits when modal opens
  useEffect(() => {
    if (isOpen && userId) {
      checkUsageLimits();
    }
  }, [isOpen, userId, count]);

  const checkUsageLimits = async () => {
    setIsChecking(true);
    try {
      const { auth } = await import('@/lib/firebase/config');
      const idToken = await auth.currentUser?.getIdToken();

      const response = await fetch(`/api/usage/check?count=${count}`, {
        headers: { Authorization: `Bearer ${idToken}` },
      });

      const data = await response.json();
      if (response.ok) {
        setUsageInfo(data);
      }
    } catch (error) {
      console.error('Failed to check usage limits:', error);
      // Default to allowing if check fails
      setUsageInfo({
        allowed: true,
        remaining: 0,
        limit: 0,
        tier: 'free',
      });
    } finally {
      setIsChecking(false);
    }
  };

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm();
      onClose();
    } catch (error) {
      console.error('Generation failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getTypeLabel = (type: GenerationType, count: number) => {
    const labels = {
      category: count === 1 ? 'category' : 'categories',
      subcategory: count === 1 ? 'subcategory' : 'subcategories',
      question: count === 1 ? 'question' : 'questions',
      draft: count === 1 ? 'draft' : 'drafts',
    };
    return labels[type];
  };

  const getTierBadge = (tier: string) => {
    const configs = {
      free: {
        label: 'Free',
        icon: Zap,
        className: 'bg-slate-100 text-slate-700',
      },
      pro: {
        label: 'Pro',
        icon: Sparkles,
        className: 'bg-blue-100 text-blue-700',
      },
      enterprise: {
        label: 'Enterprise',
        icon: Crown,
        className: 'bg-purple-100 text-purple-700',
      },
    };

    const config = configs[tier as keyof typeof configs] || configs.free;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.className}`}>
        <Icon className="h-3 w-3" />
        {config.label}
      </span>
    );
  };

  const isOverLimit = usageInfo && !usageInfo.allowed;
  const hasExisting = existingCount > 0;
  const isUnlimited = usageInfo?.limit === -1;

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-600" />
            Confirm Generation
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-4">
              {/* Generation Summary */}
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-700">Items to generate</span>
                  <span className="text-2xl font-bold text-slate-900">{count}</span>
                </div>
                <p className="text-xs text-slate-500">
                  {count} {getTypeLabel(type, count)} will be created using AI
                </p>
                {hasExisting && (
                  <div className="mt-2 pt-2 border-t border-slate-200">
                    <p className="text-xs text-amber-600 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {existingCount} existing {getTypeLabel(type, existingCount)} will be overwritten
                    </p>
                  </div>
                )}
              </div>

              {/* Usage Status */}
              {isChecking ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
                  <span className="ml-2 text-sm text-slate-500">Checking limits...</span>
                </div>
              ) : usageInfo ? (
                <div className={`rounded-lg p-4 border ${
                  isOverLimit
                    ? 'bg-red-50 border-red-200'
                    : 'bg-green-50 border-green-200'
                }`}>
                  <div className="flex items-start gap-3">
                    {isOverLimit ? (
                      <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    ) : (
                      <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className={`text-sm font-medium ${
                          isOverLimit ? 'text-red-900' : 'text-green-900'
                        }`}>
                          {isOverLimit ? 'Insufficient credits' : 'Credits available'}
                        </span>
                        {getTierBadge(usageInfo.tier)}
                      </div>

                      {isOverLimit ? (
                        <p className="text-xs text-red-700 mt-1">
                          {usageInfo.message || 'You don\'t have enough credits for this generation.'}
                        </p>
                      ) : (
                        <div className="mt-2">
                          {isUnlimited ? (
                            <div className="flex items-center gap-2">
                              <div className="flex-1 h-2 bg-green-200 rounded-full overflow-hidden">
                                <div className="h-full bg-green-500 w-full" />
                              </div>
                              <span className="text-xs font-medium text-green-700">Unlimited</span>
                            </div>
                          ) : (
                            <>
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs text-green-700">
                                  {usageInfo.remaining} / {usageInfo.limit} credits remaining
                                </span>
                                <span className="text-xs font-medium text-green-700">
                                  {Math.round((usageInfo.remaining / usageInfo.limit) * 100)}%
                                </span>
                              </div>
                              <div className="h-2 bg-green-200 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-green-500 transition-all duration-300"
                                  style={{ width: `${(usageInfo.remaining / usageInfo.limit) * 100}%` }}
                                />
                              </div>
                              <p className="text-xs text-green-600 mt-2">
                                After this generation: {usageInfo.remaining - count} credits remaining
                              </p>
                            </>
                          )}
                        </div>
                      )}

                      {/* Upgrade CTA for over-limit users */}
                      {isOverLimit && usageInfo.tier !== 'enterprise' && (
                        <a
                          href="/settings?tab=billing"
                          className="inline-flex items-center gap-1 mt-3 text-xs font-medium text-purple-600 hover:text-purple-700"
                        >
                          <Crown className="h-3 w-3" />
                          Upgrade for more credits →
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ) : null}

              {/* Processing Info */}
              {!isOverLimit && (
                <div className="text-xs text-slate-500 bg-blue-50 border border-blue-100 rounded p-3">
                  <p className="flex items-start gap-2">
                    <span className="text-blue-600 mt-0.5">ℹ️</span>
                    <span>
                      Generation will be queued and processed in the background.
                      You can continue working while items are being created.
                    </span>
                  </p>
                </div>
              )}
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isLoading || isChecking || isOverLimit}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Generate {count} {getTypeLabel(type, count)}
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
