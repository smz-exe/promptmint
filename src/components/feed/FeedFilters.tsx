'use client'

import { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { api } from '~/trpc/react';
import { cn } from '~/lib/utils';

interface FeedFiltersProps {
  onFilterChange: (filter: {
    categoryId?: string;
    aiModelId?: string;
    search?: string;
  }) => void;
  onOrderChange: (orderBy: 'latest' | 'popular') => void;
  currentFilter?: {
    categoryId?: string;
    aiModelId?: string;
    search?: string;
  };
  currentOrder?: 'latest' | 'popular';
}

export function FeedFilters({ 
  onFilterChange, 
  onOrderChange, 
  currentFilter = {},
  currentOrder = 'latest' 
}: FeedFiltersProps) {
  const [searchValue, setSearchValue] = useState(currentFilter.search || '');
  const [showFilters, setShowFilters] = useState(false);

  const { data: categoriesData } = api.metadata.getCategories.useQuery();
  const { data: aiModelsData } = api.metadata.getAIModels.useQuery();

  const categories = categoriesData?.categories || [];
  const aiModels = aiModelsData?.aiModels || [];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange({ ...currentFilter, search: searchValue.trim() || undefined });
  };

  const handleCategoryChange = (categoryId: string) => {
    const newCategoryId = categoryId === currentFilter.categoryId ? undefined : categoryId;
    onFilterChange({ ...currentFilter, categoryId: newCategoryId });
  };

  const handleAIModelChange = (aiModelId: string) => {
    const newAIModelId = aiModelId === currentFilter.aiModelId ? undefined : aiModelId;
    onFilterChange({ ...currentFilter, aiModelId: newAIModelId });
  };

  const clearFilters = () => {
    setSearchValue('');
    onFilterChange({});
  };

  const hasActiveFilters = currentFilter.categoryId || currentFilter.aiModelId || currentFilter.search;

  return (
    <div className="space-y-4">
      {/* Search and Sort Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <form onSubmit={handleSearchSubmit} className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search prompts..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="pl-10"
            />
          </div>
        </form>

        <div className="flex items-center gap-2">
          <Button
            variant={showFilters ? "default" : "outline"}
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            Filters
            {hasActiveFilters && (
              <span className="ml-1 bg-primary text-primary-foreground rounded-full w-2 h-2"></span>
            )}
          </Button>

          <div className="flex bg-muted rounded-lg p-1">
            <Button
              size="sm"
              variant={currentOrder === 'latest' ? 'default' : 'ghost'}
              onClick={() => onOrderChange('latest')}
              className="text-xs"
            >
              Latest
            </Button>
            <Button
              size="sm"
              variant={currentOrder === 'popular' ? 'default' : 'ghost'}
              onClick={() => onOrderChange('popular')}
              className="text-xs"
            >
              Popular
            </Button>
          </div>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Expanded Filters */}
      {showFilters && (
        <div className="border rounded-lg p-4 space-y-4 bg-background">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Categories */}
            <div>
              <h3 className="font-medium mb-3">Categories</h3>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={currentFilter.categoryId === category.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleCategoryChange(category.id)}
                    className="text-xs"
                  >
                    {category.name}
                  </Button>
                ))}
              </div>
            </div>

            {/* AI Models */}
            <div>
              <h3 className="font-medium mb-3">AI Models</h3>
              <div className="flex flex-wrap gap-2">
                {aiModels.map((aiModel) => (
                  <Button
                    key={aiModel.id}
                    variant={currentFilter.aiModelId === aiModel.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleAIModelChange(aiModel.id)}
                    className="text-xs"
                  >
                    {aiModel.displayName}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 text-sm">
          <span className="text-muted-foreground">Active filters:</span>
          {currentFilter.search && (
            <span className="bg-primary/10 text-primary px-2 py-1 rounded">
              Search: "{currentFilter.search}"
            </span>
          )}
          {currentFilter.categoryId && (
            <span className="bg-primary/10 text-primary px-2 py-1 rounded">
              Category: {categories.find(c => c.id === currentFilter.categoryId)?.name}
            </span>
          )}
          {currentFilter.aiModelId && (
            <span className="bg-primary/10 text-primary px-2 py-1 rounded">
              AI Model: {aiModels.find(m => m.id === currentFilter.aiModelId)?.displayName}
            </span>
          )}
        </div>
      )}
    </div>
  );
}