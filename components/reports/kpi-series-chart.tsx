"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface KpiSeriesChartProps {
  data: any[]
  yKeys: string[]
}

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"]

export function KpiSeriesChart({ data, yKeys }: KpiSeriesChartProps) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="d" tickFormatter={(value) => new Date(value).toLocaleDateString()} fontSize={12} />
        <YAxis fontSize={12} />
        <Tooltip labelFormatter={(value) => new Date(value).toLocaleDateString()} />
        <Legend />
        {yKeys.map((key, i) => (
          <Line key={key} type="monotone" dataKey={key} stroke={COLORS[i % COLORS.length]} strokeWidth={2} />
        ))}
      </LineChart>
    </ResponsiveContainer>
  )
}
