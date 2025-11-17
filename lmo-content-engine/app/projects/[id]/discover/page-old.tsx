'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/hooks/use-auth';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import {
  Loader2,
  AlertCircle,
  ArrowLeft,
  FolderTree,
  TrendingUp,
  MessageSquarePlus,
  ChevronDown,
  ChevronRight,
  Plus,
  HelpCircle,
  Layers,
  Sparkles,
  Edit,
  Trash2,
  SlidersHorizontal
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { BulkActionsModal } from '@/components/content/bulk-actions-modal';

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
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [isGeneratingCategories, setIsGeneratingCategories] = useState(false);

  // Form state
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [isSaving, setIsSaving] = useState(false);

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

  const handleAddCategory = () => {
    setEditingCategory(null);
    setFormTitle('');
    setFormDescription('');
    setIsAddEditModalOpen(true);
  };

  const handleEditCategory = (category: Category, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingCategory(category);
    setFormTitle(category.title);
    setFormDescription(category.description);
    setIsAddEditModalOpen(true);
  };

  const handleSaveCategory = async () => {
    if (!formTitle.trim()) {
      alert('Please enter a category title');
      return;
    }

    try {
      setIsSaving(true);
      const { auth } = await import('@/lib/firebase/config');
      const idToken = await auth.currentUser?.getIdToken();

      if (!idToken) {
        throw new Error('Not authenticated');
      }

      const url = editingCategory
        ? `/api/projects/${projectId}/categories/${editingCategory.id}`
        : `/api/projects/${projectId}/categories`;

      const method = editingCategory ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formTitle,
          description: formDescription,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save category');
      }

      setIsAddEditModalOpen(false);
      await fetchCategories();
    } catch (error: any) {
      console.error('Failed to save category:', error);
      alert(`Failed to save category: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteCategory = async (categoryId: string, e: React.MouseEvent) => {
    e.stopPropagation();

    if (!confirm('Are you sure you want to delete this category? This will also delete all its subcategories and questions.')) {
      return;
    }

    try {
      const { auth } = await import('@/lib/firebase/config');
      const idToken = await auth.currentUser?.getIdToken();

      if (!idToken) {
        throw new Error('Not authenticated');
      }

      const response = await fetch(`/api/projects/${projectId}/categories/${categoryId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${idToken}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete category');
      }

      await fetchCategories();
    } catch (error: any) {
      console.error('Failed to delete category:', error);
      alert(`Failed to delete category: ${error.message}`);
    }
  };

  const handleGenerateCategories = async () => {
    try {
      setIsGeneratingCategories(true);
      const { auth } = await import('@/lib/firebase/config');
      const idToken = await auth.currentUser?.getIdToken();

      if (!idToken) {
        throw new Error('Not authenticated');
      }

      const response = await fetch(`/api/projects/${projectId}/categories/generate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${idToken}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to generate categories');
      }

      alert('Category generation started! This may take a few moments.');
      await fetchCategories();
    } catch (error: any) {
      console.error('Failed to generate categories:', error);
      alert(`Failed to generate categories: ${error.message}`);
    } finally {
      setIsGeneratingCategories(false);
    }
  };

  const handleToggleSelect = (categoryId: string) => {
    const newSelected = new Set(selectedCategories);
    if (newSelected.has(categoryId)) {
      newSelected.delete(categoryId);
    } else {
      newSelected.add(categoryId);
    }
    setSelectedCategories(newSelected);
  };

  const handleSelectAll = () => {
    setSelectedCategories(new Set(categories.map(c => c.id)));
  };

  const handleDeselectAll = () => {
    setSelectedCategories(new Set());
  };

  const handleBulkGenerateSubcategories = async () => {
    try {
      const { auth } = await import('@/lib/firebase/config');
      const idToken = await auth.currentUser?.getIdToken();

      await fetch('/api/categories/bulk', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          categoryIds: Array.from(selectedCategories),
          action: 'generateSubcategories',
          projectId,
        }),
      });

      alert('Bulk subcategory generation started!');
      setSelectedCategories(new Set());
      setIsBulkModalOpen(false);
    } catch (error: any) {
      console.error('Bulk operation failed:', error);
      alert(`Failed: ${error.message}`);
    }
  };

  const handleBulkGenerateQuestions = async () => {
    try {
      const { auth } = await import('@/lib/firebase/config');
      const idToken = await auth.currentUser?.getIdToken();

      await fetch('/api/categories/bulk', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          categoryIds: Array.from(selectedCategories),
          action: 'generateQuestions',
          projectId,
        }),
      });

      alert('Bulk question generation started!');
      setSelectedCategories(new Set());
      setIsBulkModalOpen(false);
    } catch (error: any) {
      console.error('Bulk operation failed:', error);
      alert(`Failed: ${error.message}`);
    }
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${selectedCategories.size} categories?`)) {
      return;
    }

    try {
      const { auth } = await import('@/lib/firebase/config');
      const idToken = await auth.currentUser?.getIdToken();

      await fetch('/api/categories/bulk', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          categoryIds: Array.from(selectedCategories),
          action: 'delete',
          projectId,
        }),
      });

      await fetchCategories();
      setSelectedCategories(new Set());
      setIsBulkModalOpen(false);
    } catch (error: any) {
      console.error('Bulk delete failed:', error);
      alert(`Failed: ${error.message}`);
    }
  };

  const getConfidenceBadge = (confidence: number) => {
    const percentage = Math.round(confidence * 100);
    let variant: 'default' | 'secondary' | 'outline' | 'destructive' = 'outline';
    let colorClass = 'bg-yellow-100 text-yellow-800 border-yellow-300';

    if (percentage >= 80) {
      colorClass = 'bg-lmo-dark-100 text-lmo-dark-700 border-lmo-dark-100';
    } else if (percentage >= 60) {
      colorClass = 'bg-blue-100 text-blue-800 border-blue-300';
    } else {
      colorClass = 'bg-orange-100 text-orange-800 border-orange-300';
    }

    return (
      <Badge variant="outline" className={`flex items-center gap-1 ${colorClass}`}>
        <TrendingUp className="h-3 w-3" />
        {percentage}%
      </Badge>
    );
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

  const allSelected = categories.length > 0 && categories.every(c => selectedCategories.has(c.id));
  const someSelected = selectedCategories.size > 0 && !allSelected;

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
              Manage and organize your content categories
            </p>
          </div>
          <div className="flex gap-2">
            {selectedCategories.size > 0 && (
              <Button
                variant="outline"
                onClick={() => setIsBulkModalOpen(true)}
              >
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Bulk Actions ({selectedCategories.size})
              </Button>
            )}
            <Button
              variant="outline"
              onClick={handleAddCategory}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
            <Button
              onClick={handleGenerateCategories}
              disabled={isGeneratingCategories}
              className="bg-lmo-dark-600 hover:bg-lmo-dark-700"
            >
              {isGeneratingCategories ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate with AI
                </>
              )}
            </Button>
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
            <div className="flex items-center gap-3">
              <Checkbox
                checked={allSelected ? true : someSelected ? 'indeterminate' : false}
                onCheckedChange={(checked) => {
                  if (checked) {
                    handleSelectAll();
                  } else {
                    handleDeselectAll();
                  }
                }}
              />
              <p className="text-sm text-slate-600">
                {selectedCategories.size > 0 ? (
                  <span>{selectedCategories.size} selected</span>
                ) : (
                  <span>{categories.length} {categories.length === 1 ? 'category' : 'categories'} found</span>
                )}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {categories.map((category) => {
              const isExpanded = expandedCategories.has(category.id);
              const categorySubcategories = subcategories[category.id] || [];
              const isGenerating = generatingSubcategories.has(category.id);
              const isSelected = selectedCategories.has(category.id);

              return (
                <div key={category.id} className="space-y-2">
                  <Card className={`hover:shadow-md transition-all ${isSelected ? 'ring-2 ring-lmo-dark-600' : ''}`}>
                    <CardHeader>
                      <div className="flex items-start gap-3">
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => handleToggleSelect(category.id)}
                          onClick={(e) => e.stopPropagation()}
                        />
                        <div
                          className={`flex-1 ${category.hasSubcategories ? 'cursor-pointer' : ''}`}
                          onClick={() => category.hasSubcategories && toggleCategory(category.id)}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2 flex-1">
                              {category.hasSubcategories && (
                                <div className="flex items-center justify-center h-6 w-6">
                                  {isExpanded ? (
                                    <ChevronDown className="h-4 w-4 text-slate-600" />
                                  ) : (
                                    <ChevronRight className="h-4 w-4 text-slate-600" />
                                  )}
                                </div>
                              )}
                              <CardTitle className="text-lg">{category.title}</CardTitle>
                            </div>
                            <div className="flex items-center gap-2">
                              {getConfidenceBadge(category.confidence)}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => handleEditCategory(category, e)}
                                className="h-8 w-8 p-0"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => handleDeleteCategory(category.id, e)}
                                className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <CardDescription className="text-sm ml-8">
                            {category.description}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-[1fr_auto] gap-4">
                        {/* Left column - Info */}
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge variant="secondary" className="flex items-center gap-1.5">
                              <HelpCircle className="h-3 w-3" />
                              {category.stats.totalQuestions} {category.stats.totalQuestions === 1 ? 'Question' : 'Questions'}
                            </Badge>

                            {category.hasSubcategories && (
                              <Badge variant="outline" className="flex items-center gap-1.5">
                                <Layers className="h-3 w-3" />
                                {category.subcategoryCount} {category.subcategoryCount === 1 ? 'Subcategory' : 'Subcategories'}
                              </Badge>
                            )}
                          </div>

                          {!category.hasSubcategories && (
                            <div className="pt-3 border-t">
                              <Button
                                variant="outline"
                                className="w-full"
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
                            </div>
                          )}
                        </div>

                        {/* Right column - Q&A Button */}
                        <div className="flex items-start">
                          <Button
                            onClick={() => navigateToQuestions(category.id)}
                            className="whitespace-nowrap"
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
                        <Link
                          key={subcategory.id}
                          href={`/projects/${projectId}/discover/${subcategory.id}`}
                          className="block"
                        >
                          <Card className="bg-slate-50 hover:bg-slate-100 hover:border-lmo-dark-600 transition-all cursor-pointer">
                            <CardContent className="pt-4">
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex-1">
                                  <h4 className="font-medium text-slate-900 mb-1 group-hover:text-lmo-dark-600">
                                    {subcategory.title}
                                  </h4>
                                  <p className="text-sm text-slate-600">
                                    {subcategory.description}
                                  </p>
                                </div>
                                {getConfidenceBadge(subcategory.confidence)}
                              </div>

                              <div className="flex items-center gap-2 mt-3">
                                <Badge variant="secondary" className="flex items-center gap-1.5">
                                  <HelpCircle className="h-3 w-3" />
                                  {subcategory.stats.totalQuestions} {subcategory.stats.totalQuestions === 1 ? 'Question' : 'Questions'}
                                </Badge>
                                {subcategory.stats.totalQuestions === 0 && (
                                  <Badge variant="outline" className="text-xs">
                                    Click to generate
                                  </Badge>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Add/Edit Category Modal */}
      <AlertDialog open={isAddEditModalOpen} onOpenChange={setIsAddEditModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {editingCategory ? 'Edit Category' : 'Add New Category'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {editingCategory
                ? 'Update the category information below.'
                : 'Create a new category for your content organization.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label htmlFor="title" className="text-sm font-medium text-slate-900 mb-2 block">
                Category Title *
              </label>
              <Input
                id="title"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="e.g., Product Features, How-To Guides"
                className="w-full"
              />
            </div>
            <div>
              <label htmlFor="description" className="text-sm font-medium text-slate-900 mb-2 block">
                Description
              </label>
              <textarea
                id="description"
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="Brief description of this category..."
                className="w-full min-h-[100px] px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-lmo-dark-600 focus:border-transparent"
              />
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSaving}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleSaveCategory}
              disabled={isSaving}
              className="bg-lmo-dark-600 hover:bg-lmo-dark-700"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>{editingCategory ? 'Update' : 'Create'} Category</>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk Actions Modal */}
      <BulkActionsModal
        isOpen={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
        selectedCount={selectedCategories.size}
        mode="categories"
        onGenerateSubcategories={handleBulkGenerateSubcategories}
        onGenerateQuestions={handleBulkGenerateQuestions}
        onDelete={handleBulkDelete}
      />
    </div>
  );
}
