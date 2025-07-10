"use client";

import { cn } from "~/lib/utils";
import { Code2, Palette, BarChart3, Sparkles } from "lucide-react";

interface DisplayCardProps {
  className?: string;
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  author?: string;
  category?: string;
  rarity?: "bronze" | "silver" | "gold" | "platinum";
  likes?: number;
}

function DisplayCard({
  className,
  icon = <Sparkles className="h-4 w-4" />,
  title = "Featured Prompt",
  description = "An amazing AI prompt",
  author = "@creator",
  category = "Creative",
  rarity = "silver",
  likes = 42,
}: DisplayCardProps) {
  const rarityColors = {
    bronze: "from-orange-600 to-orange-400",
    silver: "from-gray-400 to-gray-300",
    gold: "from-yellow-500 to-yellow-400",
    platinum: "from-purple-600 to-purple-400",
  };

  const rarityBorderColors = {
    bronze: "border-orange-500/50",
    silver: "border-gray-400/50",
    gold: "border-yellow-500/50",
    platinum: "border-purple-500/50",
  };

  return (
    <div
      className={cn(
        "relative flex h-48 w-[22rem] -skew-y-[8deg] flex-col rounded-xl border-2 bg-gradient-to-br from-slate-900/90 to-slate-800/90 px-5 py-4 backdrop-blur-sm transition-all duration-700 select-none",
        "hover:scale-105 hover:shadow-2xl",
        rarityBorderColors[rarity],
        className,
      )}
    >
      {/* Rarity gradient overlay */}
      <div
        className={cn(
          "absolute inset-x-0 top-0 h-1 rounded-t-xl bg-gradient-to-r",
          rarityColors[rarity],
        )}
      />

      {/* Category and likes */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-white/10 p-1.5 backdrop-blur-sm">
            {icon}
          </span>
          <span className="text-sm font-medium text-white/80">{category}</span>
        </div>
        <div className="flex items-center gap-1 text-sm text-white/60">
          <span>❤️</span>
          <span>{likes}</span>
        </div>
      </div>

      {/* Title and description */}
      <div className="flex-1">
        <h3 className="mb-2 line-clamp-1 text-lg font-bold text-white">
          {title}
        </h3>
        <p className="line-clamp-2 text-sm text-white/70">{description}</p>
      </div>

      {/* Author and rarity */}
      <div className="mt-3 flex items-center justify-between">
        <span className="text-xs text-white/50">{author}</span>
        <span
          className={cn(
            "rounded-full bg-gradient-to-r px-2 py-0.5 text-xs font-medium text-white",
            rarityColors[rarity],
          )}
        >
          {rarity.charAt(0).toUpperCase() + rarity.slice(1)}
        </span>
      </div>
    </div>
  );
}

interface DisplayCardsProps {
  cards?: DisplayCardProps[];
}

export default function DisplayCards({ cards }: DisplayCardsProps) {
  const defaultCards: DisplayCardProps[] = [
    {
      icon: <Code2 className="h-4 w-4 text-blue-400" />,
      title: "Debug React Hooks Expert",
      description:
        "Analyze and fix complex React hooks issues with detailed explanations and best practices",
      author: "@alexdev",
      category: "Programming",
      rarity: "gold",
      likes: 156,
      className: "[grid-area:stack] hover:-translate-y-12 hover:rotate-2 z-30",
    },
    {
      icon: <Palette className="h-4 w-4 text-purple-400" />,
      title: "Fantasy World Builder",
      description:
        "Create rich, detailed fantasy worlds complete with lore, magic systems, and unique cultures",
      author: "@storywizard",
      category: "Creative",
      rarity: "platinum",
      likes: 243,
      className:
        "[grid-area:stack] translate-x-8 translate-y-8 hover:-translate-y-2 hover:rotate-1 z-20",
    },
    {
      icon: <BarChart3 className="h-4 w-4 text-green-400" />,
      title: "Data Viz Assistant",
      description:
        "Transform complex datasets into beautiful, insightful visualizations with code examples",
      author: "@datapro",
      category: "Analysis",
      rarity: "silver",
      likes: 89,
      className:
        "[grid-area:stack] translate-x-16 translate-y-16 hover:translate-y-8 z-10",
    },
  ];

  const displayCards = cards ?? defaultCards;

  return (
    <div className="grid place-items-center [grid-template-areas:'stack']">
      {displayCards.map((cardProps, index) => (
        <DisplayCard key={index} {...cardProps} />
      ))}
    </div>
  );
}
