'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/hooks/use-auth';
import { CategoryTree } from '@/components/content/category-tree';
import { ContentToolbar } from '@/components/content/content-toolbar';
import { ContentList } from '@/components/content/content-list';
import { ContentEditorPane } from '@/components/content/content-editor-pane';
import { BulkActionsModal } from '@/components/content/bulk-actions-modal';
import { CategoryDialog } from '@/components/content/category-dialog';
import type {
  PublicationStatus,
  WorkflowStatus,
  SortBy,
  SortOrder,
  ViewMode,
} from '@/components/content/content-toolbar';
import { Loader2 } from 'lucide-react';

interface ContentItem {
  id: string;
  question: string;
  content?: string;
  status: 'pending' | 'generating' | 'ready_for_review' | 'accepted' | 'rejected';
  publicationStatus?: 'draft' | 'published' | 'archived';
  draftType?: 'short' | 'long';
  wordCount?: number;
  categoryTitle?: string;
  subcategoryTitle?: string;
  categoryId?: string;
  subcategoryId?: string;
  createdAt: Date;
  updatedAt: Date;
  hasShortDraft?: boolean;
  hasLongDraft?: boolean;
  currentDraftId?: string;
}

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

export default function ContentPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Record<string, Subcategory[]>>({});
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<string | null>(null);

  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<ContentItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [activeItemId, setActiveItemId] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [publicationStatus, setPublicationStatus] = useState<PublicationStatus>('all');
  const [workflowStatus, setWorkflowStatus] = useState<WorkflowStatus>('all');
  const [sortBy, setSortBy] = useState<SortBy>('updatedAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [viewMode, setViewMode] = useState<ViewMode>('card');
  const [bulkActionsOpen, setBulkActionsOpen] = useState(false);

  // Category management dialogs
  const [addCategoryOpen, setAddCategoryOpen] = useState(false);
  const [addSubcategoryOpen, setAddSubcategoryOpen] = useState(false);
  const [selectedParentCategoryId, setSelectedParentCategoryId] = useState<string | null>(null);
  const [isGeneratingSubcategories, setIsGeneratingSubcategories] = useState(false);

  // Column widths
  const [categoryWidth, setCategoryWidth] = useState(20); // percentage
  const [listWidth, setListWidth] = useState(30); // percentage

  // Auto-collapse sidebar on mount
  useEffect(() => {
    localStorage.setItem('sidebar-collapsed', 'true');
    // Dispatch a custom event to notify the sidebar
    window.dispatchEvent(new CustomEvent('sidebar-collapse-request', { detail: { collapsed: true } }));
  }, []);

  // Fetch projects
  useEffect(() => {
    if (user) {
      fetchProjects();
    }
  }, [user]);

  // Fetch categories when project selected
  useEffect(() => {
    if (selectedProjectId) {
      fetchCategories();
    }
  }, [selectedProjectId]);

  // Fetch content when filters change
  useEffect(() => {
    if (selectedProjectId) {
      fetchContent();
    }
  }, [selectedProjectId, selectedCategoryId, selectedSubcategoryId, workflowStatus, publicationStatus]);

  // Apply client-side filtering
  useEffect(() => {
    let filtered = [...contentItems];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.question.toLowerCase().includes(query) ||
          item.content?.toLowerCase().includes(query)
      );
    }

    setFilteredItems(filtered);

    // Auto-select first item if none selected
    if (filtered.length > 0 && !activeItemId) {
      setActiveItemId(filtered[0].id);
    }
  }, [contentItems, searchQuery]);

  const fetchProjects = async () => {
    try {
      const { auth } = await import('@/lib/firebase/config');
      const idToken = await auth.currentUser?.getIdToken();

      const response = await fetch('/api/projects', {
        headers: { Authorization: `Bearer ${idToken}` },
      });

      const data = await response.json();
      if (response.ok && data.projects) {
        setProjects(data.projects);
        // Auto-select first project
        if (data.projects.length > 0 && !selectedProjectId) {
          setSelectedProjectId(data.projects[0].id);
        }
      }
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    if (!selectedProjectId) return;

    try {
      const { auth } = await import('@/lib/firebase/config');
      const idToken = await auth.currentUser?.getIdToken();

      const response = await fetch(`/api/projects/${selectedProjectId}/categories`, {
        headers: { Authorization: `Bearer ${idToken}` },
      });

      const data = await response.json();
      if (response.ok) {
        setCategories(data.categories || []);

        // Fetch subcategories for each category
        const subcatMap: Record<string, Subcategory[]> = {};
        for (const category of data.categories || []) {
          if (category.hasSubcategories) {
            const subResponse = await fetch(
              `/api/projects/${selectedProjectId}/categories/${category.id}/subcategories`,
              {
                headers: { Authorization: `Bearer ${idToken}` },
              }
            );
            const subData = await subResponse.json();
            if (subResponse.ok) {
              subcatMap[category.id] = subData.subcategories || [];
            }
          }
        }
        setSubcategories(subcatMap);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const fetchContent = async () => {
    if (!selectedProjectId) return;

    try {
      const { auth } = await import('@/lib/firebase/config');
      const idToken = await auth.currentUser?.getIdToken();

      const params = new URLSearchParams({
        projectId: selectedProjectId,
      });

      if (selectedCategoryId) {
        params.append('category', selectedCategoryId);
      }
      if (selectedSubcategoryId) {
        params.append('subcategory', selectedSubcategoryId);
      }
      if (workflowStatus !== 'all') {
        params.append('workflowStatus', workflowStatus);
      }
      if (publicationStatus !== 'all') {
        params.append('publicationStatus', publicationStatus);
      }
      params.append('sortBy', sortBy);
      params.append('sortOrder', sortOrder);

      const response = await fetch(`/api/content?${params.toString()}`, {
        headers: { Authorization: `Bearer ${idToken}` },
      });

      const data = await response.json();
      if (response.ok) {
        const items = (data.items || []).map((item: any) => ({
          ...item,
          createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
          updatedAt: item.updatedAt ? new Date(item.updatedAt) : new Date(),
        }));
        setContentItems(items);
      }
    } catch (error) {
      console.error('Failed to fetch content:', error);
    }
  };

  const handleCategorySelect = (categoryId: string | null, subcategoryId?: string | null) => {
    setSelectedCategoryId(categoryId);
    setSelectedSubcategoryId(subcategoryId || null);
    setActiveItemId(null);
    setSelectedItems(new Set());
  };

  const handleItemSelect = (itemId: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(itemId)) {
      newSelected.delete(itemId);
    } else {
      newSelected.add(itemId);
    }
    setSelectedItems(newSelected);
  };

  const handleSelectAll = () => {
    setSelectedItems(new Set(filteredItems.map((item) => item.id)));
  };

  const handleDeselectAll = () => {
    setSelectedItems(new Set());
  };

  const handleItemClick = (itemId: string) => {
    setActiveItemId(itemId);
  };

  const handleKeyboardNavigation = (direction: 'up' | 'down') => {
    const currentIndex = filteredItems.findIndex((item) => item.id === activeItemId);
    if (currentIndex === -1) return;

    let newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0) newIndex = filteredItems.length - 1;
    if (newIndex >= filteredItems.length) newIndex = 0;

    setActiveItemId(filteredItems[newIndex].id);
  };

  const handleNavigatePrevious = () => {
    const currentIndex = filteredItems.findIndex((item) => item.id === activeItemId);
    if (currentIndex > 0) {
      setActiveItemId(filteredItems[currentIndex - 1].id);
    }
  };

  const handleNavigateNext = () => {
    const currentIndex = filteredItems.findIndex((item) => item.id === activeItemId);
    if (currentIndex < filteredItems.length - 1) {
      setActiveItemId(filteredItems[currentIndex + 1].id);
    }
  };

  const handleQuickGenerate = async (itemId: string) => {
    if (!selectedProjectId) return;
    try {
      const { auth } = await import('@/lib/firebase/config');
      const idToken = await auth.currentUser?.getIdToken();

      const response = await fetch('/api/content/bulk-update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          projectId: selectedProjectId,
          itemIds: [itemId],
          action: 'generate',
        }),
      });

      if (response.ok) {
        await fetchContent();
      }
    } catch (error) {
      console.error('Failed to generate content:', error);
    }
  };

  const handleQuickApprove = async (itemId: string) => {
    if (!selectedProjectId) return;
    try {
      const { auth } = await import('@/lib/firebase/config');
      const idToken = await auth.currentUser?.getIdToken();

      const response = await fetch('/api/content/bulk-update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          projectId: selectedProjectId,
          itemIds: [itemId],
          action: 'approve',
        }),
      });

      if (response.ok) {
        await fetchContent();
      }
    } catch (error) {
      console.error('Failed to approve content:', error);
    }
  };

  const handleBulkGenerate = async () => {
    if (!selectedProjectId) return;
    try {
      const { auth } = await import('@/lib/firebase/config');
      const idToken = await auth.currentUser?.getIdToken();

      const response = await fetch('/api/content/bulk-update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          projectId: selectedProjectId,
          itemIds: Array.from(selectedItems),
          action: 'generate',
        }),
      });

      if (response.ok) {
        await fetchContent();
        setSelectedItems(new Set());
      }
    } catch (error) {
      console.error('Failed to generate content:', error);
    }
  };

  const handleBulkApprove = async () => {
    if (!selectedProjectId) return;
    try {
      const { auth } = await import('@/lib/firebase/config');
      const idToken = await auth.currentUser?.getIdToken();

      const response = await fetch('/api/content/bulk-update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          projectId: selectedProjectId,
          itemIds: Array.from(selectedItems),
          action: 'approve',
        }),
      });

      if (response.ok) {
        await fetchContent();
        setSelectedItems(new Set());
      }
    } catch (error) {
      console.error('Failed to approve items:', error);
    }
  };

  const handleBulkPublish = async () => {
    if (!selectedProjectId) return;
    try {
      const { auth } = await import('@/lib/firebase/config');
      const idToken = await auth.currentUser?.getIdToken();

      const response = await fetch('/api/content/bulk-update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          projectId: selectedProjectId,
          itemIds: Array.from(selectedItems),
          action: 'publish',
        }),
      });

      if (response.ok) {
        await fetchContent();
        setSelectedItems(new Set());
      }
    } catch (error) {
      console.error('Failed to publish items:', error);
    }
  };

  const handleBulkArchive = async () => {
    if (!selectedProjectId) return;
    try {
      const { auth } = await import('@/lib/firebase/config');
      const idToken = await auth.currentUser?.getIdToken();

      const response = await fetch('/api/content/bulk-update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          projectId: selectedProjectId,
          itemIds: Array.from(selectedItems),
          action: 'archive',
        }),
      });

      if (response.ok) {
        await fetchContent();
        setSelectedItems(new Set());
      }
    } catch (error) {
      console.error('Failed to archive items:', error);
    }
  };

  const handleBulkDelete = async () => {
    if (!selectedProjectId) return;
    try {
      const { auth } = await import('@/lib/firebase/config');
      const idToken = await auth.currentUser?.getIdToken();

      const response = await fetch('/api/content/bulk-update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          projectId: selectedProjectId,
          itemIds: Array.from(selectedItems),
          action: 'delete',
        }),
      });

      if (response.ok) {
        await fetchContent();
        setSelectedItems(new Set());
      }
    } catch (error) {
      console.error('Failed to delete items:', error);
    }
  };

  // Category management handlers
  const handleAddCategory = () => {
    setAddCategoryOpen(true);
  };

  const handleAddSubcategory = (categoryId: string) => {
    setSelectedParentCategoryId(categoryId);
    setAddSubcategoryOpen(true);
  };

  const handleCreateCategory = async (title: string, description?: string) => {
    if (!selectedProjectId) return;

    const { auth } = await import('@/lib/firebase/config');
    const idToken = await auth.currentUser?.getIdToken();

    const response = await fetch(`/api/projects/${selectedProjectId}/categories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify({ title, description }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create category');
    }

    // Refresh categories
    await fetchCategories();
  };

  const handleCreateSubcategory = async (title: string, description?: string) => {
    if (!selectedProjectId || !selectedParentCategoryId) return;

    const { auth } = await import('@/lib/firebase/config');
    const idToken = await auth.currentUser?.getIdToken();

    const response = await fetch(`/api/projects/${selectedProjectId}/categories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify({
        title,
        description,
        parentId: selectedParentCategoryId,
        level: 1,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create subcategory');
    }

    // Refresh categories
    await fetchCategories();
  };

  const handleGenerateSubcategory = async (categoryId: string) => {
    if (!selectedProjectId) return;

    setIsGeneratingSubcategories(true);

    try {
      const { auth } = await import('@/lib/firebase/config');
      const idToken = await auth.currentUser?.getIdToken();

      const response = await fetch(
        `/api/projects/${selectedProjectId}/categories/${categoryId}/subcategories`,
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

      // Refresh categories
      await fetchCategories();
    } catch (error: any) {
      console.error('Failed to generate subcategories:', error);
      alert(error.message || 'Failed to generate subcategories');
    } finally {
      setIsGeneratingSubcategories(false);
    }
  };

  // Column resizing
  const handleCategoryResize = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = categoryWidth;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const containerWidth = window.innerWidth - 64; // Subtract sidebar width
      const delta = moveEvent.clientX - startX;
      const deltaPercent = (delta / containerWidth) * 100;
      const newWidth = Math.max(10, Math.min(40, startWidth + deltaPercent));
      setCategoryWidth(newWidth);
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleListResize = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = listWidth;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const containerWidth = window.innerWidth - 64; // Subtract sidebar width
      const delta = moveEvent.clientX - startX;
      const deltaPercent = (delta / containerWidth) * 100;
      const newWidth = Math.max(20, Math.min(50, startWidth + deltaPercent));
      setListWidth(newWidth);
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const activeItem = filteredItems.find((item) => item.id === activeItemId);
  const activeItemIndex = filteredItems.findIndex((item) => item.id === activeItemId);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-lmo-dark-600" />
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">No projects yet</h2>
          <p className="text-slate-600 mb-6">
            Create a project first to start managing your content
          </p>
          <a href="/projects/new" className="text-lmo-dark-600 hover:text-lmo-dark-700 font-medium">
            Create your first project →
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Toolbar */}
      <ContentToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        publicationStatus={publicationStatus}
        onPublicationStatusChange={setPublicationStatus}
        workflowStatus={workflowStatus}
        onWorkflowStatusChange={setWorkflowStatus}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSortChange={(newSortBy, newSortOrder) => {
          setSortBy(newSortBy);
          setSortOrder(newSortOrder);
        }}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        totalCount={contentItems.length}
        filteredCount={filteredItems.length}
        selectedCount={selectedItems.size}
        userId={user?.uid}
        projectId={selectedProjectId || undefined}
      />

      {/* Main Content: 3-column layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Category Tree */}
        <div style={{ width: `${categoryWidth}%` }} className="min-w-[200px] overflow-hidden relative">
          <CategoryTree
            projectId={selectedProjectId || ''}
            categories={categories}
            subcategories={subcategories}
            selectedCategoryId={selectedCategoryId || undefined}
            selectedSubcategoryId={selectedSubcategoryId || undefined}
            onCategorySelect={handleCategorySelect}
            onAddCategory={handleAddCategory}
            onAddSubcategory={handleAddSubcategory}
            onGenerateSubcategory={handleGenerateSubcategory}
          />
          {/* Resize Handle */}
          <div
            onMouseDown={handleCategoryResize}
            className="absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-lmo-dark-600 transition-colors group"
          >
            <div className="absolute top-1/2 right-0 transform -translate-y-1/2 w-1 h-12 bg-slate-300 group-hover:bg-lmo-dark-600 transition-colors" />
          </div>
        </div>

        {/* Content List */}
        <div style={{ width: `${listWidth}%` }} className="min-w-[300px] border-r overflow-hidden relative">
          <ContentList
            items={filteredItems}
            selectedItems={selectedItems}
            onItemSelect={handleItemSelect}
            onSelectAll={handleSelectAll}
            onDeselectAll={handleDeselectAll}
            activeItemId={activeItemId || undefined}
            onItemClick={handleItemClick}
            onKeyboardNavigation={handleKeyboardNavigation}
            onBulkActions={() => setBulkActionsOpen(true)}
            onQuickGenerate={handleQuickGenerate}
            onQuickApprove={handleQuickApprove}
          />
          {/* Resize Handle */}
          <div
            onMouseDown={handleListResize}
            className="absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-lmo-dark-600 transition-colors group"
          >
            <div className="absolute top-1/2 right-0 transform -translate-y-1/2 w-1 h-12 bg-slate-300 group-hover:bg-lmo-dark-600 transition-colors" />
          </div>
        </div>

        {/* Editor Pane */}
        <div style={{ width: `${100 - categoryWidth - listWidth}%` }} className="overflow-hidden">
          <ContentEditorPane
            itemId={activeItem?.id || null}
            question={activeItem?.question || ''}
            content={activeItem?.content || ''}
            status={activeItem?.status || 'pending'}
            publicationStatus={activeItem?.publicationStatus}
            draftType={activeItem?.draftType}
            wordCount={activeItem?.wordCount}
            hasShortDraft={activeItem?.hasShortDraft}
            hasLongDraft={activeItem?.hasLongDraft}
            categoryTitle={activeItem?.categoryTitle}
            subcategoryTitle={activeItem?.subcategoryTitle}
            onNavigatePrevious={activeItemIndex > 0 ? handleNavigatePrevious : undefined}
            onNavigateNext={
              activeItemIndex < filteredItems.length - 1 ? handleNavigateNext : undefined
            }
            currentIndex={activeItemIndex >= 0 ? activeItemIndex : undefined}
            totalItems={filteredItems.length}
          />
        </div>
      </div>

      {/* Bulk Actions Modal */}
      <BulkActionsModal
        isOpen={bulkActionsOpen}
        onClose={() => setBulkActionsOpen(false)}
        selectedCount={selectedItems.size}
        onGenerate={handleBulkGenerate}
        onApprove={handleBulkApprove}
        onPublish={handleBulkPublish}
        onArchive={handleBulkArchive}
        onDelete={handleBulkDelete}
      />

      {/* Add Category Dialog */}
      <CategoryDialog
        isOpen={addCategoryOpen}
        onClose={() => setAddCategoryOpen(false)}
        onSubmit={handleCreateCategory}
        title="Add Category"
        description="Create a new category to organize your content."
        submitLabel="Create Category"
      />

      {/* Add Subcategory Dialog */}
      <CategoryDialog
        isOpen={addSubcategoryOpen}
        onClose={() => setAddSubcategoryOpen(false)}
        onSubmit={handleCreateSubcategory}
        title="Add Subcategory"
        description="Create a new subcategory under the selected category."
        submitLabel="Create Subcategory"
      />
    </div>
  );
}
