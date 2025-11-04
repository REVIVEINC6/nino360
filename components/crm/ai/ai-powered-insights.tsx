"use client"

import { useState, useEffect } from "react"
import { Brain, TrendingUp, AlertTriangle, Lightbulb, Target, Users, DollarSign } from "lucide-react"
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
    // Simulate AI analysis
    const analyzeData = async () => {
      setLoading(true)
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const generatedInsights: Insight[] = [
        {
          id: "1",
          type: "opportunity",
          title: "High-Value Lead Opportunity",
          description: "3 enterprise leads in your pipeline show strong buying signals. Prioritize follow-up calls within 24 hours.",
          impact: "high",
          confidence: 87,
          actionable: true,
          metadata: { leads: ["TechCorp", "DataFlow Inc", "SystemX"] }
        },
        {
          id: "2",
          type: "risk",
          title: "Deal Velocity Decline",
          description: "Average deal closure time has increased by 15% this quarter. Consider pipeline optimization.",
          impact: "medium",
          confidence: 92,
          actionable: true,
          metadata: { metric: "deal_velocity", change: -15 }
        },
        {
          id: "3",
          type: "trend",
          title: "Q4 Revenue Acceleration",
          description: "Current trajectory suggests 23% higher Q4 revenue vs Q3. Maintain momentum with current strategies.",
          impact: "high",
          confidence: 79,
          actionable: false,
          metadata: { projection: 1.23, quarter: "Q4" }
        },
        {
          id: "4",
          type: "recommendation",
          title: "Optimize Demo-to-Close Rate",
          description: "Schedule follow-up demos within 3 days to improve conversion by estimated 18%.",
          impact: "medium",
          confidence: 84,
          actionable: true,
          metadata: { improvement: 18, timeframe: "3 days" }
        }
      ]
      
      setInsights(generatedInsights)
      setLoading(false)
    }
    
    analyzeData()
  }, [kpis, pipeline])

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
            <Brain className="w-5 h-5 text-purple-600" />
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
        {insights.map((insight) => {
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
                    <span className="text-xs text-gray-500">
                      {insight.confidence}% confidence
                    </span>
                    {insight.actionable && (
                      <Badge variant="outline" className="text-xs">
                        Actionable
                      </Badge>
                    )}
                  </div>
                  {insight.actionable && (
                    <Button size="sm" variant="outline" className="text-xs h-7">
                      Take Action
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
