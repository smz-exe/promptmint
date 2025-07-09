"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
// import { formatDistanceToNow } from "date-fns";

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
import {
  Heart,
  MessageCircle,
  Copy,
  ExternalLink,
  GitBranch,
} from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { RarityBadge } from "./RarityBadge";
import { api } from "~/trpc/react";
import { useAuth } from "~/lib/hooks/useAuth";
import { cn } from "~/lib/utils";

interface PromptCardProps {
  card: {
    id: string;
    title: string;
    description: string;
    promptText: string;
    likesCount: number;
    commentCount: number;
    forkCount: number;
    rarity: "BRONZE" | "SILVER" | "GOLD" | "PLATINUM";
    createdAt: Date;
    isLikedByUser: boolean;
    author: {
      id: string;
      username: string;
      displayName: string;
      avatarUrl: string | null;
    };
    category: {
      id: string;
      name: string;
      slug: string;
    };
    aiModel: {
      id: string;
      name: string;
      displayName: string;
    };
    parentPrompt?: {
      id: string;
      title: string;
      author: {
        username: string;
        displayName: string;
      };
    };
  };
  onClick?: () => void;
  showFullPrompt?: boolean;
}

export function PromptCard({
  card,
  onClick,
  showFullPrompt = false,
}: PromptCardProps) {
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(card.isLikedByUser);
  const [likesCount, setLikesCount] = useState(card.likesCount);
  const [isLikeLoading, setIsLikeLoading] = useState(false);

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
      setIsLiked(card.isLikedByUser);
      setLikesCount(card.likesCount);
      toast.error(error.message);
    },
    onSettled: () => {
      setIsLikeLoading(false);
      void utils.promptCard.getFeed.invalidate();
    },
  });

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.error("Please sign in to like cards");
      return;
    }

    likeMutation.mutate({ promptCardId: card.id });
  };

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      await navigator.clipboard.writeText(card.promptText);
      toast.success("Prompt copied to clipboard!");
    } catch {
      toast.error("Failed to copy prompt");
    }
  };

  const getCardBorderClass = () => {
    switch (card.rarity) {
      case "BRONZE":
        return "border-amber-500/30 hover:border-amber-500/60";
      case "SILVER":
        return "border-slate-400/30 hover:border-slate-400/60";
      case "GOLD":
        return "border-yellow-400/30 hover:border-yellow-400/60";
      case "PLATINUM":
        return "border-purple-400/30 hover:border-purple-400/60";
      default:
        return "border-gray-300/30 hover:border-gray-300/60";
    }
  };

  const getCardGlowClass = () => {
    switch (card.rarity) {
      case "SILVER":
        return "hover:shadow-slate-400/20";
      case "GOLD":
        return "hover:shadow-yellow-400/20";
      case "PLATINUM":
        return "hover:shadow-purple-400/20";
      default:
        return "";
    }
  };

  const promptPreview = showFullPrompt
    ? card.promptText
    : card.promptText.length > 150
      ? card.promptText.substring(0, 150) + "..."
      : card.promptText;

  return (
    <Card
      className={cn(
        "group relative cursor-pointer transition-all duration-300 hover:scale-[1.02]",
        getCardBorderClass(),
        getCardGlowClass(),
        "from-background to-background/95 bg-gradient-to-b",
      )}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="mb-2 flex items-center gap-2">
              <RarityBadge rarity={card.rarity} />
              <span className="text-muted-foreground bg-secondary rounded px-2 py-1 text-xs">
                {card.category.name}
              </span>
            </div>
            <h3 className="mb-1 line-clamp-2 text-lg font-semibold">
              {card.title}
            </h3>
            <p className="text-muted-foreground line-clamp-2 text-sm">
              {card.description}
            </p>
          </div>
          <div className="text-muted-foreground flex items-center gap-1 text-xs">
            <span className="bg-primary/10 text-primary rounded-full px-2 py-1">
              {card.aiModel.displayName}
            </span>
          </div>
        </div>

        {card.parentPrompt && (
          <div className="text-muted-foreground flex items-center gap-1 text-xs">
            <GitBranch className="h-3 w-3" />
            <span>Forked from</span>
            <Link
              href={`/profile/${card.parentPrompt.author.username}`}
              className="hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              {card.parentPrompt.author.displayName}
            </Link>
          </div>
        )}
      </CardHeader>

      <CardContent className="pt-0">
        <div className="mb-4">
          <div className="bg-muted/50 rounded-lg p-3 font-mono text-sm">
            <pre className="text-foreground/80 whitespace-pre-wrap">
              {promptPreview}
            </pre>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-muted-foreground flex items-center gap-1 text-xs">
            <Image
              src={card.author.avatarUrl ?? "/default-avatar.png"}
              alt={card.author.displayName}
              width={16}
              height={16}
              className="rounded-full"
            />
            <Link
              href={`/profile/${card.author.username}`}
              className="hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              {card.author.displayName}
            </Link>
            <span>•</span>
            <span>{formatDistanceToNow(new Date(card.createdAt))}</span>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              disabled={isLikeLoading}
              className={cn(
                "flex items-center gap-1 text-xs",
                isLiked
                  ? "text-red-500 hover:text-red-600"
                  : "text-muted-foreground",
              )}
            >
              <Heart className={cn("h-4 w-4", isLiked && "fill-current")} />
              {likesCount}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground flex items-center gap-1 text-xs"
              onClick={(e) => e.stopPropagation()}
            >
              <MessageCircle className="h-4 w-4" />
              {card.commentCount}
            </Button>

            {card.forkCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground flex items-center gap-1 text-xs"
                onClick={(e) => e.stopPropagation()}
              >
                <GitBranch className="h-4 w-4" />
                {card.forkCount}
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-xs"
            >
              <Copy className="h-4 w-4" />
              Copy
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                if (onClick) onClick();
              }}
              className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-xs"
            >
              <ExternalLink className="h-4 w-4" />
              View
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
