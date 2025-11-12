# LMO Content Engine - Complete Implementation Blueprint

**Version:** 2.0 (Unified)  
**Stack:** Next.js 14 + shadcn/ui + Firebase + Stripe Extension  
**Timeline:** Phase 1 - 6-8 weeks  
**Last Updated:** November 2025

---

## Executive Summary

A modern, scalable platform for automated Q&A content generation optimized for generative AI visibility. Built with Next.js 14 App Router, shadcn/ui for components, Firebase for backend, and Stripe's official Firebase Extension for payments.

**Core Value:** Transform any website into a comprehensive knowledge base of SEO-optimized Q&A content through AI-powered research, generation, and review workflows.

---

## 1. Technology Stack (FINAL)

### Frontend
- **Next.js 14.2+** (App Router, React Server Components)
- **shadcn/ui** - Component system (Radix UI primitives)
- **TypeScript 5.3+**
- **Tailwind CSS 3.4+**
- **TipTap Editor** - Rich text editing with Markdown support
- **Zustand** - Client state management
- **React Query** - Server state & caching
- **Framer Motion** - Animations

### Backend & Database
- **Firebase Auth** - Google & Email authentication
- **Firestore** - Primary database
- **Firebase Functions** - Serverless functions
- **Vercel Edge Functions** - Streaming responses

### Payments
- **Stripe Firebase Extension** (`firestore-stripe-payments`)
  - Automatic webhook handling
  - Subscription sync
  - Customer portal
  - No custom webhook code needed

### AI Services
- **Perplexity API** (`sonar-pro`) - Research & topic discovery
- **OpenAI GPT-4 Turbo** - Content generation & fact-checking

### DevOps
- **Vercel** - Hosting & deployment
- **GitHub Actions** - CI/CD
- **Sentry** - Error tracking
- **Upstash Redis** - Caching layer

---

## 2. System Architecture

```
┌─────────────────────────────────────────────────┐
│              Next.js 14 Frontend                │
│         (shadcn/ui + TailwindCSS)              │
└────────────┬────────────────────────────────────┘
             │
             ├──────────────┬──────────────┬───────────────┐
             │              │              │               │
    ┌────────▼──────┐  ┌───▼────────┐  ┌──▼──────────┐ ┌─▼─────────┐
    │   Firebase    │  │  Vercel    │  │  Perplexity │ │  OpenAI   │
    │     Auth      │  │   Edge     │  │     API     │ │    API    │
    └────────┬──────┘  │ Functions  │  └─────────────┘ └───────────┘
             │         └────────────┘
             │
    ┌────────▼──────────────────────────────────────┐
    │              Firestore Database                │
    │  ┌──────────┬──────────┬──────────┬─────────┐│
    │  │ Projects │Categories│ Questions│  Jobs   ││
    │  │  Drafts  │Fact-checks│Customers│Products ││
    │  └──────────┴──────────┴──────────┴─────────┘│
    └───────────────────────┬───────────────────────┘
                            │
                   ┌────────▼────────┐
                   │ Stripe Firebase │
                   │   Extension     │
                   │  (Auto-sync)    │
                   └────────┬────────┘
                            │
                      ┌─────▼─────┐
                      │  Stripe   │
                      │    API    │
                      └───────────┘
```

---

## 3. Enhanced User Stories (from PRD)

### 3.1 As a Content Strategist

#### Story 1: Website Research & Topic Discovery

**I want to input a website URL so that the system can research it and identify topics that are relevant to my brand.**

**Implementation Details:**

```typescript
// app/projects/new/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { validateUrl, extractDomain } from '@/lib/utils/url';
import { createProject } from '@/lib/api/projects';
import { Loader2, Globe, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function NewProjectPage() {
  const [url, setUrl] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const router = useRouter();

  const handleUrlChange = async (value: string) => {
    setUrl(value);
    setValidationError(null);
    
    // Real-time validation
    if (value.length > 8) {
      setIsValidating(true);
      try {
        const isValid = await validateUrl(value);
        if (!isValid) {
          setValidationError('Invalid URL format or unreachable');
        }
      } catch (error) {
        setValidationError('Unable to verify URL');
      } finally {
        setIsValidating(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validationError || !url) return;
    
    setIsCreating(true);
    
    try {
      const { project, jobId } = await createProject({
        websiteUrl: url,
        name: extractDomain(url),
      });
      
      toast.success('Research started!', {
        description: 'Analyzing your website for content opportunities...',
        action: {
          label: 'View Progress',
          onClick: () => router.push(`/projects/${project.id}/discover`),
        },
      });
      
      router.push(`/projects/${project.id}/discover?jobId=${jobId}`);
      
    } catch (error) {
      toast.error('Failed to create project', {
        description: error.message,
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="container max-w-2xl py-16">
      <Card className="p-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Create New Project
            </h1>
            <p className="text-slate-600 mt-2">
              Enter your website URL to start generating AI-optimized content
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-900">
                Website URL
              </label>
              <div className="relative">
                <Globe className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <Input
                  type="url"
                  placeholder="https://example.com"
                  value={url}
                  onChange={(e) => handleUrlChange(e.target.value)}
                  className={`pl-10 ${validationError ? 'border-red-500' : ''}`}
                  disabled={isCreating}
                />
                {isValidating && (
                  <Loader2 className="absolute right-3 top-3 h-5 w-5 animate-spin text-slate-400" />
                )}
              </div>
              {validationError && (
                <div className="flex items-center gap-2 text-sm text-red-600">
                  <AlertCircle className="h-4 w-4" />
                  {validationError}
                </div>
              )}
            </div>

            <Button
              type="submit"
              disabled={isCreating || isValidating || !!validationError || !url}
              className="w-full"
            >
              {isCreating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Project...
                </>
              ) : (
                'Start Research'
              )}
            </Button>
          </form>

          <div className="border-t pt-4">
            <h3 className="text-sm font-medium text-slate-900 mb-2">
              What happens next?
            </h3>
            <ul className="space-y-2 text-sm text-slate-600">
              <li className="flex items-start gap-2">
                <span className="text-teal-600 mt-0.5">1.</span>
                AI analyzes your website content and structure
              </li>
              <li className="flex items-start gap-2">
                <span className="text-teal-600 mt-0.5">2.</span>
                Generates 5-10 relevant content categories
              </li>
              <li className="flex items-start gap-2">
                <span className="text-teal-600 mt-0.5">3.</span>
                You explore and expand topics of interest
              </li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
```

