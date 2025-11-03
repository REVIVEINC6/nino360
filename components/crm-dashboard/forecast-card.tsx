"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface ForecastCardProps {
  data: {
    series: Array<{ date: string; commit: number; best: number; pipeline: number }>
    confBand: Array<{ date: string; low: number; high: number }>
  }
}

export function ForecastCard({ data }: ForecastCardProps) {
  const [showWhatIf, setShowWhatIf] = useState(false)

  return (
    <Card className="glass-panel">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>90-Day Forecast</CardTitle>
          <div className="flex items-center gap-2">
            <Switch id="what-if" checked={showWhatIf} onCheckedChange={setShowWhatIf} />
            <Label htmlFor="what-if" className="text-sm">
              What-if
            </Label>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data.series}>
            <defs>
              <linearGradient id="colorCommit" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorBest" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorPipeline" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#D0FF00" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#D0FF00" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="date"
              stroke="hsl(var(--muted-foreground))"
              tickFormatter={(value) => new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            />
            <YAxis stroke="hsl(var(--muted-foreground))" />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--background))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
              formatter={(value: number) => `$${(value / 1000).toFixed(1)}K`}
            />
            <Legend />
            <Area
              type="monotone"
              dataKey="commit"
              stroke="#4F46E5"
              fillOpacity={1}
              fill="url(#colorCommit)"
              name="Commit"
            />
            <Area
              type="monotone"
              dataKey="best"
              stroke="#8B5CF6"
              fillOpacity={1}
              fill="url(#colorBest)"
              name="Best Case"
            />
            {showWhatIf && (
              <Area
                type="monotone"
                dataKey="pipeline"
                stroke="#D0FF00"
                fillOpacity={1}
                fill="url(#colorPipeline)"
                name="Pipeline"
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
