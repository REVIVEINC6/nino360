"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Sparkles, TrendingUp, AlertCircle, Target } from "lucide-react"
import { useState, useEffect, useTransition } from "react"

interface CRMAIInsightsProps {
  generateInsights: () => Promise<any>
}

export function CRMAIInsights({ generateInsights }: CRMAIInsightsProps) {
  const [insights, setInsights] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    const loadInsights = async () => {
      const result = await generateInsights()
      if (result.success) {
        setInsights(result.data)
      }
      setLoading(false)
    }

    startTransition(() => {
      loadInsights()
    })
  }, [generateInsights])

  if (loading || isPending) {
    return (
      <Card className="border-indigo-500/20 bg-gradient-to-br from-indigo-500/5 to-purple-500/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <Sparkles className="h-4 w-4 text-indigo-500" />
            AI Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-muted rounded" />
            <div className="h-4 bg-muted rounded w-3/4" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-indigo-500/20 bg-gradient-to-br from-indigo-500/5 to-purple-500/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Sparkles className="h-4 w-4 text-indigo-500" />
          AI Insights
        </CardTitle>
        <CardDescription>Predictive analytics and recommendations</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-start gap-2">
          <TrendingUp className="h-4 w-4 text-green-500 mt-0.5" />
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium">High-Value Opportunity</p>
            <p className="text-xs text-muted-foreground">
              {insights?.topOpportunity || "TechCorp renewal likely to close"}
            </p>
            <Badge variant="secondary" className="text-xs">
              {insights?.confidence || "92%"} confidence
            </Badge>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5" />
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium">At-Risk Account</p>
            <p className="text-xs text-muted-foreground">{insights?.atRisk || "FinanceHub engagement declining"}</p>
            <Button size="sm" variant="outline" className="h-7 text-xs mt-1 bg-transparent">
              Schedule Follow-up
            </Button>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <Target className="h-4 w-4 text-blue-500 mt-0.5" />
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium">Lead Scoring</p>
            <p className="text-xs text-muted-foreground">
              {insights?.leadScore || "15 hot leads identified this week"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
