'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/hooks/use-auth';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, FolderKanban, ExternalLink, Loader2, AlertCircle, Trash2 } from 'lucide-react';
import Link from 'next/link';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface Project {
  id: string;
  name: string;
  websiteUrl: string;
  domain: string;
  status: string;
  categoryTreeGenerated: boolean;
  stats: {
    totalCategories: number;
    totalQuestions: number;
    questionsAccepted: number;
  };
  createdAt: { _seconds: number };
  updatedAt: { _seconds: number };
}

export default function ProjectsPage() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchProjects();
    }
  }, [user]);

  const fetchProjects = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { auth } = await import('@/lib/firebase/config');
      const idToken = await auth.currentUser?.getIdToken();

      if (!idToken) {
        throw new Error('Not authenticated');
      }

      const response = await fetch('/api/projects', {
        headers: {
          'Authorization': `Bearer ${idToken}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Failed to fetch projects');
      }

      setProjects(data.projects || []);
    } catch (error: any) {
      console.error('Failed to fetch projects:', error);
      setError(error.message || 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const deleteProject = async (projectId: string) => {
    try {
      setDeletingId(projectId);

      const { auth } = await import('@/lib/firebase/config');
      const idToken = await auth.currentUser?.getIdToken();

      if (!idToken) {
        throw new Error('Not authenticated');
      }

      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${idToken}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || data.error || 'Failed to delete project');
      }

      // Remove project from local state
      setProjects(projects.filter(p => p.id !== projectId));
    } catch (error: any) {
      console.error('Failed to delete project:', error);
      alert(`Failed to delete project: ${error.message}`);
    } finally {
      setDeletingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
      initializing: { label: 'Initializing', variant: 'secondary' },
      active: { label: 'Active', variant: 'default' },
      paused: { label: 'Paused', variant: 'outline' },
      completed: { label: 'Completed', variant: 'outline' },
    };

    const config = statusConfig[status] || { label: status, variant: 'outline' };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const formatDate = (timestamp: { _seconds: number }) => {
    if (!timestamp?._seconds) return 'N/A';
    return new Date(timestamp._seconds * 1000).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Projects</h1>
          <p className="text-slate-600 mt-2">
            Manage your content generation projects
          </p>
        </div>
        <Link href="/projects/new">
          <Button className="bg-teal-600 hover:bg-teal-700">
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
        </div>
      ) : error ? (
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">
                Failed to load projects
              </h3>
              <p className="text-slate-500 mb-6 max-w-sm">
                {error}
              </p>
              <Button onClick={fetchProjects} variant="outline">
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : projects.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 mb-4">
                <FolderKanban className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-medium text-slate-900 mb-2">
                No projects yet
              </h3>
              <p className="text-slate-500 mb-6 max-w-sm">
                Get started by creating your first project. Enter a website URL to begin generating AI-optimized content.
              </p>
              <Link href="/projects/new">
                <Button className="bg-teal-600 hover:bg-teal-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Project
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Card key={project.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <CardTitle className="text-lg">{project.name}</CardTitle>
                  {getStatusBadge(project.status)}
                </div>
                <CardDescription className="flex items-center gap-2">
                  <ExternalLink className="h-3 w-3" />
                  <a
                    href={project.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline truncate"
                  >
                    {project.domain}
                  </a>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-slate-50 rounded p-2">
                      <div className="text-xl font-bold text-slate-900">
                        {project.stats.totalCategories}
                      </div>
                      <div className="text-xs text-slate-600">Categories</div>
                    </div>
                    <div className="bg-slate-50 rounded p-2">
                      <div className="text-xl font-bold text-slate-900">
                        {project.stats.totalQuestions}
                      </div>
                      <div className="text-xs text-slate-600">Questions</div>
                    </div>
                    <div className="bg-slate-50 rounded p-2">
                      <div className="text-xl font-bold text-teal-600">
                        {project.stats.questionsAccepted}
                      </div>
                      <div className="text-xs text-slate-600">Accepted</div>
                    </div>
                  </div>

                  <div className="text-xs text-slate-500 pt-2 border-t">
                    Created {formatDate(project.createdAt)}
                  </div>

                  <div className="flex gap-2">
                    <Link href={`/projects/${project.id}`} className="flex-1">
                      <Button variant="outline" className="w-full">
                        View Project
                      </Button>
                    </Link>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          disabled={deletingId === project.id}
                        >
                          {deletingId === project.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Project?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete <strong>{project.name}</strong>? This will permanently delete the project and all associated categories and questions. This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deleteProject(project.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

