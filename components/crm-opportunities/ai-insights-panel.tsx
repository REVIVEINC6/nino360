"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, TrendingUp, AlertTriangle, Target } from "lucide-react"
import { motion } from "framer-motion"
import { AIInsightCard } from "@/components/shared/ai-insight-card"

interface AIInsightsPanelProps {
  opportunities: any[]
}

export function AIInsightsPanel({ opportunities }: AIInsightsPanelProps) {
  // Calculate AI insights
  const highProbability = opportunities.filter((o) => (o.win_probability || 0) > 70)
  const atRisk = opportunities.filter((o) => {
    const daysToClose = o.close_date
      ? Math.floor((new Date(o.close_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
      : 999
    return daysToClose < 7 && (o.win_probability || 0) < 50
  })
  const needsAttention = opportunities.filter((o) => {
    const daysSinceUpdate = o.updated_at
      ? Math.floor((Date.now() - new Date(o.updated_at).getTime()) / (1000 * 60 * 60 * 24))
      : 0
    return daysSinceUpdate > 7
  })

  return (
    <div className="space-y-4">
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
        <Card className="glass-card border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-500" />
              AI Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <AIInsightCard
              title="High Win Probability"
              description={`${highProbability.length} opportunities with >70% win rate`}
              confidence={92}
              type="success"
              icon={TrendingUp}
            />

            <AIInsightCard
              title="At Risk"
              description={`${atRisk.length} deals closing soon with low probability`}
              confidence={85}
              type="warning"
              icon={AlertTriangle}
            />

            <AIInsightCard
              title="Needs Attention"
              description={`${needsAttention.length} opportunities not updated in 7+ days`}
              confidence={78}
              type="info"
              icon={Target}
            />
          </CardContent>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
        <Card className="glass-card border-white/20">
          <CardHeader>
            <CardTitle className="text-sm">Recommended Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
              <p className="text-sm font-medium text-blue-900">Follow up on Enterprise License Renewal</p>
              <p className="text-xs text-blue-700 mt-1">High value deal closing in 3 days</p>
            </div>
            <div className="p-3 rounded-lg bg-orange-50 border border-orange-200">
              <p className="text-sm font-medium text-orange-900">Update Cloud Migration Project</p>
              <p className="text-xs text-orange-700 mt-1">No activity in 10 days</p>
            </div>
            <div className="p-3 rounded-lg bg-green-50 border border-green-200">
              <p className="text-sm font-medium text-green-900">Schedule demo for Consulting Services</p>
              <p className="text-xs text-green-700 mt-1">AI suggests moving to next stage</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