**Acceptance Criteria:**
- ✅ Real-time URL validation with visual feedback (green check/red error)
- ✅ Auto-completion for common domains
- ✅ Handles redirects, non-English sites, and paywall scenarios
- ✅ Job completes in <30 seconds with progress updates
- ✅ Cancellation support with confirmation dialog
- ✅ Error handling with actionable error messages

---

#### Story 2: Interactive Category Exploration

**I want to explore categories and subcategories interactively so I can decide where to focus content efforts.**

**Implementation Details:**

```typescript
// app/projects/[id]/discover/page.tsx
'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CategoryTree } from '@/components/discover/category-tree';
import { TreeSearch } from '@/components/discover/tree-search';
import { TreeFilters } from '@/components/discover/tree-filters';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, RefreshCw } from 'lucide-react';
import { getCategories, exportTree } from '@/lib/api/categories';
import { toast } from 'sonner';

export default function DiscoverPage({ params }: { params: { id: string } }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({ priority: 'all', confidence: 0 });
  const queryClient = useQueryClient();

  const { data: categories, isLoading } = useQuery({
    queryKey: ['categories', params.id],
    queryFn: () => getCategories(params.id),
  });

  const exportMutation = useMutation({
    mutationFn: () => exportTree(params.id),
    onSuccess: (blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `category-tree-${Date.now()}.json`;
      a.click();
      toast.success('Tree exported successfully');
    },
  });

  const stats = {
    totalCategories: categories?.length || 0,
    totalSubcategories: categories?.reduce((sum, cat) => sum + cat.subcategoryCount, 0) || 0,
    totalQuestions: categories?.reduce((sum, cat) => sum + cat.stats.totalQuestions, 0) || 0,
  };

  return (
    <div className="container py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Discover Content Topics
          </h1>
          <p className="text-slate-600 mt-1">
            Explore and expand AI-generated categories
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => exportMutation.mutate()}
            disabled={exportMutation.isPending}
          >
            <Download className="h-4 w-4 mr-2" />
            Export Tree
          </Button>
          <Button
            variant="outline"
            onClick={() => queryClient.invalidateQueries(['categories', params.id])}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="text-2xl font-bold text-teal-600">
            {stats.totalCategories}
          </div>
          <div className="text-sm text-slate-600">Categories</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-teal-600">
            {stats.totalSubcategories}
          </div>
          <div className="text-sm text-slate-600">Subcategories</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-teal-600">
            {stats.totalQuestions}
          </div>
          <div className="text-sm text-slate-600">Questions Generated</div>
        </Card>
      </div>

      {/* Search & Filters */}
      <Card className="p-4">
        <div className="flex gap-4">
          <TreeSearch value={searchQuery} onChange={setSearchQuery} />
          <TreeFilters value={filters} onChange={setFilters} />
        </div>
      </Card>

      {/* Category Tree */}
      <CategoryTree
        projectId={params.id}
        categories={categories}
        searchQuery={searchQuery}
        filters={filters}
        isLoading={isLoading}
      />
    </div>
  );
}
```

