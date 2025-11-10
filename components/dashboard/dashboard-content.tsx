"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Users,
  Briefcase,
  TrendingUp,
  TrendingDown,
  Calendar,
  DollarSign,
  AlertCircle,
  Clock,
  Award,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Brain,
} from "lucide-react"
import {
  Line,
  LineChart,
  Bar,
  BarChart,
  Pie,
  PieChart,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const COLORS = ["#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#06b6d4"]

export function DashboardContent() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  // Sample data - replace with actual API calls
  const kpiData = [
    {
      title: "Total Employees",
      value: "1,247",
      change: "+12.5%",
      trend: "up",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Open Positions",
      value: "34",
      change: "-8.3%",
      trend: "down",
      icon: Briefcase,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Avg. Performance",
      value: "4.2/5",
      change: "+0.3",
      trend: "up",
      icon: Award,
      color: "text-pink-600",
      bgColor: "bg-pink-50",
    },
    {
      title: "Turnover Rate",
      value: "8.4%",
      change: "-2.1%",
      trend: "down",
      icon: TrendingDown,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
  ]

  const headcountTrend = [
    { month: "Jan", employees: 1150, hires: 45, exits: 12 },
    { month: "Feb", employees: 1183, hires: 38, exits: 5 },
    { month: "Mar", employees: 1216, hires: 42, exits: 9 },
    { month: "Apr", employees: 1247, hires: 35, exits: 4 },
  ]

  const departmentData = [
    { name: "Engineering", value: 420, fill: COLORS[0] },
    { name: "Sales", value: 280, fill: COLORS[1] },
    { name: "Marketing", value: 150, fill: COLORS[2] },
    { name: "Operations", value: 200, fill: COLORS[3] },
    { name: "HR", value: 97, fill: COLORS[4] },
    { name: "Finance", value: 100, fill: COLORS[5] },
  ]

  const performanceData = [
    { rating: "5 - Exceptional", count: 187, percentage: 15 },
    { rating: "4 - Exceeds", count: 498, percentage: 40 },
    { rating: "3 - Meets", count: 436, percentage: 35 },
    { rating: "2 - Needs Improvement", count: 100, percentage: 8 },
    { rating: "1 - Unsatisfactory", count: 26, percentage: 2 },
  ]

  const aiInsights = [
    {
      type: "warning",
      title: "Retention Risk Alert",
      description: "15 high-performing employees show signs of disengagement",
      action: "Review engagement data",
      icon: AlertCircle,
      color: "text-orange-600",
    },
    {
      type: "success",
      title: "Hiring Velocity Up",
      description: "Time-to-hire decreased by 18% this quarter",
      action: "View talent metrics",
      icon: TrendingUp,
      color: "text-green-600",
    },
    {
      type: "info",
      title: "Performance Cycle Due",
      description: "Q2 performance reviews start in 2 weeks",
      action: "Prepare reviews",
      icon: Calendar,
      color: "text-blue-600",
    },
  ]

  const quickActions = [
    { label: "Add Employee", icon: Users, href: "/hrms/employees" },
    { label: "Post Job", icon: Briefcase, href: "/talent/jobs/new" },
    { label: "Review Timesheets", icon: Clock, href: "/hrms/timesheets" },
    { label: "Process Payroll", icon: DollarSign, href: "/finance/payroll" },
  ]

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Welcome back!
          </h1>
          <p className="text-muted-foreground mt-1">Here's what's happening with your organization today</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gap-1">
            <Sparkles className="h-3 w-3" />
            AI Insights Active
          </Badge>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {kpiData.map((kpi, index) => {
          const Icon = kpi.icon
          return (
            <Card
              key={index}
              className="relative overflow-hidden backdrop-blur-sm bg-white/70 border-white/20 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{kpi.title}</CardTitle>
                <div className={`p-2 rounded-lg ${kpi.bgColor}`}>
                  <Icon className={`h-4 w-4 ${kpi.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{kpi.value}</div>
                <div className="flex items-center gap-1 mt-1">
                  {kpi.trend === "up" ? (
                    <ArrowUpRight className="h-4 w-4 text-green-600" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 text-red-600" />
                  )}
                  <span className={`text-xs font-medium ${kpi.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                    {kpi.change}
                  </span>
                  <span className="text-xs text-muted-foreground">vs last month</span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* AI Insights */}
      <Card className="backdrop-blur-sm bg-white/70 border-white/20 shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-600" />
            <CardTitle>AI-Powered Insights</CardTitle>
          </div>
          <CardDescription>Intelligent recommendations based on your data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {aiInsights.map((insight, index) => {
              const Icon = insight.icon
              return (
                <div
                  key={index}
                  className="p-4 rounded-lg border bg-linear-to-br from-white/50 to-white/30 backdrop-blur-sm hover:shadow-md transition-all"
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg bg-white/80`}>
                      <Icon className={`h-4 w-4 ${insight.color}`} />
                    </div>
                    <div className="flex-1 space-y-1">
                      <h4 className="font-semibold text-sm">{insight.title}</h4>
                      <p className="text-xs text-muted-foreground">{insight.description}</p>
                      <Button variant="link" size="sm" className="h-auto p-0 text-xs">
                        {insight.action} →
                      </Button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Headcount Trend */}
        <Card className="backdrop-blur-sm bg-white/70 border-white/20 shadow-lg">
          <CardHeader>
            <CardTitle>Headcount Trend</CardTitle>
            <CardDescription>Employee growth over the last 4 months</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                employees: { label: "Employees", color: "hsl(var(--chart-1))" },
                hires: { label: "Hires", color: "hsl(var(--chart-2))" },
                exits: { label: "Exits", color: "hsl(var(--chart-3))" },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={headcountTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Line type="monotone" dataKey="employees" stroke="var(--color-employees)" strokeWidth={2} />
                  <Line type="monotone" dataKey="hires" stroke="var(--color-hires)" strokeWidth={2} />
                  <Line type="monotone" dataKey="exits" stroke="var(--color-exits)" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Department Distribution */}
        <Card className="backdrop-blur-sm bg-white/70 border-white/20 shadow-lg">
          <CardHeader>
            <CardTitle>Department Distribution</CardTitle>
            <CardDescription>Employees by department</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                value: { label: "Employees", color: "hsl(var(--chart-1))" },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={departmentData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(props: any) => `${props.name} ${((Number(props.percent) || 0) * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {departmentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Performance Distribution */}
        <Card className="backdrop-blur-sm bg-white/70 border-white/20 shadow-lg">
          <CardHeader>
            <CardTitle>Performance Distribution</CardTitle>
            <CardDescription>Latest performance review ratings</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                count: { label: "Employees", color: "hsl(var(--chart-1))" },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={performanceData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="rating" type="category" width={150} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="count" fill={COLORS[0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="backdrop-blur-sm bg-white/70 border-white/20 shadow-lg">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {quickActions.map((action, index) => {
                const Icon = action.icon
                return (
                  <Button
                    key={index}
                    variant="outline"
                    className="h-auto flex-col gap-2 p-6 backdrop-blur-sm bg-white/50 hover:bg-white/80 transition-all"
                    asChild
                  >
                    <a href={action.href}>
                      <Icon className="h-6 w-6" />
                      <span className="text-sm font-medium">{action.label}</span>
                    </a>
                  </Button>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
