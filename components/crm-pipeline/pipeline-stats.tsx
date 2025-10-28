"use client"

import { Card } from "@/components/ui/card"
import { DollarSign, TrendingUp, Target, Zap } from "lucide-react"
import { motion } from "framer-motion"

interface PipelineStatsProps {
  opportunities: any[]
}

export function PipelineStats({ opportunities }: PipelineStatsProps) {
  const totalValue = opportunities.reduce((sum, opp) => sum + (opp.amount || 0), 0)
  const weightedValue = opportunities.reduce(
    (sum, opp) => sum + (opp.amount || 0) * ((opp.win_probability || 0) / 100),
    0,
  )
  const avgDealSize = opportunities.length > 0 ? totalValue / opportunities.length : 0
  const conversionRate = opportunities.filter((o) => o.stage === "Closed Won").length / opportunities.length || 0

  const stats = [
    {
      label: "Total Pipeline Value",
      value: `$${(totalValue / 1000000).toFixed(2)}M`,
      icon: DollarSign,
      color: "from-blue-500 to-cyan-500",
    },
    {
      label: "Weighted Pipeline",
      value: `$${(weightedValue / 1000000).toFixed(2)}M`,
      icon: TrendingUp,
      color: "from-purple-500 to-pink-500",
    },
    {
      label: "Avg Deal Size",
      value: `$${(avgDealSize / 1000).toFixed(0)}K`,
      icon: Target,
      color: "from-orange-500 to-red-500",
    },
    {
      label: "Win Rate",
      value: `${(conversionRate * 100).toFixed(1)}%`,
      icon: Zap,
      color: "from-green-500 to-emerald-500",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="glass-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="mt-2 text-3xl font-bold">{stat.value}</p>
              </div>
              <div className={`rounded-full bg-gradient-to-br ${stat.color} p-3`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