```typescript
// components/discover/category-tree.tsx
'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, ChevronDown, Plus, Loader2, Star } from 'lucide-react';
import { expandCategory } from '@/lib/api/categories';
import { SubcategoryNode } from './subcategory-node';
import { cn } from '@/lib/utils';

interface CategoryTreeProps {
  projectId: string;
  categories: Category[];
  searchQuery: string;
  filters: any;
  isLoading: boolean;
}

export function CategoryTree({ 
  projectId, 
  categories, 
  searchQuery,
  filters,
  isLoading 
}: CategoryTreeProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const queryClient = useQueryClient();

  const expandMutation = useMutation({
    mutationFn: (categoryId: string) => 
      expandCategory(projectId, categoryId),
    onSuccess: (data, categoryId) => {
      setExpandedIds(prev => new Set(prev).add(categoryId));
      queryClient.invalidateQueries(['subcategories', projectId, categoryId]);
    },
  });

  if (isLoading) {
    return <TreeSkeleton />;
  }

  // Filter categories by search
  const filteredCategories = categories?.filter(cat => 
    cat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cat.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-3">
      {filteredCategories?.map((category) => (
        <CategoryNode
          key={category.id}
          category={category}
          projectId={projectId}
          isExpanded={expandedIds.has(category.id)}
          onToggleExpand={() => {
            if (expandedIds.has(category.id)) {
              setExpandedIds(prev => {
                const next = new Set(prev);
                next.delete(category.id);
                return next;
              });
            } else {
              expandMutation.mutate(category.id);
            }
          }}
          isExpanding={expandMutation.isPending && expandMutation.variables === category.id}
        />
      ))}
    </div>
  );
}

function CategoryNode({ 
  category, 
  projectId,
  isExpanded, 
  onToggleExpand, 
  isExpanding 
}) {
  const { data: subcategories } = useQuery({
    queryKey: ['subcategories', projectId, category.id],
    queryFn: () => getSubcategories(projectId, category.id),
    enabled: isExpanded,
  });

  return (
    <Card className="overflow-hidden border-l-4 border-l-teal-500">
      <button
        onClick={onToggleExpand}
        disabled={isExpanding}
        className="w-full p-4 flex items-start gap-4 hover:bg-slate-50 transition-colors text-left"
      >
        <motion.div
          animate={{ rotate: isExpanded ? 90 : 0 }}
          transition={{ duration: 0.2 }}
          className="mt-1"
        >
          <ChevronRight className="w-5 h-5 text-slate-600" />
        </motion.div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h3 className="font-semibold text-slate-900 mb-1">
                {category.title}
              </h3>
              <p className="text-sm text-slate-600 line-clamp-2">
                {category.description}
              </p>
            </div>

            <div className="flex items-center gap-3 flex-shrink-0">
              {category.confidence && (
                <Badge variant="secondary" className="gap-1">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  {(category.confidence * 100).toFixed(0)}%
                </Badge>
              )}
              
              {isExpanding && (
                <Loader2 className="w-4 h-4 animate-spin text-teal-600" />
              )}
              
              {category.hasSubcategories && (
                <Badge variant="outline">
                  {category.subcategoryCount} subcategories
                </Badge>
              )}
              
              {category.stats.totalQuestions > 0 && (
                <Badge variant="outline" className="bg-teal-50 text-teal-700 border-teal-200">
                  {category.stats.totalQuestions} questions
                </Badge>
              )}
            </div>
          </div>
        </div>
      </button>

      <AnimatePresence>
        {isExpanded && subcategories && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="border-t border-slate-200 bg-slate-50/50 p-4 space-y-2">
              {subcategories.map(sub => (
                <SubcategoryNode
                  key={sub.id}
                  subcategory={sub}
                  projectId={projectId}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
```

**Acceptance Criteria:**
- ✅ Smooth expand/collapse animations
- ✅ Real-time search with auto-expand parents
- ✅ Drag-and-drop reordering (using `@dnd-kit`)
- ✅ Keyboard navigation (arrows, Enter)
- ✅ Multi-select for bulk actions
- ✅ Export as JSON/CSV
- ✅ Lazy loading for deep trees
- ✅ Inline title editing with undo
- ✅ Full ARIA labels for accessibility

---

### 3.2 As a Reviewer/Editor

#### Story 3: Unified Review Dashboard

**I want to view all generated questions and drafts in one interface.**

```typescript
// app/projects/[id]/review/page.tsx
'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { DataTable } from '@/components/ui/data-table';
import { QuestionFilters } from '@/components/review/question-filters';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download, Check, X, AlertCircle } from 'lucide-react';
import { getQuestions } from '@/lib/api/questions';
import { useRouter } from 'next/navigation';

export default function ReviewPage({ params }: { params: { id: string } }) {
  const [filters, setFilters] = useState({
    status: 'all',
    categoryId: null,
    confidence: 0,
    search: '',
  });
  const [page, setPage] = useState(1);
  const router = useRouter();

  const { data, isLoading } = useQuery({
    queryKey: ['questions', params.id, filters, page],
    queryFn: () => getQuestions(params.id, { ...filters, page, limit: 20 }),
  });

  const columns = [
    {
      header: 'Question',
      cell: (row) => (
        <div className="max-w-md">
          <div className="font-medium text-slate-900">{row.question}</div>
          <div className="text-sm text-slate-500 mt-1 line-clamp-1">
            {row.category} → {row.subcategory}
          </div>
        </div>
      ),
    },
    {
      header: 'Status',
      cell: (row) => <StatusBadge status={row.status} />,
    },
    {
      header: 'Confidence',
      cell: (row) => (
        <ConfidenceBadge 
          score={row.factCheckScore} 
          status={row.factCheckStatus} 
        />
      ),
    },
    {
      header: 'Draft Preview',
      cell: (row) => (
        <div className="max-w-xs text-sm text-slate-600 line-clamp-2">
          {row.shortDraftPreview}
        </div>
      ),
    },
    {
      header: 'Actions',
      cell: (row) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push(`/projects/${params.id}/review/${row.id}`)}
        >
          Review
        </Button>
      ),
    },
  ];

  return (
    <div className="container py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Review Content</h1>
          <p className="text-slate-600 mt-1">
            {data?.total || 0} questions awaiting review
          </p>
        </div>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export Selected
        </Button>
      </div>

      <QuestionFilters value={filters} onChange={setFilters} />

      <DataTable
        columns={columns}
        data={data?.questions || []}
        isLoading={isLoading}
        pagination={{
          page,
          pageSize: 20,
          total: data?.total || 0,
          onPageChange: setPage,
        }}
      />
    </div>
  );
}
```

**Acceptance Criteria:**
- ✅ Infinite scroll pagination
- ✅ Real-time Firestore subscriptions
- ✅ Customizable filter presets
- ✅ Bulk accept/reject with confirmation
- ✅ Export as Markdown bundle
- ✅ Mobile-responsive (cards on small screens)
- ✅ Initial load <1s

---

#### Story 4: Rich Text Editing with Keyboard Shortcuts

