'use client';

import { useState } from 'react';
import { Plus, Sparkles, X, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';

type CreationMode = 'manual' | 'ai';
type ItemType = 'category' | 'subcategory';

interface BatchCategoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (items: string[], mode: CreationMode) => Promise<void>;
  type: ItemType;
  parentId?: string; // For subcategories
  maxItems?: number;
}

export function BatchCategoryDialog({
  isOpen,
  onClose,
  onConfirm,
  type,
  parentId,
  maxItems = 25,
}: BatchCategoryDialogProps) {
  const [mode, setMode] = useState<CreationMode>('manual');
  const [manualItems, setManualItems] = useState<string[]>(['']);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiCount, setAiCount] = useState(5);
  const [isLoading, setIsLoading] = useState(false);

  const itemLabel = type === 'category' ? 'Category' : 'Subcategory';
  const itemLabelPlural = type === 'category' ? 'Categories' : 'Subcategories';

  const handleAddManualItem = () => {
    if (manualItems.length < maxItems) {
      setManualItems([...manualItems, '']);
    }
  };

  const handleRemoveManualItem = (index: number) => {
    if (manualItems.length > 1) {
      setManualItems(manualItems.filter((_, i) => i !== index));
    }
  };

  const handleManualItemChange = (index: number, value: string) => {
    const updated = [...manualItems];
    updated[index] = value;
    setManualItems(updated);
  };

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      if (mode === 'manual') {
        const validItems = manualItems.filter((item) => item.trim().length > 0);
        if (validItems.length === 0) {
          throw new Error('Please enter at least one item');
        }
        await onConfirm(validItems, 'manual');
      } else {
        // For AI mode, pass the prompt and count
        await onConfirm([aiPrompt], 'ai');
      }
      // Reset form
      setManualItems(['']);
      setAiPrompt('');
      setAiCount(5);
      onClose();
    } catch (error) {
      console.error('Failed to create items:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setManualItems(['']);
    setAiPrompt('');
    setAiCount(5);
    setMode('manual');
    onClose();
  };

  const validManualCount = manualItems.filter((item) => item.trim().length > 0).length;
  const canSubmit = mode === 'manual' ? validManualCount > 0 : aiPrompt.trim().length > 0;

  return (
    <AlertDialog open={isOpen} onOpenChange={handleCancel}>
      <AlertDialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <AlertDialogHeader>
          <AlertDialogTitle>Create {itemLabelPlural}</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div>Add multiple {itemLabelPlural.toLowerCase()} at once using manual entry or AI generation</div>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-4">
          {/* Mode Selection */}
          <div className="flex gap-2">
            <button
              onClick={() => setMode('manual')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 font-medium transition-all ${
                mode === 'manual'
                  ? 'border-lmo-dark-600 bg-lmo-dark-600 text-white'
                  : 'border-slate-200 hover:border-slate-300 text-slate-700'
              }`}
            >
              <Plus className="h-4 w-4" />
              Manual Entry
            </button>
            <button
              onClick={() => setMode('ai')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 font-medium transition-all ${
                mode === 'ai'
                  ? 'border-purple-600 bg-purple-600 text-white'
                  : 'border-slate-200 hover:border-slate-300 text-slate-700'
              }`}
            >
              <Sparkles className="h-4 w-4" />
              AI Generation
            </button>
          </div>

          {/* Manual Mode */}
          {mode === 'manual' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-slate-700">
                  {itemLabel} Names
                </label>
                <Badge variant="secondary">
                  {validManualCount} / {maxItems}
                </Badge>
              </div>

              <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                {manualItems.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="text-sm text-slate-500 w-6">{index + 1}.</span>
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => handleManualItemChange(index, e.target.value)}
                      placeholder={`Enter ${itemLabel.toLowerCase()} name`}
                      className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-lmo-dark-600 focus:border-transparent"
                      maxLength={100}
                    />
                    {manualItems.length > 1 && (
                      <button
                        onClick={() => handleRemoveManualItem(index)}
                        className="p-2 hover:bg-slate-100 rounded transition-colors"
                        title="Remove"
                      >
                        <X className="h-4 w-4 text-slate-400" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {manualItems.length < maxItems && (
                <button
                  onClick={handleAddManualItem}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed border-slate-300 rounded-lg text-sm font-medium text-slate-600 hover:border-slate-400 hover:text-slate-700 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Add Another {itemLabel}
                </button>
              )}

              {manualItems.length >= maxItems && (
                <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <AlertCircle className="h-4 w-4 text-amber-600 flex-shrink-0" />
                  <p className="text-xs text-amber-700">
                    Maximum batch size of {maxItems} items reached. To add more, create another batch.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* AI Mode */}
          {mode === 'ai' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Description / Context
                </label>
                <textarea
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder={`Describe what ${itemLabelPlural.toLowerCase()} you want to generate...

Example: "Generate ${itemLabelPlural.toLowerCase()} for a SaaS company's blog covering topics like onboarding, user retention, and product analytics"`}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent resize-none"
                  rows={6}
                  maxLength={500}
                />
                <div className="flex justify-between mt-1">
                  <p className="text-xs text-slate-500">
                    Be specific for better results
                  </p>
                  <p className="text-xs text-slate-400">
                    {aiPrompt.length} / 500
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Number of {itemLabelPlural}
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="1"
                    max={Math.min(maxItems, 25)}
                    value={aiCount}
                    onChange={(e) => setAiCount(parseInt(e.target.value))}
                    className="flex-1"
                  />
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="1"
                      max={Math.min(maxItems, 25)}
                      value={aiCount}
                      onChange={(e) => setAiCount(Math.min(Math.max(1, parseInt(e.target.value) || 1), maxItems))}
                      className="w-16 px-2 py-1 border border-slate-200 rounded text-sm text-center focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />
                    <Badge variant="secondary">{aiCount}</Badge>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                <p className="text-xs text-purple-700 flex items-start gap-2">
                  <Sparkles className="h-4 w-4 flex-shrink-0 mt-0.5" />
                  <span>
                    AI will generate {aiCount} relevant {itemLabelPlural.toLowerCase()} based on your description.
                    You can review and edit them before publishing.
                  </span>
                </p>
              </div>
            </div>
          )}

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs text-blue-700">
              {mode === 'manual' ? (
                <>
                  <strong>Tip:</strong> Enter one {itemLabel.toLowerCase()} per line.
                  You can add up to {maxItems} at once.
                </>
              ) : (
                <>
                  <strong>Tip:</strong> The more context you provide, the better the AI can generate
                  relevant {itemLabelPlural.toLowerCase()} for your needs.
                </>
              )}
            </p>
          </div>
        </div>

        <AlertDialogFooter>
          <Button variant="outline" onClick={handleCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!canSubmit || isLoading}
            className={mode === 'ai' ? 'bg-purple-600 hover:bg-purple-700' : ''}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : mode === 'manual' ? (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Create {validManualCount} {validManualCount === 1 ? itemLabel : itemLabelPlural}
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Generate {aiCount} {aiCount === 1 ? itemLabel : itemLabelPlural}
              </>
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
