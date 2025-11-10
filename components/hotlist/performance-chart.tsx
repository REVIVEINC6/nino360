"use client"

import { Line, LineChart, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface PerformanceChartProps {
  period: "7d" | "30d" | "90d"
}

export function PerformanceChart({ period }: PerformanceChartProps) {
  // Mock data - in production, this would come from the analytics API
  const data =
    period === "7d"
      ? [
          { date: "Mon", campaigns: 12, responses: 8, placements: 2 },
          { date: "Tue", campaigns: 15, responses: 11, placements: 3 },
          { date: "Wed", campaigns: 18, responses: 14, placements: 4 },
          { date: "Thu", campaigns: 14, responses: 10, placements: 2 },
          { date: "Fri", campaigns: 20, responses: 16, placements: 5 },
          { date: "Sat", campaigns: 8, responses: 5, placements: 1 },
          { date: "Sun", campaigns: 6, responses: 4, placements: 1 },
        ]
      : period === "30d"
        ? [
            { date: "Week 1", campaigns: 45, responses: 32, placements: 8 },
            { date: "Week 2", campaigns: 52, responses: 38, placements: 10 },
            { date: "Week 3", campaigns: 48, responses: 35, placements: 9 },
            { date: "Week 4", campaigns: 55, responses: 42, placements: 12 },
          ]
        : [
            { date: "Month 1", campaigns: 180, responses: 135, placements: 35 },
            { date: "Month 2", campaigns: 195, responses: 148, placements: 38 },
            { date: "Month 3", campaigns: 210, responses: 162, placements: 42 },
          ]

  return (
    <ChartContainer
      config={{
        campaigns: {
          label: "Campaigns Sent",
          color: "hsl(var(--chart-1))",
        },
        responses: {
          label: "Responses",
          color: "hsl(var(--chart-2))",
        },
        placements: {
          label: "Placements",
          color: "hsl(var(--chart-3))",
        },
      }}
      className="h-[300px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis dataKey="date" className="text-xs" />
          <YAxis className="text-xs" />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Legend />
          <Line type="monotone" dataKey="campaigns" stroke="var(--color-campaigns)" strokeWidth={2} />
          <Line type="monotone" dataKey="responses" stroke="var(--color-responses)" strokeWidth={2} />
          <Line type="monotone" dataKey="placements" stroke="var(--color-placements)" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
