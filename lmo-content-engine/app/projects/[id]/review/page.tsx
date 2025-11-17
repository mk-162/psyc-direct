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
  ArrowLeft,
  FileText,
  CheckCircle2,
  XCircle,
  Clock,
  TrendingUp
} from 'lucide-react';
import Link from 'next/link';

interface Question {
  id: string;
  question: string;
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

export default function ReviewDashboardPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    ready: 0,
    accepted: 0,
    rejected: 0,
    pending: 0,
  });

  const projectId = params.id as string;

  useEffect(() => {
    if (projectId && user) {
      fetchQuestions();
    }
  }, [projectId, user]);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      setError(null);

      const { auth } = await import('@/lib/firebase/config');
      const idToken = await auth.currentUser?.getIdToken();

      if (!idToken) {
        throw new Error('Not authenticated');
      }

      // Fetch all questions for this project
      const response = await fetch(`/api/projects/${projectId}/questions`, {
        headers: {
          'Authorization': `Bearer ${idToken}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Failed to fetch questions');
      }

      const allQuestions = data.questions || [];

      // Calculate stats
      const newStats = {
        ready: allQuestions.filter((q: Question) => q.status === 'ready_for_review').length,
        accepted: allQuestions.filter((q: Question) => q.status === 'accepted').length,
        rejected: allQuestions.filter((q: Question) => q.status === 'rejected').length,
        pending: allQuestions.filter((q: Question) => q.status === 'pending' || q.status === 'generating').length,
      };

      setStats(newStats);

      // Filter to only show ready for review
      const reviewQuestions = allQuestions.filter(
        (q: Question) => q.status === 'ready_for_review'
      );

      setQuestions(reviewQuestions);
    } catch (error: any) {
      console.error('Failed to fetch questions:', error);
      setError(error.message || 'Failed to load questions');
    } finally {
      setLoading(false);
    }
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
                {error || 'Failed to load review dashboard'}
              </h3>
              <p className="text-slate-500 mb-6 max-w-sm">
                Unable to load the review dashboard for this project.
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
          onClick={() => router.push(`/projects/${projectId}`)}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Project
        </Button>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Review Dashboard</h1>
            <p className="text-slate-600">
              Review and approve AI-generated content
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Ready to Review</p>
                <p className="text-3xl font-bold text-lmo-dark-600">{stats.ready}</p>
              </div>
              <Clock className="h-8 w-8 text-lmo-dark-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Accepted</p>
                <p className="text-3xl font-bold text-lmo-dark-600">{stats.accepted}</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-lmo-dark-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Rejected</p>
                <p className="text-3xl font-bold text-red-600">{stats.rejected}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Pending</p>
                <p className="text-3xl font-bold text-slate-600">{stats.pending}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-slate-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Questions List */}
      {questions.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 mb-4">
                <FileText className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-medium text-slate-900 mb-2">
                No questions ready for review
              </h3>
              <p className="text-slate-500 mb-6 max-w-sm">
                Generate questions and drafts to see them here for review.
              </p>
              <Button onClick={() => router.push(`/projects/${projectId}/questions`)}>
                Go to Questions
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-slate-900">
              Questions Ready for Review ({questions.length})
            </h2>
          </div>

          {questions.map((question, index) => (
            <Card key={question.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-3 mb-2">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-lmo-dark-100 text-lmo-dark-600 font-semibold text-sm flex-shrink-0">
                        {index + 1}
                      </span>
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-slate-900 mb-2">
                          {question.question}
                        </h3>
                        <div className="flex flex-wrap gap-2 mb-3">
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
                          {question.factCheckScore !== undefined && (
                            <Badge variant="outline" className="text-xs flex items-center gap-1">
                              <TrendingUp className="h-3 w-3" />
                              {Math.round(question.factCheckScore * 100)}% confidence
                            </Badge>
                          )}
                        </div>
                        {question.targetKeywords.length > 0 && (
                          <div className="flex flex-wrap gap-1">
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
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Link href={`/projects/${projectId}/review/${question.id}`}>
                      <Button size="sm" className="bg-lmo-dark-600 hover:bg-lmo-dark-700">
                        <FileText className="h-4 w-4 mr-2" />
                        Start Review
                      </Button>
                    </Link>
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
