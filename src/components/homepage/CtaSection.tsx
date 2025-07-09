"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Clock, Users, Zap } from "lucide-react";
import { Button } from "~/components/ui/button";
import Link from "next/link";

const steps = [
  {
    number: "01",
    title: "Sign Up",
    description: "Create your free account in seconds",
    icon: Users,
    color: "from-blue-500 to-cyan-500",
  },
  {
    number: "02",
    title: "Create",
    description: "Design your first prompt card",
    icon: Sparkles,
    color: "from-purple-500 to-pink-500",
  },
  {
    number: "03",
    title: "Share",
    description: "Connect with the community",
    icon: Zap,
    color: "from-emerald-500 to-teal-500",
  },
];

const benefits = [
  "Free to get started",
  "No design skills required",
  "Instant community feedback",
  "Export and share anywhere",
];

// Pre-defined particle positions to avoid hydration errors
const particles = [
  { id: 0, x: 8.2, y: 12.5, delay: 0.3, duration: 3.2 },
  { id: 1, x: 76.5, y: 89.3, delay: 0.7, duration: 4.1 },
  { id: 2, x: 42.1, y: 56.8, delay: 1.2, duration: 3.7 },
  { id: 3, x: 91.7, y: 31.4, delay: 0.1, duration: 4.5 },
  { id: 4, x: 23.8, y: 74.2, delay: 1.5, duration: 3.9 },
  { id: 5, x: 65.4, y: 18.6, delay: 0.5, duration: 4.3 },
  { id: 6, x: 37.9, y: 92.1, delay: 0.9, duration: 3.4 },
  { id: 7, x: 84.2, y: 47.5, delay: 1.8, duration: 4.8 },
  { id: 8, x: 51.6, y: 25.9, delay: 0.2, duration: 3.6 },
  { id: 9, x: 19.3, y: 85.7, delay: 1.1, duration: 4.2 },
  { id: 10, x: 73.1, y: 39.2, delay: 0.6, duration: 3.8 },
  { id: 11, x: 46.8, y: 71.4, delay: 1.4, duration: 4.6 },
  { id: 12, x: 95.2, y: 14.8, delay: 0.8, duration: 3.3 },
  { id: 13, x: 28.7, y: 63.5, delay: 1.7, duration: 4.7 },
  { id: 14, x: 61.4, y: 96.8, delay: 0.4, duration: 4.0 },
];

export function CtaSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-24">
      {/* Background animation */}
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
              scale: [1, 1.5, 1],
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

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl"
          >
            Start Creating in{" "}
            <span className="bg-gradient-to-r from-pink-400 to-cyan-400 bg-clip-text text-transparent">
              3 Simple Steps
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mt-4 max-w-2xl text-lg text-white/80"
          >
            Join thousands of creators who are already transforming their AI
            prompts into beautiful trading cards
          </motion.p>
        </div>

        {/* Steps */}
        <div className="mb-16 grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="group relative"
            >
              {/* Connection line */}
              {index < steps.length - 1 && (
                <div className="absolute top-1/2 -right-4 hidden h-0.5 w-8 bg-gradient-to-r from-white/30 to-transparent md:block" />
              )}

              <div className="text-center">
                {/* Icon container */}
                <div
                  className={`relative inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br ${step.color} mb-6 transition-transform group-hover:scale-110`}
                >
                  <step.icon className="h-8 w-8 text-white" />
                  <div className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-white">
                    <span className="text-sm font-bold text-gray-900">
                      {step.number}
                    </span>
                  </div>
                </div>

                <h3 className="mb-2 text-xl font-bold text-white">
                  {step.title}
                </h3>
                <p className="text-white/70">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Main CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mx-auto max-w-4xl"
        >
          {/* Benefits grid */}
          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
                className="flex items-center gap-2 text-white/80"
              >
                <div className="h-2 w-2 rounded-full bg-green-400" />
                <span className="text-sm">{benefit}</span>
              </motion.div>
            ))}
          </div>

          {/* CTA buttons */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="group relative overflow-hidden bg-gradient-to-r from-pink-500 to-violet-600 px-8 py-4 text-lg font-semibold shadow-lg shadow-pink-500/25 transition-all hover:scale-105 hover:shadow-xl hover:shadow-pink-500/40"
            >
              <Link href="/sign-up">
                <span className="relative z-10 flex items-center gap-2">
                  Start Creating Free
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-pink-500 opacity-0 transition-opacity group-hover:opacity-100" />
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-white/30 bg-white/10 px-8 py-4 text-lg font-semibold text-white backdrop-blur-sm hover:bg-white/20"
            >
              <Link href="/feed">
                <span className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Browse Examples
                </span>
              </Link>
            </Button>
          </div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
            className="mt-8 text-center"
          >
            <p className="mb-4 text-sm text-white/60">
              Trusted by creators worldwide
            </p>
            <div className="flex items-center justify-center gap-8 opacity-60">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/10 backdrop-blur-sm"
                >
                  <div className="h-6 w-6 rounded bg-white/30" />
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Floating elements */}
        <div className="absolute top-20 left-10 h-4 w-4 animate-pulse rounded-full bg-pink-400" />
        <div className="absolute right-10 bottom-20 h-3 w-3 animate-bounce rounded-full bg-cyan-400" />
        <div className="absolute top-1/2 right-20 h-2 w-2 animate-ping rounded-full bg-purple-400" />
      </div>
    </section>
  );
}
