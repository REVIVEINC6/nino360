"use client"

import { AIInsightCard } from "@/components/shared/ai-insight-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, AlertTriangle, Target } from "lucide-react"

interface PipelineAIPanelProps {
  opportunities: any[]
}

export function PipelineAIPanel({ opportunities }: PipelineAIPanelProps) {
  // AI Insights
  const highProbDeals = opportunities
    .filter((o) => (o.win_probability || 0) >= 70 && o.stage !== "Closed Won")
    .sort((a, b) => (b.win_probability || 0) - (a.win_probability || 0))
    .slice(0, 3)

  const atRiskDeals = opportunities
    .filter((o) => {
      const daysToClose = o.close_date
        ? Math.ceil((new Date(o.close_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
        : 999
      return daysToClose < 7 && (o.win_probability || 0) < 50
    })
    .slice(0, 3)

  const staleDeals = opportunities
    .filter((o) => {
      const daysSinceUpdate = o.updated_at
        ? Math.ceil((Date.now() - new Date(o.updated_at).getTime()) / (1000 * 60 * 60 * 24))
        : 0
      return daysSinceUpdate > 14 && o.stage !== "Closed Won" && o.stage !== "Closed Lost"
    })
    .slice(0, 3)

  return (
    <div className="space-y-4">
      <Card className="glass-panel">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">AI Insights</CardTitle>
            <Badge className="ai-glow">Live</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <AIInsightCard
            title="High Probability Deals"
            description={`${highProbDeals.length} deals likely to close soon`}
            confidence={85}
            type="success"
          >
            <div className="mt-3 space-y-2">
              {highProbDeals.map((deal) => (
                <div key={deal.id} className="flex items-center justify-between text-sm">
                  <span className="line-clamp-1 flex-1">{deal.name}</span>
                  <Badge variant="outline" className="ml-2 text-xs">
                    {deal.win_probability}%
                  </Badge>
                </div>
              ))}
            </div>
          </AIInsightCard>

          <AIInsightCard
            title="At-Risk Opportunities"
            description={`${atRiskDeals.length} deals need immediate attention`}
            confidence={78}
            type="warning"
          >
            <div className="mt-3 space-y-2">
              {atRiskDeals.map((deal) => (
                <div key={deal.id} className="flex items-center justify-between text-sm">
                  <span className="line-clamp-1 flex-1">{deal.name}</span>
                  <Badge variant="destructive" className="ml-2 text-xs">
                    {deal.close_date
                      ? `${Math.ceil((new Date(deal.close_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24))}d`
                      : "No date"}
                  </Badge>
                </div>
              ))}
            </div>
          </AIInsightCard>

          <AIInsightCard
            title="Stale Opportunities"
            description={`${staleDeals.length} deals haven't been updated recently`}
            confidence={72}
            type="info"
          >
            <div className="mt-3 space-y-2">
              {staleDeals.map((deal) => (
                <div key={deal.id} className="flex items-center justify-between text-sm">
                  <span className="line-clamp-1 flex-1">{deal.name}</span>
                  <Badge variant="outline" className="ml-2 text-xs">
                    {deal.updated_at
                      ? `${Math.ceil((Date.now() - new Date(deal.updated_at).getTime()) / (1000 * 60 * 60 * 24))}d ago`
                      : "Never"}
                  </Badge>
                </div>
              ))}
            </div>
          </AIInsightCard>
        </CardContent>
      </Card>
    </div>
  )
}
