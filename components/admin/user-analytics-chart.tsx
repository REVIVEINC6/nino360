"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { TrendingUp, UserPlus } from "lucide-react"
import { getUserAnalytics } from "@/app/(dashboard)/admin/actions/users"

interface UserAnalyticsChartProps {
  tenantId: string
  days?: number
}

export function UserAnalyticsChart({ tenantId, days = 30 }: UserAnalyticsChartProps) {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAnalytics()
  }, [tenantId, days])

  const loadAnalytics = async () => {
    setLoading(true)
    try {
      const result = await getUserAnalytics({ tenantId, days })
      if (result.data) {
        setData(result.data)
      }
    } catch (error) {
      console.error("[v0] Error loading analytics:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>User Growth Analytics</CardTitle>
          <CardDescription>Loading analytics data...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">Loading...</div>
        </CardContent>
      </Card>
    )
  }

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>User Growth Analytics</CardTitle>
          <CardDescription>No analytics data available</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            No data for the selected period
          </div>
        </CardContent>
      </Card>
    )
  }

  const chartData = data.map((d) => ({
    date: new Date(d.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    total: d.total_users,
    active: d.active_users,
    new: d.new_users,
  }))

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            User Growth Trend
          </CardTitle>
          <CardDescription>Total and active users over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              total: { label: "Total Users", color: "hsl(var(--chart-1))" },
              active: { label: "Active Users", color: "hsl(var(--chart-2))" },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="total"
                  stroke="var(--color-total)"
                  fill="var(--color-total)"
                  fillOpacity={0.2}
                />
                <Area
                  type="monotone"
                  dataKey="active"
                  stroke="var(--color-active)"
                  fill="var(--color-active)"
                  fillOpacity={0.2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            New User Registrations
          </CardTitle>
          <CardDescription>Daily new user signups</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              new: { label: "New Users", color: "hsl(var(--chart-3))" },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="new" fill="var(--color-new)" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
