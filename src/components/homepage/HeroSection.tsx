"use client";

import { motion } from "framer-motion";
import { Sparkles, Zap, Brain } from "lucide-react";
import { Button } from "~/components/ui/button";
import DisplayCards from "~/components/ui/display-cards";
import Link from "next/link";

// Pre-defined particle positions to avoid hydration errors
const particles = [
  { id: 0, x: 12.5, y: 15.3, delay: 0.2, duration: 3.5 },
  { id: 1, x: 87.2, y: 22.8, delay: 0.8, duration: 4.2 },
  { id: 2, x: 45.6, y: 78.1, delay: 1.1, duration: 3.8 },
  { id: 3, x: 23.9, y: 91.4, delay: 0.5, duration: 4.7 },
  { id: 4, x: 67.3, y: 34.2, delay: 1.4, duration: 3.3 },
  { id: 5, x: 91.8, y: 56.7, delay: 0.9, duration: 4.1 },
  { id: 6, x: 34.1, y: 12.9, delay: 0.3, duration: 3.9 },
  { id: 7, x: 78.5, y: 89.3, delay: 1.7, duration: 4.5 },
  { id: 8, x: 52.7, y: 45.6, delay: 0.6, duration: 3.6 },
  { id: 9, x: 15.9, y: 67.8, delay: 1.2, duration: 4.3 },
  { id: 10, x: 89.4, y: 23.1, delay: 0.1, duration: 3.4 },
  { id: 11, x: 41.2, y: 90.5, delay: 1.5, duration: 4.8 },
  { id: 12, x: 73.8, y: 18.7, delay: 0.7, duration: 3.7 },
  { id: 13, x: 28.6, y: 76.2, delay: 1.3, duration: 4.4 },
  { id: 14, x: 95.1, y: 41.9, delay: 0.4, duration: 3.2 },
  { id: 15, x: 59.3, y: 8.4, delay: 1.8, duration: 4.6 },
  { id: 16, x: 6.7, y: 85.1, delay: 1.0, duration: 4.0 },
  { id: 17, x: 82.4, y: 62.3, delay: 0.0, duration: 3.1 },
  { id: 18, x: 37.9, y: 29.8, delay: 1.6, duration: 4.9 },
  { id: 19, x: 64.2, y: 94.5, delay: 1.9, duration: 5.0 },
];

export function HeroSection() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated background particles - Responsive count */}
      <div className="absolute inset-0">
        {particles
          .slice(
            0,
            typeof window !== "undefined" && window.innerWidth < 768 ? 10 : 20,
          )
          .map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute h-1 w-1 rounded-full bg-white/20"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: particle.duration,
                repeat: Infinity,
                delay: particle.delay,
                ease: "easeInOut",
              }}
            />
          ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 flex min-h-[calc(100vh-4rem)] items-center px-4 sm:px-6 lg:px-12">
        <div className="mx-auto w-full max-w-7xl">
          <div className="grid items-center gap-8 sm:gap-12 lg:grid-cols-2 lg:gap-8">
            {/* Left column - Text content */}
            <div className="text-left">
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-6 sm:mb-8"
              >
                <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs text-white backdrop-blur-sm sm:px-4 sm:py-2 sm:text-sm">
                  <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span>10K+ Cards Minted Daily</span>
                </div>
              </motion.div>

              {/* Main heading */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="mb-4 text-3xl leading-tight font-bold text-white sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl"
              >
                <span className="block">Mint Your Prompts,</span>
                <span className="block bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  Build Your Legacy
                </span>
              </motion.h1>

              {/* Tagline */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="mb-4 text-lg font-medium text-white/90 sm:mb-6 sm:text-xl"
              >
                Where AI Prompts Become Collectibles
              </motion.p>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="mb-8 max-w-xl text-base leading-relaxed text-white/80 sm:mb-10 sm:text-lg lg:text-xl"
              >
                Transform AI prompts into collectible cards. Every mint tells a
                story, every collection builds your reputation.
              </motion.p>

              {/* CTA buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7 }}
                className="flex flex-col gap-3 sm:flex-row sm:gap-4"
              >
                <Button
                  asChild
                  size="lg"
                  className="group relative min-h-[48px] overflow-hidden bg-gradient-to-r from-pink-500 to-violet-600 px-6 py-3 text-base font-semibold shadow-lg shadow-pink-500/25 transition-all hover:scale-105 hover:shadow-xl hover:shadow-pink-500/40 sm:min-h-[56px] sm:px-8 sm:py-4 sm:text-lg"
                >
                  <Link href="/sign-up">
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      Start Minting
                      <Zap className="h-4 w-4 transition-transform group-hover:rotate-12 sm:h-5 sm:w-5" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-pink-500 opacity-0 transition-opacity group-hover:opacity-100" />
                  </Link>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="min-h-[48px] border-white/20 bg-white/10 px-6 py-3 text-base font-semibold text-white backdrop-blur-sm hover:bg-white/20 sm:min-h-[56px] sm:px-8 sm:py-4 sm:text-lg"
                >
                  <Link href="/feed">
                    <span className="flex items-center justify-center gap-2">
                      Explore Collections
                      <Brain className="h-4 w-4 sm:h-5 sm:w-5" />
                    </span>
                  </Link>
                </Button>
              </motion.div>
            </div>

            {/* Right column - Display Cards */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.8 }}
              className="relative mt-8 sm:mt-12 lg:mt-0 lg:pl-8"
            >
              <div className="relative">
                {/* Glow effect behind cards */}
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-cyan-500/20 blur-3xl" />

                {/* Display Cards - Hidden on very small screens, shown on sm and up */}
                <div className="hidden sm:block">
                  <DisplayCards />
                </div>

                {/* Mobile alternative - simplified card preview */}
                <div className="block sm:hidden">
                  <div className="relative mx-auto flex h-40 w-64 items-center justify-center rounded-xl border border-white/20 bg-gradient-to-br from-pink-500/20 to-purple-500/20 backdrop-blur-sm">
                    <div className="text-center text-white/80">
                      <Sparkles className="mx-auto mb-2 h-8 w-8" />
                      <p className="text-sm font-medium">
                        Beautiful AI Prompt Cards
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute right-0 bottom-0 left-0 h-32 bg-gradient-to-t from-slate-50 to-transparent" />
    </section>
  );
}
