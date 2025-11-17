'use client';

import { useState } from 'react';
import { CheckCircle2, Upload, Archive, Trash2, X, Loader2, Sparkles, Layers, HelpCircle, Download } from 'lucide-react';
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

interface BulkActionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCount: number;
  mode?: 'content' | 'categories';
  onGenerate?: () => Promise<void>;
  onApprove?: () => Promise<void>;
  onPublish?: () => Promise<void>;
  onArchive?: () => Promise<void>;
  onDelete?: () => Promise<void>;
  // Category-specific actions
  onGenerateSubcategories?: () => Promise<void>;
  onGenerateQuestions?: () => Promise<void>;
  onExportCategories?: () => Promise<void>;
}

type Action = 'generate' | 'approve' | 'publish' | 'archive' | 'delete' | 'generateSubcategories' | 'generateQuestions' | 'exportCategories' | null;

export function BulkActionsModal({
  isOpen,
  onClose,
  selectedCount,
  mode = 'content',
  onGenerate,
  onApprove,
  onPublish,
  onArchive,
  onDelete,
  onGenerateSubcategories,
  onGenerateQuestions,
  onExportCategories,
}: BulkActionsModalProps) {
  const [confirmAction, setConfirmAction] = useState<Action>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAction = async (action: Action) => {
    if (!action) return;

    setIsProcessing(true);
    try {
      switch (action) {
        case 'generate':
          await onGenerate?.();
          break;
        case 'approve':
          await onApprove?.();
          break;
        case 'publish':
          await onPublish?.();
          break;
        case 'archive':
          await onArchive?.();
          break;
        case 'delete':
          await onDelete?.();
          break;
        case 'generateSubcategories':
          await onGenerateSubcategories?.();
          break;
        case 'generateQuestions':
          await onGenerateQuestions?.();
          break;
        case 'exportCategories':
          await onExportCategories?.();
          break;
      }
      setConfirmAction(null);
      onClose();
    } catch (error) {
      console.error('Bulk action failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  const contentActionConfig = {
    generate: {
      icon: Sparkles,
      label: 'Generate',
      color: 'bg-purple-600 hover:bg-purple-700',
      description: 'Generate or regenerate content drafts',
    },
    approve: {
      icon: CheckCircle2,
      label: 'Approve',
      color: 'bg-green-600 hover:bg-green-700',
      description: 'Mark as accepted and ready for publishing',
    },
    publish: {
      icon: Upload,
      label: 'Publish',
      color: 'bg-[#0a0020] hover:bg-[#080019]',
      description: 'Make content live and available in feed',
    },
    archive: {
      icon: Archive,
      label: 'Archive',
      color: 'bg-slate-600 hover:bg-slate-700',
      description: 'Hide from feed but keep in database',
    },
    delete: {
      icon: Trash2,
      label: 'Delete',
      color: 'bg-red-600 hover:bg-red-700',
      description: 'Permanently remove (cannot be undone)',
    },
  };

  const categoryActionConfig = {
    generateSubcategories: {
      icon: Layers,
      label: 'Generate Subcategories',
      color: 'bg-blue-600 hover:bg-blue-700',
      description: 'Generate AI-powered subcategories for selected categories',
    },
    generateQuestions: {
      icon: HelpCircle,
      label: 'Generate Questions',
      color: 'bg-purple-600 hover:bg-purple-700',
      description: 'Generate Q&A content for selected categories',
    },
    exportCategories: {
      icon: Download,
      label: 'Export',
      color: 'bg-teal-600 hover:bg-teal-700',
      description: 'Export selected categories to CSV/JSON',
    },
    archive: {
      icon: Archive,
      label: 'Archive',
      color: 'bg-slate-600 hover:bg-slate-700',
      description: 'Hide categories but keep in database',
    },
    delete: {
      icon: Trash2,
      label: 'Delete',
      color: 'bg-red-600 hover:bg-red-700',
      description: 'Permanently remove categories (cannot be undone)',
    },
  };

  const actionConfig = mode === 'categories' ? categoryActionConfig : contentActionConfig;

  return (
    <>
      {/* Main Modal */}
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="text-lg font-semibold text-slate-900">
              Bulk Actions
            </h3>
            <button
              onClick={onClose}
              className="p-1 hover:bg-slate-100 rounded transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="p-4">
            <p className="text-sm text-slate-600 mb-4">
              {selectedCount} {selectedCount === 1 ? 'item' : 'items'} selected
            </p>

            <div className="space-y-2">
              {Object.entries(actionConfig).map(([key, config]) => {
                const Icon = config.icon;
                const action = key as Action;

                return (
                  <button
                    key={key}
                    onClick={() => setConfirmAction(action)}
                    className={`w-full flex items-start gap-3 p-3 rounded-lg border-2 hover:border-${key === 'approve' ? 'green' : key === 'publish' ? 'blue' : key === 'archive' ? 'slate' : 'red'}-200 transition-all text-left group`}
                  >
                    <div className={`p-2 rounded ${config.color} text-white`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-slate-900 group-hover:text-slate-700">
                        {config.label}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {config.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-4 border-t bg-slate-50 flex justify-end">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {confirmAction && (
        <AlertDialog open={!!confirmAction} onOpenChange={() => setConfirmAction(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {actionConfig[confirmAction].label} {selectedCount} items?
              </AlertDialogTitle>
              <AlertDialogDescription>
                {actionConfig[confirmAction].description}
                {confirmAction === 'delete' && (
                  <span className="block mt-2 font-medium text-red-600">
                    This action cannot be undone.
                  </span>
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isProcessing}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => handleAction(confirmAction)}
                disabled={isProcessing}
                className={actionConfig[confirmAction].color}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  `${actionConfig[confirmAction].label} ${selectedCount} items`
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
}
