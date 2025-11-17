'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  useAuth,
  useProjects,
  useCategoriesWithSubcategories,
  useContent,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
  useGenerateSubcategories,
  useBulkContentUpdate,
} from '@/lib/hooks';
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

export default function ContentPage() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const projectQueryParam = searchParams.get('project');

  // Filter & UI state
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<string | null>(null);
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
  const [editCategoryOpen, setEditCategoryOpen] = useState(false);
  const [deleteCategoryOpen, setDeleteCategoryOpen] = useState(false);
  const [selectedParentCategoryId, setSelectedParentCategoryId] = useState<string | null>(null);
  const [editingCategory, setEditingCategory] = useState<{ id: string; title: string; description?: string } | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<{ id: string; title: string } | null>(null);

  // Column widths
  const [categoryWidth, setCategoryWidth] = useState(20);
  const [listWidth, setListWidth] = useState(30);

  // Auto-collapse sidebar on mount
  useEffect(() => {
    localStorage.setItem('sidebar-collapsed', 'true');
    window.dispatchEvent(new CustomEvent('sidebar-collapse-request', { detail: { collapsed: true } }));
  }, []);

  // Fetch data with React Query
  const { data: projects, isLoading: projectsLoading } = useProjects();

  const { data: categoriesData, isLoading: categoriesLoading } = useCategoriesWithSubcategories(
    selectedProjectId
  );

  const { data: contentData, isLoading: contentLoading } = useContent({
    projectId: selectedProjectId,
    categoryId: selectedCategoryId,
    subcategoryId: selectedSubcategoryId,
    workflowStatus,
    publicationStatus,
    sortBy,
    sortOrder,
  });

  // Mutations
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();
  const generateSubcategories = useGenerateSubcategories();
  const bulkUpdate = useBulkContentUpdate();

  // Auto-select project from query param or first project
  useEffect(() => {
    if (projects && projects.length > 0 && !selectedProjectId) {
      // If there's a project query param and it exists in the projects list, use it
      if (projectQueryParam && projects.some(p => p.id === projectQueryParam)) {
        setSelectedProjectId(projectQueryParam);
      } else {
        // Otherwise, select the first project
        setSelectedProjectId(projects[0].id);
      }
    }
  }, [projects, selectedProjectId, projectQueryParam]);

  // Extract data from queries
  const categories = categoriesData?.categories || [];
  const subcategories = categoriesData?.subcategories || {};
  const contentItems = contentData || [];

  // Client-side search filtering
  const filteredItems = useMemo(() => {
    if (!searchQuery) return contentItems;

    const query = searchQuery.toLowerCase();
    return contentItems.filter(
      (item) =>
        item.question.toLowerCase().includes(query) ||
        item.content?.toLowerCase().includes(query)
    );
  }, [contentItems, searchQuery]);

  // Auto-select first item
  useEffect(() => {
    if (filteredItems.length > 0 && !activeItemId) {
      setActiveItemId(filteredItems[0].id);
    }
  }, [filteredItems, activeItemId]);

  // Event handlers
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

  // Quick actions
  const handleQuickGenerate = async (itemId: string) => {
    if (!selectedProjectId) return;
    await bulkUpdate.mutateAsync({
      projectId: selectedProjectId,
      itemIds: [itemId],
      action: 'generate',
    });
  };

  const handleQuickApprove = async (itemId: string) => {
    if (!selectedProjectId) return;
    await bulkUpdate.mutateAsync({
      projectId: selectedProjectId,
      itemIds: [itemId],
      action: 'approve',
    });
  };

  // Bulk actions
  const handleBulkGenerate = async () => {
    if (!selectedProjectId) return;
    await bulkUpdate.mutateAsync({
      projectId: selectedProjectId,
      itemIds: Array.from(selectedItems),
      action: 'generate',
    });
    setSelectedItems(new Set());
  };

  const handleBulkApprove = async () => {
    if (!selectedProjectId) return;
    await bulkUpdate.mutateAsync({
      projectId: selectedProjectId,
      itemIds: Array.from(selectedItems),
      action: 'approve',
    });
    setSelectedItems(new Set());
  };

  const handleBulkPublish = async () => {
    if (!selectedProjectId) return;
    await bulkUpdate.mutateAsync({
      projectId: selectedProjectId,
      itemIds: Array.from(selectedItems),
      action: 'publish',
    });
    setSelectedItems(new Set());
  };

  const handleBulkArchive = async () => {
    if (!selectedProjectId) return;
    await bulkUpdate.mutateAsync({
      projectId: selectedProjectId,
      itemIds: Array.from(selectedItems),
      action: 'archive',
    });
    setSelectedItems(new Set());
  };

  const handleBulkDelete = async () => {
    if (!selectedProjectId) return;
    await bulkUpdate.mutateAsync({
      projectId: selectedProjectId,
      itemIds: Array.from(selectedItems),
      action: 'delete',
    });
    setSelectedItems(new Set());
  };

  // Category management
  const handleAddCategory = () => {
    setAddCategoryOpen(true);
  };

  const handleAddSubcategory = (categoryId: string) => {
    setSelectedParentCategoryId(categoryId);
    setAddSubcategoryOpen(true);
  };

  const handleCreateCategory = async (title: string, description?: string) => {
    if (!selectedProjectId) return;
    await createCategory.mutateAsync({
      projectId: selectedProjectId,
      title,
      description,
    });
  };

  const handleCreateSubcategory = async (title: string, description?: string) => {
    if (!selectedProjectId || !selectedParentCategoryId) return;
    await createCategory.mutateAsync({
      projectId: selectedProjectId,
      title,
      description,
      parentId: selectedParentCategoryId,
      level: 1,
    });
  };

  const handleGenerateSubcategory = async (categoryId: string) => {
    if (!selectedProjectId) return;
    await generateSubcategories.mutateAsync({
      projectId: selectedProjectId,
      categoryId,
    });
  };

  const handleEditCategory = (categoryId: string, category: any) => {
    setEditingCategory({
      id: categoryId,
      title: category.title,
      description: category.description,
    });
    setEditCategoryOpen(true);
  };

  const handleUpdateCategory = async (title: string, description?: string) => {
    if (!selectedProjectId || !editingCategory) return;
    await updateCategory.mutateAsync({
      projectId: selectedProjectId,
      categoryId: editingCategory.id,
      title,
      description,
    });
    setEditCategoryOpen(false);
    setEditingCategory(null);
  };

  const handleDeleteCategory = (categoryId: string, category: any) => {
    setDeletingCategory({
      id: categoryId,
      title: category.title,
    });
    setDeleteCategoryOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedProjectId || !deletingCategory) return;
    await deleteCategory.mutateAsync({
      projectId: selectedProjectId,
      categoryId: deletingCategory.id,
    });
    setDeleteCategoryOpen(false);
    setDeletingCategory(null);
    // Clear selection if deleted category was selected
    if (selectedCategoryId === deletingCategory.id) {
      setSelectedCategoryId(null);
      setSelectedSubcategoryId(null);
    }
  };

  // Column resizing
  const handleCategoryResize = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = categoryWidth;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const containerWidth = window.innerWidth - 64;
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
      const containerWidth = window.innerWidth - 64;
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

  // Loading state
  if (projectsLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-lmo-dark-600" />
      </div>
    );
  }

  // No projects state
  if (!projects || projects.length === 0) {
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
            onEditCategory={handleEditCategory}
            onDeleteCategory={handleDeleteCategory}
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

      {/* Edit Category Dialog */}
      <CategoryDialog
        isOpen={editCategoryOpen}
        onClose={() => {
          setEditCategoryOpen(false);
          setEditingCategory(null);
        }}
        onSubmit={handleUpdateCategory}
        title="Edit Category"
        description="Update the category title and description."
        submitLabel="Update Category"
        initialTitle={editingCategory?.title || ''}
        initialDescription={editingCategory?.description || ''}
      />

      {/* Delete Category Confirmation */}
      <AlertDialog open={deleteCategoryOpen} onOpenChange={setDeleteCategoryOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Category</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{deletingCategory?.title}&quot;? This will also delete all subcategories and their content. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
