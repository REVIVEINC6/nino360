"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Brain, Sparkles, TrendingUp, AlertCircle } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface AIInsightCardProps {
  title: string
  insight?: string
  confidence?: number
  // allow some extra legacy values callers use ('success','warning','info')
  type: "prediction" | "recommendation" | "anomaly" | "insight" | "success" | "warning" | "info"
  action?: {
    label: string
    onClick: () => void
  }
  className?: string
  children?: React.ReactNode
  // optional display props commonly passed by callers
  icon?: any
  iconColor?: string
  description?: string
}

export function AIInsightCard({ title, insight = "", confidence = 0, type, action, className }: AIInsightCardProps) {
  const icons = {
    prediction: TrendingUp,
    recommendation: Sparkles,
    anomaly: AlertCircle,
    insight: Brain,
    // legacy mappings
    success: TrendingUp,
    warning: AlertCircle,
    info: Sparkles,
  }

  const colors = {
    prediction: "from-blue-500 to-cyan-500",
    recommendation: "from-purple-500 to-pink-500",
    anomaly: "from-orange-500 to-red-500",
    insight: "from-indigo-500 to-purple-500",
    // legacy mappings
    success: "from-green-400 to-emerald-500",
    warning: "from-amber-400 to-orange-500",
    info: "from-sky-400 to-blue-500",
  }

  const Icon = icons[type]

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Card
        className={cn(
          "relative overflow-hidden backdrop-blur-xl bg-white/80 border border-slate-200/50 shadow-lg hover:shadow-xl transition-all duration-300",
          className,
        )}
      >
        <div className={cn("absolute top-0 left-0 right-0 h-1 bg-gradient-to-r", colors[type])} />
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={cn("p-2 rounded-lg bg-gradient-to-br", colors[type])}>
                <Icon className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">{title}</h3>
                <Badge variant="secondary" className="mt-1">
                  {confidence}% confidence
                </Badge>
              </div>
            </div>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed mb-4">{insight}</p>
          {action && (
            <button
              onClick={action.onClick}
              className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              {action.label} →
            </button>
          )}
        </div>
      </Card>
    </motion.div>
  )
}
