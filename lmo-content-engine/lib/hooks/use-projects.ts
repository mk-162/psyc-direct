import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from './use-auth';

interface Project {
  id: string;
  name: string;
  description?: string;
  websiteUrl?: string;
  ownerId: string;
  stats?: {
    totalCategories?: number;
    totalSubcategories?: number;
    totalQuestions?: number;
  };
}

const CACHE_TIMES = {
  projects: {
    staleTime: 5 * 60 * 1000, // 5 minutes - projects change rarely
    gcTime: 10 * 60 * 1000,
  },
};

async function fetchProjects(idToken: string): Promise<Project[]> {
  const response = await fetch('/api/projects', {
    headers: { Authorization: `Bearer ${idToken}` },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch projects');
  }

  const data = await response.json();
  return data.projects || [];
}

export function useProjects() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['projects', user?.uid],
    queryFn: async () => {
      const { auth } = await import('@/lib/firebase/config');
      const idToken = await auth.currentUser?.getIdToken();
      if (!idToken) throw new Error('Not authenticated');
      return fetchProjects(idToken);
    },
    enabled: !!user,
    ...CACHE_TIMES.projects,
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (projectData: { name: string; description?: string; websiteUrl?: string }) => {
      const { auth } = await import('@/lib/firebase/config');
      const idToken = await auth.currentUser?.getIdToken();

      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify(projectData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create project');
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate projects cache to refetch
      queryClient.invalidateQueries({ queryKey: ['projects', user?.uid] });
    },
  });
}
