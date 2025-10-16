"use client"

import { motion } from "framer-motion"
import { Zap, ArrowRight } from "lucide-react"

export function AutomationOrchestrator() {
  return (
    <section className="relative py-32 bg-gradient-to-b from-black via-[#0a0015] to-black overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#D0FF00]/10 border border-[#D0FF00]/30">
              <Zap className="h-4 w-4 text-[#D0FF00]" />
              <span className="text-sm font-medium text-[#D0FF00]">Flow Engine & RPA</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold">
              Automation{" "}
              <span className="bg-gradient-to-r from-[#4F46E5] via-[#8B5CF6] to-[#A855F7] bg-clip-text text-transparent">
                Orchestrator
              </span>
            </h2>

            <p className="text-xl text-white/70 leading-relaxed">
              Compose low-code workflows with triggers, conditions, and approvals. Reliable retries and human
              checkpoints ensure continuity.
            </p>

            <div className="space-y-4">
              {[
                "Visual workflow builder with drag-and-drop",
                "100+ pre-built automation templates",
                "Human-in-the-loop approval gates",
                "Automatic retry with exponential backoff",
                "Real-time execution monitoring",
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="h-6 w-6 rounded-full bg-[#D0FF00]/20 flex items-center justify-center">
                    <ArrowRight className="h-4 w-4 text-[#D0FF00]" />
                  </div>
                  <span className="text-white/80">{feature}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative h-[500px]"
          >
            <svg className="w-full h-full" viewBox="0 0 400 500">
              {/* Animated workflow nodes */}
              <motion.circle
                cx="200"
                cy="50"
                r="30"
                fill="url(#gradient1)"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 0.5 }}
              />
              <motion.circle
                cx="100"
                cy="150"
                r="30"
                fill="url(#gradient2)"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              />
              <motion.circle
                cx="300"
                cy="150"
                r="30"
                fill="url(#gradient3)"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              />
              <motion.circle
                cx="200"
                cy="250"
                r="30"
                fill="url(#gradient4)"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              />
              <motion.circle
                cx="200"
                cy="350"
                r="30"
                fill="url(#gradient5)"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              />

              {/* Animated connections */}
              <motion.path
                d="M 200 80 L 100 120"
                stroke="#8B5CF6"
                strokeWidth="2"
                fill="none"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              />
              <motion.path
                d="M 200 80 L 300 120"
                stroke="#8B5CF6"
                strokeWidth="2"
                fill="none"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              />
              <motion.path
                d="M 100 180 L 200 220"
                stroke="#8B5CF6"
                strokeWidth="2"
                fill="none"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              />
              <motion.path
                d="M 300 180 L 200 220"
                stroke="#8B5CF6"
                strokeWidth="2"
                fill="none"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              />
              <motion.path
                d="M 200 280 L 200 320"
                stroke="#8B5CF6"
                strokeWidth="2"
                fill="none"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                transition={{ duration: 0.5, delay: 0.7 }}
              />

              {/* Gradients */}
              <defs>
                <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#4F46E5" />
                  <stop offset="100%" stopColor="#8B5CF6" />
                </linearGradient>
                <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#8B5CF6" />
                  <stop offset="100%" stopColor="#A855F7" />
                </linearGradient>
                <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#A855F7" />
                  <stop offset="100%" stopColor="#D0FF00" />
                </linearGradient>
                <linearGradient id="gradient4" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#D0FF00" />
                  <stop offset="100%" stopColor="#F81CE5" />
                </linearGradient>
                <linearGradient id="gradient5" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#F81CE5" />
                  <stop offset="100%" stopColor="#4F46E5" />
                </linearGradient>
              </defs>
            </svg>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
