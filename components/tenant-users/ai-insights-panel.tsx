"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Sparkles, TrendingUp, AlertTriangle, Users, RefreshCw } from "lucide-react"
import { motion } from "framer-motion"
import { toast } from "sonner"

interface AiInsightsPanelProps {
  tenantId: string
}

export function AiInsightsPanel({ tenantId }: AiInsightsPanelProps) {
  const [loading, setLoading] = useState(false)
  const [insights, setInsights] = useState({
    recommendations: [
      "Consider enabling MFA for all administrators",
      "3 users haven't logged in for 30+ days - review access",
      "User growth trending up 23% this month",
    ],
    anomalies: [],
    trends: {
      growth: "+23%",
      activeRate: "87%",
      avgSessionTime: "2.4h",
    },
  })

  const refreshInsights = async () => {
    setLoading(true)
    // Simulate AI analysis
    await new Promise((resolve) => setTimeout(resolve, 2000))
    toast.success("AI insights refreshed")
    setLoading(false)
  }

  return (
    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="p-6 backdrop-blur-xl bg-gradient-to-br from-[#4F46E5]/10 via-[#8B5CF6]/10 to-[#A855F7]/10 border-[#8B5CF6]/30">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-[#D0FF00]" />
            <h3 className="font-semibold">AI-Powered Insights</h3>
            <Badge variant="secondary" className="text-xs">
              Beta
            </Badge>
          </div>
          <Button variant="ghost" size="sm" onClick={refreshInsights} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>

        <div className="space-y-4">
          {/* Recommendations */}
          <div>
            <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-400" />
              Smart Recommendations
            </h4>
            <div className="space-y-2">
              {insights.recommendations.map((rec, i) => (
                <div key={i} className="text-sm text-muted-foreground flex items-start gap-2 p-2 rounded-lg bg-white/5">
                  <span className="text-[#D0FF00]">•</span>
                  <span>{rec}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Trends */}
          <div>
            <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-400" />
              Key Metrics
            </h4>
            <div className="grid grid-cols-3 gap-2">
              <div className="p-2 rounded-lg bg-white/5 text-center">
                <p className="text-xs text-muted-foreground">Growth</p>
                <p className="text-lg font-bold text-green-400">{insights.trends.growth}</p>
              </div>
              <div className="p-2 rounded-lg bg-white/5 text-center">
                <p className="text-xs text-muted-foreground">Active Rate</p>
                <p className="text-lg font-bold text-blue-400">{insights.trends.activeRate}</p>
              </div>
              <div className="p-2 rounded-lg bg-white/5 text-center">
                <p className="text-xs text-muted-foreground">Avg Session</p>
                <p className="text-lg font-bold text-purple-400">{insights.trends.avgSessionTime}</p>
              </div>
            </div>
          </div>

          {/* Anomalies */}
          {insights.anomalies.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-yellow-400" />
                Detected Anomalies
              </h4>
              <div className="space-y-2">
                {insights.anomalies.map((anomaly: string, i) => (
                  <div
                    key={i}
                    className="text-sm text-yellow-400 flex items-start gap-2 p-2 rounded-lg bg-yellow-500/10"
                  >
                    <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                    <span>{anomaly}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  )
}
