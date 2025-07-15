"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Sparkles, Users, Heart, Code2, BarChart3 } from "lucide-react";
import { PromptCard } from "~/components/ui/PromptCard";

const categories = [
  { id: "creative", label: "Creative", icon: Sparkles, color: "pink" as const },
  {
    id: "programming",
    label: "Programming",
    icon: Code2,
    color: "blue" as const,
  },
  {
    id: "analysis",
    label: "Analysis",
    icon: BarChart3,
    color: "emerald" as const,
  },
];

const demoCards = {
  creative: {
    title: "Storytelling Master",
    description: "Create compelling narratives with rich character development",
    prompt: "Write a short story about...",
    likes: 234,
    gradient: "from-pink-500 to-rose-600",
  },
  programming: {
    title: "Code Optimizer",
    description: "Improve code performance and readability",
    prompt: "Optimize this function for...",
    likes: 156,
    gradient: "from-blue-500 to-cyan-600",
  },
  analysis: {
    title: "Data Insights",
    description: "Extract meaningful patterns from complex datasets",
    prompt: "Analyze the following data...",
    likes: 189,
    gradient: "from-emerald-500 to-teal-600",
  },
};

const stats = [
  { label: "Active Minters", value: "12.5K", icon: Users },
  { label: "Cards Minted", value: "47.2K", icon: Sparkles },
  { label: "Total Likes", value: "892K", icon: Heart },
];

export function InteractiveDemo() {
  const [activeCategory, setActiveCategory] = useState("creative");
  const currentCard = demoCards[activeCategory as keyof typeof demoCards];

  return (
    <section className="bg-slate-50 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="mb-16 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl"
          >
            See The{" "}
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Minting Process
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mt-4 max-w-2xl text-lg text-gray-600"
          >
            Watch how prompts transform into valuable digital cards across our
            curated collections
          </motion.p>
        </div>

        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Interactive controls */}
          <div className="space-y-8">
            {/* Category selector */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Choose a Category
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {categories.map((category) => (
                  <motion.button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`relative rounded-xl border-2 p-4 text-left transition-all ${
                      activeCategory === category.id
                        ? "border-purple-500 bg-purple-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`rounded-lg p-2 ${
                          category.color === "pink"
                            ? "bg-pink-100 text-pink-600"
                            : category.color === "blue"
                              ? "bg-blue-100 text-blue-600"
                              : "bg-emerald-100 text-emerald-600"
                        }`}
                      >
                        <category.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {category.label}
                        </div>
                        <div className="text-sm text-gray-500">
                          {category.id === "creative"
                            ? "Art & Writing"
                            : category.id === "programming"
                              ? "Code & Development"
                              : "Data & Research"}
                        </div>
                      </div>
                    </div>
                    {activeCategory === category.id && (
                      <motion.div
                        layoutId="activeCategory"
                        className="absolute inset-0 rounded-xl border-2 border-purple-500 bg-purple-50"
                        style={{ zIndex: -1 }}
                      />
                    )}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="rounded-xl border border-gray-100 bg-white p-4 text-center shadow-sm"
                >
                  <stat.icon className="mx-auto mb-2 h-6 w-6 text-purple-600" />
                  <div className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </div>
                  <div className="text-xs text-gray-500">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Live card preview */}
          <div className="flex justify-center">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, scale: 0.9, rotateY: -10 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ duration: 0.5 }}
              className="relative"
              style={{ perspective: "1000px" }}
            >
              <PromptCard
                title={currentCard.title}
                description={currentCard.description}
                author="@ai_creator"
                likes={currentCard.likes}
                category={categories.find((c) => c.id === activeCategory)!}
                gradient={currentCard.gradient}
                prompt={currentCard.prompt}
                timestamp="2 hours ago"
                showPromptPreview={true}
                floatingElements={true}
                className="rotate-3 transform transition-transform duration-300 hover:rotate-0"
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
