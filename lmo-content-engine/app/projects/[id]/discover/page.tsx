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
  FolderTree,
  TrendingUp,
  MessageSquarePlus,
  ChevronDown,
  ChevronRight,
  Plus
} from 'lucide-react';

interface Category {
  id: string;
  title: string;
  description: string;
  slug: string;
  order: number;
  level: number;
  confidence: number;
  generatedBy: string;
  hasSubcategories: boolean;
  subcategoryCount: number;
  stats: {
    totalQuestions: number;
    questionsGenerated: number;
    questionsAccepted: number;
  };
}

export default function DiscoverPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [subcategories, setSubcategories] = useState<Record<string, Category[]>>({});
  const [generatingSubcategories, setGeneratingSubcategories] = useState<Set<string>>(new Set());
  const [generatingQuestions, setGeneratingQuestions] = useState<Set<string>>(new Set());

  const projectId = params.id as string;

  useEffect(() => {
    if (projectId && user) {
      fetchCategories();
    }
  }, [projectId, user]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);

      const { auth } = await import('@/lib/firebase/config');
      const idToken = await auth.currentUser?.getIdToken();

      if (!idToken) {
        throw new Error('Not authenticated');
      }

      const response = await fetch(`/api/projects/${projectId}/categories`, {
        headers: {
          'Authorization': `Bearer ${idToken}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Failed to fetch categories');
      }

      setCategories(data.categories || []);
    } catch (error: any) {
      console.error('Failed to fetch categories:', error);
      setError(error.message || 'Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const fetchSubcategories = async (categoryId: string) => {
    try {
      const { auth } = await import('@/lib/firebase/config');
      const idToken = await auth.currentUser?.getIdToken();

      if (!idToken) {
        throw new Error('Not authenticated');
      }

      const response = await fetch(
        `/api/projects/${projectId}/categories/${categoryId}/subcategories`,
        {
          headers: {
            'Authorization': `Bearer ${idToken}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Failed to fetch subcategories');
      }

      setSubcategories(prev => ({
        ...prev,
        [categoryId]: data.subcategories || [],
      }));
    } catch (error: any) {
      console.error('Failed to fetch subcategories:', error);
      alert(`Failed to load subcategories: ${error.message}`);
    }
  };

  const generateSubcategories = async (categoryId: string) => {
    try {
      setGeneratingSubcategories(prev => new Set(prev).add(categoryId));

      const { auth } = await import('@/lib/firebase/config');
      const idToken = await auth.currentUser?.getIdToken();

      if (!idToken) {
        throw new Error('Not authenticated');
      }

      const response = await fetch(
        `/api/projects/${projectId}/categories/${categoryId}/subcategories`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${idToken}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Failed to generate subcategories');
      }

      // Fetch the newly created subcategories
      await fetchSubcategories(categoryId);

      // Expand the category to show subcategories
      setExpandedCategories(prev => new Set(prev).add(categoryId));

      // Update the category in the list to reflect it now has subcategories
      setCategories(prev =>
        prev.map(cat =>
          cat.id === categoryId
            ? { ...cat, hasSubcategories: true, subcategoryCount: data.count }
            : cat
        )
      );
    } catch (error: any) {
      console.error('Failed to generate subcategories:', error);
      alert(`Failed to generate subcategories: ${error.message}`);
    } finally {
      setGeneratingSubcategories(prev => {
        const next = new Set(prev);
        next.delete(categoryId);
        return next;
      });
    }
  };

  const toggleCategory = async (categoryId: string) => {
    const isExpanded = expandedCategories.has(categoryId);

    if (isExpanded) {
      // Collapse
      setExpandedCategories(prev => {
        const next = new Set(prev);
        next.delete(categoryId);
        return next;
      });
    } else {
      // Expand - fetch subcategories if not already loaded
      if (!subcategories[categoryId]) {
        await fetchSubcategories(categoryId);
      }
      setExpandedCategories(prev => new Set(prev).add(categoryId));
    }
  };

  const generateQuestions = async (categoryId: string) => {
    try {
      setGeneratingQuestions(prev => new Set(prev).add(categoryId));

      const { auth } = await import('@/lib/firebase/config');
      const idToken = await auth.currentUser?.getIdToken();

      if (!idToken) {
        throw new Error('Not authenticated');
      }

      const response = await fetch('/api/questions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectId,
          categoryId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Failed to generate questions');
      }

      // Navigate to questions page for this category
      router.push(`/projects/${projectId}/questions?category=${categoryId}`);
    } catch (error: any) {
      console.error('Failed to generate questions:', error);
      alert(`Failed to generate questions: ${error.message}`);
    } finally {
      setGeneratingQuestions(prev => {
        const next = new Set(prev);
        next.delete(categoryId);
        return next;
      });
    }
  };

  const navigateToQuestions = (categoryId: string, isSubcategory: boolean = false) => {
    router.push(`/projects/${projectId}/questions?category=${categoryId}`);
  };

  const getConfidenceBadge = (confidence: number) => {
    const percentage = Math.round(confidence * 100);
    let variant: 'default' | 'secondary' | 'outline' = 'outline';

    if (percentage >= 80) {
      variant = 'default';
    } else if (percentage >= 60) {
      variant = 'secondary';
    }

    return (
      <Badge variant={variant} className="flex items-center gap-1">
        <TrendingUp className="h-3 w-3" />
        {percentage}% confidence
      </Badge>
    );
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
                {error || 'Failed to load categories'}
              </h3>
              <p className="text-slate-500 mb-6 max-w-sm">
                Unable to load the content categories for this project.
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
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Content Categories</h1>
            <p className="text-slate-600">
              AI-generated content categories based on your website analysis
            </p>
          </div>
        </div>
      </div>

      {categories.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 mb-4">
                <FolderTree className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-medium text-slate-900 mb-2">
                No categories yet
              </h3>
              <p className="text-slate-500 mb-6 max-w-sm">
                Categories are being generated. This usually takes a few moments.
              </p>
              <Button onClick={fetchCategories} variant="outline">
                Refresh
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-slate-600">
              {categories.length} {categories.length === 1 ? 'category' : 'categories'} found
            </p>
          </div>

          <div className="space-y-4">
            {categories.map((category) => {
              const isExpanded = expandedCategories.has(category.id);
              const categorySubcategories = subcategories[category.id] || [];
              const isGenerating = generatingSubcategories.has(category.id);

              return (
                <div key={category.id} className="space-y-2">
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2 flex-1">
                          {category.hasSubcategories && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleCategory(category.id)}
                              className="h-6 w-6 p-0"
                            >
                              {isExpanded ? (
                                <ChevronDown className="h-4 w-4" />
                              ) : (
                                <ChevronRight className="h-4 w-4" />
                              )}
                            </Button>
                          )}
                          <CardTitle className="text-lg">{category.title}</CardTitle>
                        </div>
                        {getConfidenceBadge(category.confidence)}
                      </div>
                      <CardDescription className="text-sm ml-8">
                        {category.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-600">Questions:</span>
                          <span className="font-medium text-slate-900">
                            {category.stats.totalQuestions}
                          </span>
                        </div>

                        {category.hasSubcategories && (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-600">Subcategories:</span>
                            <span className="font-medium text-slate-900">
                              {category.subcategoryCount}
                            </span>
                          </div>
                        )}

                        <div className="pt-3 border-t flex gap-2">
                          {!category.hasSubcategories ? (
                            <Button
                              variant="outline"
                              className="flex-1"
                              onClick={() => generateSubcategories(category.id)}
                              disabled={isGenerating}
                            >
                              {isGenerating ? (
                                <>
                                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                  Generating...
                                </>
                              ) : (
                                <>
                                  <Plus className="h-4 w-4 mr-2" />
                                  Generate Subcategories
                                </>
                              )}
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              className="flex-1"
                              onClick={() => toggleCategory(category.id)}
                            >
                              {isExpanded ? (
                                <>
                                  <ChevronDown className="h-4 w-4 mr-2" />
                                  Collapse
                                </>
                              ) : (
                                <>
                                  <FolderTree className="h-4 w-4 mr-2" />
                                  Explore ({category.subcategoryCount})
                                </>
                              )}
                            </Button>
                          )}

                          <Button
                            variant="outline"
                            onClick={() => navigateToQuestions(category.id)}
                          >
                            <MessageSquarePlus className="h-4 w-4 mr-2" />
                            View Q&A
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Subcategories */}
                  {isExpanded && categorySubcategories.length > 0 && (
                    <div className="ml-8 space-y-2">
                      {categorySubcategories.map((subcategory) => (
                        <Card
                          key={subcategory.id}
                          className="bg-slate-50 hover:bg-slate-100 transition-colors"
                        >
                          <CardContent className="pt-4">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1">
                                <h4 className="font-medium text-slate-900 mb-1">
                                  {subcategory.title}
                                </h4>
                                <p className="text-sm text-slate-600">
                                  {subcategory.description}
                                </p>
                              </div>
                              {getConfidenceBadge(subcategory.confidence)}
                            </div>

                            <div className="flex gap-2 mt-3">
                              {subcategory.stats.totalQuestions > 0 ? (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => navigateToQuestions(subcategory.id, true)}
                                  className="bg-white"
                                >
                                  <MessageSquarePlus className="h-3 w-3 mr-2" />
                                  View Questions ({subcategory.stats.totalQuestions})
                                </Button>
                              ) : (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => generateQuestions(subcategory.id)}
                                  disabled={generatingQuestions.has(subcategory.id)}
                                  className="bg-white"
                                >
                                  {generatingQuestions.has(subcategory.id) ? (
                                    <>
                                      <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                                      Generating...
                                    </>
                                  ) : (
                                    <>
                                      <MessageSquarePlus className="h-3 w-3 mr-2" />
                                      Generate Questions
                                    </>
                                  )}
                                </Button>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
