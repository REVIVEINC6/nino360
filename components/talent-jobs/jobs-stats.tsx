"use client"

import { motion } from "framer-motion"
import { Briefcase, TrendingUp, Target, Brain } from "lucide-react"

interface JobsStatsProps {
  stats: {
    total: number
    open: number
    totalOpenings: number
    avgAiScore: number
    avgFillProb: number
  } | null
}

export function JobsStats({ stats }: JobsStatsProps) {
  if (!stats) return null

  const statCards = [
    {
      label: "Total Requisitions",
      value: stats.total,
      icon: Briefcase,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      label: "Open Positions",
      value: stats.open,
      icon: Target,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
    },
    {
      label: "Total Openings",
      value: stats.totalOpenings,
      icon: TrendingUp,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      label: "Avg AI Score",
      value: `${(stats.avgAiScore * 100).toFixed(0)}%`,
      icon: Brain,
      color: "from-indigo-500 to-indigo-600",
      bgColor: "bg-indigo-50",
      confidence: stats.avgAiScore,
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="glass-card group relative overflow-hidden p-6 hover:shadow-lg"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{stat.label}</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">{stat.value}</p>
              {stat.confidence && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="h-1.5 w-24 overflow-hidden rounded-full bg-gray-200">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${stat.confidence * 100}%` }}
                      transition={{ delay: 0.5, duration: 0.8 }}
                      className={`h-full bg-linear-to-r ${stat.color}`}
                    />
                  </div>
                  <span className="text-xs text-gray-500">ML Confidence</span>
                </div>
              )}
            </div>
            <div className={`rounded-lg ${stat.bgColor} p-3`}>
              <stat.icon className={`h-6 w-6 bg-linear-to-br ${stat.color} bg-clip-text text-transparent`} />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
