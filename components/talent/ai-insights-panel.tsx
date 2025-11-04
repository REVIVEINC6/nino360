"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Brain, TrendingUp, AlertCircle, CheckCircle, ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"

export function AIInsightsPanel() {
  const router = useRouter()

  const insights = [
    {
      type: "success",
      icon: CheckCircle,
      title: "Pipeline Optimization",
      message: "Your screening process is 23% faster than industry average",
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      type: "warning",
      icon: AlertCircle,
      title: "Candidate Drop-off",
      message: "15% drop-off rate at interview stage - consider scheduling improvements",
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
    {
      type: "info",
      icon: TrendingUp,
      title: "Quality Improvement",
      message: "AI-matched candidates have 40% higher offer acceptance rate",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
  ]

  return (
    <Card className="p-4 bg-linear-to-r from-primary/5 to-primary/10 border-primary/20">
      <div className="flex items-start gap-4">
        <div className="p-2 rounded-lg bg-primary/10">
          <Brain className="h-6 w-6 text-primary" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-semibold">AI Insights</h3>
            <Badge variant="secondary">3 new</Badge>
          </div>
          <div className="grid gap-2 md:grid-cols-3">
            {insights.map((insight, index) => (
              <div key={index} className={`p-3 rounded-lg ${insight.bgColor} border border-current/20`}>
                <div className="flex items-start gap-2">
                  <insight.icon className={`h-4 w-4 mt-0.5 ${insight.color}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{insight.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{insight.message}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Button variant="ghost" size="sm" className="mt-3" onClick={() => router.push("/talent/analytics")}>
            View Detailed Analytics
            <ArrowRight className="ml-2 h-3 w-3" />
          </Button>
        </div>
      </div>
    </Card>
  )
}
