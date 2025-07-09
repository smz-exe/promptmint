"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { GitBranch, ChevronDown, ChevronRight } from "lucide-react";

import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { RarityBadge } from "./RarityBadge";
import { api } from "~/trpc/react";

// Temporary date formatting function
const formatDistanceToNow = (date: Date): string => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return "just now";
};

interface ForkHistoryProps {
  cardId: string;
  parentPrompt?: {
    id: string;
    title: string;
    author: {
      username: string;
      displayName: string;
      avatarUrl?: string | null;
    };
    rarity?: "BRONZE" | "SILVER" | "GOLD" | "PLATINUM";
    createdAt?: Date;
  } | null;
  forkCount: number;
}

export function ForkHistory({
  cardId,
  parentPrompt,
  forkCount,
}: ForkHistoryProps) {
  const [showForks, setShowForks] = useState(false);

  const { data: forksData, isLoading: isLoadingForks } =
    api.promptCard.getForks.useQuery(
      { cardId },
      { enabled: showForks && forkCount > 0 },
    );

  const handleToggleForks = () => {
    setShowForks(!showForks);
  };

  if (!parentPrompt && forkCount === 0) {
    return null;
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GitBranch className="h-5 w-5" />
          Fork History
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Parent Card */}
        {parentPrompt && (
          <div className="space-y-2">
            <h4 className="text-muted-foreground text-sm font-medium">
              Forked from:
            </h4>
            <div className="bg-muted/50 flex items-center gap-3 rounded-lg p-3">
              <Image
                src={parentPrompt.author.avatarUrl ?? "/default-avatar.png"}
                alt={parentPrompt.author.displayName}
                width={32}
                height={32}
                className="rounded-full"
              />
              <div className="flex-1">
                <div className="mb-1 flex items-center gap-2">
                  <Link
                    href={`/cards/${parentPrompt.id}`}
                    className="font-medium hover:underline"
                  >
                    {parentPrompt.title}
                  </Link>
                  {parentPrompt.rarity && (
                    <RarityBadge rarity={parentPrompt.rarity} size="sm" />
                  )}
                </div>
                <div className="text-muted-foreground flex items-center gap-2 text-sm">
                  <span>by</span>
                  <Link
                    href={`/profile/${parentPrompt.author.username}`}
                    className="hover:underline"
                  >
                    {parentPrompt.author.displayName}
                  </Link>
                  {parentPrompt.createdAt && (
                    <>
                      <span>•</span>
                      <span>
                        {formatDistanceToNow(new Date(parentPrompt.createdAt))}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Forks of this card */}
        {forkCount > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-muted-foreground text-sm font-medium">
                Forks ({forkCount}):
              </h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleToggleForks}
                className="flex items-center gap-1"
              >
                {showForks ? (
                  <>
                    <ChevronDown className="h-4 w-4" />
                    Hide
                  </>
                ) : (
                  <>
                    <ChevronRight className="h-4 w-4" />
                    Show
                  </>
                )}
              </Button>
            </div>

            {showForks && (
              <div className="space-y-2">
                {isLoadingForks ? (
                  <div className="py-4 text-center">
                    <div className="text-muted-foreground text-sm">
                      Loading forks...
                    </div>
                  </div>
                ) : forksData?.forks && forksData.forks.length > 0 ? (
                  <div className="space-y-2">
                    {forksData.forks.map((fork) => (
                      <div
                        key={fork.id}
                        className="bg-muted/30 flex items-center gap-3 rounded-lg p-3"
                      >
                        <Image
                          src={fork.author.avatarUrl ?? "/default-avatar.png"}
                          alt={fork.author.displayName}
                          width={32}
                          height={32}
                          className="rounded-full"
                        />
                        <div className="flex-1">
                          <div className="mb-1 flex items-center gap-2">
                            <Link
                              href={`/cards/${fork.id}`}
                              className="font-medium hover:underline"
                            >
                              {fork.title}
                            </Link>
                            <RarityBadge rarity={fork.rarity} size="sm" />
                          </div>
                          <div className="text-muted-foreground flex items-center gap-2 text-sm">
                            <span>by</span>
                            <Link
                              href={`/profile/${fork.author.username}`}
                              className="hover:underline"
                            >
                              {fork.author.displayName}
                            </Link>
                            <span>•</span>
                            <span>
                              {formatDistanceToNow(new Date(fork.createdAt))}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-4 text-center">
                    <div className="text-muted-foreground text-sm">
                      No forks found.
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
