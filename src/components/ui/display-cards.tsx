"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "~/lib/utils";
import {
  Code2,
  Palette,
  BarChart3,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { PromptCard } from "~/components/ui/PromptCard";

interface DisplayCardProps {
  className?: string;
  icon: LucideIcon;
  title: string;
  description: string;
  author: string;
  category: string;
  categoryColor: "pink" | "blue" | "emerald" | "purple" | "orange";
  rarity: "bronze" | "silver" | "gold" | "platinum";
  likes: number;
  index?: number;
  isHovered?: boolean;
  hoveredIndex?: number | null;
  onHover?: (index: number | null) => void;
  gradient: string;
}

function DisplayCard({
  className,
  icon = Sparkles,
  title = "Featured Prompt",
  description = "An amazing AI prompt",
  author = "@creator",
  category = "Creative",
  categoryColor = "pink",
  rarity = "silver",
  likes = 42,
  index = 0,
  isHovered = false,
  hoveredIndex = null,
  onHover,
  gradient = "from-slate-900 to-slate-800",
}: DisplayCardProps) {
  const rarityBorderColors = {
    bronze: "border-orange-500/50",
    silver: "border-gray-400/50",
    gold: "border-yellow-500/50",
    platinum: "border-purple-500/50",
  };

  // Calculate dynamic positioning and z-index
  const getCardStyle = () => {
    const baseTransforms = [
      { x: 0, y: 0, rotate: 3 }, // Card 0 (front)
      { x: 40, y: 50, rotate: 6 }, // Card 1 (middle)
      { x: 80, y: 90, rotate: 9 }, // Card 2 (back)
    ];

    const baseTransform = baseTransforms[index] ?? baseTransforms[0]!;

    // If this card is hovered
    if (isHovered) {
      return {
        x: baseTransform.x,
        y: -50,
        rotate: 0,
        scale: 1.04,
        zIndex: 50,
      };
    }

    // If another card is hovered, spread this card out
    if (hoveredIndex !== null && hoveredIndex !== index) {
      const spreadPositions = [
        // When card 0 is hovered
        [
          { x: 0, y: 0, rotate: 0 }, // Card 0 stays
          { x: 90, y: 70, rotate: 10 }, // Card 1 spreads right
          { x: 100, y: 90, rotate: 12 }, // Card 2 spreads further right
        ],
        // When card 1 is hovered
        [
          { x: -100, y: 40, rotate: -12 }, // Card 0 spreads left-back
          { x: 0, y: 0, rotate: 0 }, // Card 1 stays
          { x: 120, y: 100, rotate: 20 }, // Card 2 spreads right-back
        ],
        // When card 2 is hovered
        [
          { x: -10, y: 30, rotate: -10 }, // Card 0 spreads far left-back
          { x: -80, y: 90, rotate: -25 }, // Card 1 spreads left-back
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
        "absolute -skew-y-[8deg] cursor-pointer select-none",
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
      <PromptCard
        title={title}
        description={description}
        author={author}
        likes={likes}
        category={{
          id: category.toLowerCase(),
          label: category,
          icon: icon,
          color: categoryColor,
        }}
        gradient={gradient}
        rarity={rarity}
        showRarity={true}
        className="border-2 backdrop-blur-sm"
      />
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
      icon: Code2,
      title: "Debug React Hooks Expert",
      description:
        "Analyze and fix complex React hooks issues with detailed explanations and best practices",
      author: "@alexdev",
      category: "Programming",
      categoryColor: "blue",
      rarity: "gold",
      likes: 156,
      gradient: "from-blue-500 to-cyan-600",
    },
    {
      icon: Palette,
      title: "Fantasy World Builder",
      description:
        "Create rich, detailed fantasy worlds complete with lore, magic systems, and unique cultures",
      author: "@storywizard",
      category: "Creative",
      categoryColor: "purple",
      rarity: "platinum",
      likes: 243,
      gradient: "from-purple-500 to-pink-600",
    },
    {
      icon: BarChart3,
      title: "Data Viz Assistant",
      description:
        "Transform complex datasets into beautiful, insightful visualizations with code examples",
      author: "@datapro",
      category: "Analysis",
      categoryColor: "emerald",
      rarity: "silver",
      likes: 89,
      gradient: "from-emerald-500 to-teal-600",
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
