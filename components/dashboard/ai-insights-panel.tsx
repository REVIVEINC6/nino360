"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Brain, TrendingUp, AlertTriangle, Lightbulb, RefreshCw, Sparkles } from "lucide-react"
import type { KPIs, WeeklyDigest } from "@/app/(dashboard)/dashboard/actions"
import { cn } from "@/lib/utils"

interface AiInsightsPanelProps {
  kpis: KPIs
  digest: WeeklyDigest
}

export function AiInsightsPanel({ kpis, digest }: AiInsightsPanelProps) {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [insights, setInsights] = useState([
    {
      type: "prediction",
      title: "Revenue Forecast",
      message: "Based on current pipeline velocity, expect 15% revenue increase next quarter",
      confidence: 87,
      icon: TrendingUp,
      color: "text-green-500",
    },
    {
      type: "risk",
      title: "Cash Flow Alert",
      message: `${kpis.finance?.overdueInvoices || 0} overdue invoices detected. Recommend immediate follow-up to maintain runway`,
      confidence: 92,
      icon: AlertTriangle,
      color: "text-yellow-500",
    },
    {
      type: "recommendation",
      title: "Bench Optimization",
      message: `${kpis.bench?.onBench || 0} consultants on bench. AI suggests targeting 3 high-probability opportunities`,
      confidence: 78,
      icon: Lightbulb,
      color: "text-blue-500",
    },
  ])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    // Simulate AI processing
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsRefreshing(false)
  }

  return (
    <Card className="glass-panel border-primary/20 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-transparent">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            <span className="bg-gradient-to-r from-primary to-pink-500 bg-clip-text text-transparent">
              AI-Powered Insights
            </span>
            <Badge variant="secondary" className="gap-1">
              <Sparkles className="h-3 w-3" />
              Live
            </Badge>
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="gap-2 border-primary/20 bg-transparent"
          >
            <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid gap-4 md:grid-cols-3">
          {insights.map((insight, index) => (
            <motion.div
              key={insight.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 rounded-lg bg-background/50 border border-primary/10 hover:border-primary/30 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className={cn("p-2 rounded-lg bg-background", insight.color)}>
                  <insight.icon className="h-4 w-4" />
                </div>
                <div className="flex-1 space-y-2">
                  <h4 className="text-sm font-semibold">{insight.title}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">{insight.message}</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-background rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${insight.confidence}%` }}
                        transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
                        className="h-full bg-gradient-to-r from-primary to-pink-500"
                      />
                    </div>
                    <span className="text-xs font-medium text-primary">{insight.confidence}%</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
