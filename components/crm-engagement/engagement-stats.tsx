"use client"

import { Card } from "@/components/ui/card"
import { Mail, Eye, MousePointer, MessageSquare } from "lucide-react"
import { motion } from "framer-motion"

interface EngagementStatsProps {
  analytics: {
    totalSent: number
    totalOpened: number
    totalClicked: number
    totalReplied: number
    openRate: number
    clickRate: number
    replyRate: number
  }
}

export function EngagementStats({ analytics }: EngagementStatsProps) {
  const stats = [
    {
      label: "Total Sent",
      value: analytics.totalSent.toLocaleString(),
      icon: Mail,
      color: "text-blue-500",
    },
    {
      label: "Open Rate",
      value: `${analytics.openRate.toFixed(1)}%`,
      icon: Eye,
      color: "text-purple-500",
    },
    {
      label: "Click Rate",
      value: `${analytics.clickRate.toFixed(1)}%`,
      icon: MousePointer,
      color: "text-pink-500",
    },
    {
      label: "Reply Rate",
      value: `${analytics.replyRate.toFixed(1)}%`,
      icon: MessageSquare,
      color: "text-green-500",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-4">
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
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
              </div>
              <stat.icon className={`h-8 w-8 ${stat.color}`} />
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
