import { Rarity } from "@prisma/client";
import { cn } from "~/lib/utils";

interface RarityBadgeProps {
  rarity: Rarity;
  className?: string;
}

const rarityConfig = {
  BRONZE: {
    label: "Bronze",
    className: "bg-gradient-to-r from-amber-600 to-amber-800 text-white border-amber-500",
    glowClass: "shadow-amber-500/20",
  },
  SILVER: {
    label: "Silver",
    className: "bg-gradient-to-r from-slate-400 to-slate-600 text-white border-slate-300",
    glowClass: "shadow-slate-400/30",
  },
  GOLD: {
    label: "Gold",
    className: "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white border-yellow-300",
    glowClass: "shadow-yellow-400/40",
  },
  PLATINUM: {
    label: "Platinum",
    className: "bg-gradient-to-r from-purple-400 to-purple-600 text-white border-purple-300",
    glowClass: "shadow-purple-400/50",
  },
} as const;

export function RarityBadge({ rarity, className }: RarityBadgeProps) {
  const config = rarityConfig[rarity];
  
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-1 text-xs font-semibold shadow-lg",
        config.className,
        config.glowClass,
        className
      )}
    >
      <div className="mr-1 h-2 w-2 rounded-full bg-current opacity-75" />
      {config.label}
    </div>
  );
}

export function getRarityThresholds(rarity: Rarity): { min: number; max: number | null } {
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