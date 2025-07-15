import React from "react";
import { Heart, type LucideIcon } from "lucide-react";
import { cn } from "~/lib/utils";

interface PromptCardProps {
  // 必須コンテンツ
  title: string;
  description: string;
  author: string;
  likes: number;

  // カテゴリー情報
  category: {
    id: string;
    label: string;
    icon: LucideIcon;
    color: "pink" | "blue" | "emerald" | "purple" | "orange";
  };

  // スタイリング
  gradient: string;

  // オプションコンテンツ
  prompt?: string;
  timestamp?: string;
  rarity?: "bronze" | "silver" | "gold" | "platinum";

  // カスタマイズ
  className?: string;
  showPromptPreview?: boolean;
  showRarity?: boolean;
  floatingElements?: boolean;
}

export function PromptCard({
  title,
  description,
  author,
  likes,
  category,
  gradient,
  prompt,
  timestamp,
  rarity,
  className,
  showPromptPreview = false,
  showRarity = false,
  floatingElements = false,
}: PromptCardProps) {
  const categoryColorClasses = {
    pink: "bg-pink-100 text-pink-600",
    blue: "bg-blue-100 text-blue-600",
    emerald: "bg-emerald-100 text-emerald-600",
    purple: "bg-purple-100 text-purple-600",
    orange: "bg-orange-100 text-orange-600",
  };

  const rarityColors = {
    bronze: "bg-gradient-to-r from-orange-600 to-orange-400",
    silver: "bg-gradient-to-r from-gray-400 to-gray-300",
    gold: "bg-gradient-to-r from-yellow-500 to-yellow-400",
    platinum: "bg-gradient-to-r from-purple-600 to-purple-400",
  };

  return (
    <div
      className={cn(
        "relative h-96 w-80 rounded-2xl bg-gradient-to-br p-6 shadow-2xl",
        gradient,
        className,
      )}
    >
      {/* Glassmorphism overlay */}
      <div className="absolute inset-0 rounded-2xl bg-white/10 backdrop-blur-sm" />

      {/* Card content */}
      <div className="relative z-10 flex h-full flex-col text-white">
        <div className="flex-1">
          {/* Header: Category and Likes */}
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "rounded-lg p-2",
                  categoryColorClasses[category.color],
                )}
              >
                <category.icon className="h-5 w-5" />
              </div>
              <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium">
                {category.label}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Heart className="h-4 w-4 fill-current" />
              <span className="text-sm">{likes}</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="mb-2 text-xl font-bold">{title}</h3>

          {/* Description */}
          <p className="mb-4 text-sm text-white/80">{description}</p>

          {/* Optional Prompt Preview */}
          {showPromptPreview && prompt && (
            <div className="rounded-lg bg-white/10 p-3 backdrop-blur-sm">
              <div className="mb-1 text-xs text-white/60">Prompt Preview</div>
              <div className="font-mono text-sm">{prompt}</div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-white/20 pt-4">
          <div className="text-xs text-white/60">{author}</div>
          <div className="text-xs text-white/60">
            {showRarity && rarity ? (
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-xs font-medium text-white",
                  rarityColors[rarity],
                )}
              >
                {rarity.charAt(0).toUpperCase() + rarity.slice(1)}
              </span>
            ) : (
              timestamp
            )}
          </div>
        </div>
      </div>

      {/* Optional Floating elements */}
      {floatingElements && (
        <>
          <div className="absolute -top-2 -right-2 h-4 w-4 animate-pulse rounded-full bg-yellow-400" />
          <div className="absolute -bottom-2 -left-2 h-3 w-3 animate-bounce rounded-full bg-pink-400" />
        </>
      )}
    </div>
  );
}
