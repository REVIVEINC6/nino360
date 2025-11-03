"use client"

import { motion } from "framer-motion"
import { Brain, Cpu, TrendingUp, Zap, Shield } from "lucide-react"

const pillars = [
  {
    icon: Brain,
    title: "Generative AI",
    description: "Prompt-to-action, auto content, NL commands",
    color: "#4F46E5",
  },
  {
    icon: Cpu,
    title: "Intelligent AI",
    description: "Policy-aware reasoning, contextual memory, multi-agent planning",
    color: "#8B5CF6",
  },
  {
    icon: TrendingUp,
    title: "Machine Learning",
    description: "Predictive scoring, churn forecasts, timesheet anomaly detection",
    color: "#A855F7",
  },
  {
    icon: Zap,
    title: "Automation",
    description: "RPA flows, webhooks, human-in-loop approvals",
    color: "#D0FF00",
  },
  {
    icon: Shield,
    title: "Blockchain Trust",
    description: "Hash-chained audits, signed artifacts, on-chain verification",
    color: "#F81CE5",
  },
]

export function PillarsSection() {
  return (
    <section className="relative py-32 bg-linear-to-b from-black via-[#0a0015] to-black">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            The Five Pillars of{" "}
            <span className="bg-linear-to-r from-[#4F46E5] via-[#8B5CF6] to-[#A855F7] bg-clip-text text-transparent">
              Intelligence
            </span>
          </h2>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            Unified technologies powering the future of enterprise operations
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
          {pillars.map((pillar, index) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -10 }}
              className="relative group"
            >
              <div className="p-6 rounded-2xl bg-linear-to-br from-white/5 to-white/0 border border-white/10 backdrop-blur-sm hover:border-white/30 transition-all duration-300">
                <div
                  className="h-14 w-14 rounded-xl flex items-center justify-center mb-4 relative"
                  style={{
                    background: `linear-gradient(135deg, ${pillar.color}20, ${pillar.color}10)`,
                  }}
                >
                  <pillar.icon className="h-7 w-7" style={{ color: pillar.color }} />
                  <div
                    className="absolute inset-0 rounded-xl blur-xl opacity-50 group-hover:opacity-100 transition-opacity"
                    style={{ background: pillar.color }}
                  />
                </div>
                <h3 className="text-lg font-semibold mb-2">{pillar.title}</h3>
                <p className="text-sm text-white/60 leading-relaxed">{pillar.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
