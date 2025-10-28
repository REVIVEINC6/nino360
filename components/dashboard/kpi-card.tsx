"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { motion } from "framer-motion"
import { TrendingUp, TrendingDown, DollarSign, Briefcase, UserCheck, Sparkles, Brain, Zap } from "lucide-react"

type IconName =
  | "dollar-sign"
  | "briefcase"
  | "trending-up"
  | "user-check"
  | "sparkles"
  | "brain"
  | "zap"

interface KpiCardProps {
  title: string
  value: string | number
  iconName?: IconName
  href?: string
  variant?: "default" | "warning" | "danger"
  trend?: {
    value: number
    direction?: "up" | "down"
  }
  className?: string
}

function renderIcon(name?: IconName) {
  if (!name) return null
  const common = "h-4 w-4"
  switch (name) {
    case "dollar-sign":
      return <DollarSign className={`${common} text-green-600`} />
    case "briefcase":
      return <Briefcase className={`${common} text-blue-600`} />
    case "trending-up":
      return <TrendingUp className={`${common} text-orange-600`} />
    case "user-check":
      return <UserCheck className={`${common} text-purple-600`} />
    case "sparkles":
      return <Sparkles className={`${common} text-blue-500`} />
    case "brain":
      return <Brain className={`${common} text-purple-500`} />
    case "zap":
      return <Zap className={`${common} text-yellow-500`} />
    default:
      return null
  }
}

export function KpiCard({ title, value, iconName, href, variant = "default", trend, className }: KpiCardProps) {
  const variantStyles = {
    default: "border-primary/20 glass-panel",
    warning: "border-orange-500/50 bg-orange-500/5",
    danger: "border-red-500/50 bg-red-500/5",
  }

  const sparklineData = Array.from({ length: 12 }, () => Math.random() * 100)

  const content = (
    <Card className={cn("transition-all hover:shadow-lg hover:neon-glow-hover", variantStyles[variant], className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {iconName && <div className="text-primary">{renderIcon(iconName)}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>

        <div className="flex items-end gap-0.5 h-8 mt-2">
          {sparklineData.map((height, i) => (
            <div
              key={i}
              className="flex-1 bg-primary/30 rounded-sm transition-all hover:bg-primary/50"
              style={{ height: `${height}%` }}
            />
          ))}
        </div>

        {trend && (
          <div className="flex items-center gap-1 mt-2">
            {trend.direction === "up" ? (
              <TrendingUp className="h-3.5 w-3.5 text-green-500" />
            ) : (
              <TrendingDown className="h-3.5 w-3.5 text-red-500" />
            )}
            <span className={cn("text-xs font-medium", trend.direction === "up" ? "text-green-500" : "text-red-500")}>
              {trend.value > 0 ? "+" : ""}
              {trend.value}%
            </span>
            <span className="text-xs text-muted-foreground">vs last period</span>
          </div>
        )}
      </CardContent>
    </Card>
  )

  if (href) {
    return (
      <Link href={href}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.02, y: -4 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          {content}
        </motion.div>
      </Link>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {content}
    </motion.div>
  )
}
