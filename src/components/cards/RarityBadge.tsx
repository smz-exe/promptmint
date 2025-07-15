import { type Rarity } from "@prisma/client";
import { cn } from "~/lib/utils";

interface RarityBadgeProps {
  rarity: Rarity;
  size?: "sm" | "md";
  className?: string;
}

const rarityConfig = {
  BRONZE: {
    label: "Bronze",
    className:
      "bg-gradient-to-r from-amber-600 to-amber-800 text-white border-amber-500 hover:from-amber-500 hover:to-amber-700",
    glowClass: "shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50",
    ringClass: "ring-2 ring-amber-500/20",
  },
  SILVER: {
    label: "Silver",
    className:
      "bg-gradient-to-r from-slate-400 to-slate-600 text-white border-slate-300 hover:from-slate-300 hover:to-slate-500",
    glowClass: "shadow-lg shadow-slate-400/40 hover:shadow-slate-400/60",
    ringClass: "ring-2 ring-slate-400/20",
  },
  GOLD: {
    label: "Gold",
    className:
      "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white border-yellow-300 hover:from-yellow-300 hover:to-yellow-500",
    glowClass: "shadow-lg shadow-yellow-400/50 hover:shadow-yellow-400/70",
    ringClass: "ring-2 ring-yellow-400/30",
  },
  PLATINUM: {
    label: "Platinum",
    className:
      "bg-gradient-to-r from-purple-400 to-purple-600 text-white border-purple-300 hover:from-purple-300 hover:to-purple-500",
    glowClass: "shadow-lg shadow-purple-400/60 hover:shadow-purple-400/80",
    ringClass: "ring-2 ring-purple-400/30",
  },
} as const;

export function RarityBadge({
  rarity,
  size = "md",
  className,
}: RarityBadgeProps) {
  const config = rarityConfig[rarity];

  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
  };

  const dotSizeClasses = {
    sm: "mr-0.5 h-1.5 w-1.5",
    md: "mr-1 h-2 w-2",
  };

  return (
    <div
      className={cn(
        "inline-flex transform items-center rounded-full border font-semibold transition-all duration-300 hover:scale-105",
        sizeClasses[size],
        config.className,
        config.glowClass,
        config.ringClass,
        "animate-pulse",
        className,
      )}
      style={{
        animationDuration:
          rarity === "PLATINUM" ? "1s" : rarity === "GOLD" ? "1.5s" : "2s",
        animationIterationCount: "infinite",
      }}
    >
      <div
        className={cn(
          "rounded-full bg-current opacity-75",
          dotSizeClasses[size],
        )}
      />
      {config.label}
    </div>
  );
}

export function getRarityThresholds(rarity: Rarity): {
  min: number;
  max: number | null;
} {
  switch (rarity) {
    case "BRONZE":
      return { min: 0, max: 19 };
    case "SILVER":
      return { min: 20, max: 49 };
    case "GOLD":
      return { min: 50, max: 99 };
    case "PLATINUM":
      return { min: 100, max: null };
    default:
      return { min: 0, max: null };
  }
}
