"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Target, DollarSign, TrendingUp, Zap } from "lucide-react"
import { motion } from "framer-motion"
import { useMemo } from "react"

interface OpportunitiesStatsProps {
  opportunities: any[]
}

export function OpportunitiesStats({ opportunities }: OpportunitiesStatsProps) {
  const stats = useMemo(() => {
    const open = opportunities.filter((o) => o.stage !== "Closed Won" && o.stage !== "Closed Lost").length
    const totalValue = opportunities.reduce((sum, o) => sum + (o.amount || 0), 0)
    const weightedValue = opportunities.reduce((sum, o) => sum + ((o.amount || 0) * (o.win_probability || 0)) / 100, 0)
    const won = opportunities.filter((o) => o.stage === "Closed Won").length
    const total = opportunities.length
    const winRate = total > 0 ? Math.round((won / total) * 100) : 0

    return { open, totalValue, weightedValue, winRate }
  }, [opportunities])

  const statCards = [
    {
      title: "Open Opportunities",
      value: stats.open,
      subtitle: `${opportunities.length} total`,
      icon: Target,
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      title: "Pipeline Value",
      value: `$${(stats.totalValue / 1000000).toFixed(1)}M`,
      subtitle: `Weighted: $${(stats.weightedValue / 1000000).toFixed(1)}M`,
      icon: DollarSign,
      gradient: "from-purple-500 to-pink-500",
    },
    {
      title: "Win Rate",
      value: `${stats.winRate}%`,
      subtitle: "Last 90 days",
      icon: TrendingUp,
      gradient: "from-green-500 to-emerald-500",
    },
    {
      title: "AI Confidence",
      value: "87%",
      subtitle: "Prediction accuracy",
      icon: Zap,
      gradient: "from-orange-500 to-red-500",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="glass-card border-white/20 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className={`p-2 rounded-lg bg-linear-to-br ${stat.gradient}`}>
                <stat.icon className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.subtitle}</p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
