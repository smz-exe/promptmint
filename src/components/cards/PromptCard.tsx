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
        return "bg-gradient-to-br from-amber-600 to-orange-600";
      case "SILVER":
        return "bg-gradient-to-br from-slate-600 to-gray-600";
      case "GOLD":
        return "bg-gradient-to-br from-yellow-500 to-amber-500";
      case "PLATINUM":
        return "bg-gradient-to-br from-purple-600 to-pink-600";
      default:
        return "bg-gradient-to-br from-slate-700 to-slate-800";
    }
  };

  const getCategoryGradient = () => {
    const gradientMap: Record<string, string> = {
      Programming: "from-blue-500 to-cyan-600",
      Writing: "from-emerald-500 to-teal-600",
      "Analysis & Research": "from-purple-500 to-violet-600",
      "Learning & Education": "from-orange-500 to-amber-600",
      "Creative & Art": "from-pink-500 to-rose-600",
      Others: "from-slate-500 to-gray-600",
    };
    return gradientMap[card.category.name] ?? "from-slate-500 to-gray-600";
  };

  const getCategoryColor = () => {
    const colorMap: Record<string, string> = {
      Programming: "bg-blue-100 text-blue-700 border-blue-200",
      Writing: "bg-green-100 text-green-700 border-green-200",
      "Analysis & Research": "bg-purple-100 text-purple-700 border-purple-200",
      "Learning & Education": "bg-orange-100 text-orange-700 border-orange-200",
      "Creative & Art": "bg-pink-100 text-pink-700 border-pink-200",
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
        "mx-auto flex h-[450px] w-full max-w-md flex-col",
        "bg-gradient-to-br",
        getCategoryGradient(),
        getCardBorderClass(),
        getCardGlowClass(),
        "border-2 shadow-2xl backdrop-blur-sm",
      )}
      onClick={onClick}
    >
      {/* Glassmorphism overlay */}
      <div className="absolute inset-0 rounded-lg bg-white/10 backdrop-blur-sm" />
      {/* Rarity Sparkle Effect */}
      {(card.rarity === "GOLD" || card.rarity === "PLATINUM") && (
        <div className="absolute -top-1 -right-1 z-10">
          <Sparkles className="h-4 w-4 animate-pulse text-yellow-400" />
        </div>
      )}

      <CardHeader className="relative z-10 flex-shrink-0 pb-4 text-white">
        <div className="mb-3 flex items-start justify-between">
          <div className="flex items-center gap-2">
            <RarityBadge rarity={card.rarity} size="sm" />
            <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white">
              {card.category.name}
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
          <h3 className="line-clamp-2 text-lg leading-tight font-bold text-white">
            {card.title}
          </h3>
          <p className="line-clamp-2 text-sm leading-relaxed text-white/80">
            {card.description}
          </p>
        </div>
      </CardHeader>

      <CardContent className="relative z-10 flex flex-1 flex-col pt-0 text-white">
        <div className="mb-4 flex-grow">
          <div className="h-[120px] overflow-hidden rounded-lg border border-white/20 bg-white/10 p-4 font-mono text-sm backdrop-blur-sm">
            <pre className="line-clamp-4 whitespace-pre-wrap text-white/90">
              {promptPreview}
            </pre>
          </div>
        </div>

        <div className="mt-auto">
          <div className="mb-4 flex flex-shrink-0 items-center justify-between border-t border-white/20 pt-4">
            <div className="flex items-center gap-2 text-xs text-white/60">
              <Image
                src={card.author.avatarUrl ?? "/default-avatar.svg"}
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
                  "flex h-8 items-center gap-1 px-2 text-xs hover:bg-white/10",
                  isLiked
                    ? "text-red-400 hover:text-red-300"
                    : "text-white/60 hover:text-white",
                )}
              >
                <Heart className={cn("h-4 w-4", isLiked && "fill-current")} />
                {likesCount}
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="flex h-8 items-center gap-1 px-2 text-xs text-white/60 hover:bg-white/10 hover:text-white"
                onClick={(e) => e.stopPropagation()}
              >
                <MessageCircle className="h-4 w-4" />
                {card.commentCount}
              </Button>

              {card.forkCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex h-8 items-center gap-1 px-2 text-xs text-white/60 hover:bg-white/10 hover:text-white"
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
                className="flex h-8 items-center gap-1 px-2 text-xs text-white/60 hover:bg-white/10 hover:text-white"
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
                className="flex h-8 items-center gap-1 px-2 text-xs text-white/60 hover:bg-white/10 hover:text-white"
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