**I want to edit the generated answers in markdown/WYSIWYG mode and accept or reject them easily with keyboard shortcuts.**

```typescript
// app/projects/[id]/review/[questionId]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { RichTextEditor } from '@/components/review/rich-text-editor';
import { DraftPreview } from '@/components/review/draft-preview';
import { FactCheckPanel } from '@/components/review/fact-check-panel';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Check, X, RotateCw, Save } from 'lucide-react';
import { getQuestionWithDrafts, acceptDraft, rejectDraft, saveDraft } from '@/lib/api/questions';
import { useKeyboardShortcuts } from '@/lib/hooks/use-keyboard-shortcuts';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function QuestionReviewPage({ 
  params 
}: { 
  params: { id: string; questionId: string } 
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState('');
  const [activeTab, setActiveTab] = useState<'short' | 'long'>('short');
  const router = useRouter();

  const { data, isLoading } = useQuery({
    queryKey: ['question', params.questionId],
    queryFn: () => getQuestionWithDrafts(params.id, params.questionId),
  });

  const acceptMutation = useMutation({
    mutationFn: () => acceptDraft(params.id, data.drafts[activeTab].id),
    onSuccess: () => {
      toast.success('Answer accepted');
      loadNextQuestion();
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (reason: string) => 
      rejectDraft(params.id, data.drafts[activeTab].id, reason),
    onSuccess: () => {
      toast.info('Answer rejected');
      loadNextQuestion();
    },
  });

  const saveMutation = useMutation({
    mutationFn: () => 
      saveDraft(params.id, data.drafts[activeTab].id, editedContent),
    onSuccess: () => {
      toast.success('Draft saved');
      setIsEditing(false);
    },
  });

  const loadNextQuestion = () => {
    // Navigate to next question in queue
    router.push(`/projects/${params.id}/review`); // Or implement next logic
  };

  // Keyboard shortcuts
  useKeyboardShortcuts({
    'a': () => !isEditing && acceptMutation.mutate(),
    'r': () => !isEditing && rejectMutation.mutate(''),
    'e': () => setIsEditing(!isEditing),
    'ctrl+enter': () => {
      if (isEditing) {
        saveMutation.mutate();
        loadNextQuestion();
      }
    },
    'escape': () => setIsEditing(false),
  });

  if (isLoading) return <ReviewSkeleton />;

  const currentDraft = data.drafts[activeTab];

  return (
    <div className="container max-w-7xl py-6">
      <div className="grid grid-cols-2 gap-6 h-[calc(100vh-120px)]">
        {/* Left: AI Draft */}
        <Card className="p-6 flex flex-col overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900">AI Generated Draft</h3>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="short">Short (80 words)</TabsTrigger>
                <TabsTrigger value="long">Long (250+ words)</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="flex-1 overflow-y-auto">
            <RichTextEditor
              content={isEditing ? editedContent : currentDraft.content}
              onChange={setEditedContent}
              editable={isEditing}
              className="prose prose-sm max-w-none"
            />
          </div>

          {data.factCheck && (
            <FactCheckPanel 
              factCheck={data.factCheck}
              className="mt-4 border-t pt-4"
            />
          )}

          <div className="flex items-center gap-2 mt-4 text-sm text-slate-600">
            <div>{currentDraft.wordCount} words</div>
            <div>•</div>
            <div>Generated {new Date(currentDraft.createdAt).toLocaleDateString()}</div>
          </div>
        </Card>

        {/* Right: Preview & Actions */}
        <Card className="p-6 flex flex-col overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900">Preview</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? 'Stop Editing' : 'Edit'}
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto border border-slate-200 rounded-lg p-6 bg-white">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              {data.question.question}
            </h2>
            <DraftPreview 
              content={isEditing ? editedContent : currentDraft.htmlContent} 
            />
          </div>

          {currentDraft.citations.length > 0 && (
            <div className="mt-4 space-y-2">
              <h4 className="text-sm font-medium text-slate-900">Sources</h4>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {currentDraft.citations.map((citation, i) => (
                  
                    key={i}
                    href={citation.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-sm text-teal-600 hover:text-teal-700 truncate"
                  >
                    {i + 1}. {citation.source}
                  </a>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3 mt-6 pt-6 border-t">
            <Button
              onClick={() => acceptMutation.mutate()}
              disabled={acceptMutation.isPending || isEditing}
              className="flex-1 bg-teal-600 hover:bg-teal-700"
            >
              <Check className="w-4 h-4 mr-2" />
              Accept (A)
            </Button>
            <Button
              onClick={() => rejectMutation.mutate('')}
              disabled={rejectMutation.isPending || isEditing}
              variant="outline"
              className="flex-1"
            >
              <X className="w-4 h-4 mr-2" />
              Reject (R)
            </Button>
            <Button
              variant="outline"
              className="px-4"
            >
              <RotateCw className="w-4 h-4" />
            </Button>
          </div>

          {isEditing && (
            <Button
              onClick={() => saveMutation.mutate()}
              disabled={saveMutation.isPending}
              className="w-full mt-2"
              variant="secondary"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Changes (Ctrl+Enter)
            </Button>
          )}
        </Card>
      </div>

      {/* Keyboard shortcuts hint */}
      <div className="fixed bottom-4 right-4 bg-slate-900 text-white text-xs px-3 py-2 rounded-lg shadow-lg">
        <div className="flex gap-4">
          <span><kbd>A</kbd> Accept</span>
          <span><kbd>R</kbd> Reject</span>
          <span><kbd>E</kbd> Edit</span>
          <span><kbd>Ctrl+Enter</kbd> Save & Next</span>
        </div>
      </div>
    </div>
  );
}
```

