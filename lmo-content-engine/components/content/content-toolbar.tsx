'use client';

import { Search, SlidersHorizontal, LayoutGrid, List, ArrowUpDown } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { QueueHeader } from './queue-header';
import { QuotaIndicator } from './quota-indicator';

export type PublicationStatus = 'all' | 'draft' | 'published' | 'archived';
export type WorkflowStatus = 'all' | 'pending' | 'ready_for_review' | 'accepted' | 'rejected';
export type SortBy = 'createdAt' | 'updatedAt' | 'title' | 'status';
export type SortOrder = 'asc' | 'desc';
export type ViewMode = 'card' | 'table';

interface ContentToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  publicationStatus: PublicationStatus;
  onPublicationStatusChange: (status: PublicationStatus) => void;
  workflowStatus: WorkflowStatus;
  onWorkflowStatusChange: (status: WorkflowStatus) => void;
  sortBy: SortBy;
  sortOrder: SortOrder;
  onSortChange: (sortBy: SortBy, sortOrder: SortOrder) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  totalCount: number;
  filteredCount: number;
  selectedCount?: number;
  onBulkActions?: () => void;
  userId?: string;
  projectId?: string;
}

export function ContentToolbar({
  searchQuery,
  onSearchChange,
  publicationStatus,
  onPublicationStatusChange,
  workflowStatus,
  onWorkflowStatusChange,
  sortBy,
  sortOrder,
  onSortChange,
  viewMode,
  onViewModeChange,
  totalCount,
  filteredCount,
  selectedCount = 0,
  onBulkActions,
  userId,
  projectId,
}: ContentToolbarProps) {
  const hasActiveFilters =
    publicationStatus !== 'all' ||
    workflowStatus !== 'all' ||
    searchQuery.length > 0;

  const clearFilters = () => {
    onSearchChange('');
    onPublicationStatusChange('all');
    onWorkflowStatusChange('all');
  };

  return (
    <div className="border-b bg-white">
      {/* Compact Single Row Toolbar */}
      <div className="flex items-center gap-2 px-4 py-2.5">
        {/* Search - More compact */}
        <div className="flex-1 max-w-sm relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-lmo-dark-600 focus:border-transparent"
          />
        </div>

        {/* Item Count - More compact */}
        <div className="text-xs text-slate-500 whitespace-nowrap">
          {filteredCount === totalCount ? (
            <span>{totalCount}</span>
          ) : (
            <span>{filteredCount}/{totalCount}</span>
          )}
        </div>

        {/* Filter Pills - Compact */}
        <div className="flex items-center gap-1">
          {(['all', 'draft', 'published', 'archived'] as const).map((status) => (
            <button
              key={status}
              onClick={() => onPublicationStatusChange(status)}
              className={cn(
                "px-2 py-1 text-xs font-medium rounded transition-colors",
                publicationStatus === status
                  ? "bg-lmo-dark-600 text-white"
                  : "hover:bg-slate-100 text-slate-600"
              )}
              title={status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
            >
              {status === 'all' ? 'All' : status.charAt(0).toUpperCase()}
            </button>
          ))}
        </div>

        {/* Workflow Status - Compact badges */}
        <div className="flex items-center gap-1 border-l pl-2 ml-1">
          {(['pending', 'ready_for_review', 'accepted', 'rejected'] as const).map((status) => {
            const active = workflowStatus === status;
            const labels: Record<typeof status, string> = {
              pending: 'P',
              ready_for_review: 'R',
              accepted: 'A',
              rejected: 'X',
            };

            return (
              <button
                key={status}
                onClick={() => onWorkflowStatusChange(status)}
                className={cn(
                  "w-6 h-6 flex items-center justify-center text-xs font-medium rounded transition-colors",
                  active && "ring-2 ring-lmo-dark-600",
                  !active && "opacity-60 hover:opacity-100",
                  status === 'pending' && "bg-yellow-100 text-yellow-700",
                  status === 'ready_for_review' && "bg-blue-100 text-blue-700",
                  status === 'accepted' && "bg-green-100 text-green-700",
                  status === 'rejected' && "bg-red-100 text-red-700"
                )}
                title={status.split('_').join(' ')}
              >
                {labels[status]}
              </button>
            );
          })}
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-xs text-lmo-dark-600 hover:text-lmo-dark-700 font-medium whitespace-nowrap"
          >
            Clear
          </button>
        )}

        <div className="flex-1" />

        {/* Quota Indicator */}
        {userId && (
          <QuotaIndicator userId={userId} projectId={projectId} compact />
        )}

        {/* Queue Header */}
        {userId && (
          <QueueHeader userId={userId} projectId={projectId} />
        )}

        {/* Bulk Actions Button - Compact */}
        {selectedCount > 0 && onBulkActions && (
          <Button
            variant="outline"
            size="sm"
            onClick={onBulkActions}
            className="h-7 text-xs px-2"
          >
            <SlidersHorizontal className="h-3.5 w-3.5 mr-1" />
            {selectedCount}
          </Button>
        )}

        {/* Sort - More compact */}
        <select
          value={`${sortBy}:${sortOrder}`}
          onChange={(e) => {
            const [newSortBy, newSortOrder] = e.target.value.split(':') as [SortBy, SortOrder];
            onSortChange(newSortBy, newSortOrder);
          }}
          className="text-xs border border-slate-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-lmo-dark-600 cursor-pointer bg-white"
        >
          <option value="createdAt:desc">Newest</option>
          <option value="createdAt:asc">Oldest</option>
          <option value="updatedAt:desc">Recently Updated</option>
          <option value="title:asc">Title A-Z</option>
          <option value="title:desc">Title Z-A</option>
        </select>

        {/* View Mode Toggle - Compact */}
        <div className="flex items-center border border-slate-200 rounded">
          <button
            onClick={() => onViewModeChange('card')}
            className={cn(
              "p-1 transition-colors",
              viewMode === 'card'
                ? "bg-lmo-dark-600 text-white"
                : "hover:bg-slate-100 text-slate-600"
            )}
            title="Card view"
          >
            <LayoutGrid className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => onViewModeChange('table')}
            className={cn(
              "p-1 transition-colors",
              viewMode === 'table'
                ? "bg-lmo-dark-600 text-white"
                : "hover:bg-slate-100 text-slate-600"
            )}
            title="Table view"
          >
            <List className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
