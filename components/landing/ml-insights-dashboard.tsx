"use client"

import { motion, useMotionValue, useTransform, animate } from "framer-motion"
import { useEffect, useRef } from "react"
import { TrendingUp, TrendingDown } from "lucide-react"

const metrics = [
  { label: "Lead Win-Rate Forecast", value: 32, prefix: "↑", suffix: "%", color: "#4F46E5" },
  { label: "Bench Utilization", value: 18, prefix: "↑", suffix: "%", color: "#8B5CF6" },
  { label: "DSO Reduction", value: 9, prefix: "↓", suffix: " days", color: "#A855F7" },
  { label: "Anomalies Resolved", value: 742, prefix: "", suffix: "", color: "#D0FF00" },
]

const insights = [
  "Timesheet anomaly flagged for Project ZN-11.",
  "Embedding similarity matched churn cluster.",
  "Forecast confidence +14% this quarter.",
  "New high-value lead detected in pipeline.",
  "Consultant skill gap identified: React Native.",
]

function Counter({ value, prefix, suffix }: { value: number; prefix: string; suffix: string }) {
  const count = useMotionValue(0)
  const rounded = useTransform(count, (latest) => Math.round(latest))
  const nodeRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const controls = animate(count, value, { duration: 2 })
    return controls.stop
  }, [count, value])

  useEffect(() => {
    return rounded.on("change", (latest) => {
      if (nodeRef.current) {
        nodeRef.current.textContent = `${prefix}${latest}${suffix}`
      }
    })
  }, [rounded, prefix, suffix])

  return <span ref={nodeRef} />
}

export function MLInsightsDashboard() {
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
            ML Insights{" "}
            <span className="bg-gradient-to-r from-[#4F46E5] via-[#8B5CF6] to-[#A855F7] bg-clip-text text-transparent">
              Dashboard
            </span>
          </h2>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            Real-time predictive analytics and anomaly detection
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="p-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 backdrop-blur-sm"
            >
              <div className="flex items-center gap-2 mb-2">
                {metric.prefix === "↑" ? (
                  <TrendingUp className="h-5 w-5" style={{ color: metric.color }} />
                ) : metric.prefix === "↓" ? (
                  <TrendingDown className="h-5 w-5" style={{ color: metric.color }} />
                ) : null}
                <span className="text-sm text-white/60">{metric.label}</span>
              </div>
              <div className="text-3xl font-bold" style={{ color: metric.color }}>
                <Counter value={metric.value} prefix={metric.prefix} suffix={metric.suffix} />
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="p-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 backdrop-blur-sm"
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-[#D0FF00] animate-pulse" />
            Live AI Insights
          </h3>
          <div className="space-y-3">
            {insights.map((insight, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="flex items-start gap-3 text-sm text-white/70"
              >
                <div className="h-1.5 w-1.5 rounded-full bg-[#8B5CF6] mt-1.5 flex-shrink-0" />
                {insight}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
