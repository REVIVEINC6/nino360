"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { TrendingDown, TrendingUp } from "lucide-react"

export function PipelineFunnel() {
  const stages = [
    { name: "Applied", count: 120, percentage: 100, change: 12, trend: "up" },
    { name: "Screen", count: 45, percentage: 37.5, change: -5, trend: "down" },
    { name: "Interview", count: 18, percentage: 15, change: 3, trend: "up" },
    { name: "Offer", count: 5, percentage: 4.2, change: 1, trend: "up" },
    { name: "Hired", count: 3, percentage: 2.5, change: 1, trend: "up" },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pipeline Funnel</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {stages.map((stage, index) => (
            <div key={stage.name} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{stage.name}</span>
                  <span className="text-muted-foreground">({stage.percentage.toFixed(1)}%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold">{stage.count}</span>
                  <div
                    className={`flex items-center gap-1 text-xs ${
                      stage.trend === "up" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {stage.trend === "up" ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    <span>{Math.abs(stage.change)}</span>
                  </div>
                </div>
              </div>
              <Progress
                value={stage.percentage}
                className="h-2"
                style={{
                  background: `linear-gradient(to right, hsl(var(--primary)) ${stage.percentage}%, hsl(var(--muted)) ${stage.percentage}%)`,
                }}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
