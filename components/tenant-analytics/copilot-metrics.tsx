"use client"

import { Card } from "@/components/ui/card"
import { Sparkles } from "lucide-react"

interface CopilotMetricsProps {
  data: {
    totalQueries: number
    avgResponseTime: number
    successRate: number
    topFeatures: Array<{ feature: string; count: number }>
  }
}

export function CopilotMetrics({ data }: CopilotMetricsProps) {
  return (
    <Card className="border-white/10 bg-white/5 p-6 backdrop-blur-xl">
      <div className="mb-4 flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-[#D0FF00]" />
        <h3 className="text-lg font-semibold">Copilot Metrics</h3>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <p className="text-sm text-muted-foreground">Total Queries</p>
          <p className="text-2xl font-bold">{data.totalQueries.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Avg Response Time</p>
          <p className="text-2xl font-bold">{data.avgResponseTime}ms</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Success Rate</p>
          <p className="text-2xl font-bold">{data.successRate}%</p>
        </div>
      </div>
      <div className="mt-4">
        <p className="mb-2 text-sm font-medium">Top Features</p>
        <div className="space-y-2">
          {data.topFeatures.map((item) => (
            <div key={item.feature} className="flex items-center justify-between">
              <span className="text-sm">{item.feature}</span>
              <span className="text-sm font-medium">{item.count}</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}
