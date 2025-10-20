"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, CheckCircle, TrendingUp, Star } from "lucide-react"
import { motion } from "framer-motion"
import { useMemo } from "react"

interface LeadsStatsProps {
  leads: any[]
}

export function LeadsStats({ leads }: LeadsStatsProps) {
  const stats = useMemo(() => {
    const total = leads.length
    const qualified = leads.filter((l) => l.status === "qualified").length
    const converted = leads.filter((l) => l.status === "converted").length
    const conversionRate = total > 0 ? Math.round((converted / total) * 100) : 0
    const avgScore = total > 0 ? Math.round(leads.reduce((sum, l) => sum + (l.score || 0), 0) / total) : 0

    return { total, qualified, conversionRate, avgScore }
  }, [leads])

  const statCards = [
    {
      title: "Total Leads",
      value: stats.total,
      subtitle: `${stats.qualified} qualified`,
      icon: Users,
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      title: "Qualified",
      value: stats.qualified,
      subtitle: `${Math.round((stats.qualified / stats.total) * 100)}% of total`,
      icon: CheckCircle,
      gradient: "from-green-500 to-emerald-500",
    },
    {
      title: "Conversion Rate",
      value: `${stats.conversionRate}%`,
      subtitle: "Last 30 days",
      icon: TrendingUp,
      gradient: "from-purple-500 to-pink-500",
    },
    {
      title: "Avg. AI Score",
      value: stats.avgScore,
      subtitle: "ML-powered scoring",
      icon: Star,
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
              <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.gradient}`}>
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