**Acceptance Criteria:**
- ✅ WYSIWYG with bold, italic, lists, code blocks, headings
- ✅ Bidirectional Markdown sync
- ✅ Customizable shortcuts in settings
- ✅ Validation: prevent accept if <200 words
- ✅ Auto-save every 10 seconds
- ✅ Undo/redo stack
- ✅ Edit locking for collaboration
- ✅ Full keyboard support + high-contrast mode

---

## 4. Complete Database Schema

```typescript
// lib/firebase/schema.ts

interface Project {
  id: string;
  name: string;
  websiteUrl: string;
  domain: string;
  status: 'initializing' | 'researching' | 'active' | 'completed' | 'error';
  
  // Ownership
  ownerId: string;
  editorIds: string[];
  
  // Research metadata
  researchJobId?: string;
  categoryTreeGenerated: boolean;
  
  // Statistics (denormalized)
  stats: {
    totalCategories: number;
    totalSubcategories: number;
    totalQuestions: number;
    questionsGenerated: number;
    questionsAccepted: number;
    questionsRejected: number;
    averageConfidence: number;
  };
  
  // Settings
  settings: {
    targetAudience?: string;
    brandVoice: 'professional' | 'casual' | 'technical' | 'friendly';
    contentDepth: 'concise' | 'detailed' | 'comprehensive';
    factCheckThreshold: number; // 0-1
    autoGenerateQuestions: boolean;
  };
  
  // Timestamps
  createdAt: Timestamp;
  updatedAt: Timestamp;
  lastActivityAt: Timestamp;
  deletedAt?: Timestamp;
}

interface Category {
  id: string;
  projectId: string;
  title: string;
  description: string;
  slug: string;
  order: number;
  level: 0;
  parentId: null;
  
  // Generation metadata
  generatedBy: 'perplexity' | 'manual';
  perplexityPrompt?: string;
  confidence: number; // 0-1
  
  // Expansion state
  isExpanded: boolean;
  hasSubcategories: boolean;
  subcategoryCount: number;
  
  // Statistics
  stats: {
    totalQuestions: number;
    questionsGenerated: number;
    questionsAccepted: number;
  };
  
  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdBy: string;
}

interface Subcategory {
  id: string;
  projectId: string;
  categoryId: string;
  title: string;
  description: string;
  slug: string;
  order: number;
  level: 1;
  parentId: string; // categoryId
  
  generatedBy: 'perplexity' | 'manual';
  perplexityPrompt?: string;
  confidence: number;
  
  isExpanded: boolean;
  hasQuestions: boolean;
  questionCount: number;
  
  stats: {
    totalQuestions: number;
    questionsGenerated: number;
    questionsAccepted: number;
  };
  
  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdBy: string;
}

interface Question {
  id: string;
  projectId: string;
  categoryId: string;
  subcategoryId: string;
  
  question: string;
  questionSlug: string;
  
  searchIntent: 'informational' | 'navigational' | 'transactional';
  targetKeywords: string[];
  relatedTerms: string[];
  
  generatedBy: 'perplexity' | 'manual';
  perplexityPrompt?: string;
  perplexityResearchId?: string;
  
  status: 'pending' | 'generating' | 'ready_for_review' | 'accepted' | 'rejected';
  
  currentDraftId?: string;
  draftCount: number;
  hasShortDraft: boolean;
  hasLongDraft: boolean;
  
  factCheckStatus: 'pending' | 'in_progress' | 'completed' | 'failed';
  factCheckJobId?: string;
  factCheckScore?: number; // 0-1
  factCheckIssues?: string[];
  
  reviewedBy?: string;
  reviewedAt?: Timestamp;
  reviewNotes?: string;
  
  createdAt: Timestamp;
  updatedAt: Timestamp;
  order: number;
}

interface Draft {
  id: string;
  questionId: string;
  projectId: string;
  
  type: 'short' | 'long';
  
  content: string; // Markdown
  htmlContent?: string; // Cached
  wordCount: number;
  
  generatedBy: 'gpt4' | 'manual';
  model?: string;
  prompt?: string;
  temperature?: number;
  
  citations: Array<{
    text: string;
    url: string;
    source: string;
    relevance: number;
  }>;
  
  qualityScore?: number;
  readabilityScore?: number;
  seoScore?: number;
  
  version: number;
  parentDraftId?: string;
  isDraft: boolean;
  
  status: 'draft' | 'accepted' | 'rejected';
  
  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdBy: string;
  acceptedBy?: string;
  acceptedAt?: Timestamp;
}

interface FactCheck {
  id: string;
  questionId: string;
  draftId: string;
  projectId: string;
  
  overallScore: number; // 0-1
  confidence: 'high' | 'medium' | 'low';
  
  claims: Array<{
    claim: string;
    verification: 'verified' | 'unverified' | 'disputed';
    sources: string[];
    confidence: number;
    explanation: string;
  }>;
  
  issues: Array<{
    type: 'factual_error' | 'missing_context' | 'outdated' | 'unsupported';
    severity: 'critical' | 'warning' | 'info';
    location: string;
    description: string;
    suggestedFix?: string;
  }>;
  
  sourcesChecked: number;
  sourcesVerified: number;
  externalSources: string[];
  
  jobId: string;
  model: string;
  processingTime: number;
  
  status: 'completed' | 'failed' | 'partial';
  errorMessage?: string;
  
  createdAt: Timestamp;
  completedAt?: Timestamp;
}

interface Job {
  id: string;
  type: 'research_site' | 'generate_categories' | 'generate_subcategories' | 
        'generate_questions' | 'generate_draft' | 'fact_check';
  idempotencyKey: string;
  
  projectId: string;
  entityId?: string;
  parentJobId?: string;
  
  params: Record<string, any>;
  
  status: 'queued' | 'processing' | 'completed' | 'failed' | 'cancelled';
  progress: number; // 0-100
  
  attempts: number;
  maxAttempts: number;
  nextRetryAt?: Timestamp;
  backoffMultiplier: number;
  
  result?: Record<string, any>;
  error?: {
    message: string;
    code: string;
    stack?: string;
    timestamp: Timestamp;
  };
  
  startedAt?: Timestamp;
  completedAt?: Timestamp;
  processingTime?: number;
  workerId?: string;
  
  createdAt: Timestamp;
  updatedAt: Timestamp;
  expiresAt: Timestamp;
}
```

