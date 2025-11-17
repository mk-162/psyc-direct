'use client';

import { useState } from 'react';
import { AlertTriangle, Trash2, Skip, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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

export type OverwriteStrategy = 'overwrite' | 'skip' | 'cancel';

interface OverwriteWarningModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (strategy: OverwriteStrategy) => Promise<void>;
  existingCount: number;
  totalCount: number;
  itemType: 'category' | 'subcategory' | 'question' | 'draft';
}

export function OverwriteWarningModal({
  isOpen,
  onClose,
  onConfirm,
  existingCount,
  totalCount,
  itemType,
}: OverwriteWarningModalProps) {
  const [strategy, setStrategy] = useState<'overwrite' | 'skip'>('skip');
  const [confirmChecked, setConfirmChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    if (!confirmChecked) return;

    setIsLoading(true);
    try {
      await onConfirm(strategy);
      // Reset state
      setConfirmChecked(false);
      setStrategy('skip');
    } catch (error) {
      console.error('Operation failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setConfirmChecked(false);
    setStrategy('skip');
    onClose();
  };

  const getItemLabel = (count: number) => {
    const labels = {
      category: count === 1 ? 'category' : 'categories',
      subcategory: count === 1 ? 'subcategory' : 'subcategories',
      question: count === 1 ? 'question' : 'questions',
      draft: count === 1 ? 'draft' : 'drafts',
    };
    return labels[itemType];
  };

  const newCount = totalCount - existingCount;

  return (
    <AlertDialog open={isOpen} onOpenChange={handleCancel}>
      <AlertDialogContent className="max-w-lg">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-amber-600">
            <AlertTriangle className="h-5 w-5" />
            Existing Content Found
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-4">
              {/* Summary */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-sm text-amber-900 font-medium mb-2">
                  {existingCount} of {totalCount} {getItemLabel(totalCount)} already exist
                </p>
                <div className="space-y-1 text-xs text-amber-700">
                  <p>• {existingCount} existing {getItemLabel(existingCount)}</p>
                  {newCount > 0 && <p>• {newCount} new {getItemLabel(newCount)} will be created</p>}
                </div>
              </div>

              {/* Strategy Selection */}
              <div className="space-y-3">
                <p className="text-sm font-medium text-slate-700">
                  How would you like to handle existing content?
                </p>

                {/* Skip Strategy */}
                <button
                  onClick={() => setStrategy('skip')}
                  className={`w-full flex items-start gap-3 p-4 rounded-lg border-2 transition-all text-left ${
                    strategy === 'skip'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className={`mt-0.5 rounded-full p-1.5 ${
                    strategy === 'skip' ? 'bg-blue-500' : 'bg-slate-200'
                  }`}>
                    <Skip className={`h-4 w-4 ${
                      strategy === 'skip' ? 'text-white' : 'text-slate-500'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-900 mb-1">
                      Skip Existing (Recommended)
                    </p>
                    <p className="text-xs text-slate-600">
                      Keep existing content unchanged and only generate {newCount > 0 ? `the ${newCount} new` : 'new'} {getItemLabel(newCount || totalCount)}.
                      This preserves any manual edits or customizations.
                    </p>
                  </div>
                </button>

                {/* Overwrite Strategy */}
                <button
                  onClick={() => setStrategy('overwrite')}
                  className={`w-full flex items-start gap-3 p-4 rounded-lg border-2 transition-all text-left ${
                    strategy === 'overwrite'
                      ? 'border-red-500 bg-red-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className={`mt-0.5 rounded-full p-1.5 ${
                    strategy === 'overwrite' ? 'bg-red-500' : 'bg-slate-200'
                  }`}>
                    <Trash2 className={`h-4 w-4 ${
                      strategy === 'overwrite' ? 'text-white' : 'text-slate-500'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-900 mb-1">
                      Overwrite All
                    </p>
                    <p className="text-xs text-slate-600">
                      Replace all {existingCount} existing {getItemLabel(existingCount)} with newly generated content.
                      <span className="block mt-1 text-red-600 font-medium">
                        ⚠️ This action cannot be undone.
                      </span>
                    </p>
                  </div>
                </button>
              </div>

              {/* Confirmation Checkbox */}
              <div className={`flex items-start gap-2 p-3 rounded-lg border ${
                strategy === 'overwrite'
                  ? 'bg-red-50 border-red-200'
                  : 'bg-slate-50 border-slate-200'
              }`}>
                <Checkbox
                  id="confirm-strategy"
                  checked={confirmChecked}
                  onCheckedChange={(checked) => setConfirmChecked(checked === true)}
                  className="mt-0.5"
                />
                <label
                  htmlFor="confirm-strategy"
                  className="text-xs text-slate-700 cursor-pointer"
                >
                  {strategy === 'overwrite' ? (
                    <>
                      I understand that overwriting will <strong>permanently delete</strong> the existing content
                      and this action <strong>cannot be undone</strong>.
                    </>
                  ) : (
                    <>
                      I confirm that I want to <strong>skip existing items</strong> and only generate new content.
                    </>
                  )}
                </label>
              </div>

              {/* Processing Info */}
              <div className="text-xs text-slate-500 bg-blue-50 border border-blue-100 rounded p-3">
                <p className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">ℹ️</span>
                  <span>
                    {strategy === 'skip'
                      ? `Only ${newCount > 0 ? newCount : 'new'} ${getItemLabel(newCount || totalCount)} will be generated and added to the queue.`
                      : `All ${totalCount} ${getItemLabel(totalCount)} will be regenerated, replacing existing content.`
                    }
                  </span>
                </p>
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading} onClick={handleCancel}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={!confirmChecked || isLoading}
            className={strategy === 'overwrite' ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                {strategy === 'overwrite' ? (
                  <>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Overwrite All ({totalCount})
                  </>
                ) : (
                  <>
                    <Skip className="h-4 w-4 mr-2" />
                    Skip Existing ({newCount > 0 ? `Generate ${newCount}` : 'No new items'})
                  </>
                )}
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
