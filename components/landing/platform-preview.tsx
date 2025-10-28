"use client"

import { motion } from "framer-motion"

const mockups = [
  { title: "CRM Dashboard", module: "Customer Intelligence", color: "#4F46E5" },
  { title: "HRMS Portal", module: "People Operations", color: "#8B5CF6" },
  { title: "Finance Hub", module: "Financial Intelligence", color: "#A855F7" },
]

export function PlatformPreview() {
  return (
    <section className="relative py-32 bg-gradient-to-b from-black via-[#0a0015] to-black">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Live Platform{" "}
            <span className="bg-gradient-to-r from-[#4F46E5] via-[#8B5CF6] to-[#A855F7] bg-clip-text text-transparent">
              Preview
            </span>
          </h2>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            Glassmorphic interfaces with AI-powered insights at every layer
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {mockups.map((mockup, index) => (
            <motion.div
              key={mockup.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -10, rotateY: 5 }}
              className="group relative"
            >
              <div className="p-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 backdrop-blur-sm overflow-hidden">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-1">{mockup.title}</h3>
                  <p className="text-sm" style={{ color: mockup.color }}>
                    {mockup.module}
                  </p>
                </div>

                <div className="aspect-video rounded-lg bg-gradient-to-br from-white/5 to-white/0 border border-white/10 flex items-center justify-center relative overflow-hidden">
                  <div
                    className="absolute inset-0 bg-gradient-to-br opacity-20"
                    style={{
                      background: `linear-gradient(135deg, ${mockup.color}40, ${mockup.color}10)`,
                    }}
                  />
                  <div className="relative z-10 text-center">
                    <div
                      className="h-12 w-12 rounded-full mx-auto mb-3"
                      style={{
                        background: `linear-gradient(135deg, ${mockup.color}60, ${mockup.color}30)`,
                      }}
                    />
                    <p className="text-sm text-white/60">Dashboard Preview</p>
                  </div>
                </div>

                <div className="mt-4 p-3 rounded-lg bg-black/30 border border-white/10">
                  <p className="text-xs text-white/70">
                    💡 AI Insight:{" "}
                    {index === 0
                      ? "3 high-value leads detected"
                      : index === 1
                        ? "2 performance reviews due"
                        : "Invoice forecast: $124K"}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-16 flex flex-wrap items-center justify-center gap-8 text-center"
        >
          {[
            { value: "24K+", label: "Automations" },
            { value: "180K", label: "Events/day" },
            { value: "520K", label: "Blockchain Proofs" },
          ].map((stat, i) => (
            <div key={i} className="space-y-1">
              <div className="text-3xl font-bold bg-gradient-to-r from-[#4F46E5] via-[#8B5CF6] to-[#A855F7] bg-clip-text text-transparent">
                {stat.value}
              </div>
              <div className="text-sm text-white/60">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
