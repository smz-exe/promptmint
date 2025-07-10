"use client";

import { motion } from "framer-motion";
import { Sparkles, Zap, Brain } from "lucide-react";
import { Button } from "~/components/ui/button";
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
      {/* Animated background particles */}
      <div className="absolute inset-0">
        {particles.map((particle) => (
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
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4">
        <div className="mx-auto max-w-6xl text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-white backdrop-blur-sm">
              <Sparkles className="h-4 w-4" />
              <span>Powered by AI Community</span>
            </div>
          </motion.div>

          {/* Main heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-6 text-4xl leading-tight font-bold text-white sm:text-6xl lg:text-7xl"
          >
            <span className="block">Create.</span>
            <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Share.
            </span>
            <span className="block">Discover.</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mx-auto mb-10 max-w-2xl text-lg text-white/80 sm:text-xl"
          >
            Transform your AI prompts into beautiful trading cards. Join a
            creative community where ideas become collectible art.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mb-16 flex flex-col gap-4 sm:flex-row sm:justify-center"
          >
            <Button
              asChild
              size="lg"
              className="group relative overflow-hidden bg-gradient-to-r from-pink-500 to-violet-600 px-8 py-4 text-lg font-semibold shadow-lg shadow-pink-500/25 transition-all hover:scale-105 hover:shadow-xl hover:shadow-pink-500/40"
            >
              <Link href="/sign-up">
                <span className="relative z-10 flex items-center gap-2">
                  Start Creating
                  <Zap className="h-5 w-5 transition-transform group-hover:rotate-12" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-pink-500 opacity-0 transition-opacity group-hover:opacity-100" />
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-white/20 bg-white/10 px-8 py-4 text-lg font-semibold text-white backdrop-blur-sm hover:bg-white/20"
            >
              <Link href="/feed">
                <span className="flex items-center gap-2">
                  Explore Cards
                  <Brain className="h-5 w-5" />
                </span>
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute right-0 bottom-0 left-0 h-32 bg-gradient-to-t from-slate-50 to-transparent" />
    </section>
  );
}
