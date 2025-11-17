import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface Category {
  id: string;
  title: string;
  description?: string;
  hasSubcategories: boolean;
  subcategoryCount: number;
  stats: {
    totalQuestions: number;
  };
}

interface Subcategory {
  id: string;
  title: string;
  stats: {
    totalQuestions: number;
  };
}

const CACHE_TIMES = {
  categories: {
    staleTime: 3 * 60 * 1000, // 3 minutes - categories change occasionally
    gcTime: 10 * 60 * 1000,
  },
  subcategories: {
    staleTime: 3 * 60 * 1000, // 3 minutes
    gcTime: 10 * 60 * 1000,
  },
};

async function fetchCategories(projectId: string, idToken: string): Promise<Category[]> {
  const response = await fetch(`/api/projects/${projectId}/categories`, {
    headers: { Authorization: `Bearer ${idToken}` },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch categories');
  }

  const data = await response.json();
  return data.categories || [];
}

async function fetchSubcategories(
  projectId: string,
  categoryId: string,
  idToken: string
): Promise<Subcategory[]> {
  const response = await fetch(
    `/api/projects/${projectId}/categories/${categoryId}/subcategories`,
    {
      headers: { Authorization: `Bearer ${idToken}` },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch subcategories');
  }

  const data = await response.json();
  return data.subcategories || [];
}

export function useCategories(projectId: string | null) {
  return useQuery({
    queryKey: ['categories', projectId],
    queryFn: async () => {
      if (!projectId) throw new Error('Project ID required');
      const { auth } = await import('@/lib/firebase/config');
      const idToken = await auth.currentUser?.getIdToken();
      if (!idToken) throw new Error('Not authenticated');
      return fetchCategories(projectId, idToken);
    },
    enabled: !!projectId,
    ...CACHE_TIMES.categories,
  });
}

export function useSubcategories(projectId: string | null, categoryId: string | null) {
  return useQuery({
    queryKey: ['subcategories', projectId, categoryId],
    queryFn: async () => {
      if (!projectId || !categoryId) throw new Error('Project ID and Category ID required');
      const { auth } = await import('@/lib/firebase/config');
      const idToken = await auth.currentUser?.getIdToken();
      if (!idToken) throw new Error('Not authenticated');
      return fetchSubcategories(projectId, categoryId, idToken);
    },
    enabled: !!projectId && !!categoryId,
    ...CACHE_TIMES.subcategories,
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      projectId,
      title,
      description,
      parentId,
      level,
    }: {
      projectId: string;
      title: string;
      description?: string;
      parentId?: string;
      level?: number;
    }) => {
      const { auth } = await import('@/lib/firebase/config');
      const idToken = await auth.currentUser?.getIdToken();

      const response = await fetch(`/api/projects/${projectId}/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ title, description, parentId, level }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create category');
      }

      return response.json();
    },
    onSuccess: (data, variables) => {
      // Invalidate categories cache
      queryClient.invalidateQueries({ queryKey: ['categories', variables.projectId] });
      // If it's a subcategory, also invalidate the parent's subcategories
      if (variables.parentId) {
        queryClient.invalidateQueries({
          queryKey: ['subcategories', variables.projectId, variables.parentId],
        });
      }
    },
  });
}

export function useGenerateSubcategories() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      projectId,
      categoryId,
    }: {
      projectId: string;
      categoryId: string;
    }) => {
      const { auth } = await import('@/lib/firebase/config');
      const idToken = await auth.currentUser?.getIdToken();

      const response = await fetch(
        `/api/projects/${projectId}/categories/${categoryId}/subcategories`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${idToken}`,
          },
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to generate subcategories');
      }

      return response.json();
    },
    onSuccess: (data, variables) => {
      // Invalidate both categories and subcategories cache
      queryClient.invalidateQueries({ queryKey: ['categories', variables.projectId] });
      queryClient.invalidateQueries({
        queryKey: ['subcategories', variables.projectId, variables.categoryId],
      });
      // Also invalidate the combined hook
      queryClient.invalidateQueries({ queryKey: ['categories-with-subcategories', variables.projectId] });
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      projectId,
      categoryId,
      title,
      description,
    }: {
      projectId: string;
      categoryId: string;
      title: string;
      description?: string;
    }) => {
      const { auth } = await import('@/lib/firebase/config');
      const idToken = await auth.currentUser?.getIdToken();

      const response = await fetch(`/api/projects/${projectId}/categories/${categoryId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ title, description }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update category');
      }

      return response.json();
    },
    onSuccess: (data, variables) => {
      // Invalidate categories cache
      queryClient.invalidateQueries({ queryKey: ['categories', variables.projectId] });
      queryClient.invalidateQueries({ queryKey: ['categories-with-subcategories', variables.projectId] });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      projectId,
      categoryId,
    }: {
      projectId: string;
      categoryId: string;
    }) => {
      const { auth } = await import('@/lib/firebase/config');
      const idToken = await auth.currentUser?.getIdToken();

      const response = await fetch(`/api/projects/${projectId}/categories/${categoryId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete category');
      }

      return response.json();
    },
    onSuccess: (data, variables) => {
      // Invalidate categories cache
      queryClient.invalidateQueries({ queryKey: ['categories', variables.projectId] });
      queryClient.invalidateQueries({ queryKey: ['categories-with-subcategories', variables.projectId] });
      // Also invalidate content cache as it may reference this category
      queryClient.invalidateQueries({ queryKey: ['content', variables.projectId] });
    },
  });
}
