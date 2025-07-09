"use client";

import { motion } from "framer-motion";
import {
  Palette,
  Share2,
  Trophy,
  Zap,
  Shield,
  Globe,
  Brain,
} from "lucide-react";

const features = [
  {
    title: "Beautiful Cards",
    description: "Transform prompts into stunning visual trading cards",
    icon: Palette,
    gradient: "from-pink-500 to-rose-500",
    size: "large",
  },
  {
    title: "Share & Discover",
    description: "Connect with creators worldwide",
    icon: Share2,
    gradient: "from-blue-500 to-cyan-500",
    size: "medium",
  },
  {
    title: "Rarity System",
    description: "Earn recognition through likes",
    icon: Trophy,
    gradient: "from-yellow-500 to-orange-500",
    size: "medium",
  },
  {
    title: "AI-Powered",
    description: "Enhance creativity with AI",
    icon: Brain,
    gradient: "from-purple-500 to-indigo-500",
    size: "small",
  },
  {
    title: "Lightning Fast",
    description: "Instant card creation",
    icon: Zap,
    gradient: "from-emerald-500 to-teal-500",
    size: "small",
  },
  {
    title: "Secure Platform",
    description: "Your data is protected",
    icon: Shield,
    gradient: "from-gray-500 to-slate-500",
    size: "small",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
    },
  },
};

export function FeatureGrid() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl">
            Powerful{" "}
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Features
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
            Everything you need to create, share, and discover amazing AI
            prompts
          </p>
        </motion.div>

        {/* Bento grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          className="grid auto-rows-fr grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4"
        >
          {/* Large feature card */}
          <motion.div
            variants={itemVariants}
            className="group lg:col-span-2 lg:row-span-2"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="relative h-full min-h-[300px] overflow-hidden rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 p-8 text-white">
              {/* Background decoration */}
              <div className="absolute inset-0 bg-black/10" />
              <div className="absolute top-4 right-4 opacity-20">
                <Palette className="h-24 w-24" />
              </div>

              {/* Content */}
              <div className="relative z-10 flex h-full flex-col">
                <div className="mb-6">
                  <Palette className="mb-4 h-8 w-8" />
                  <h3 className="mb-2 text-2xl font-bold">
                    {features[0]?.title}
                  </h3>
                  <p className="text-white/80">{features[0]?.description}</p>
                </div>

                {/* Demo cards */}
                <div className="flex flex-1 items-end">
                  <div className="flex gap-2">
                    <div className="h-20 w-16 rotate-3 transform rounded-lg bg-white/20 backdrop-blur-sm transition-transform group-hover:rotate-6" />
                    <div className="h-20 w-16 -rotate-2 transform rounded-lg bg-white/30 backdrop-blur-sm transition-transform group-hover:-rotate-4" />
                    <div className="h-20 w-16 rotate-1 transform rounded-lg bg-white/20 backdrop-blur-sm transition-transform group-hover:rotate-3" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Medium feature cards */}
          {features.slice(1, 3).map((feature) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              className="group lg:col-span-1 lg:row-span-1"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <div
                className={`relative h-full min-h-[140px] rounded-2xl bg-gradient-to-br ${feature.gradient} overflow-hidden p-6 text-white`}
              >
                <div className="absolute inset-0 bg-black/10" />
                <div className="absolute top-2 right-2 opacity-20">
                  <feature.icon className="h-16 w-16" />
                </div>

                <div className="relative z-10">
                  <feature.icon className="mb-3 h-6 w-6" />
                  <h3 className="mb-1 text-lg font-bold">{feature.title}</h3>
                  <p className="text-sm text-white/80">{feature.description}</p>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Small feature cards */}
          {features.slice(3).map((feature) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              className="group"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <div
                className={`relative h-full min-h-[140px] rounded-2xl bg-gradient-to-br ${feature.gradient} overflow-hidden p-6 text-white`}
              >
                <div className="absolute inset-0 bg-black/10" />
                <div className="absolute top-2 right-2 opacity-20">
                  <feature.icon className="h-12 w-12" />
                </div>

                <div className="relative z-10">
                  <feature.icon className="mb-3 h-5 w-5" />
                  <h3 className="mb-1 text-base font-bold">{feature.title}</h3>
                  <p className="text-xs text-white/80">{feature.description}</p>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Special stats card */}
          <motion.div
            variants={itemVariants}
            className="group lg:col-span-2"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="relative h-full min-h-[140px] overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 p-6 text-white">
              <div className="absolute inset-0 bg-black/10" />

              {/* Animated background elements */}
              <div className="absolute inset-0">
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute h-2 w-2 rounded-full bg-white/20"
                    style={{
                      left: `${20 + i * 15}%`,
                      top: `${30 + (i % 2) * 40}%`,
                    }}
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.3, 0.8, 0.3],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.3,
                    }}
                  />
                ))}
              </div>

              <div className="relative z-10 flex h-full items-center justify-between">
                <div>
                  <Globe className="mb-2 h-6 w-6" />
                  <h3 className="mb-1 text-lg font-bold">Global Community</h3>
                  <p className="text-sm text-white/80">
                    Join creators from 50+ countries
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">50K+</div>
                  <div className="text-sm text-white/80">Active Users</div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
