'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/hooks/use-auth';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Loader2,
  AlertCircle,
  ArrowLeft,
  MessageSquare,
  FileText,
  CheckCircle2,
  XCircle,
  Clock
} from 'lucide-react';
import Link from 'next/link';

interface Question {
  id: string;
  question: string;
  questionSlug: string;
  searchIntent: 'informational' | 'navigational' | 'transactional';
  targetKeywords: string[];
  status: 'pending' | 'generating' | 'ready_for_review' | 'accepted' | 'rejected';
  draftCount: number;
  hasShortDraft: boolean;
  hasLongDraft: boolean;
  factCheckStatus: 'pending' | 'in_progress' | 'completed' | 'failed';
  factCheckScore?: number;
  createdAt: { _seconds: number };
  updatedAt: { _seconds: number };
}

export default function QuestionsPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [generatingDrafts, setGeneratingDrafts] = useState<Set<string>>(new Set());

  const projectId = params.id as string;
  const categoryFilter = searchParams.get('category');

  useEffect(() => {
    if (projectId && user) {
      fetchQuestions();
    }
  }, [projectId, user, categoryFilter, statusFilter]);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      setError(null);

      const { auth } = await import('@/lib/firebase/config');
      const idToken = await auth.currentUser?.getIdToken();

      if (!idToken) {
        throw new Error('Not authenticated');
      }

      const queryParams = new URLSearchParams();
      if (categoryFilter) {
        queryParams.append('category', categoryFilter);
      }
      if (statusFilter !== 'all') {
        queryParams.append('status', statusFilter);
      }

      const response = await fetch(
        `/api/projects/${projectId}/questions?${queryParams.toString()}`,
        {
          headers: {
            'Authorization': `Bearer ${idToken}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Failed to fetch questions');
      }

      setQuestions(data.questions || []);
    } catch (error: any) {
      console.error('Failed to fetch questions:', error);
      setError(error.message || 'Failed to load questions');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; icon: any }> = {
      pending: { label: 'Pending', variant: 'outline', icon: Clock },
      generating: { label: 'Generating', variant: 'secondary', icon: Loader2 },
      ready_for_review: { label: 'Ready for Review', variant: 'default', icon: FileText },
      accepted: { label: 'Accepted', variant: 'default', icon: CheckCircle2 },
      rejected: { label: 'Rejected', variant: 'destructive', icon: XCircle },
    };

    const config = statusConfig[status] || { label: status, variant: 'outline', icon: MessageSquare };
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className={`h-3 w-3 ${status === 'generating' ? 'animate-spin' : ''}`} />
        {config.label}
      </Badge>
    );
  };

  const getIntentBadge = (intent: string) => {
    const intentColors: Record<string, string> = {
      informational: 'bg-blue-100 text-blue-800',
      navigational: 'bg-purple-100 text-purple-800',
      transactional: 'bg-lmo-dark-100 text-lmo-dark-700',
    };

    return (
      <span className={`text-xs px-2 py-1 rounded ${intentColors[intent] || 'bg-slate-100 text-slate-800'}`}>
        {intent}
      </span>
    );
  };

  const generateDraft = async (questionId: string) => {
    try {
      setGeneratingDrafts(prev => new Set(prev).add(questionId));

      const { auth } = await import('@/lib/firebase/config');
      const idToken = await auth.currentUser?.getIdToken();

      if (!idToken) {
        throw new Error('Not authenticated');
      }

      const response = await fetch(`/api/questions/${questionId}/drafts`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${idToken}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Failed to generate drafts');
      }

      // Update the question in local state
      setQuestions(prev =>
        prev.map(q =>
          q.id === questionId
            ? {
                ...q,
                status: 'ready_for_review',
                hasShortDraft: true,
                hasLongDraft: true,
                draftCount: 2,
              }
            : q
        )
      );
    } catch (error: any) {
      console.error('Failed to generate drafts:', error);
      alert(`Failed to generate drafts: ${error.message}`);
    } finally {
      setGeneratingDrafts(prev => {
        const next = new Set(prev);
        next.delete(questionId);
        return next;
      });
    }
  };

  const formatDate = (timestamp: { _seconds: number }) => {
    if (!timestamp?._seconds) return 'N/A';
    return new Date(timestamp._seconds * 1000).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-lmo-dark-600" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <Button
          variant="ghost"
          onClick={() => router.push(`/projects/${projectId}`)}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Project
        </Button>
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">
                {error || 'Failed to load questions'}
              </h3>
              <p className="text-slate-500 mb-6 max-w-sm">
                Unable to load the questions for this project.
              </p>
              <Button onClick={() => router.push(`/projects/${projectId}`)}>
                Back to Project
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
          onClick={() => router.push(categoryFilter ? `/content?project=${projectId}` : `/projects/${projectId}`)}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {categoryFilter ? 'Back to Categories' : 'Back to Project'}
        </Button>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Questions</h1>
            <p className="text-slate-600">
              Generated questions for your content strategy
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex gap-2">
        <Button
          variant={statusFilter === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setStatusFilter('all')}
        >
          All
        </Button>
        <Button
          variant={statusFilter === 'pending' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setStatusFilter('pending')}
        >
          Pending
        </Button>
        <Button
          variant={statusFilter === 'ready_for_review' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setStatusFilter('ready_for_review')}
        >
          Ready for Review
        </Button>
        <Button
          variant={statusFilter === 'accepted' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setStatusFilter('accepted')}
        >
          Accepted
        </Button>
      </div>

      {questions.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 mb-4">
                <MessageSquare className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-medium text-slate-900 mb-2">
                No questions yet
              </h3>
              <p className="text-slate-500 mb-6 max-w-sm">
                {categoryFilter
                  ? 'Generate questions for this category to see them here.'
                  : 'Start by exploring categories and generating questions.'}
              </p>
              <Button onClick={() => router.push(`/content?project=${projectId}`)}>
                Go to Categories
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-slate-600">
              {questions.length} {questions.length === 1 ? 'question' : 'questions'} found
            </p>
          </div>

          {questions.map((question) => (
            <Card key={question.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-3 mb-2">
                      <MessageSquare className="h-5 w-5 text-lmo-dark-600 mt-1 flex-shrink-0" />
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-slate-900 mb-2">
                          {question.question}
                        </h3>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {getStatusBadge(question.status)}
                          {getIntentBadge(question.searchIntent)}
                          {question.hasShortDraft && (
                            <Badge variant="outline" className="text-xs">
                              Short Draft
                            </Badge>
                          )}
                          {question.hasLongDraft && (
                            <Badge variant="outline" className="text-xs">
                              Long Draft
                            </Badge>
                          )}
                        </div>
                        {question.targetKeywords.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-2">
                            {question.targetKeywords.slice(0, 5).map((keyword, idx) => (
                              <span
                                key={idx}
                                className="text-xs px-2 py-1 bg-slate-100 text-slate-700 rounded"
                              >
                                {keyword}
                              </span>
                            ))}
                          </div>
                        )}
                        <p className="text-xs text-slate-500">
                          Created {formatDate(question.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    {question.status === 'pending' && !generatingDrafts.has(question.id) && (
                      <Button
                        size="sm"
                        onClick={() => generateDraft(question.id)}
                        className="bg-lmo-dark-600 hover:bg-lmo-dark-700"
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        Generate Draft
                      </Button>
                    )}
                    {generatingDrafts.has(question.id) && (
                      <Button size="sm" disabled className="bg-lmo-dark-600">
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Generating...
                      </Button>
                    )}
                    {question.status === 'generating' && !generatingDrafts.has(question.id) && (
                      <Button size="sm" disabled className="bg-lmo-dark-600">
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Generating...
                      </Button>
                    )}
                    {question.status === 'ready_for_review' && (
                      <Link href={`/projects/${projectId}/review/${question.id}`}>
                        <Button size="sm" className="bg-lmo-dark-600 hover:bg-lmo-dark-700">
                          <FileText className="h-4 w-4 mr-2" />
                          Review
                        </Button>
                      </Link>
                    )}
                    {question.status === 'accepted' && (
                      <Button size="sm" variant="outline">
                        <CheckCircle2 className="h-4 w-4 mr-2 text-lmo-dark-600" />
                        View
                      </Button>
                    )}
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
