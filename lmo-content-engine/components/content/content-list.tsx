'use client';

import { useEffect, useRef } from 'react';
import { MessageSquare, Clock, ChevronRight, SlidersHorizontal, Sparkles, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';

interface ContentItem {
  id: string;
  question: string;
  content?: string;
  status: 'pending' | 'generating' | 'ready_for_review' | 'accepted' | 'rejected';
  publicationStatus?: 'draft' | 'published' | 'archived';
  draftType?: 'short' | 'long';
  wordCount?: number;
  categoryTitle?: string;
  subcategoryTitle?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface ContentListProps {
  items: ContentItem[];
  selectedItems: Set<string>;
  onItemSelect: (itemId: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  activeItemId?: string;
  onItemClick: (itemId: string) => void;
  onKeyboardNavigation?: (direction: 'up' | 'down') => void;
  onBulkActions?: () => void;
  onQuickGenerate?: (itemId: string) => void;
  onQuickApprove?: (itemId: string) => void;
}

export function ContentList({
  items,
  selectedItems,
  onItemSelect,
  onSelectAll,
  onDeselectAll,
  activeItemId,
  onItemClick,
  onKeyboardNavigation,
  onBulkActions,
  onQuickGenerate,
  onQuickApprove,
}: ContentListProps) {
  const listRef = useRef<HTMLDivElement>(null);
  const activeItemRef = useRef<HTMLDivElement>(null);

  // Scroll active item into view
  useEffect(() => {
    if (activeItemRef.current) {
      activeItemRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [activeItemId]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!onKeyboardNavigation) return;

      if (e.key === 'ArrowUp') {
        e.preventDefault();
        onKeyboardNavigation('up');
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        onKeyboardNavigation('down');
      } else if (e.key === ' ' && activeItemId) {
        e.preventDefault();
        onItemSelect(activeItemId);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeItemId, onKeyboardNavigation, onItemSelect]);

  const allSelected = items.length > 0 && items.every((item) => selectedItems.has(item.id));
  const someSelected = items.some((item) => selectedItems.has(item.id)) && !allSelected;

  const getStatusBadge = (status: ContentItem['status']) => {
    const config = {
      pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-700' },
      generating: { label: 'Generating', color: 'bg-blue-100 text-blue-700' },
      ready_for_review: { label: 'Ready', color: 'bg-blue-100 text-blue-700' },
      accepted: { label: 'Accepted', color: 'bg-green-100 text-green-700' },
      rejected: { label: 'Rejected', color: 'bg-red-100 text-red-700' },
    };
    return config[status];
  };

  const getPublicationBadge = (status?: ContentItem['publicationStatus']) => {
    if (!status) return null;
    const config = {
      draft: { label: 'Draft', color: 'bg-slate-100 text-slate-700' },
      published: { label: 'Published', color: 'bg-green-100 text-green-700' },
      archived: { label: 'Archived', color: 'bg-slate-300 text-slate-700' },
    };
    return config[status];
  };

  const getExcerpt = (content: string | undefined, maxLength = 80) => {
    if (!content) return 'No content yet...';
    const text = content.replace(/[#*`\n]/g, '').trim();
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b bg-slate-50 sticky top-0 z-10">
        <Checkbox
          checked={allSelected ? true : someSelected ? 'indeterminate' : false}
          onCheckedChange={(checked) => {
            if (checked) {
              onSelectAll();
            } else {
              onDeselectAll();
            }
          }}
        />
        {selectedItems.size > 0 && onBulkActions && (
          <button
            onClick={onBulkActions}
            className="p-1.5 hover:bg-slate-200 rounded transition-colors text-slate-700"
            title="Bulk actions"
          >
            <SlidersHorizontal className="h-4 w-4" />
          </button>
        )}
        <div className="flex-1 text-sm font-medium text-slate-700">
          {selectedItems.size > 0 ? (
            <span>{selectedItems.size} selected</span>
          ) : (
            <span>
              {items.length} {items.length === 1 ? 'item' : 'items'}
            </span>
          )}
        </div>
      </div>

      {/* List */}
      <div ref={listRef} className="flex-1 overflow-y-auto">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full py-12 px-4 text-center">
            <MessageSquare className="h-12 w-12 text-slate-300 mb-3" />
            <p className="text-sm font-medium text-slate-900 mb-1">No content found</p>
            <p className="text-sm text-slate-500">
              Try adjusting your filters or create new content
            </p>
          </div>
        ) : (
          <div className="divide-y">
            {items.map((item) => {
              const isSelected = selectedItems.has(item.id);
              const isActive = activeItemId === item.id;
              const statusBadge = getStatusBadge(item.status);
              const publicationBadge = getPublicationBadge(item.publicationStatus);

              return (
                <div
                  key={item.id}
                  ref={isActive ? activeItemRef : null}
                  className={cn(
                    "group relative flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors hover:bg-slate-50",
                    isActive && "bg-lmo-dark-50 border-l-4 border-lmo-dark-600",
                    isSelected && "bg-blue-50"
                  )}
                  onClick={() => onItemClick(item.id)}
                >
                  {/* Checkbox */}
                  <div className="pt-0.5" onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => onItemSelect(item.id)}
                    />
                  </div>

                  {/* Status Indicator Dot */}
                  <div className="pt-1.5">
                    <div
                      className={cn(
                        "h-2 w-2 rounded-full",
                        item.status === 'accepted' && "bg-green-500",
                        item.status === 'rejected' && "bg-red-500",
                        item.status === 'ready_for_review' && "bg-blue-500",
                        item.status === 'pending' && "bg-yellow-500",
                        item.status === 'generating' && "bg-blue-400 animate-pulse"
                      )}
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    {/* Title */}
                    <h3
                      className={cn(
                        "text-sm font-medium text-slate-900 mb-1 truncate",
                        isActive && "text-lmo-dark-900 font-semibold"
                      )}
                    >
                      {item.question}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-xs text-slate-500 mb-2 line-clamp-2">
                      {getExcerpt(item.content)}
                    </p>

                    {/* Metadata */}
                    <div className="flex items-center gap-2 flex-wrap">
                      {/* Status Badges */}
                      <Badge
                        variant="secondary"
                        className={cn("text-xs", statusBadge.color)}
                      >
                        {statusBadge.label}
                      </Badge>

                      {publicationBadge && (
                        <Badge
                          variant="secondary"
                          className={cn("text-xs", publicationBadge.color)}
                        >
                          {publicationBadge.label}
                        </Badge>
                      )}

                      {/* Draft Type */}
                      {item.draftType && (
                        <Badge variant="outline" className="text-xs">
                          {item.draftType === 'short' ? 'Short' : 'Long'}
                          {item.wordCount && ` • ${item.wordCount}w`}
                        </Badge>
                      )}

                      {/* Category */}
                      {item.categoryTitle && (
                        <span className="text-xs text-slate-500">
                          {item.subcategoryTitle
                            ? `${item.categoryTitle} › ${item.subcategoryTitle}`
                            : item.categoryTitle}
                        </span>
                      )}

                      {/* Date */}
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {item.updatedAt instanceof Date && !isNaN(item.updatedAt.getTime())
                          ? formatDistanceToNow(item.updatedAt, { addSuffix: true })
                          : 'Unknown date'}
                      </span>
                    </div>
                  </div>

                  {/* Quick Actions (shown on hover or active) */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                    {onQuickGenerate && (
                      <button
                        onClick={() => onQuickGenerate(item.id)}
                        className="p-1.5 rounded hover:bg-purple-100 text-purple-600 transition-colors"
                        title="Generate content"
                      >
                        <Sparkles className="h-4 w-4" />
                      </button>
                    )}
                    {onQuickApprove && item.status === 'ready_for_review' && (
                      <button
                        onClick={() => onQuickApprove(item.id)}
                        className="p-1.5 rounded hover:bg-green-100 text-green-600 transition-colors"
                        title="Approve"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  {/* Arrow Icon (active indicator) */}
                  {isActive && (
                    <div className="pt-1">
                      <ChevronRight className="h-4 w-4 text-lmo-dark-600" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
