"use client"

import { Card } from "@/components/ui/card"
import { Calendar, CheckCircle2, Clock, AlertCircle } from "lucide-react"
import { motion } from "framer-motion"

interface CalendarStatsProps {
  analytics: {
    totalEvents: number
    completedEvents: number
    upcomingEvents: number
    totalTasks: number
    completedTasks: number
    overdueTasks: number
    highPriorityTasks: number
  }
}

export function CalendarStats({ analytics }: CalendarStatsProps) {
  const stats = [
    {
      label: "Upcoming Events",
      value: analytics.upcomingEvents,
      icon: Calendar,
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-500/10",
      textColor: "text-blue-700",
    },
    {
      label: "Completed Tasks",
      value: `${analytics.completedTasks}/${analytics.totalTasks}`,
      icon: CheckCircle2,
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-500/10",
      textColor: "text-green-700",
    },
    {
      label: "High Priority",
      value: analytics.highPriorityTasks,
      icon: AlertCircle,
      color: "from-orange-500 to-red-500",
      bgColor: "bg-orange-500/10",
      textColor: "text-orange-700",
    },
    {
      label: "Overdue Tasks",
      value: analytics.overdueTasks,
      icon: Clock,
      color: "from-red-500 to-pink-500",
      bgColor: "bg-red-500/10",
      textColor: "text-red-700",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="glass-card p-6 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                <p className="text-3xl font-bold">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.textColor}`} />
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
