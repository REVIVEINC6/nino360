"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Brain, TrendingUp, Shield, DollarSign, CheckCircle, X, Lightbulb } from "lucide-react"

interface AIInsight {
  id: string
  type: string
  title: string
  description: string
  priority: string
  impact: string
  recommendation: string
  estimatedSavings: string
  confidence: number
  createdAt: string
}

interface AIInsightsPanelProps {
  insights: AIInsight[]
  onImplement: (id: string) => Promise<void>
  onDismiss: (id: string) => Promise<void>
}

function getInsightIcon(type: string) {
  switch (type) {
    case "performance":
    case "optimization":
      return <TrendingUp className="h-4 w-4" />
    case "cost":
      return <DollarSign className="h-4 w-4" />
    case "security":
      return <Shield className="h-4 w-4" />
    default:
      return <Lightbulb className="h-4 w-4" />
  }
}

function getPriorityColor(priority: string) {
  switch (priority) {
    case "high":
      return "destructive"
    case "medium":
      return "default"
    case "low":
      return "secondary"
    default:
      return "outline"
  }
}

export function AIInsightsPanel({ insights, onImplement, onDismiss }: AIInsightsPanelProps) {
  if (!insights || insights.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI Insights
          </CardTitle>
          <CardDescription>AI-powered recommendations and insights</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No insights available</h3>
            <p className="text-muted-foreground">AI is analyzing your system. Check back later for recommendations.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          AI Insights
        </CardTitle>
        <CardDescription>AI-powered recommendations to optimize your platform</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {insights.map((insight) => (
          <div key={insight.id} className="border rounded-lg p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                {getInsightIcon(insight.type)}
                <h4 className="font-semibold">{insight.title}</h4>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={getPriorityColor(insight.priority) as any}>{insight.priority}</Badge>
                <Badge variant="outline">{insight.type}</Badge>
              </div>
            </div>

            <p className="text-sm text-muted-foreground">{insight.description}</p>

            <div className="bg-muted/50 p-3 rounded-md">
              <p className="text-sm font-medium mb-1">Recommendation:</p>
              <p className="text-sm">{insight.recommendation}</p>
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-4">
                <span>
                  <strong>Impact:</strong> {insight.impact}
                </span>
                <span>
                  <strong>Savings:</strong> {insight.estimatedSavings}
                </span>
                <span>
                  <strong>Confidence:</strong> {Math.round(insight.confidence * 100)}%
                </span>
              </div>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                Generated {new Date(insight.createdAt).toLocaleDateString()}
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDismiss(insight.id)}
                  className="text-muted-foreground"
                >
                  <X className="h-3 w-3 mr-1" />
                  Dismiss
                </Button>
                <Button size="sm" onClick={() => onImplement(insight.id)}>
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Implement
                </Button>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
