'use client';

import { useState, useMemo } from 'react';
import {
  Edit,
  Save,
  Trash2,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
  FileText
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TiptapEditor } from './tiptap-editor';
import { marked } from 'marked';

interface ContentEditorPaneProps {
  itemId: string | null;
  question: string;
  content: string;
  status: 'pending' | 'generating' | 'ready_for_review' | 'accepted' | 'rejected';
  publicationStatus?: 'draft' | 'published' | 'archived';
  draftType?: 'short' | 'long';
  wordCount?: number;
  hasShortDraft?: boolean;
  hasLongDraft?: boolean;
  categoryTitle?: string;
  subcategoryTitle?: string;
  onNavigatePrevious?: () => void;
  onNavigateNext?: () => void;
  onSave?: (content: string) => Promise<void>;
  onDelete?: () => void;
  onAccept?: () => void;
  onReject?: () => void;
  onPublicationStatusChange?: (status: 'draft' | 'published' | 'archived') => void;
  currentIndex?: number;
  totalItems?: number;
}

export function ContentEditorPane({
  itemId,
  question,
  content,
  status,
  publicationStatus = 'draft',
  draftType,
  wordCount,
  hasShortDraft,
  hasLongDraft,
  categoryTitle,
  subcategoryTitle,
  onNavigatePrevious,
  onNavigateNext,
  onSave,
  onDelete,
  onAccept,
  onReject,
  onPublicationStatusChange,
  currentIndex,
  totalItems,
}: ContentEditorPaneProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content);
  const [isSaving, setIsSaving] = useState(false);

  // Convert markdown to HTML for display
  const htmlContent = useMemo(() => {
    if (!content) return '';
    // If content already looks like HTML (starts with <), return as is
    if (content.trim().startsWith('<')) {
      return content;
    }
    // Otherwise, parse as markdown
    return marked.parse(content) as string;
  }, [content]);

  const handleSave = async () => {
    if (!onSave) return;

    try {
      setIsSaving(true);
      await onSave(editedContent);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to save:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = () => {
    setEditedContent(content);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditedContent(content);
    setIsEditing(false);
  };

  if (!itemId) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-slate-50 p-8">
        <FileText className="h-16 w-16 text-slate-300 mb-4" />
        <h3 className="text-lg font-medium text-slate-900 mb-2">
          No content selected
        </h3>
        <p className="text-sm text-slate-500 text-center max-w-sm">
          Select an item from the list to view and edit its content
        </p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="flex-shrink-0 border-b bg-slate-50 p-4 space-y-3">
        {/* Navigation & Actions Row */}
        <div className="flex items-center justify-between gap-3">
          {/* Previous/Next Navigation */}
          <div className="flex items-center gap-2">
            <button
              onClick={onNavigatePrevious}
              disabled={!onNavigatePrevious}
              className="p-2 hover:bg-slate-200 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              title="Previous (Ctrl+←)"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            {currentIndex !== undefined && totalItems !== undefined && (
              <span className="text-sm text-slate-600 min-w-[60px] text-center">
                {currentIndex + 1} of {totalItems}
              </span>
            )}
            <button
              onClick={onNavigateNext}
              disabled={!onNavigateNext}
              className="p-2 hover:bg-slate-200 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              title="Next (Ctrl+→)"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleSave}
                  disabled={isSaving}
                  className="bg-lmo-dark-600 hover:bg-lmo-dark-700"
                >
                  {isSaving ? (
                    <>Saving...</>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </>
                  )}
                </Button>
              </>
            ) : (
              <>
                {onDelete && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onDelete}
                    className="text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleEdit}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Title & Draft Type Row */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-semibold text-slate-900 mb-1 break-words">
              {question}
            </h2>
            <div className="flex items-center gap-2 flex-wrap text-xs text-slate-500">
              {categoryTitle && (
                <span>
                  {subcategoryTitle
                    ? `${categoryTitle} › ${subcategoryTitle}`
                    : categoryTitle}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Status Badges & Draft Type Selector */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Draft Type Pills */}
            {(hasShortDraft || hasLongDraft) && (
              <div className="flex gap-1">
                {hasShortDraft && (
                  <button
                    className={cn(
                      "px-3 py-1 text-xs font-medium rounded-lg transition-colors",
                      draftType === 'short'
                        ? "bg-lmo-dark-600 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    )}
                  >
                    Short {wordCount && draftType === 'short' && `(${wordCount}w)`}
                  </button>
                )}
                {hasLongDraft && (
                  <button
                    className={cn(
                      "px-3 py-1 text-xs font-medium rounded-lg transition-colors",
                      draftType === 'long'
                        ? "bg-lmo-dark-600 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    )}
                  >
                    Long {wordCount && draftType === 'long' && `(${wordCount}w)`}
                  </button>
                )}
              </div>
            )}

            {/* Publication Status Dropdown */}
            {onPublicationStatusChange && (
              <select
                value={publicationStatus}
                onChange={(e) => onPublicationStatusChange(e.target.value as any)}
                className={cn(
                  "px-3 py-1 text-xs font-medium rounded-lg border transition-colors cursor-pointer",
                  publicationStatus === 'published' && "bg-green-100 text-green-700 border-green-200",
                  publicationStatus === 'archived' && "bg-slate-200 text-slate-700 border-slate-300",
                  publicationStatus === 'draft' && "bg-slate-100 text-slate-600 border-slate-200"
                )}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            )}
          </div>

          {/* Accept/Reject Buttons */}
          {status === 'ready_for_review' && (
            <div className="flex gap-2">
              {onReject && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onReject}
                  className="text-red-600 hover:bg-red-50"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject (R)
                </Button>
              )}
              {onAccept && (
                <Button
                  size="sm"
                  onClick={onAccept}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Accept (A)
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-6">
        {isEditing ? (
          <TiptapEditor
            content={editedContent}
            onChange={setEditedContent}
            placeholder="Write your content here..."
          />
        ) : (
          <div className="prose prose-slate max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-h1:text-3xl prose-h1:mb-6 prose-h2:text-2xl prose-h2:mb-4 prose-h3:text-xl prose-h3:mb-3 prose-p:text-slate-700 prose-p:leading-relaxed prose-p:mb-4 prose-a:text-lmo-dark-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-slate-900 prose-strong:font-semibold prose-ul:my-4 prose-ul:list-disc prose-ul:pl-6 prose-ol:my-4 prose-ol:list-decimal prose-ol:pl-6 prose-li:text-slate-700 prose-li:mb-2 prose-blockquote:border-l-4 prose-blockquote:border-lmo-dark-500 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-slate-600 prose-code:bg-slate-100 prose-code:text-slate-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-pre:bg-slate-900 prose-pre:text-slate-100 prose-pre:rounded-lg prose-pre:p-4 prose-img:rounded-lg prose-img:shadow-md">
            {htmlContent ? (
              <div
                dangerouslySetInnerHTML={{
                  __html: htmlContent,
                }}
              />
            ) : (
              <p className="text-slate-500 italic">No content available</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
