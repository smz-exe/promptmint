"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Heart,
  MessageCircle,
  Copy,
  GitBranch,
  Share2,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { RarityBadge } from "~/components/cards/RarityBadge";
import { ForkButton } from "~/components/cards/ForkButton";
import { ForkHistory } from "~/components/cards/ForkHistory";
import { CommentList } from "~/components/comments/CommentList";
import { CommentForm } from "~/components/comments/CommentForm";
import { api } from "~/trpc/react";
import { useAuth } from "~/lib/hooks/useAuth";
import { ErrorBoundary } from "~/components/error/ErrorBoundary";
import { formatDateSmart } from "~/lib/utils/dateUtils";
import { ReportDialog } from "~/components/moderation/ReportDialog";
import { SmartBreadcrumb } from "~/components/navigation/SmartBreadcrumb";
import { CardDetailSkeleton } from "~/components/loading/CardDetailSkeleton";

export default function CardDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [isLikeLoading, setIsLikeLoading] = useState(false);

  const cardId = params.id as string;

  const {
    data: cardData,
    isLoading,
    error,
  } = api.promptCard.getById.useQuery(
    { id: cardId },
    {
      enabled: !!cardId,
    },
  );

  // Set initial like state when data is loaded
  useEffect(() => {
    if (cardData?.card) {
      setIsLiked(cardData.card.isLikedByUser);
      setLikesCount(cardData.card.likesCount);
    }
  }, [cardData]);

  const utils = api.useUtils();
  const likeMutation = api.like.toggle.useMutation({
    onMutate: () => {
      setIsLikeLoading(true);
      // Optimistic update
      setIsLiked(!isLiked);
      setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
    },
    onSuccess: (data) => {
      setIsLiked(data.isLiked);
      setLikesCount(data.likesCount);
    },
    onError: (error) => {
      // Revert optimistic update
      setIsLiked(cardData?.card.isLikedByUser ?? false);
      setLikesCount(cardData?.card.likesCount ?? 0);
      toast.error(error.message);
    },
    onSettled: () => {
      setIsLikeLoading(false);
      void utils.promptCard.getById.invalidate({ id: cardId });
    },
  });

  const handleLike = async () => {
    if (!user) {
      toast.error("Please sign in to like cards");
      return;
    }

    likeMutation.mutate({ promptCardId: cardId });
  };

  const handleCopy = async () => {
    if (!cardData?.card.promptText) return;

    try {
      await navigator.clipboard.writeText(cardData.card.promptText);
      toast.success("Prompt copied to clipboard!");
    } catch {
      toast.error("Failed to copy prompt");
    }
  };

  const handleShare = async () => {
    if (!cardData?.card) return;

    try {
      await navigator.share({
        title: cardData.card.title,
        text: cardData.card.description,
        url: window.location.href,
      });
    } catch {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard!");
      } catch {
        toast.error("Failed to share");
      }
    }
  };

  if (isLoading) {
    return <CardDetailSkeleton />;
  }

  if (error || !cardData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-4 text-2xl font-bold">Card Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The card you&apos;re looking for doesn&apos;t exist or has been
            deleted.
          </p>
          <Button asChild>
            <Link href="/feed">Browse Cards</Link>
          </Button>
        </div>
      </div>
    );
  }

  const { card } = cardData;

  const getCardBorderClass = () => {
    switch (card.rarity) {
      case "BRONZE":
        return "border-amber-500/40 shadow-amber-500/20";
      case "SILVER":
        return "border-slate-400/40 shadow-slate-400/20";
      case "GOLD":
        return "border-yellow-400/40 shadow-yellow-400/20";
      case "PLATINUM":
        return "border-purple-400/40 shadow-purple-400/20";
      default:
        return "border-gray-300/40 shadow-gray-300/20";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Breadcrumb Navigation */}
        <SmartBreadcrumb
          customItems={[
            {
              label: card.title,
              href: undefined,
            },
          ]}
        />

        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6 flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        {/* Main Card */}
        <Card
          className={`${getCardBorderClass()} transform bg-gradient-to-br from-white to-slate-50 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl dark:from-slate-900 dark:to-slate-800`}
        >
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="mb-4 flex flex-wrap items-center gap-3">
                  <RarityBadge rarity={card.rarity} size="md" />
                  <span className="rounded-full bg-gradient-to-r from-slate-100 to-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm dark:from-slate-800 dark:to-slate-700 dark:text-slate-300">
                    {card.category.name}
                  </span>
                  <span className="rounded-full border border-blue-200 bg-gradient-to-r from-blue-100 to-blue-200 px-3 py-1.5 text-sm font-medium text-blue-700 shadow-sm dark:border-blue-700 dark:from-blue-950/50 dark:to-blue-900/50 dark:text-blue-300">
                    {card.aiModel.displayName}
                  </span>
                </div>
                <h1 className="mb-3 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-4xl font-bold text-transparent dark:from-gray-100 dark:to-gray-400">
                  {card.title}
                </h1>
                <p className="text-muted-foreground mb-6 text-lg leading-relaxed">
                  {card.description}
                </p>
              </div>
            </div>

            {/* Author and Date */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Image
                    src={card.author.avatarUrl ?? "/default-avatar.svg"}
                    alt={card.author.displayName}
                    width={48}
                    height={48}
                    className="rounded-full shadow-md ring-2 ring-slate-200 dark:ring-slate-700"
                  />
                  <div className="absolute -right-1 -bottom-1 h-4 w-4 rounded-full border-2 border-white bg-green-500 shadow-sm dark:border-slate-900"></div>
                </div>
                <div>
                  <Link
                    href={`/profile/${card.author.username}`}
                    className="text-lg font-semibold text-slate-900 transition-colors hover:text-blue-600 hover:underline dark:text-slate-100 dark:hover:text-blue-400"
                  >
                    {card.author.displayName}
                  </Link>
                  <p className="text-muted-foreground flex items-center gap-1 text-sm">
                    <span>Created</span>
                    <span className="font-medium">
                      {formatDateSmart(new Date(card.createdAt), "card")}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Fork Information */}
            {card.parentPrompt && (
              <div className="mt-6 rounded-xl border border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 p-4 shadow-sm dark:border-green-800 dark:from-green-950/30 dark:to-emerald-950/30">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-green-100 p-2 dark:bg-green-900/50">
                    <GitBranch className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="flex-1">
                    <div className="mb-1 text-sm font-medium text-green-700 dark:text-green-300">
                      Forked from
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Link
                        href={`/cards/${card.parentPrompt.id}`}
                        className="font-semibold text-green-800 transition-colors hover:text-green-600 hover:underline dark:text-green-200 dark:hover:text-green-100"
                      >
                        {card.parentPrompt.title}
                      </Link>
                      <span className="text-green-600 dark:text-green-400">
                        by
                      </span>
                      <Link
                        href={`/profile/${card.parentPrompt.author.username}`}
                        className="font-medium text-green-700 transition-colors hover:text-green-600 hover:underline dark:text-green-300 dark:hover:text-green-200"
                      >
                        {card.parentPrompt.author.displayName}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardHeader>

          <CardContent>
            {/* Prompt Text */}
            <div className="mb-8">
              <h3 className="mb-4 flex items-center gap-2 text-xl font-semibold">
                <span className="inline-block h-6 w-1 rounded-full bg-gradient-to-b from-blue-500 to-purple-500"></span>
                Prompt
              </h3>
              <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100 p-6 shadow-inner dark:border-slate-700 dark:from-slate-900 dark:to-slate-800">
                <pre className="text-foreground/90 font-mono text-sm leading-relaxed whitespace-pre-wrap">
                  {card.promptText}
                </pre>
              </div>
            </div>

            {/* Statistics */}
            <div className="mb-6 flex items-center gap-6">
              <div className="flex items-center gap-2 rounded-full bg-red-50 px-3 py-2 dark:bg-red-950/30">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLike}
                  disabled={isLikeLoading}
                  className={`flex h-auto items-center gap-2 p-0 hover:bg-transparent ${
                    isLiked
                      ? "text-red-500 hover:text-red-600"
                      : "text-red-400 hover:text-red-500"
                  }`}
                >
                  <Heart
                    className={`h-5 w-5 transition-all duration-200 ${isLiked ? "scale-110 fill-current" : "hover:scale-110"}`}
                  />
                  <span className="font-semibold">{likesCount}</span>
                </Button>
              </div>

              <div className="flex items-center gap-2 rounded-full bg-blue-50 px-3 py-2 dark:bg-blue-950/30">
                <MessageCircle className="h-5 w-5 text-blue-500" />
                <span className="font-semibold text-blue-600 dark:text-blue-400">
                  {card.commentCount}
                </span>
                <span className="text-sm text-blue-500">Comments</span>
              </div>

              {card.forkCount > 0 && (
                <div className="flex items-center gap-2 rounded-full bg-green-50 px-3 py-2 dark:bg-green-950/30">
                  <GitBranch className="h-5 w-5 text-green-500" />
                  <span className="font-semibold text-green-600 dark:text-green-400">
                    {card.forkCount}
                  </span>
                  <span className="text-sm text-green-500">Forks</span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className="flex items-center gap-2 border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100 shadow-sm transition-all duration-200 hover:scale-105 hover:from-slate-100 hover:to-slate-200 hover:shadow-md dark:border-slate-600 dark:from-slate-800 dark:to-slate-700 dark:hover:from-slate-700 dark:hover:to-slate-600"
              >
                <Copy className="h-4 w-4" />
                Copy Prompt
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
                className="flex items-center gap-2 border-blue-200 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 shadow-sm transition-all duration-200 hover:scale-105 hover:from-blue-100 hover:to-blue-200 hover:shadow-md dark:border-blue-700 dark:from-blue-950/50 dark:to-blue-900/50 dark:text-blue-300 dark:hover:from-blue-900/70 dark:hover:to-blue-800/70"
              >
                <Share2 className="h-4 w-4" />
                Share
              </Button>

              {user && (
                <ErrorBoundary level="component">
                  <ForkButton card={card} />
                </ErrorBoundary>
              )}

              <ReportDialog promptCardId={cardId} />
            </div>
          </CardContent>
        </Card>

        {/* Fork History */}
        <Card className="mb-8 border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100 dark:border-slate-700 dark:from-slate-900 dark:to-slate-800">
          <CardHeader>
            <h3 className="flex items-center gap-2 text-lg font-semibold">
              <GitBranch className="h-5 w-5 text-green-500" />
              Fork History
            </h3>
          </CardHeader>
          <CardContent>
            <ErrorBoundary level="component">
              <ForkHistory
                cardId={cardId}
                parentPrompt={card.parentPrompt}
                forkCount={card.forkCount}
              />
            </ErrorBoundary>
          </CardContent>
        </Card>

        {/* Comments Section */}
        <Card className="border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100 dark:border-slate-700 dark:from-slate-900 dark:to-slate-800">
          <CardHeader>
            <h3 className="flex items-center gap-2 text-lg font-semibold">
              <MessageCircle className="h-5 w-5 text-blue-500" />
              Comments ({card.commentCount})
            </h3>
          </CardHeader>
          <CardContent>
            <ErrorBoundary level="component">
              {user ? (
                <div className="space-y-6">
                  <CommentForm promptCardId={cardId} />
                  <CommentList promptCardId={cardId} />
                </div>
              ) : (
                <div className="mb-6">
                  <p className="text-muted-foreground mb-4 text-sm">
                    Sign in to leave a comment or like this card.
                  </p>
                  <div className="flex gap-2">
                    <Button asChild variant="outline">
                      <Link href="/sign-in">Sign In</Link>
                    </Button>
                    <Button asChild>
                      <Link href="/sign-up">Sign Up</Link>
                    </Button>
                  </div>
                  <div className="mt-6">
                    <CommentList promptCardId={cardId} />
                  </div>
                </div>
              )}
            </ErrorBoundary>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
