"use client"

import { useState, useEffect } from "react"
import { Brain, TrendingUp, AlertTriangle, Lightbulb, Target } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface Insight {
  id: string
  type: "opportunity" | "risk" | "trend" | "recommendation"
  title: string
  description: string
  impact: "high" | "medium" | "low"
  confidence: number
  actionable: boolean
  metadata?: Record<string, any>
}

interface AIPoweredInsightsProps {
  kpis: any
  pipeline: any
}

export function AIPoweredInsights({ kpis, pipeline }: AIPoweredInsightsProps) {
  const [insights, setInsights] = useState<Insight[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const analyzeData = async () => {
      setLoading(true)

      try {
        const res = await fetch("/api/crm/dashboard/insights", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ kpis, pipeline }),
        })

        if (res.ok) {
          const result = await res.json()
          if (result.success && result.insights.length > 0) {
            setInsights(result.insights)
          } else {
            // Fallback insights if AI fails
            setInsights(getFallbackInsights(kpis, pipeline))
          }
        } else {
          setInsights(getFallbackInsights(kpis, pipeline))
        }
      } catch (error) {
        console.error("[v0] Failed to fetch AI insights:", error)
        setInsights(getFallbackInsights(kpis, pipeline))
      }

      setLoading(false)
    }

    analyzeData()
  }, [kpis, pipeline])

  const getFallbackInsights = (kpis: any, pipeline: any): Insight[] => {
    const insights: Insight[] = []

    // Analyze pipeline growth
    if (kpis.deltas.pipeline > 10) {
      insights.push({
        id: "1",
        type: "trend",
        title: "Strong Pipeline Growth",
        description: `Your pipeline has grown ${kpis.deltas.pipeline.toFixed(1)}% compared to the previous period. This momentum indicates healthy lead generation.`,
        impact: "high",
        confidence: 95,
        actionable: false,
      })
    } else if (kpis.deltas.pipeline < -10) {
      insights.push({
        id: "1",
        type: "risk",
        title: "Pipeline Decline Alert",
        description: `Your pipeline has decreased ${Math.abs(kpis.deltas.pipeline).toFixed(1)}%. Consider increasing prospecting activities.`,
        impact: "high",
        confidence: 92,
        actionable: true,
      })
    }

    // Analyze win rate
    if (kpis.winRate > 30) {
      insights.push({
        id: "2",
        type: "opportunity",
        title: "Excellent Win Rate Performance",
        description: `Your ${kpis.winRate.toFixed(1)}% win rate is above industry average. Document winning strategies for replication.`,
        impact: "high",
        confidence: 88,
        actionable: true,
      })
    } else if (kpis.winRate < 15) {
      insights.push({
        id: "2",
        type: "recommendation",
        title: "Win Rate Optimization Needed",
        description: `Current win rate of ${kpis.winRate.toFixed(1)}% suggests qualification improvements needed. Review deal criteria.`,
        impact: "high",
        confidence: 85,
        actionable: true,
      })
    }

    // Analyze sales cycle
    if (kpis.avgCycleDays > 60) {
      insights.push({
        id: "3",
        type: "recommendation",
        title: "Reduce Sales Cycle Time",
        description: `Average cycle of ${kpis.avgCycleDays} days is lengthy. Consider implementing faster qualification and follow-up processes.`,
        impact: "medium",
        confidence: 82,
        actionable: true,
      })
    }

    // Analyze pipeline aging
    const staleDealsBucket = pipeline?.aging?.find((a: any) => a.bucket === "30+")
    if (staleDealsBucket && staleDealsBucket.count > 5) {
      insights.push({
        id: "4",
        type: "risk",
        title: "Stale Deals Need Attention",
        description: `${staleDealsBucket.count} deals haven't been updated in 30+ days. Prioritize follow-ups to prevent deal loss.`,
        impact: "high",
        confidence: 90,
        actionable: true,
      })
    }

    return insights.slice(0, 4) // Return max 4 insights
  }

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "opportunity":
        return Target
      case "risk":
        return AlertTriangle
      case "trend":
        return TrendingUp
      case "recommendation":
        return Lightbulb
      default:
        return Brain
    }
  }

  const getInsightColor = (type: string) => {
    switch (type) {
      case "opportunity":
        return "text-emerald-600 bg-emerald-100"
      case "risk":
        return "text-red-600 bg-red-100"
      case "trend":
        return "text-blue-600 bg-blue-100"
      case "recommendation":
        return "text-purple-600 bg-purple-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <Card className="bg-white/70 backdrop-blur-xl border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-600 animate-pulse" />
            AI-Powered Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-full mb-1" />
                <div className="h-3 bg-gray-200 rounded w-2/3" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-white/70 backdrop-blur-xl border-white/20">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-600" />
            AI-Powered Insights
          </div>
          <Badge variant="secondary" className="bg-purple-100 text-purple-700">
            {insights.length} insights
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {insights.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            No insights available. Add more data to generate AI-powered recommendations.
          </p>
        ) : (
          insights.map((insight) => {
            const Icon = getInsightIcon(insight.type)
            const iconColor = getInsightColor(insight.type)
            const impactColor = getImpactColor(insight.impact)

            return (
              <div
                key={insight.id}
                className="flex items-start gap-3 p-3 rounded-lg bg-white/50 border border-white/30 hover:bg-white/70 transition-colors"
              >
                <div className={`p-2 rounded-lg ${iconColor}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-gray-900 text-sm">{insight.title}</h4>
                    <Badge variant="secondary" className={`text-xs ${impactColor}`}>
                      {insight.impact}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{insight.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">{insight.confidence}% confidence</span>
                      {insight.actionable && (
                        <Badge variant="outline" className="text-xs">
                          Actionable
                        </Badge>
                      )}
                    </div>
                    {insight.actionable && (
                      <Button size="sm" variant="outline" className="text-xs h-7 bg-transparent">
                        Take Action
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )
          })
        )}
      </CardContent>
    </Card>
  )
}
