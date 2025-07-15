"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Heart,
  MessageCircle,
  Copy,
  ExternalLink,
  GitBranch,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { RarityBadge } from "./RarityBadge";
import { api } from "~/trpc/react";
import { useAuth } from "~/lib/hooks/useAuth";
import { formatDateSmart } from "~/lib/utils/dateUtils";
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
        return "border-amber-500/40 hover:border-amber-500/80";
      case "SILVER":
        return "border-slate-400/40 hover:border-slate-400/80";
      case "GOLD":
        return "border-yellow-400/40 hover:border-yellow-400/80";
      case "PLATINUM":
        return "border-purple-400/40 hover:border-purple-400/80";
      default:
        return "border-gray-300/30 hover:border-gray-300/60";
    }
  };

  const getCardGlowClass = () => {
    switch (card.rarity) {
      case "BRONZE":
        return "hover:shadow-xl hover:shadow-amber-500/25";
      case "SILVER":
        return "hover:shadow-xl hover:shadow-slate-400/25";
      case "GOLD":
        return "hover:shadow-xl hover:shadow-yellow-400/30";
      case "PLATINUM":
        return "hover:shadow-xl hover:shadow-purple-400/35";
      default:
        return "hover:shadow-lg";
    }
  };

  const getCardBackgroundClass = () => {
    switch (card.rarity) {
      case "BRONZE":
        return "bg-gradient-to-br from-amber-50/50 to-orange-50/30";
      case "SILVER":
        return "bg-gradient-to-br from-slate-50/50 to-gray-50/30";
      case "GOLD":
        return "bg-gradient-to-br from-yellow-50/50 to-amber-50/30";
      case "PLATINUM":
        return "bg-gradient-to-br from-purple-50/50 to-pink-50/30";
      default:
        return "bg-gradient-to-br from-background to-background/95";
    }
  };

  const getCategoryColor = () => {
    const colorMap: Record<string, string> = {
      Programming: "bg-blue-100 text-blue-700 border-blue-200",
      Writing: "bg-green-100 text-green-700 border-green-200",
      Analysis: "bg-purple-100 text-purple-700 border-purple-200",
      Learning: "bg-orange-100 text-orange-700 border-orange-200",
      Creative: "bg-pink-100 text-pink-700 border-pink-200",
      Others: "bg-gray-100 text-gray-700 border-gray-200",
    };
    return (
      colorMap[card.category.name] ??
      "bg-gray-100 text-gray-700 border-gray-200"
    );
  };

  const promptPreview = showFullPrompt
    ? card.promptText
    : card.promptText.length > 150
      ? card.promptText.substring(0, 150) + "..."
      : card.promptText;

  return (
    <Card
      className={cn(
        "group relative cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02]",
        "mx-auto flex h-[360px] w-full max-w-md flex-col", // Reduced height, increased width
        getCardBorderClass(),
        getCardGlowClass(),
        getCardBackgroundClass(),
        "border-2 backdrop-blur-sm",
      )}
      onClick={onClick}
    >
      {/* Rarity Sparkle Effect */}
      {(card.rarity === "GOLD" || card.rarity === "PLATINUM") && (
        <div className="absolute -top-1 -right-1 z-10">
          <Sparkles className="h-4 w-4 animate-pulse text-yellow-400" />
        </div>
      )}

      <CardHeader className="flex-shrink-0 pb-4">
        <div className="mb-3 flex items-start justify-between">
          <div className="flex items-center gap-2">
            <RarityBadge rarity={card.rarity} size="sm" />
            <span
              className={cn(
                "rounded-full border px-3 py-1 text-xs font-medium",
                "max-w-[140px] truncate", // Increased width for better category display
                getCategoryColor(),
              )}
            >
              {card.category.name}
            </span>
          </div>
          <div className="flex-shrink-0">
            <span className="bg-primary/10 text-primary rounded-full px-3 py-1 text-xs font-medium">
              {card.aiModel.displayName}
            </span>
          </div>
        </div>

        {card.parentPrompt && (
          <div className="text-muted-foreground mb-2 flex items-center gap-1 text-xs">
            <GitBranch className="h-3 w-3 flex-shrink-0" />
            <span>Forked from</span>
            <Link
              href={`/profile/${card.parentPrompt.author.username}`}
              className="text-primary max-w-[100px] truncate hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              {card.parentPrompt.author.displayName}
            </Link>
          </div>
        )}

        <div className="space-y-3">
          <h3 className="line-clamp-2 text-lg leading-tight font-bold">
            {card.title}
          </h3>
          <p className="text-muted-foreground line-clamp-2 text-sm leading-relaxed">
            {card.description}
          </p>
        </div>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col pt-0">
        <div className="mb-4 flex-1">
          <div className="bg-muted/50 h-full overflow-hidden rounded-lg border p-4 font-mono text-sm">
            <pre className="text-foreground/80 line-clamp-3 whitespace-pre-wrap">
              {promptPreview}
            </pre>
          </div>
        </div>

        <div className="mb-4 flex flex-shrink-0 items-center justify-between">
          <div className="text-muted-foreground flex items-center gap-2 text-xs">
            <Image
              src={card.author.avatarUrl ?? "/default-avatar.png"}
              alt={card.author.displayName}
              width={18}
              height={18}
              className="flex-shrink-0 rounded-full"
            />
            <Link
              href={`/profile/${card.author.username}`}
              className="max-w-[100px] truncate font-medium hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              {card.author.displayName}
            </Link>
            <span>•</span>
            <span className="text-xs">
              {formatDateSmart(new Date(card.createdAt), "card")}
            </span>
          </div>
        </div>

        <div className="flex flex-shrink-0 items-center justify-between gap-2">
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              disabled={isLikeLoading}
              className={cn(
                "flex h-8 items-center gap-1 px-2 text-xs",
                isLiked
                  ? "text-red-500 hover:text-red-600"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Heart className={cn("h-4 w-4", isLiked && "fill-current")} />
              {likesCount}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground flex h-8 items-center gap-1 px-2 text-xs"
              onClick={(e) => e.stopPropagation()}
            >
              <MessageCircle className="h-4 w-4" />
              {card.commentCount}
            </Button>

            {card.forkCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground flex h-8 items-center gap-1 px-2 text-xs"
                onClick={(e) => e.stopPropagation()}
              >
                <GitBranch className="h-4 w-4" />
                {card.forkCount}
              </Button>
            )}
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="text-muted-foreground hover:text-foreground flex h-8 items-center gap-1 px-2 text-xs"
            >
              <Copy className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                if (onClick) onClick();
              }}
              className="text-muted-foreground hover:text-foreground flex h-8 items-center gap-1 px-2 text-xs"
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
