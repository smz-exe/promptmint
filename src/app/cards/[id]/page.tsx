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
        return "border-amber-500/30";
      case "SILVER":
        return "border-slate-400/30";
      case "GOLD":
        return "border-yellow-400/30";
      case "PLATINUM":
        return "border-purple-400/30";
      default:
        return "border-gray-300/30";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-4xl">
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
        <Card className={`${getCardBorderClass()} mb-8`}>
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <RarityBadge rarity={card.rarity} />
                  <span className="text-muted-foreground bg-secondary rounded px-2 py-1 text-xs">
                    {card.category.name}
                  </span>
                  <span className="bg-primary/10 text-primary rounded-full px-2 py-1 text-xs">
                    {card.aiModel.displayName}
                  </span>
                </div>
                <h1 className="mb-2 text-2xl font-bold">{card.title}</h1>
                <p className="text-muted-foreground mb-4 text-base">
                  {card.description}
                </p>
              </div>
            </div>

            {/* Author and Date */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Image
                  src={card.author.avatarUrl ?? "/default-avatar.png"}
                  alt={card.author.displayName}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
                <div>
                  <Link
                    href={`/profile/${card.author.username}`}
                    className="font-medium hover:underline"
                  >
                    {card.author.displayName}
                  </Link>
                  <p className="text-muted-foreground text-sm">
                    {formatDateSmart(new Date(card.createdAt), "card")}
                  </p>
                </div>
              </div>
            </div>

            {/* Fork Information */}
            {card.parentPrompt && (
              <div className="bg-muted/50 mt-4 rounded-lg p-3">
                <div className="text-muted-foreground flex items-center gap-2 text-sm">
                  <GitBranch className="h-4 w-4" />
                  <span>Forked from</span>
                  <Link
                    href={`/cards/${card.parentPrompt.id}`}
                    className="font-medium hover:underline"
                  >
                    {card.parentPrompt.title}
                  </Link>
                  <span>by</span>
                  <Link
                    href={`/profile/${card.parentPrompt.author.username}`}
                    className="font-medium hover:underline"
                  >
                    {card.parentPrompt.author.displayName}
                  </Link>
                </div>
              </div>
            )}
          </CardHeader>

          <CardContent>
            {/* Prompt Text */}
            <div className="mb-6">
              <h3 className="mb-3 text-lg font-semibold">Prompt</h3>
              <div className="bg-muted/50 rounded-lg p-4">
                <pre className="text-foreground/90 font-mono text-sm whitespace-pre-wrap">
                  {card.promptText}
                </pre>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLike}
                  disabled={isLikeLoading}
                  className={`flex items-center gap-2 ${
                    isLiked
                      ? "text-red-500 hover:text-red-600"
                      : "text-muted-foreground"
                  }`}
                >
                  <Heart
                    className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`}
                  />
                  {likesCount}
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground flex items-center gap-2"
                >
                  <MessageCircle className="h-4 w-4" />
                  {card.commentCount}
                </Button>

                {card.forkCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground flex items-center gap-2"
                  >
                    <GitBranch className="h-4 w-4" />
                    {card.forkCount}
                  </Button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopy}
                  className="flex items-center gap-2"
                >
                  <Copy className="h-4 w-4" />
                  Copy
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleShare}
                  className="flex items-center gap-2"
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
            </div>
          </CardContent>
        </Card>

        {/* Fork History */}
        <ErrorBoundary level="component">
          <ForkHistory
            cardId={cardId}
            parentPrompt={card.parentPrompt}
            forkCount={card.forkCount}
          />
        </ErrorBoundary>

        {/* Comments Section */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">
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
