"use client"

import { Card } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"
import { motion } from "framer-motion"

interface KpiCardProps {
  title: string
  value: number | string
  icon: LucideIcon
  trend?: {
    value: number
    isPositive: boolean
  }
  className?: string
}

export function KpiCard({ title, value, icon: Icon, trend, className }: KpiCardProps) {
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
            <Icon className="h-6 w-6 text-primary" />
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
