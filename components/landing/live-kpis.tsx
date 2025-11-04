"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { TrendingUp, TrendingDown } from "lucide-react"

interface KPI {
  label: string
  value: number
  suffix: string
  trend: "up" | "down"
  color: string
}

const kpis: KPI[] = [
  { label: "Lead Win-Rate Forecast", value: 32, suffix: "%", trend: "up", color: "#D0FF00" },
  { label: "Bench Utilization", value: 18, suffix: "%", trend: "up", color: "#F81CE5" },
  { label: "DSO Reduction", value: 9, suffix: " days", trend: "down", color: "#8B5CF6" },
  { label: "Anomalies Resolved", value: 742, suffix: "", trend: "up", color: "#4F46E5" },
]

export function LiveKpis() {
  const [counts, setCounts] = useState(kpis.map(() => 0))

  useEffect(() => {
    const duration = 2000
    const steps = 60
    const interval = duration / steps

    let step = 0
    const timer = setInterval(() => {
      step++
      setCounts(kpis.map((kpi) => Math.floor((kpi.value * step) / steps)))

      if (step >= steps) {
        clearInterval(timer)
        setCounts(kpis.map((kpi) => kpi.value))
      }
    }, interval)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {kpis.map((kpi, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="glass-card p-6 neon-glow-hover transition-all"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="text-sm text-white/60">{kpi.label}</div>
            {kpi.trend === "up" ? (
              <TrendingUp className="h-5 w-5" style={{ color: kpi.color }} />
            ) : (
              <TrendingDown className="h-5 w-5" style={{ color: kpi.color }} />
            )}
          </div>
          <div className="text-4xl font-bold font-heading" style={{ color: kpi.color }}>
            {kpi.trend === "up" ? "↑" : "↓"} {counts[index]}
            {kpi.suffix}
          </div>
        </motion.div>
      ))}
    </div>
  )
}
