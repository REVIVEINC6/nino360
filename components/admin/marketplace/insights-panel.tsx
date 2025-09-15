"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, CheckCircle, DollarSign, Star, Activity, Brain, Target } from "lucide-react"
import type { AIMarketplaceInsight } from "@/lib/types/marketplace"

interface InsightsPanelProps {
  insights: AIMarketplaceInsight[]
  loading?: boolean
}

export function InsightsPanel({ insights, loading }: InsightsPanelProps) {
  const getInsightIcon = (type: string) => {
    switch (type) {
      case "forecast":
        return <TrendingUp className="h-4 w-4" />
      case "pricing":
        return <DollarSign className="h-4 w-4" />
      case "bundling":
        return <Target className="h-4 w-4" />
      case "promotion":
        return <Star className="h-4 w-4" />
      case "lifecycle":
        return <Activity className="h-4 w-4" />
      default:
        return <Brain className="h-4 w-4" />
    }
  }

  const getInsightColor = (impact: string) => {
    switch (impact) {
      case "high":
        return "text-red-600 bg-red-50 border-red-200"
      case "medium":
        return "text-orange-600 bg-orange-50 border-orange-200"
      case "low":
        return "text-blue-600 bg-blue-50 border-blue-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return "text-green-600"
    if (confidence >= 0.6) return "text-orange-600"
    return "text-red-600"
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-purple-600" />
          AI Insights & Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {insights.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Brain className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No AI insights available yet.</p>
              <p className="text-sm">Check back later for recommendations.</p>
            </div>
          ) : (
            insights.map((insight) => (
              <div key={insight.id} className={`p-4 rounded-lg border ${getInsightColor(insight.impact)}`}>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getInsightIcon(insight.type)}
                    <h4 className="font-medium">{insight.title}</h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {insight.impact} impact
                    </Badge>
                    <Badge variant="outline" className={`text-xs ${getConfidenceColor(insight.confidence)}`}>
                      {Math.round(insight.confidence * 100)}% confidence
                    </Badge>
                  </div>
                </div>

                <p className="text-sm mb-3 opacity-90">{insight.description}</p>

                {insight.recommendation && (
                  <div className="bg-white/50 p-3 rounded border mb-3">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 mt-0.5 text-green-600" />
                      <div>
                        <p className="text-sm font-medium">Recommendation:</p>
                        <p className="text-sm">{insight.recommendation}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="text-xs opacity-75">
                    {insight.category} • {new Date(insight.createdAt).toLocaleDateString()}
                  </div>
                  {insight.actionable && (
                    <Button size="sm" variant="outline">
                      Take Action
                    </Button>
                  )}
                </div>

                {insight.confidence && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span>Confidence Score</span>
                      <span className={getConfidenceColor(insight.confidence)}>
                        {Math.round(insight.confidence * 100)}%
                      </span>
                    </div>
                    <Progress value={insight.confidence * 100} className="h-2" />
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {insights.length > 0 && (
          <div className="mt-6 pt-4 border-t">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>{insights.filter((i) => i.actionable).length} actionable insights</span>
              <Button variant="outline" size="sm">
                View All Insights
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
