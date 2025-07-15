"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Calendar, User, Star, Settings } from "lucide-react";

import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { PromptCard } from "~/components/cards/PromptCard";
import { api } from "~/trpc/react";
import { useAuth } from "~/lib/hooks/useAuth";
import { ErrorBoundary } from "~/components/error/ErrorBoundary";
import { SmartBreadcrumb } from "~/components/navigation/SmartBreadcrumb";
import { formatJoinDate } from "~/lib/utils/dateUtils";

type TabType = "cards" | "liked";

export default function ProfilePage() {
  const params = useParams();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>("cards");

  const username = params.username as string;

  const { data: currentUser } = api.auth.getCurrentUser.useQuery(undefined, {
    enabled: !!user,
  });

  const { data: profileData, isLoading: isProfileLoading } =
    api.user.getProfile.useQuery({ username }, { enabled: !!username });

  const {
    data: userCardsData,
    fetchNextPage: fetchNextUserCards,
    hasNextPage: hasNextUserCards,
    isFetchingNextPage: isFetchingNextUserCards,
    isLoading: isUserCardsLoading,
  } = api.promptCard.getUserCards.useInfiniteQuery(
    { username, limit: 20 },
    {
      enabled: !!username && activeTab === "cards",
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );

  const {
    data: likedCardsData,
    fetchNextPage: fetchNextLikedCards,
    hasNextPage: hasNextLikedCards,
    isFetchingNextPage: isFetchingNextLikedCards,
    isLoading: isLikedCardsLoading,
  } = api.user.getFavoriteCards.useInfiniteQuery(
    { username, limit: 20 },
    {
      enabled: !!username && activeTab === "liked",
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );

  const isOwnProfile = currentUser?.username === username;

  if (isProfileLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-4xl">
          <div className="animate-pulse">
            <div className="mb-8 flex items-center gap-6">
              <div className="h-24 w-24 rounded-full bg-gray-300"></div>
              <div className="flex-1">
                <div className="mb-2 h-6 w-32 rounded bg-gray-300"></div>
                <div className="mb-2 h-4 w-24 rounded bg-gray-300"></div>
                <div className="h-4 w-48 rounded bg-gray-300"></div>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="h-32 rounded bg-gray-300"></div>
              <div className="h-32 rounded bg-gray-300"></div>
              <div className="h-32 rounded bg-gray-300"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-4 text-2xl font-bold">User Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The user you&apos;re looking for doesn&apos;t exist.
          </p>
          <Button asChild>
            <Link href="/feed">Browse Cards</Link>
          </Button>
        </div>
      </div>
    );
  }

  const userCards = userCardsData?.pages.flatMap((page) => page.cards) ?? [];
  const likedCards = likedCardsData?.pages.flatMap((page) => page.cards) ?? [];

  const currentCards = activeTab === "cards" ? userCards : likedCards;
  const isLoadingCards =
    activeTab === "cards" ? isUserCardsLoading : isLikedCardsLoading;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <SmartBreadcrumb
          customItems={[
            {
              label: profileData.displayName ?? profileData.username,
              href: undefined,
            },
          ]}
        />

        {/* Profile Header */}
        <div className="mb-8">
          <div className="mb-6 flex items-start gap-6">
            <Image
              src={profileData.avatarUrl ?? "/default-avatar.svg"}
              alt={profileData.displayName ?? profileData.username}
              width={96}
              height={96}
              className="rounded-full"
            />
            <div className="flex-1">
              <div className="mb-2 flex items-center gap-3">
                <h1 className="text-2xl font-bold">
                  {profileData.displayName ?? profileData.username}
                </h1>
                {isOwnProfile && (
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/settings" className="flex items-center gap-2">
                      <Settings className="h-4 w-4" />
                      Edit Profile
                    </Link>
                  </Button>
                )}
              </div>
              <p className="text-muted-foreground mb-2">
                @{profileData.username}
              </p>
              {profileData.bio && (
                <p className="mb-3 text-sm">{profileData.bio}</p>
              )}
              <div className="text-muted-foreground flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Joined {formatJoinDate(new Date(profileData.createdAt))}
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-primary mb-1 text-2xl font-bold">
                  {profileData.stats.totalCards}
                </div>
                <p className="text-muted-foreground text-sm">Cards Created</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="mb-1 text-2xl font-bold text-red-500">
                  {profileData.stats.totalLikes}
                </div>
                <p className="text-muted-foreground text-sm">Likes Received</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="mb-1 text-2xl font-bold text-green-500">
                  {profileData.stats.totalForks}
                </div>
                <p className="text-muted-foreground text-sm">Cards Forked</p>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <div className="mb-6 flex gap-1">
            <Button
              variant={activeTab === "cards" ? "default" : "ghost"}
              onClick={() => setActiveTab("cards")}
              className="flex items-center gap-2"
            >
              <User className="h-4 w-4" />
              Cards ({profileData.stats.totalCards})
            </Button>
            <Button
              variant={activeTab === "liked" ? "default" : "ghost"}
              onClick={() => setActiveTab("liked")}
              className="flex items-center gap-2"
            >
              <Star className="h-4 w-4" />
              Liked Cards
            </Button>
          </div>
        </div>

        {/* Cards Grid */}
        <ErrorBoundary level="component">
          <div className="space-y-8">
            {isLoadingCards ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-64 rounded-lg bg-gray-300"></div>
                  </div>
                ))}
              </div>
            ) : currentCards.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-muted-foreground mb-4">
                  {activeTab === "cards"
                    ? "No cards created yet"
                    : "No liked cards yet"}
                </p>
                {isOwnProfile && activeTab === "cards" && (
                  <Button asChild>
                    <Link href="/cards/create">Create Your First Card</Link>
                  </Button>
                )}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {currentCards.map((card) => (
                    <PromptCard
                      key={card.id}
                      card={{
                        ...card,
                        isLikedByUser:
                          activeTab === "liked"
                            ? true
                            : "isLikedByUser" in card
                              ? Boolean(card.isLikedByUser)
                              : false,
                      }}
                      onClick={() => {
                        window.location.href = `/cards/${card.id}`;
                      }}
                    />
                  ))}
                </div>

                {/* Load More Button */}
                {((activeTab === "cards" && hasNextUserCards) ||
                  (activeTab === "liked" && hasNextLikedCards)) && (
                  <div className="text-center">
                    <Button
                      variant="outline"
                      onClick={() => {
                        if (activeTab === "cards") {
                          void fetchNextUserCards();
                        } else {
                          void fetchNextLikedCards();
                        }
                      }}
                      disabled={
                        activeTab === "cards"
                          ? isFetchingNextUserCards
                          : isFetchingNextLikedCards
                      }
                    >
                      {(
                        activeTab === "cards"
                          ? isFetchingNextUserCards
                          : isFetchingNextLikedCards
                      )
                        ? "Loading..."
                        : "Load More"}
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </ErrorBoundary>
      </div>
    </div>
  );
}
