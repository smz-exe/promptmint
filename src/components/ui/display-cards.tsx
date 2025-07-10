"use client";

import { useState } from "react";
import { motion } from "framer-motion";
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
  index?: number;
  isHovered?: boolean;
  hoveredIndex?: number | null;
  onHover?: (index: number | null) => void;
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
  index = 0,
  isHovered = false,
  hoveredIndex = null,
  onHover,
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

  // Calculate dynamic positioning and z-index
  const getCardStyle = () => {
    const baseTransforms = [
      { x: 0, y: 0, rotate: 0 }, // Card 0 (front)
      { x: 32, y: 32, rotate: 2 }, // Card 1 (middle)
      { x: 64, y: 64, rotate: 4 }, // Card 2 (back)
    ];

    const baseTransform = baseTransforms[index] ?? baseTransforms[0];

    // If this card is hovered
    if (isHovered) {
      return {
        x: 0,
        y: -40,
        rotate: 0,
        scale: 1.1,
        zIndex: 50,
      };
    }

    // If another card is hovered, spread this card out
    if (hoveredIndex !== null && hoveredIndex !== index) {
      const spreadPositions = [
        // When card 0 is hovered
        [
          { x: 0, y: 0, rotate: 0 }, // Card 0 stays
          { x: 90, y: 60, rotate: 8 }, // Card 1 spreads right
          { x: 120, y: 100, rotate: 12 }, // Card 2 spreads further right
        ],
        // When card 1 is hovered
        [
          { x: -100, y: 40, rotate: -12 }, // Card 0 spreads left-back
          { x: 0, y: 0, rotate: 0 }, // Card 1 stays
          { x: 120, y: 80, rotate: 12 }, // Card 2 spreads right-back
        ],
        // When card 2 is hovered
        [
          { x: -120, y: 30, rotate: -10 }, // Card 0 spreads far left-back
          { x: -80, y: 50, rotate: -25 }, // Card 1 spreads left-back
          { x: 0, y: 0, rotate: 0 }, // Card 2 stays
        ],
      ];

      const spreadConfig =
        spreadPositions[hoveredIndex]?.[index] ?? baseTransform;
      return {
        ...spreadConfig,
        scale: 0.95,
        zIndex: 30 - index,
      };
    }

    // Default stacked position
    return {
      ...baseTransform,
      scale: 1,
      zIndex: 30 - index,
    };
  };

  const cardStyle = getCardStyle();

  return (
    <motion.div
      className={cn(
        "absolute flex h-48 w-[22rem] -skew-y-[8deg] cursor-pointer flex-col rounded-xl border-2 bg-gradient-to-br from-slate-900/90 to-slate-800/90 px-5 py-4 backdrop-blur-sm select-none",
        rarityBorderColors[rarity],
        className,
      )}
      style={{
        zIndex: cardStyle.zIndex,
      }}
      animate={{
        x: cardStyle.x,
        y: cardStyle.y,
        rotate: cardStyle.rotate,
        scale: cardStyle.scale,
      }}
      transition={{
        type: "spring",
        stiffness: 250,
        damping: 35,
        mass: 1,
      }}
      whileHover={{
        boxShadow: isHovered
          ? "0 25px 50px -12px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.1)"
          : "0 10px 25px -3px rgba(0, 0, 0, 0.3)",
      }}
      onHoverStart={() => onHover?.(index)}
      onHoverEnd={() => {
        // Only clear hover if we're not hovering over the container
        // This will be handled by the container's onHoverEnd
      }}
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
    </motion.div>
  );
}

interface DisplayCardsProps {
  cards?: DisplayCardProps[];
}

export default function DisplayCards({ cards }: DisplayCardsProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

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
    },
  ];

  const displayCards = cards ?? defaultCards;

  return (
    <div
      className="relative flex h-[400px] w-[500px] items-center justify-center"
      onMouseLeave={() => setHoveredIndex(null)}
    >
      {displayCards.map((cardProps, index) => (
        <DisplayCard
          key={index}
          {...cardProps}
          index={index}
          isHovered={hoveredIndex === index}
          hoveredIndex={hoveredIndex}
          onHover={setHoveredIndex}
        />
      ))}
    </div>
  );
}
