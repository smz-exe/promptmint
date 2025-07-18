"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import { PromptCard } from "~/components/cards/PromptCard";
import { FeedGridSkeleton } from "~/components/loading/FeedGridSkeleton";
import { api } from "~/trpc/react";

interface FeedGridProps {
  filter?: {
    categoryId?: string;
    aiModelId?: string;
    authorId?: string;
    search?: string;
  };
  orderBy?: "latest" | "popular";
}

export function FeedGrid({ filter, orderBy = "latest" }: FeedGridProps) {
  const router = useRouter();
  const [hasManuallyFetched, setHasManuallyFetched] = useState(false);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = api.promptCard.getFeed.useInfiniteQuery(
    {
      limit: 20,
      filter,
      orderBy,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  );

  // Auto-fetch next page when scrolling near bottom
  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage) return;

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // Fetch next page when 80% scrolled
      if (scrollTop + windowHeight >= documentHeight * 0.8) {
        void fetchNextPage();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleCardClick = (cardId: string) => {
    router.push(`/cards/${cardId}`);
  };

  const handleLoadMore = () => {
    setHasManuallyFetched(true);
    void fetchNextPage();
  };

  if (isLoading) {
    return <FeedGridSkeleton />;
  }

  if (error) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground mb-4">
          Failed to load prompt cards. Please try again.
        </p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  const allCards = data?.pages.flatMap((page) => page.cards) ?? [];

  if (allCards.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground mb-4">
          No prompt cards found. Be the first to create one!
        </p>
        <Button onClick={() => router.push("/cards/create")}>
          Create First Card
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Improved Grid Layout with better spacing */}
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {allCards.map((card) => (
          <div key={card.id} className="flex justify-center">
            <PromptCard card={card} onClick={() => handleCardClick(card.id)} />
          </div>
        ))}
      </div>

      {/* Load More Button */}
      {hasNextPage && (
        <div className="flex justify-center">
          <Button
            onClick={handleLoadMore}
            disabled={isFetchingNextPage}
            variant="outline"
            size="lg"
          >
            {isFetchingNextPage ? "Loading..." : "Load More"}
          </Button>
        </div>
      )}

      {/* Loading indicator for infinite scroll */}
      {isFetchingNextPage && !hasManuallyFetched && (
        <div className="flex justify-center py-8">
          <div className="border-primary h-8 w-8 animate-spin rounded-full border-b-2"></div>
        </div>
      )}
    </div>
  );
}
