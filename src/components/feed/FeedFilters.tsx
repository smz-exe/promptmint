"use client";

import { useState } from "react";
import { Search, Filter, X } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { api } from "~/trpc/react";

interface FeedFiltersProps {
  onFilterChange: (filter: {
    categoryId?: string;
    aiModelId?: string;
    search?: string;
  }) => void;
  onOrderChange: (orderBy: "latest" | "popular") => void;
  currentFilter?: {
    categoryId?: string;
    aiModelId?: string;
    search?: string;
  };
  currentOrder?: "latest" | "popular";
}

export function FeedFilters({
  onFilterChange,
  onOrderChange,
  currentFilter = {},
  currentOrder = "latest",
}: FeedFiltersProps) {
  const [searchValue, setSearchValue] = useState(currentFilter.search ?? "");
  const [showFilters, setShowFilters] = useState(false);

  const { data: categoriesData } = api.metadata.getCategories.useQuery();
  const { data: aiModelsData } = api.metadata.getAIModels.useQuery();

  const categories = categoriesData?.categories ?? [];
  const aiModels = aiModelsData?.aiModels ?? [];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange({
      ...currentFilter,
      search: searchValue.trim() || undefined,
    });
  };

  const handleCategoryChange = (categoryId: string) => {
    const newCategoryId =
      categoryId === currentFilter.categoryId ? undefined : categoryId;
    onFilterChange({ ...currentFilter, categoryId: newCategoryId });
  };

  const handleAIModelChange = (aiModelId: string) => {
    const newAIModelId =
      aiModelId === currentFilter.aiModelId ? undefined : aiModelId;
    onFilterChange({ ...currentFilter, aiModelId: newAIModelId });
  };

  const clearFilters = () => {
    setSearchValue("");
    onFilterChange({});
  };

  const hasActiveFilters =
    currentFilter.categoryId ?? currentFilter.aiModelId ?? currentFilter.search;

  return (
    <div className="space-y-4">
      {/* Search and Sort Controls */}
      <div className="flex flex-col items-center gap-4 sm:flex-row">
        <form onSubmit={handleSearchSubmit} className="max-w-md flex-1">
          <div className="relative">
            <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
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
              <span className="bg-primary text-primary-foreground ml-1 h-2 w-2 rounded-full"></span>
            )}
          </Button>

          <div className="bg-muted flex rounded-lg p-1">
            <Button
              size="sm"
              variant={currentOrder === "latest" ? "default" : "ghost"}
              onClick={() => onOrderChange("latest")}
              className="text-xs"
            >
              Latest
            </Button>
            <Button
              size="sm"
              variant={currentOrder === "popular" ? "default" : "ghost"}
              onClick={() => onOrderChange("popular")}
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
        <div className="bg-background space-y-4 rounded-lg border p-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Categories */}
            <div>
              <h3 className="mb-3 font-medium">Categories</h3>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={
                      currentFilter.categoryId === category.id
                        ? "default"
                        : "outline"
                    }
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
              <h3 className="mb-3 font-medium">AI Models</h3>
              <div className="flex flex-wrap gap-2">
                {aiModels.map((aiModel) => (
                  <Button
                    key={aiModel.id}
                    variant={
                      currentFilter.aiModelId === aiModel.id
                        ? "default"
                        : "outline"
                    }
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
            <span className="bg-primary/10 text-primary rounded px-2 py-1">
              Search: &quot;{currentFilter.search}&quot;
            </span>
          )}
          {currentFilter.categoryId && (
            <span className="bg-primary/10 text-primary rounded px-2 py-1">
              Category:{" "}
              {categories.find((c) => c.id === currentFilter.categoryId)?.name}
            </span>
          )}
          {currentFilter.aiModelId && (
            <span className="bg-primary/10 text-primary rounded px-2 py-1">
              AI Model:{" "}
              {
                aiModels.find((m) => m.id === currentFilter.aiModelId)
                  ?.displayName
              }
            </span>
          )}
        </div>
      )}
    </div>
  );
}
