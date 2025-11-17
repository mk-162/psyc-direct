'use client';

import { useState } from 'react';
import { ChevronRight, ChevronDown, Plus, Sparkles, Folder, FolderOpen, Edit, Trash2, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { Badge } from '@/components/ui/badge';

interface Category {
  id: string;
  title: string;
  hasSubcategories: boolean;
  subcategoryCount: number;
  confidence?: number;
  stats: {
    totalQuestions: number;
    questionsGenerated?: number;
    questionsAccepted?: number;
  };
}

interface Subcategory {
  id: string;
  title: string;
  confidence?: number;
  stats: {
    totalQuestions: number;
    questionsGenerated?: number;
    questionsAccepted?: number;
  };
}

interface CategoryTreeProps {
  projectId: string;
  categories: Category[];
  subcategories: Record<string, Subcategory[]>;
  selectedCategoryId?: string;
  selectedSubcategoryId?: string;
  onCategorySelect: (categoryId: string | null, subcategoryId?: string | null) => void;
  onGenerateCategory?: () => void;
  onAddCategory?: () => void;
  onGenerateSubcategory?: (categoryId: string) => void;
  onAddSubcategory?: (categoryId: string) => void;
  onEditCategory?: (categoryId: string, category: Category) => void;
  onDeleteCategory?: (categoryId: string, category: Category) => void;
}

function getConfidenceBadge(confidence?: number) {
  if (confidence === undefined) return null;

  const percentage = Math.round(confidence * 100);
  let colorClass = 'bg-orange-100 text-orange-800 border-orange-300';

  if (percentage >= 80) {
    colorClass = 'bg-lmo-dark-100 text-lmo-dark-700 border-lmo-dark-300';
  } else if (percentage >= 60) {
    colorClass = 'bg-blue-100 text-blue-800 border-blue-300';
  }

  return (
    <Badge variant="outline" className={`flex items-center gap-1 ${colorClass} text-xs`}>
      <TrendingUp className="h-3 w-3" />
      {percentage}%
    </Badge>
  );
}

export function CategoryTree({
  projectId,
  categories,
  subcategories,
  selectedCategoryId,
  selectedSubcategoryId,
  onCategorySelect,
  onGenerateCategory,
  onAddCategory,
  onGenerateSubcategory,
  onAddSubcategory,
  onEditCategory,
  onDeleteCategory,
}: CategoryTreeProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const totalQuestions = categories.reduce((sum, cat) => sum + cat.stats.totalQuestions, 0);

  return (
    <div className="h-full flex flex-col bg-slate-50 border-r">
      {/* Header */}
      <div className="p-4 border-b bg-white sticky top-0 z-10">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-slate-900">Categories</h2>
          <div className="flex gap-1">
            {onAddCategory && (
              <button
                onClick={onAddCategory}
                className="p-1.5 hover:bg-slate-100 rounded transition-colors"
                title="Add category"
              >
                <Plus className="h-4 w-4 text-slate-600" />
              </button>
            )}
            {onGenerateCategory && (
              <button
                onClick={onGenerateCategory}
                className="p-1.5 hover:bg-slate-100 rounded transition-colors"
                title="Generate categories with AI"
              >
                <Sparkles className="h-4 w-4 text-purple-600" />
              </button>
            )}
          </div>
        </div>

        {/* All Content Option */}
        <button
          onClick={() => onCategorySelect(null, null)}
          className={cn(
            "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors",
            !selectedCategoryId && !selectedSubcategoryId
              ? "bg-lmo-dark-600 text-white"
              : "hover:bg-slate-100 text-slate-700"
          )}
        >
          <span>All Content</span>
          <Badge variant="secondary" className="ml-2">
            {totalQuestions}
          </Badge>
        </button>
      </div>

      {/* Category Tree */}
      <div className="flex-1 overflow-y-auto p-2">
        {categories.length === 0 ? (
          <div className="text-center py-8 px-4">
            <p className="text-sm text-slate-500 mb-3">No categories yet</p>
            {onGenerateCategory && (
              <button
                onClick={onGenerateCategory}
                className="text-sm text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1 mx-auto"
              >
                <Sparkles className="h-4 w-4" />
                Generate with AI
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-1">
            {categories.map((category) => {
              const isExpanded = expandedCategories.has(category.id);
              const isSelected = selectedCategoryId === category.id && !selectedSubcategoryId;
              const categorySubcategories = subcategories[category.id] || [];

              return (
                <div key={category.id}>
                  {/* Category Item */}
                  <div
                    className={cn(
                      "group flex items-center gap-2 px-2 py-1.5 rounded-lg transition-colors cursor-pointer",
                      isSelected
                        ? "bg-lmo-dark-600 text-white"
                        : "hover:bg-slate-100 text-slate-700"
                    )}
                  >
                    {/* Expand/Collapse Icon */}
                    {category.hasSubcategories ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleCategory(category.id);
                        }}
                        className="flex-shrink-0"
                      >
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </button>
                    ) : (
                      <div className="w-4" />
                    )}

                    {/* Folder Icon */}
                    {isExpanded ? (
                      <FolderOpen className="h-4 w-4 flex-shrink-0" />
                    ) : (
                      <Folder className="h-4 w-4 flex-shrink-0" />
                    )}

                    {/* Title */}
                    <button
                      onClick={() => onCategorySelect(category.id, null)}
                      className="flex-1 text-left text-sm font-medium truncate"
                    >
                      {category.title}
                    </button>

                    {/* Confidence Badge */}
                    {getConfidenceBadge(category.confidence)}

                    {/* Count Badge */}
                    <Badge
                      variant="secondary"
                      className={cn(
                        "text-xs",
                        isSelected && "bg-white/20 text-white hover:bg-white/30"
                      )}
                    >
                      {category.stats.totalQuestions}
                    </Badge>

                    {/* Action Icons (on hover) */}
                    <div className={cn(
                      "flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity",
                      isSelected && "opacity-100"
                    )}>
                      {onEditCategory && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onEditCategory(category.id, category);
                          }}
                          className={cn(
                            "p-1 rounded hover:bg-slate-200 transition-colors",
                            isSelected && "hover:bg-white/20"
                          )}
                          title="Edit category"
                        >
                          <Edit className="h-3 w-3" />
                        </button>
                      )}
                      {onDeleteCategory && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteCategory(category.id, category);
                          }}
                          className={cn(
                            "p-1 rounded hover:bg-slate-200 transition-colors text-red-600",
                            isSelected && "hover:bg-white/20"
                          )}
                          title="Delete category"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      )}
                      {onAddSubcategory && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onAddSubcategory(category.id);
                          }}
                          className={cn(
                            "p-1 rounded hover:bg-slate-200 transition-colors",
                            isSelected && "hover:bg-white/20"
                          )}
                          title="Add subcategory"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      )}
                      {onGenerateSubcategory && !category.hasSubcategories && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onGenerateSubcategory(category.id);
                          }}
                          className={cn(
                            "p-1 rounded hover:bg-slate-200 transition-colors",
                            isSelected && "hover:bg-white/20"
                          )}
                          title="Generate subcategories with AI"
                        >
                          <Sparkles className="h-3 w-3 text-purple-600" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Subcategories */}
                  {isExpanded && (
                    <>
                      {categorySubcategories.length > 0 ? (
                        <div className="ml-6 mt-1 space-y-1">
                          {categorySubcategories.map((subcategory) => {
                            const isSubSelected =
                              selectedCategoryId === category.id &&
                              selectedSubcategoryId === subcategory.id;

                            return (
                              <button
                                key={subcategory.id}
                                onClick={() => onCategorySelect(category.id, subcategory.id)}
                                className={cn(
                                  "w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors",
                                  isSubSelected
                                    ? "bg-lmo-dark-600 text-white font-medium"
                                    : "hover:bg-slate-100 text-slate-600"
                                )}
                              >
                                <span className="truncate flex-1">{subcategory.title}</span>
                                {getConfidenceBadge(subcategory.confidence)}
                                <Badge
                                  variant="secondary"
                                  className={cn(
                                    "text-xs",
                                    isSubSelected && "bg-white/20 text-white hover:bg-white/30"
                                  )}
                                >
                                  {subcategory.stats.totalQuestions}
                                </Badge>
                              </button>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="ml-6 mt-2 mb-3 p-3 bg-white border border-slate-200 rounded-lg">
                          <div className="text-center">
                            <p className="text-xs text-slate-500 mb-2">No subcategories</p>
                            <div className="flex gap-2 justify-center">
                              {onAddSubcategory && (
                                <button
                                  onClick={() => onAddSubcategory(category.id)}
                                  className="text-xs text-slate-600 hover:text-slate-700 font-medium flex items-center gap-1 px-2 py-1 hover:bg-slate-50 rounded transition-colors"
                                >
                                  <Plus className="h-3 w-3" />
                                  Add
                                </button>
                              )}
                              {onGenerateSubcategory && (
                                <button
                                  onClick={() => onGenerateSubcategory(category.id)}
                                  className="text-xs text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1 px-2 py-1 hover:bg-purple-50 rounded transition-colors"
                                >
                                  <Sparkles className="h-3 w-3" />
                                  Generate
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