---

## 5. Stripe Integration (Firebase Extension)

### 5.1 Installation & Setup

```bash
# Install via Firebase CLI
firebase ext:install stripe/firestore-stripe-payments --project=lmo-content-engine

# Configure during installation:
# - Stripe API Key (from Stripe Dashboard)
# - Webhook Secret (automatically configured)
# - Products & Prices collection: 'products'
# - Customers collection: 'customers'
```

### 5.2 Product Setup

```typescript
// Create products directly in Stripe Dashboard, they auto-sync to Firestore

// products/{productId}
{
  name: "Starter Plan",
  description: "Perfect for small projects",
  active: true,
  images: ["https://..."],
  metadata: {
    questionsPerMonth: "50",
    features: ["Basic support", "5 projects"],
  },
  prices: [
    {
      id: "price_starter_monthly",
      active: true,
      currency: "usd",
      unit_amount: 2900, // $29.00
      type: "recurring",
      interval: "month",
      interval_count: 1,
    }
  ]
}
```

### 5.3 Client-Side Integration

```typescript
// lib/stripe/client.ts
import { getFunctions, httpsCallable } from 'firebase/functions';
import { getFirestore, collection, doc, onSnapshot } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const functions = getFunctions();
const db = getFirestore();
const auth = getAuth();

export async function createCheckoutSession(priceId: string) {
  const createCheckout = httpsCallable(
    functions, 
    'ext-firestore-stripe-payments-createCheckoutSession'
  );
  
  const { data } = await createCheckout({
    price: priceId,
    success_url: `${window.location.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${window.location.origin}/pricing`,
    allow_promotion_codes: true,
  });
  
  return data as { sessionId: string; url: string };
}

export async function createPortalLink() {
  const createPortal = httpsCallable(
    functions,
    'ext-firestore-stripe-payments-createPortalLink'
  );
  
  const { data } = await createPortal({
    returnUrl: `${window.location.origin}/settings/billing`,
  });
  
  return data as { url: string };
}

export function useSubscription(userId: string) {
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const subscriptionsRef = collection(
      db,
      'customers',
      userId,
      'subscriptions'
    );

    const unsubscribe = onSnapshot(subscriptionsRef, (snapshot) => {
      const subs = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(sub => sub.status === 'active' || sub.status === 'trialing');
      
      setSubscription(subs[0] || null);
      setLoading(false);
    });

    return unsubscribe;
  }, [userId]);

  return { subscription, loading };
}
```

### 5.4 Pricing Page with shadcn

```typescript
// app/pricing/page.tsx
'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Loader2 } from 'lucide-react';
import { getProducts, createCheckoutSession } from '@/lib/stripe/client';
import { useAuth } from '@/lib/firebase/auth';
import { toast } from 'sonner';

const PLAN_FEATURES = {
  starter: [
    '50 questions per month',
    '5 active projects',
    'Basic support',
    'Email notifications',
  ],
  pro: [
    '500 questions per month',
    'Unlimited projects',
    'Priority support',
    'Custom branding',
    'API access',
    'Team collaboration',
  ],
  enterprise: [
    'Unlimited questions',
    'Unlimited projects',
    'Dedicated support',
    'Custom AI models',
    'White-label option',
    'SLA guarantee',
  ],
};

export default function PricingPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState<string | null>(null);

  const { data: products, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
  });

  async function handleSubscribe(priceId: string) {
    if (!user) {
      toast.error('Please sign in to subscribe');
      return;
    }

    setLoading(priceId);
    try {
      const { url } = await createCheckoutSession(priceId);
      window.location.href = url;
    } catch (error) {
      toast.error('Failed to start checkout');
      console.error(error);
    } finally {
      setLoading(null);
    }
  }

  if (isLoading) {
    return <PricingSkeleton />;
  }

  return (
    <div className="container max-w-6xl py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">
          Choose Your Plan
        </h1>
        <p className="text-xl text-slate-600">
          Start generating AI-optimized content today
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {products?.map((product) => {
          const price = product.prices[0];
          const planKey = product.metadata.planKey;
          const isPopular = planKey === 'pro';

          return (
            <Card 
              key={product.id}
              className={`relative p-8 ${
                isPopular ? 'border-2 border-teal-500 shadow-lg' : ''
              }`}
            >
              {isPopular && (
                <Badge 
                  className="absolute -top-3 left-1/2 -translate-x-1/2 bg-teal-600"
                >
                  Most Popular
                </Badge>
              )}

              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">
                  {product.name}
                </h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-slate-900">
                    ${price.unit_amount / 100}
                  </span>
                  <span className="text-slate-600">/month</span>
                </div>
                <p className="text-slate-600">{product.description}</p>
              </div>

              <ul className="space-y-3 mb-8">
                {PLAN_FEATURES[planKey]?.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                onClick={() => handleSubscribe(price.id)}
                disabled={loading !== null}
                className={`w-full ${
                  isPopular 
                    ? 'bg-teal-600 hover:bg-teal-700' 
                    : 'bg-slate-900 hover:bg-slate-800'
                }`}
              >
                {loading === price.id ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Loading...
                  </>
                ) : (
                  'Get Started'
                )}
              </Button>
            </Card>
          );
        })}
      </div>

      <div className="text-center mt-12 text-sm text-slate-600">
        All plans include 14-day free trial. No credit card required.
      </div>
    </div>
  );
}
```

### 5.5 Usage-Based Billing

```typescript
// lib/stripe/usage.ts
import { getFirestore, doc, updateDoc, increment } from 'firebase/firestore';

export async function trackQuestionGeneration(userId: string) {
  const db = getFirestore();
  
  // Get active subscription
  const subscription = await getActiveSubscription(userId);
  
  if (!subscription) {
    throw new Error('No active subscription');
  }

  // Check if metered billing is enabled
  const subscriptionItem = subscription.items[0];
  
  if (subscriptionItem.price.recurring.usage_type === 'metered') {
    // Report usage to Stripe (handled by Firebase extension)
    await reportUsage(subscriptionItem.id, 1);
  }
  
  // Track in Firestore for dashboard
  await updateDoc(doc(db, 'customers', userId), {
    'usage.questionsThisMonth': increment(1),
    'usage.lastQuestionAt': new Date(),
  });
}

// Check if user has remaining quota
export async function canGenerateQuestion(userId: string): Promise<boolean> {
  const subscription = await getActiveSubscription(userId);
  
  if (!subscription) return false;
  
  const planLimit = subscription.metadata.questionsPerMonth;
  const usage = await getCurrentUsage(userId);
  
  return usage.questionsThisMonth < planLimit;
}
```

---

## 6. Complete Project Structure

```
lmo-content-engine/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── register/
│   │       └── page.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx
│   │   ├── page.tsx                    # Projects list
│   │   ├── projects/
│   │   │   ├── new/
│   │   │   │   └── page.tsx
│   │   │   └── [id]/
│   │   │       ├── page.tsx            # Overview
│   │   │       ├── discover/
│   │   │       │   └── page.tsx        # Category tree
│   │   │       ├── review/
│   │   │       │   ├── page.tsx        # Questions list
│   │   │       │   └── [questionId]/
│   │   │       │       └── page.tsx    # Review editor
│   │   │       └── settings/
│   │   │           └── page.tsx
│   │   └── settings/
│   │       ├── page.tsx
│   │       ├── billing/
│   │       │   └── page.tsx
│   │       └── team/
│   │           └── page.tsx
│   ├── pricing/
│   │   └── page.tsx
│   ├── success/
│   │   └── page.tsx
│   ├── api/
│   │   ├── projects/
│   │   │   ├── route.ts
│   │   │   └── [id]/
│   │   │       ├── route.ts
│   │   │       └── categories/
│   │   │           └── route.ts
│   │   ├── questions/
│   │   │   └── [id]/
│   │   │       └── route.ts
│   │   ├── drafts/
│   │   │   └── [id]/
│   │   │       └── route.ts
│   │   ├── jobs/
│   │   │   └── [id]/
│   │   │       └── route.ts
│   │   └── webhooks/
│   │       └── stripe/
│   │           └── route.ts
│   ├── layout.tsx
│   └── globals.css
│
├── components/
│   ├── ui/                             # shadcn components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   ├── tabs.tsx
│   │   ├── badge.tsx
│   │   ├── data-table.tsx
│   │   └── ...
│   ├── layout/
│   │   ├── sidebar.tsx
│   │   ├── topbar.tsx
│   │   ├── page-header.tsx
│   │   └── mobile-nav.tsx
│   ├── discover/
│   │   ├── category-tree.tsx
│   │   ├── category-node.tsx
│   │   ├── subcategory-node.tsx
│   │   ├── tree-search.tsx
│   │   ├── tree-filters.tsx
│   │   └── expansion-button.tsx
│   ├── review/
│   │   ├── questions-list.tsx
│   │   ├── question-filters.tsx
│   │   ├── review-editor.tsx
│   │   ├── rich-text-editor.tsx
│   │   ├── draft-preview.tsx
│   │   ├── fact-check-panel.tsx
│   │   ├── status-badge.tsx
│   │   └── keyboard-shortcuts.tsx
│   └── common/
│       ├── loading-state.tsx
│       ├── error-state.tsx
│       ├── empty-state.tsx
│       └── page-loading.tsx
│
├── lib/
│   ├── firebase/
│   │   ├── client.ts
│   │   ├── admin.ts
│   │   ├── auth.ts
│   │   ├── queries.ts
│   │   └── schema.ts
│   ├── api/
│   │   ├── client.ts
│   │   ├── projects.ts
│   │   ├── categories.ts
│   │   ├── questions.ts
│   │   ├── drafts.ts
│   │   └── types.ts
│   ├── stripe/
│   │   ├── client.ts
│   │   ├── usage.ts
│   │   └── products.ts
│   ├── ai/
│   │   ├── perplexity.ts
│   │   ├── openai.ts
│   │   ├── fact-check.ts
│   │   └── prompts.ts
│   ├── queue/
│   │   ├── job-queue.ts
│   │   ├── workers.ts
│   │   └── idempotency.ts
│   ├── hooks/
│   │   ├── use-auth.ts
│   │   ├── use-project.ts
│   │   ├── use-questions.ts
│   │   ├── use-subscription.ts
│   │   ├── use-job-status.ts
│   │   └── use-keyboard-shortcuts.ts
│   ├── stores/
│   │   ├── editor-store.ts
│   │   ├── ui-store.ts
│   │   └── auth-store.ts
│   └── utils/
│       ├── cn.ts
│       ├── markdown.ts
│       ├── validation.ts
│       ├── url.ts
│       └── formatting.ts
│
├── styles/
│   └── globals.css
│
├── public/
│   ├── fonts/
│   └── images/
│
├── .env.local
├── .env.example
├── firebase.json
├── firestore.rules
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

---

## 7. Implementation Roadmap

### **Week 1-2: Foundation & Setup**
- [ ] Initialize Next.js 14 project with shadcn/ui
- [ ] Set up Firebase (Auth, Firestore, Functions)
- [ ] Install Stripe Firebase Extension
- [ ] Configure authentication flows
- [ ] Create base layout components (Sidebar, TopBar)
- [ ] Set up database schema in Firestore
- [ ] Create Firestore security rules
- [ ] Set up Perplexity & OpenAI API clients

### **Week 3-4: Core Features (Discover)**
- [ ] Implement project creation flow
- [ ] Build Perplexity research integration
- [ ] Create category tree generation logic
- [ ] Build Category Tree UI component
- [ ] Implement category expansion
- [ ] Add subcategory generation
- [ ] Build question generation
- [ ] Create job queue system with retry logic

### **Week 5-6: Review System**
- [ ] Implement draft generation (short & long)
- [ ] Build fact-checking system
- [ ] Create Review dashboard with filters
- [ ] Build rich-text editor (TipTap)
- [ ] Implement keyboard shortcuts
- [ ] Add draft preview component
- [ ] Create accept/reject workflows
- [ ] Build version control for edits

### **Week 7-8: Polish, Testing & Launch**
- [ ] Add Stripe pricing page
- [ ] Implement usage tracking
- [ ] Create customer portal integration
- [ ] Write unit tests (Vitest)
- [ ] Create E2E tests (Playwright)
- [ ] Performance optimization (caching, lazy loading)
- [ ] Error handling & monitoring (Sentry)
- [ ] User testing & feedback
- [ ] Documentation
- [ ] Deploy to Vercel
- [ ] Launch! 🚀

---

## 8. Environment Variables

```bash
# .env.local

# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Firebase Admin (server-side)
FIREBASE_ADMIN_PROJECT_ID=
FIREBASE_ADMIN_CLIENT_EMAIL=
FIREBASE_ADMIN_PRIVATE_KEY=

# AI Services
PERPLEXITY_API_KEY=
OPENAI_API_KEY=

# Stripe (managed by Firebase Extension)
STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# Redis (optional, for caching)
UPSTASH_REDIS_URL=
UPSTASH_REDIS_TOKEN=

# Monitoring
NEXT_PUBLIC_SENTRY_DSN=
SENTRY_AUTH_TOKEN=

# App
NEXT_PUBLIC_APP_URL=https://lmo-engine.com
```

---

## 9. Success Metrics & KPIs

### Technical Metrics
- Job Success Rate: ≥95%
- Category Generation: <10s
- Question Generation: <15s
- Draft Generation: <30s
- Fact-Checking: <60s
- API Response (p95): <500ms
- Uptime: 99.9%

### User Experience
- Time to First Category: <30s
- Questions per Hour: ≥100
- Review Speed: ≥10 answers/hour
- Draft Acceptance Rate: ≥70%
- Fact-Check Accuracy: ≥85%

### Business
- Cost per Question: <$0.10
- Active Projects per User: ≥2
- Average Project Size: 50+ questions
- 30-Day Retention: ≥60%
- Conversion Rate (Free → Paid): ≥15%

---

## 10. Open Questions & Decisions

**Resolved:**
1. ✅ Framework: shadcn/ui + Next.js 14
2. ✅ Payments: Stripe Firebase Extension
3. ✅ Database: Firestore

**Remaining:**

1. **Fact-Check Blocking**
   - **Decision Needed:** Block acceptance if confidence < 0.6?
   - **Recommendation:** Warn only, let reviewer decide

2. **Manual Edits**
   - **Decision Needed:** Create new version or overwrite?
   - **Recommendation:** Create new version, keep history

3. **API Key Management**
   - **Decision Needed:** User-supplied or centralized?
   - **Recommendation:** Centralized for Phase 1

4. **Category Editing**
   - **Decision Needed:** Allow manual edits post-generation?
   - **Recommendation:** Yes, with "manual" flag

5. **Re-research**
   - **Decision Needed:** Allow category refresh?
   - **Recommendation:** Yes, with "Refresh" button

---

## 🎯 **Ready to Build!**

This unified PRD combines:
- ✅ Detailed user stories with acceptance criteria
- ✅ Complete technical architecture
- ✅ shadcn/ui component system
- ✅ Stripe Firebase Extension integration
- ✅ Comprehensive database schema
- ✅ Clear implementation roadmap
- ✅ Production-ready patterns

**Start command:**
```bash
npx create-next-app@latest lmo-content-engine --typescript --tailwind --app
cd lmo-content-engine
npx shadcn-ui@latest init
```

Ready to vibe code? 🚀