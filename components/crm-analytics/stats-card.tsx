"use client"

import { Card } from "@/components/ui/card"
import { motion } from "framer-motion"
import { ArrowUp, ArrowDown, type LucideIcon, TrendingUp, DollarSign, Clock, Target } from "lucide-react"

interface StatCardProps {
  stat: {
    label: string
    value: string
    change: string
    trend: "up" | "down"
    // Accept either the LucideIcon type (direct component) or a string key
    icon: LucideIcon | string
    color: string
  }
  index: number
}

export function StatsCard({ stat, index }: StatCardProps) {
  // Map string keys (server-serialized) to actual Lucide icon components
  const iconMap: Record<string, LucideIcon> = {
    TrendingUp,
    DollarSign,
    Clock,
    Target,
  }

  const Icon = typeof stat.icon === "string" ? iconMap[stat.icon] || TrendingUp : (stat.icon as LucideIcon)
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
      <Card className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-muted-foreground">{stat.label}</p>
          <div className={`rounded-full bg-linear-to-br ${stat.color} p-2`}>
            <Icon className="h-4 w-4 text-white" />
          </div>
        </div>
        <p className="text-3xl font-bold mb-2">{stat.value}</p>
        <div className={`flex items-center gap-1 text-sm ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`}>
          {stat.trend === "up" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
          <span>{stat.change} from last quarter</span>
        </div>
      </Card>
    </motion.div>
  )
}
