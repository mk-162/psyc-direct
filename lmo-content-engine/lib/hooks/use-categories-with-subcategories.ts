import { useQuery } from '@tanstack/react-query';

interface Category {
  id: string;
  title: string;
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
  staleTime: 3 * 60 * 1000, // 3 minutes
  gcTime: 10 * 60 * 1000,
};

/**
 * Fetches categories and all their subcategories in an optimized way
 * Returns categories array and subcategories map
 */
export function useCategoriesWithSubcategories(projectId: string | null) {
  return useQuery({
    queryKey: ['categories-with-subcategories', projectId],
    queryFn: async () => {
      if (!projectId) throw new Error('Project ID required');

      const { auth } = await import('@/lib/firebase/config');
      const idToken = await auth.currentUser?.getIdToken();
      if (!idToken) throw new Error('Not authenticated');

      // Fetch categories first
      const categoriesResponse = await fetch(`/api/projects/${projectId}/categories`, {
        headers: { Authorization: `Bearer ${idToken}` },
      });

      if (!categoriesResponse.ok) {
        throw new Error('Failed to fetch categories');
      }

      const categoriesData = await categoriesResponse.json();
      const categories: Category[] = categoriesData.categories || [];

      // Fetch subcategories for categories that have them
      const subcategoriesMap: Record<string, Subcategory[]> = {};

      // Batch fetch subcategories in parallel
      const subcategoryPromises = categories
        .filter(cat => cat.hasSubcategories)
        .map(async (category) => {
          const response = await fetch(
            `/api/projects/${projectId}/categories/${category.id}/subcategories`,
            {
              headers: { Authorization: `Bearer ${idToken}` },
            }
          );

          if (response.ok) {
            const data = await response.json();
            return {
              categoryId: category.id,
              subcategories: data.subcategories || [],
            };
          }
          return { categoryId: category.id, subcategories: [] };
        });

      const subcategoriesResults = await Promise.all(subcategoryPromises);

      subcategoriesResults.forEach(({ categoryId, subcategories }) => {
        subcategoriesMap[categoryId] = subcategories;
      });

      return {
        categories,
        subcategories: subcategoriesMap,
      };
    },
    enabled: !!projectId,
    ...CACHE_TIMES,
  });
}
