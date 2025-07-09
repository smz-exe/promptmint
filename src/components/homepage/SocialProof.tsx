"use client";

import { motion } from "framer-motion";
import { Star, Quote, ArrowRight } from "lucide-react";
import Image from "next/image";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "AI Researcher",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&fit=crop&crop=face",
    content:
      "This platform revolutionized how I share my research prompts. The visual format makes complex AI concepts accessible to everyone.",
    rating: 5,
    cards: 47,
    likes: 1200,
  },
  {
    name: "Marcus Rodriguez",
    role: "Creative Director",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face",
    content:
      "The trading card format sparked creativity I didn't know I had. My prompts now have personality and style.",
    rating: 5,
    cards: 23,
    likes: 856,
  },
  {
    name: "Alex Thompson",
    role: "Software Engineer",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face",
    content:
      "Perfect for documenting and sharing coding prompts. The community feedback helps me improve continuously.",
    rating: 5,
    cards: 34,
    likes: 945,
  },
];

const creatorShowcase = [
  {
    name: "Emma Wilson",
    specialty: "Creative Writing",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face",
    gradient: "from-pink-400 to-rose-500",
    cards: 89,
    followers: "2.1K",
  },
  {
    name: "David Kim",
    specialty: "Code Architecture",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face",
    gradient: "from-blue-400 to-cyan-500",
    cards: 156,
    followers: "3.8K",
  },
  {
    name: "Lisa Garcia",
    specialty: "Data Analysis",
    avatar:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=80&h=80&fit=crop&crop=face",
    gradient: "from-emerald-400 to-teal-500",
    cards: 67,
    followers: "1.9K",
  },
];

const stats = [
  { label: "Prompts Created", value: "47,283", suffix: "+" },
  { label: "Active Creators", value: "12,847", suffix: "+" },
  { label: "Community Likes", value: "892,156", suffix: "+" },
  { label: "Countries", value: "89", suffix: "" },
];

export function SocialProof() {
  return (
    <section className="bg-gradient-to-br from-slate-50 to-blue-50 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl">
            Loved by{" "}
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Creators
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
            Join thousands of creators who are transforming how they share AI
            prompts
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-16 grid grid-cols-2 gap-8 md:grid-cols-4"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="mb-2 text-3xl font-bold text-gray-900 md:text-4xl">
                {stat.value}
                <span className="text-purple-600">{stat.suffix}</span>
              </div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid items-start gap-16 lg:grid-cols-2">
          {/* Testimonials */}
          <div className="space-y-8">
            <motion.h3
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-2 text-2xl font-bold text-gray-900"
            >
              <Quote className="h-6 w-6 text-purple-600" />
              What Creators Say
            </motion.h3>

            <div className="space-y-6">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="flex items-start gap-4">
                    <Image
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      width={48}
                      height={48}
                      className="rounded-full"
                    />
                    <div className="flex-1">
                      <div className="mb-2 flex items-center gap-2">
                        <div className="flex">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star
                              key={i}
                              className="h-4 w-4 fill-yellow-400 text-yellow-400"
                            />
                          ))}
                        </div>
                      </div>
                      <p className="mb-3 text-gray-700">
                        &ldquo;{testimonial.content}&rdquo;
                      </p>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-gray-900">
                            {testimonial.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {testimonial.role}
                          </div>
                        </div>
                        <div className="text-right text-sm text-gray-500">
                          <div>{testimonial.cards} cards</div>
                          <div>{testimonial.likes} likes</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Top Creators */}
          <div className="space-y-8">
            <motion.h3
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-2 text-2xl font-bold text-gray-900"
            >
              Featured Creators
              <ArrowRight className="h-6 w-6 text-purple-600" />
            </motion.h3>

            <div className="space-y-4">
              {creatorShowcase.map((creator, index) => (
                <motion.div
                  key={creator.name}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group cursor-pointer"
                >
                  <div
                    className={`relative bg-gradient-to-r ${creator.gradient} overflow-hidden rounded-xl p-6 text-white transition-transform hover:scale-105`}
                  >
                    {/* Background decoration */}
                    <div className="absolute inset-0 bg-black/10" />
                    <div className="absolute top-4 right-4 opacity-20">
                      <div className="h-20 w-16 rotate-12 transform rounded-lg bg-white/20" />
                    </div>

                    <div className="relative z-10 flex items-center gap-4">
                      <Image
                        src={creator.avatar}
                        alt={creator.name}
                        width={64}
                        height={64}
                        className="rounded-full border-2 border-white/50"
                      />
                      <div className="flex-1">
                        <h4 className="text-lg font-bold">{creator.name}</h4>
                        <p className="mb-2 text-sm text-white/80">
                          {creator.specialty}
                        </p>
                        <div className="flex gap-4 text-sm">
                          <span>{creator.cards} cards</span>
                          <span>{creator.followers} followers</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Join CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-center text-white"
            >
              <h4 className="mb-2 text-lg font-bold">Join the Community</h4>
              <p className="mb-4 text-sm text-white/80">
                Start creating and sharing your unique AI prompts today
              </p>
              <button className="rounded-lg bg-white px-6 py-2 font-semibold text-purple-600 transition-colors hover:bg-gray-100">
                Get Started Free
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
