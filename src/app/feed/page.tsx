"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "~/components/ui/button";
import { FeedGrid } from "~/components/feed/FeedGrid";
import { FeedFilters } from "~/components/feed/FeedFilters";
import { AdvancedFilters } from "~/components/feed/AdvancedFilters";
import { useAuth } from "~/lib/hooks/useAuth";
import { ErrorBoundary } from "~/components/error/ErrorBoundary";
import { SmartBreadcrumb } from "~/components/navigation/SmartBreadcrumb";

export default function FeedPage() {
  const { user } = useAuth();
  const [filter, setFilter] = useState<{
    categoryId?: string;
    aiModelId?: string;
    search?: string;
    dateFrom?: Date;
    dateTo?: Date;
    rarities?: ("BRONZE" | "SILVER" | "GOLD" | "PLATINUM")[];
    minLikes?: number;
    maxLikes?: number;
  }>({});
  const [orderBy, setOrderBy] = useState<"latest" | "popular">("latest");

  const handleFilterChange = (newFilter: typeof filter) => {
    setFilter(newFilter);
  };

  const handleOrderChange = (newOrder: "latest" | "popular") => {
    setOrderBy(newOrder);
  };

  const handleAdvancedFiltersChange = (advancedFilters: {
    dateRange?: { from: Date; to: Date };
    rarities?: ("BRONZE" | "SILVER" | "GOLD" | "PLATINUM")[];
    minLikes?: number;
    maxLikes?: number;
  }) => {
    setFilter((prevFilter) => ({
      ...prevFilter,
      dateFrom: advancedFilters.dateRange?.from,
      dateTo: advancedFilters.dateRange?.to,
      rarities: advancedFilters.rarities,
      minLikes: advancedFilters.minLikes,
      maxLikes: advancedFilters.maxLikes,
    }));
  };

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-7xl">
          <SmartBreadcrumb />

          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Fresh Mints</h1>
              <p className="text-muted-foreground mt-2">
                Discover the latest prompt cards minted by the PromptMint
                community
              </p>
            </div>

            {user && (
              <Button asChild size="lg">
                <Link href="/cards/create" className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Mint New Card
                </Link>
              </Button>
            )}
          </div>

          {/* Filters */}
          <div className="mb-8 space-y-4">
            <ErrorBoundary level="component">
              <FeedFilters
                onFilterChange={handleFilterChange}
                onOrderChange={handleOrderChange}
                currentFilter={filter}
                currentOrder={orderBy}
              />
            </ErrorBoundary>

            <ErrorBoundary level="component">
              <AdvancedFilters onFiltersChange={handleAdvancedFiltersChange} />
            </ErrorBoundary>
          </div>

          {/* Feed Grid */}
          <ErrorBoundary level="component">
            <FeedGrid filter={filter} orderBy={orderBy} />
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
}
