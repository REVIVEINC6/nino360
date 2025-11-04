import { TrendingUp, DollarSign, Clock, Target } from "lucide-react"
import { StatsCard } from "./stats-card"

interface AnalyticsStatsProps {
  opportunities: any[]
}

export function AnalyticsStats({ opportunities }: AnalyticsStatsProps) {
  const closedWon = opportunities.filter((o) => o.stage === "Closed Won")
  const closedLost = opportunities.filter((o) => o.stage === "Closed Lost")
  const winRate = closedWon.length / (closedWon.length + closedLost.length) || 0
  const avgDealSize =
    closedWon.length > 0 ? closedWon.reduce((sum, o) => sum + (o.amount || 0), 0) / closedWon.length : 0
  const totalPipeline = opportunities
    .filter((o) => o.stage !== "Closed Won" && o.stage !== "Closed Lost")
    .reduce((sum, o) => sum + (o.amount || 0), 0)

  // Calculate avg sales cycle (mock for now)
  const avgSalesCycle = 45

  const stats = [
    {
      label: "Win Rate",
      value: `${(winRate * 100).toFixed(1)}%`,
      change: "+5.2%",
      trend: "up" as const,
      icon: "TrendingUp",
      color: "from-green-500 to-emerald-500",
    },
    {
      label: "Avg Deal Size",
      value: `$${(avgDealSize / 1000).toFixed(0)}K`,
      change: "+12.3%",
      trend: "up" as const,
      icon: "DollarSign",
      color: "from-blue-500 to-cyan-500",
    },
    {
      label: "Sales Cycle",
      value: `${avgSalesCycle} days`,
      change: "+3 days",
      trend: "down" as const,
      icon: "Clock",
      color: "from-orange-500 to-red-500",
    },
    {
      label: "Pipeline Value",
      value: `$${(totalPipeline / 1000000).toFixed(2)}M`,
      change: "+18.7%",
      trend: "up" as const,
      icon: "Target",
      color: "from-purple-500 to-pink-500",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <StatsCard key={stat.label} stat={stat} index={index} />
      ))}
    </div>
  )
}
