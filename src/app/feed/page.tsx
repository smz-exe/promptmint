"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "~/components/ui/button";
import { FeedGrid } from "~/components/feed/FeedGrid";
import { FeedFilters } from "~/components/feed/FeedFilters";
import { useAuth } from "~/lib/hooks/useAuth";

export default function FeedPage() {
  const { user } = useAuth();
  const [filter, setFilter] = useState<{
    categoryId?: string;
    aiModelId?: string;
    search?: string;
  }>({});
  const [orderBy, setOrderBy] = useState<"latest" | "popular">("latest");

  const handleFilterChange = (newFilter: typeof filter) => {
    setFilter(newFilter);
  };

  const handleOrderChange = (newOrder: "latest" | "popular") => {
    setOrderBy(newOrder);
  };

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                AI Prompt Trading Cards
              </h1>
              <p className="text-muted-foreground mt-2">
                Discover and share amazing AI prompts with the community
              </p>
            </div>

            {user && (
              <Button asChild size="lg">
                <Link href="/cards/create" className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Create Card
                </Link>
              </Button>
            )}
          </div>

          {/* Filters */}
          <div className="mb-8">
            <FeedFilters
              onFilterChange={handleFilterChange}
              onOrderChange={handleOrderChange}
              currentFilter={filter}
              currentOrder={orderBy}
            />
          </div>

          {/* Feed Grid */}
          <FeedGrid filter={filter} orderBy={orderBy} />
        </div>
      </div>
    </div>
  );
}
