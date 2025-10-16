"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

const revenueData = [
  { month: "Jan", revenue: 125000, expenses: 85000, profit: 40000 },
  { month: "Feb", revenue: 142000, expenses: 92000, profit: 50000 },
  { month: "Mar", revenue: 158000, expenses: 98000, profit: 60000 },
  { month: "Apr", revenue: 175000, expenses: 105000, profit: 70000 },
  { month: "May", revenue: 192000, expenses: 112000, profit: 80000 },
  { month: "Jun", revenue: 210000, expenses: 120000, profit: 90000 },
]

const hiringData = [
  { stage: "Applied", count: 450 },
  { stage: "Screening", count: 180 },
  { stage: "Interview", count: 85 },
  { stage: "Offer", count: 32 },
  { stage: "Hired", count: 28 },
]

const clientDistribution = [
  { name: "Enterprise", value: 45, color: "hsl(var(--chart-1))" },
  { name: "Mid-Market", value: 30, color: "hsl(var(--chart-2))" },
  { name: "Small Business", value: 25, color: "hsl(var(--chart-3))" },
]

export function AnalyticsCharts() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Revenue Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="hsl(var(--chart-1))" strokeWidth={2} />
              <Line type="monotone" dataKey="expenses" stroke="hsl(var(--chart-2))" strokeWidth={2} />
              <Line type="monotone" dataKey="profit" stroke="hsl(var(--chart-3))" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Hiring Funnel</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={hiringData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="stage" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="hsl(var(--chart-1))" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Client Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={clientDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {clientDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Key Metrics Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <span className="text-sm text-muted-foreground">Average Time to Hire</span>
              <span className="font-semibold">28 days</span>
            </div>
            <div className="flex items-center justify-between border-b pb-3">
              <span className="text-sm text-muted-foreground">Bench Utilization Rate</span>
              <span className="font-semibold">87%</span>
            </div>
            <div className="flex items-center justify-between border-b pb-3">
              <span className="text-sm text-muted-foreground">Client Retention Rate</span>
              <span className="font-semibold">94%</span>
            </div>
            <div className="flex items-center justify-between border-b pb-3">
              <span className="text-sm text-muted-foreground">Average Project Margin</span>
              <span className="font-semibold">42%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Vendor Performance Score</span>
              <span className="font-semibold">4.6/5.0</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
