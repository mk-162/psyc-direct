'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/use-auth';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Loader2,
  AlertCircle,
  ExternalLink,
  ArrowLeft,
  Settings,
  FolderTree,
  MessageSquareText,
  Clock,
  CheckCircle,
  XCircle,
  FileText
} from 'lucide-react';
import Link from 'next/link';

interface Project {
  id: string;
  name: string;
  websiteUrl: string;
  domain: string;
  status: string;
  categoryTreeGenerated: boolean;
  stats: {
    totalCategories: number;
    totalSubcategories: number;
    totalQuestions: number;
    questionsGenerated: number;
    questionsAccepted: number;
    questionsRejected: number;
    averageConfidence: number;
  };
  settings: {
    brandVoice: string;
    contentDepth: string;
    factCheckThreshold: number;
    autoGenerateQuestions: boolean;
  };
  createdAt: { _seconds: number };
  updatedAt: { _seconds: number };
}

interface ActivityItem {
  id: string;
  type: 'question_generated' | 'draft_created' | 'draft_accepted' | 'draft_rejected';
  question: string;
  contentSnippet?: string;
  timestamp: { _seconds: number };
  status?: string;
}

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const projectId = params.id as string;

  useEffect(() => {
    if (projectId && user) {
      fetchProject();
      fetchRecentActivity();
    }
  }, [projectId, user]);

  const fetchProject = async () => {
    try {
      setLoading(true);
      setError(null);

      const { auth } = await import('@/lib/firebase/config');
      const idToken = await auth.currentUser?.getIdToken();

      if (!idToken) {
        throw new Error('Not authenticated');
      }

      const response = await fetch(`/api/projects/${projectId}`, {
        headers: {
          'Authorization': `Bearer ${idToken}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Failed to fetch project');
      }

      setProject(data.project);
    } catch (error: any) {
      console.error('Failed to fetch project:', error);
      setError(error.message || 'Failed to load project');
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentActivity = async () => {
    try {
      const { auth } = await import('@/lib/firebase/config');
      const idToken = await auth.currentUser?.getIdToken();

      if (!idToken) return;

      const response = await fetch(`/api/projects/${projectId}/activity`, {
        headers: { 'Authorization': `Bearer ${idToken}` },
      });

      if (response.ok) {
        const data = await response.json();
        setRecentActivity(data.activity || []);
      }
    } catch (error) {
      console.error('Failed to fetch activity:', error);
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
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatTimeAgo = (timestamp: { _seconds: number }) => {
    if (!timestamp?._seconds) return '';
    const now = Date.now();
    const then = timestamp._seconds * 1000;
    const diff = now - then;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return new Date(then).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="p-8">
        <Button
          variant="ghost"
          onClick={() => router.push('/projects')}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Projects
        </Button>
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">
                {error || 'Project not found'}
              </h3>
              <p className="text-slate-500 mb-6 max-w-sm">
                The project you're looking for doesn't exist or you don't have access to it.
              </p>
              <Button onClick={() => router.push('/projects')}>
                Back to Projects
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={() => router.push('/projects')}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Projects
        </Button>
        
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-slate-900">{project.name}</h1>
              {getStatusBadge(project.status)}
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <ExternalLink className="h-4 w-4" />
              <a
                href={project.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                {project.websiteUrl}
              </a>
            </div>
          </div>
          <Link href={`/projects/${projectId}/settings`}>
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardDescription>Total Categories</CardDescription>
            <CardTitle className="text-3xl">{project.stats.totalCategories}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600">
              {project.stats.totalSubcategories} subcategories
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Total Questions</CardDescription>
            <CardTitle className="text-3xl">{project.stats.totalQuestions}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600">
              {project.stats.questionsGenerated} generated
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Accepted Questions</CardDescription>
            <CardTitle className="text-3xl text-green-600">
              {project.stats.questionsAccepted}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600">
              {project.stats.questionsRejected} rejected
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Avg Confidence</CardDescription>
            <CardTitle className="text-3xl">
              {(project.stats.averageConfidence * 100).toFixed(0)}%
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600">AI confidence score</p>
          </CardContent>
        </Card>
      </div>

      {/* Content Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <FolderTree className="h-5 w-5" />
                  Categories
                </CardTitle>
                <CardDescription className="mt-2">
                  Browse content categories and topics
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {project.categoryTreeGenerated ? (
              <div className="text-center py-8">
                <p className="text-slate-600 mb-4">
                  Explore {project.stats.totalCategories} categories
                </p>
                <Link href={`/projects/${projectId}/discover`}>
                  <Button className="bg-teal-600 hover:bg-teal-700">
                    Browse Categories
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="text-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-teal-600 mx-auto mb-4" />
                <p className="text-slate-600">Generating category tree...</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquareText className="h-5 w-5" />
                  Questions & Answers
                </CardTitle>
                <CardDescription className="mt-2">
                  Review and manage generated content
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <p className="text-slate-600 mb-4">
                {project.stats.totalQuestions} questions available
              </p>
              <Link href={`/projects/${projectId}/review`}>
                <Button className="bg-teal-600 hover:bg-teal-700">
                  Review Questions
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Activity
          </CardTitle>
          <CardDescription>
            Latest updates and content changes
          </CardDescription>
        </CardHeader>
        <CardContent>
          {recentActivity.length > 0 ? (
            <div className="space-y-4">
              {recentActivity.map((activity) => {
                const timeAgo = formatTimeAgo(activity.timestamp);
                const icon = activity.type === 'draft_accepted' ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : activity.type === 'draft_rejected' ? (
                  <XCircle className="h-5 w-5 text-red-600" />
                ) : activity.type === 'draft_created' ? (
                  <FileText className="h-5 w-5 text-blue-600" />
                ) : (
                  <MessageSquareText className="h-5 w-5 text-teal-600" />
                );

                return (
                  <div
                    key={activity.id}
                    className="flex gap-4 p-4 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors"
                  >
                    <div className="flex-shrink-0 mt-0.5">{icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p className="font-medium text-slate-900 line-clamp-1">
                          {activity.question}
                        </p>
                        <span className="text-xs text-slate-500 whitespace-nowrap">
                          {timeAgo}
                        </span>
                      </div>
                      {activity.contentSnippet && (
                        <p className="text-sm text-slate-600 line-clamp-2 mb-2">
                          {activity.contentSnippet}
                        </p>
                      )}
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {activity.type === 'draft_accepted' && 'Accepted'}
                          {activity.type === 'draft_rejected' && 'Rejected'}
                          {activity.type === 'draft_created' && 'Draft Created'}
                          {activity.type === 'question_generated' && 'Question Generated'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <Clock className="h-12 w-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500">No recent activity yet</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Project Info */}
      <Card>
        <CardHeader>
          <CardTitle>Project Information</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <dt className="text-sm font-medium text-slate-600 mb-1">Created</dt>
              <dd className="text-sm text-slate-900">{formatDate(project.createdAt)}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-slate-600 mb-1">Last Updated</dt>
              <dd className="text-sm text-slate-900">{formatDate(project.updatedAt)}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-slate-600 mb-1">Brand Voice</dt>
              <dd className="text-sm text-slate-900 capitalize">{project.settings.brandVoice}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-slate-600 mb-1">Content Depth</dt>
              <dd className="text-sm text-slate-900 capitalize">{project.settings.contentDepth}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-slate-600 mb-1">Fact Check Threshold</dt>
              <dd className="text-sm text-slate-900">{(project.settings.factCheckThreshold * 100).toFixed(0)}%</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-slate-600 mb-1">Auto Generate Questions</dt>
              <dd className="text-sm text-slate-900">
                {project.settings.autoGenerateQuestions ? 'Enabled' : 'Disabled'}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </div>
  );
}

