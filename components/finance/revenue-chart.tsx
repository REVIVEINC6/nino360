"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"

const data = [
  { month: "Jan", revenue: 245000, expenses: 180000 },
  { month: "Feb", revenue: 268000, expenses: 195000 },
  { month: "Mar", revenue: 289000, expenses: 205000 },
  { month: "Apr", revenue: 312000, expenses: 220000 },
  { month: "May", revenue: 298000, expenses: 210000 },
  { month: "Jun", revenue: 335000, expenses: 235000 },
]

export function RevenueChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue Overview</CardTitle>
        <CardDescription>Monthly revenue and expenses comparison</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="month" className="text-xs" />
            <YAxis className="text-xs" />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "var(--radius)",
              }}
            />
            <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            <Bar dataKey="expenses" fill="hsl(var(--muted))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
