"use client"

import { Card } from "@/components/ui/card"
import { Users, Zap, Bot, Shield } from "lucide-react"
import { motion } from "framer-motion"

type IconName = "users" | "zap" | "bot" | "shield"

interface KpiCardProps {
  title: string
  value: number | string
  iconName?: IconName
  trend?: {
    value: number
    isPositive: boolean
  }
  className?: string
}

function renderIcon(name?: IconName) {
  if (!name) return null
  const common = "h-6 w-6 text-primary"
  switch (name) {
    case "users":
      return <Users className={common} />
    case "zap":
      return <Zap className={common} />
    case "bot":
      return <Bot className={common} />
    case "shield":
      return <Shield className={common} />
    default:
      return null
  }
}

export function KpiCard({ title, value, iconName, trend, className }: KpiCardProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Card className={`glass-card p-6 ${className}`}>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold tracking-tight">{value}</p>
            {trend && (
              <p className={`text-xs ${trend.isPositive ? "text-green-500" : "text-red-500"}`}>
                {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}% from last period
              </p>
            )}
          </div>
          <div className="rounded-lg bg-primary/10 p-3">
            {renderIcon(iconName)}
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
