"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Brain, TrendingDown, TrendingUp, AlertTriangle, Lightbulb, DollarSign, Zap } from "lucide-react"
import type { AIInsight } from "@/lib/types/modules"

interface ModuleAIInsightsProps {
  insights: AIInsight[]
}

export function ModuleAIInsights({ insights }: ModuleAIInsightsProps) {
  const getInsightIcon = (type: AIInsight["type"]) => {
    switch (type) {
      case "churn-risk":
        return <TrendingDown className="h-5 w-5 text-red-500" />
      case "upgrade-opportunity":
        return <TrendingUp className="h-5 w-5 text-green-500" />
      case "usage-optimization":
        return <Zap className="h-5 w-5 text-blue-500" />
      case "feature-request":
        return <Lightbulb className="h-5 w-5 text-yellow-500" />
      default:
        return <Brain className="h-5 w-5 text-purple-500" />
    }
  }

  const getInsightColor = (type: AIInsight["type"]) => {
    switch (type) {
      case "churn-risk":
        return "border-red-200 bg-red-50"
      case "upgrade-opportunity":
        return "border-green-200 bg-green-50"
      case "usage-optimization":
        return "border-blue-200 bg-blue-50"
      case "feature-request":
        return "border-yellow-200 bg-yellow-50"
      default:
        return "border-purple-200 bg-purple-50"
    }
  }

  const getConfidenceBadge = (confidence: number) => {
    if (confidence >= 0.8) {
      return <Badge className="bg-green-500">High Confidence</Badge>
    } else if (confidence >= 0.6) {
      return <Badge className="bg-yellow-500">Medium Confidence</Badge>
    } else {
      return <Badge variant="outline">Low Confidence</Badge>
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-600" />
            AI-Powered Insights
          </CardTitle>
          <CardDescription>
            Machine learning recommendations for module optimization and business growth
          </CardDescription>
        </CardHeader>
        <CardContent>
          {insights.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No insights available</p>
              <p className="text-sm">AI insights will appear as data is collected</p>
            </div>
          ) : (
            <div className="space-y-4">
              {insights.map((insight) => (
                <Card key={insight.id} className={getInsightColor(insight.type)}>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">{getInsightIcon(insight.type)}</div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold">{insight.title}</h4>
                          {getConfidenceBadge(insight.confidence)}
                        </div>
                        <p className="text-sm text-muted-foreground">{insight.description}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">
                            Confidence: {Math.round(insight.confidence * 100)}%
                          </span>
                          <Progress value={insight.confidence * 100} className="w-20 h-2" />
                        </div>
                        {insight.actionable && (
                          <div className="flex gap-2 mt-3">
                            <Button size="sm" variant="outline">
                              View Details
                            </Button>
                            <Button size="sm">Take Action</Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* AI Recommendations Summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Churn Risk Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {insights.filter((i) => i.type === "churn-risk").length}
            </div>
            <p className="text-xs text-muted-foreground">Modules at risk of abandonment</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upgrade Opportunities</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {insights.filter((i) => i.type === "upgrade-opportunity").length}
            </div>
            <p className="text-xs text-muted-foreground">Revenue expansion opportunities</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Optimization Tips</CardTitle>
            <Zap className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {insights.filter((i) => i.type === "usage-optimization").length}
            </div>
            <p className="text-xs text-muted-foreground">Performance improvements</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
