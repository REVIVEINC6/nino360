"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface PipelineHealthProps {
  data: {
    byStage: Array<{ stage: string; count: number; amount: number }>
    aging: Array<{ bucket: string; count: number; amount: number }>
  }
}

export function PipelineHealth({ data }: PipelineHealthProps) {
  return (
    <Card className="glass-panel">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Pipeline Health
          <span className="text-sm font-normal text-muted-foreground">by Stage & Aging</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h4 className="text-sm font-medium mb-4">By Stage</h4>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={data.byStage}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="stage" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="count" fill="#8B5CF6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-4">Aging (Days Since Update)</h4>
            <ResponsiveContainer width="100%" height={150}>
              <BarChart data={data.aging} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
                <YAxis dataKey="bucket" type="category" stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="count" fill="#D0FF00" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
