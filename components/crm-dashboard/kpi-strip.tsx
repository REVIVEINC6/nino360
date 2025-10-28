"use client"

import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, TrendingDown, DollarSign, Target, Award, Clock } from "lucide-react"
import { motion } from "framer-motion"

interface KpiStripProps {
  kpis: {
    pipeline: number
    mtdRevenue: number
    winRate: number
    avgCycleDays: number
    deltas: {
      pipeline: number
      mtdRevenue: number
      winRate: number
      avgCycleDays: number
    }
  }
}

export function KpiStrip({ kpis }: KpiStripProps) {
  const cards = [
    {
      title: "Pipeline Value",
      value: `$${(kpis.pipeline / 1000).toFixed(1)}K`,
      delta: kpis.deltas.pipeline,
      icon: DollarSign,
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "MTD Revenue",
      value: `$${(kpis.mtdRevenue / 1000).toFixed(1)}K`,
      delta: kpis.deltas.mtdRevenue,
      icon: Target,
      color: "from-green-500 to-emerald-500",
    },
    {
      title: "Win Rate",
      value: `${kpis.winRate.toFixed(1)}%`,
      delta: kpis.deltas.winRate,
      icon: Award,
      color: "from-purple-500 to-pink-500",
    },
    {
      title: "Avg Cycle",
      value: `${kpis.avgCycleDays}d`,
      delta: kpis.deltas.avgCycleDays,
      icon: Clock,
      color: "from-orange-500 to-red-500",
      inverse: true, // Lower is better
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => {
        const Icon = card.icon
        const isPositive = card.inverse ? card.delta < 0 : card.delta > 0
        const TrendIcon = isPositive ? TrendingUp : TrendingDown

        return (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="glass-panel hover:scale-105 transition-transform">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-medium text-muted-foreground">{card.title}</p>
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${card.color} bg-opacity-10`}>
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold">{card.value}</p>
                  <div className="flex items-center gap-1 text-xs">
                    <TrendIcon className={`h-3 w-3 ${isPositive ? "text-green-500" : "text-red-500"}`} />
                    <span className={isPositive ? "text-green-500" : "text-red-500"}>
                      {Math.abs(card.delta).toFixed(1)}%
                    </span>
                    <span className="text-muted-foreground">vs last period</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )
      })}
    </div>
  )
}
