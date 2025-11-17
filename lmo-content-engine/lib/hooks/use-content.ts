import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

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
  categoryId?: string;
  subcategoryId?: string;
  createdAt: Date;
  updatedAt: Date;
  hasShortDraft?: boolean;
  hasLongDraft?: boolean;
  currentDraftId?: string;
}

type WorkflowStatus = 'all' | 'pending' | 'generating' | 'ready_for_review' | 'accepted' | 'rejected';
type PublicationStatus = 'all' | 'draft' | 'published' | 'archived';
type SortBy = 'updatedAt' | 'createdAt' | 'question';
type SortOrder = 'asc' | 'desc';

const CACHE_TIMES = {
  content: {
    staleTime: 30 * 1000, // 30 seconds - content changes frequently
    gcTime: 5 * 60 * 1000,
  },
};

interface UseContentParams {
  projectId: string | null;
  categoryId?: string | null;
  subcategoryId?: string | null;
  workflowStatus?: WorkflowStatus;
  publicationStatus?: PublicationStatus;
  sortBy?: SortBy;
  sortOrder?: SortOrder;
}

async function fetchContent({
  projectId,
  categoryId,
  subcategoryId,
  workflowStatus,
  publicationStatus,
  sortBy,
  sortOrder,
}: UseContentParams & { projectId: string }): Promise<ContentItem[]> {
  const params = new URLSearchParams({
    projectId,
  });

  if (categoryId) params.append('category', categoryId);
  if (subcategoryId) params.append('subcategory', subcategoryId);
  if (workflowStatus && workflowStatus !== 'all') params.append('workflowStatus', workflowStatus);
  if (publicationStatus && publicationStatus !== 'all')
    params.append('publicationStatus', publicationStatus);
  if (sortBy) params.append('sortBy', sortBy);
  if (sortOrder) params.append('sortOrder', sortOrder);

  const { auth } = await import('@/lib/firebase/config');
  const idToken = await auth.currentUser?.getIdToken();
  if (!idToken) throw new Error('Not authenticated');

  const response = await fetch(`/api/content?${params.toString()}`, {
    headers: { Authorization: `Bearer ${idToken}` },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch content');
  }

  const data = await response.json();
  return (data.items || []).map((item: any) => ({
    ...item,
    createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
    updatedAt: item.updatedAt ? new Date(item.updatedAt) : new Date(),
  }));
}

export function useContent(params: UseContentParams) {
  return useQuery({
    queryKey: [
      'content',
      params.projectId,
      params.categoryId,
      params.subcategoryId,
      params.workflowStatus,
      params.publicationStatus,
      params.sortBy,
      params.sortOrder,
    ],
    queryFn: async () => {
      if (!params.projectId) throw new Error('Project ID required');
      return fetchContent({ ...params, projectId: params.projectId });
    },
    enabled: !!params.projectId,
    ...CACHE_TIMES.content,
  });
}

export function useBulkContentUpdate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      projectId,
      itemIds,
      action,
    }: {
      projectId: string;
      itemIds: string[];
      action: 'generate' | 'approve' | 'publish' | 'archive' | 'delete';
    }) => {
      const { auth } = await import('@/lib/firebase/config');
      const idToken = await auth.currentUser?.getIdToken();

      const response = await fetch('/api/content/bulk-update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ projectId, itemIds, action }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update content');
      }

      return response.json();
    },
    onSuccess: (data, variables) => {
      // Invalidate all content queries for this project
      queryClient.invalidateQueries({ queryKey: ['content', variables.projectId] });
    },
  });
}
