"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { BarChart3, TrendingUp, TrendingDown, Users, DollarSign, Activity, Download } from "lucide-react"

interface DashboardChartsProps {
  data: any
  timeRange: string
  customDateRange?: { start: Date; end: Date } | null
}

export function DashboardCharts({ data, timeRange, customDateRange }: DashboardChartsProps) {
  const [selectedChart, setSelectedChart] = useState("revenue")
  const [chartType, setChartType] = useState("line")

  // Mock chart data - in production, this would come from your analytics service
  const chartData = useMemo(() => {
    const generateData = (type: string) => {
      const days = timeRange === "1d" ? 24 : timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90
      const points = Array.from({ length: days }, (_, i) => {
        const date = new Date()
        date.setDate(date.getDate() - (days - i - 1))

        let value = 0
        switch (type) {
          case "revenue":
            value = Math.floor(Math.random() * 10000) + 50000
            break
          case "users":
            value = Math.floor(Math.random() * 100) + 2000
            break
          case "performance":
            value = Math.floor(Math.random() * 20) + 80
            break
          case "security":
            value = Math.floor(Math.random() * 10) + 90
            break
          default:
            value = Math.floor(Math.random() * 100)
        }

        return {
          date: date.toISOString().split("T")[0],
          value,
          label: timeRange === "1d" ? date.toLocaleTimeString() : date.toLocaleDateString(),
        }
      })
      return points
    }

    return {
      revenue: generateData("revenue"),
      users: generateData("users"),
      performance: generateData("performance"),
      security: generateData("security"),
    }
  }, [timeRange])

  const renderChart = (data: any[], color: string) => {
    const maxValue = Math.max(...data.map((d) => d.value))
    const minValue = Math.min(...data.map((d) => d.value))

    return (
      <div className="space-y-4">
        <div className="h-64 flex items-end justify-between gap-1 px-4">
          {data.map((point, index) => (
            <div key={index} className="flex flex-col items-center flex-1 max-w-8">
              <div
                className={`w-full rounded-t transition-all duration-300 hover:opacity-80 ${color}`}
                style={{
                  height: `${((point.value - minValue) / (maxValue - minValue)) * 200 + 20}px`,
                }}
                title={`${point.label}: ${point.value.toLocaleString()}`}
              />
              <span className="text-xs text-muted-foreground mt-2 rotate-45 origin-left">{point.label}</span>
            </div>
          ))}
        </div>

        <div className="flex justify-between text-sm text-muted-foreground px-4">
          <span>Min: {minValue.toLocaleString()}</span>
          <span>Max: {maxValue.toLocaleString()}</span>
        </div>
      </div>
    )
  }

  const getChartColor = (type: string) => {
    switch (type) {
      case "revenue":
        return "bg-green-500"
      case "users":
        return "bg-blue-500"
      case "performance":
        return "bg-purple-500"
      case "security":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getChartIcon = (type: string) => {
    switch (type) {
      case "revenue":
        return <DollarSign className="h-4 w-4" />
      case "users":
        return <Users className="h-4 w-4" />
      case "performance":
        return <Activity className="h-4 w-4" />
      case "security":
        return <BarChart3 className="h-4 w-4" />
      default:
        return <BarChart3 className="h-4 w-4" />
    }
  }

  const calculateTrend = (data: any[]) => {
    if (data.length < 2) return { direction: "neutral", percentage: 0 }

    const recent = data.slice(-7).reduce((sum, d) => sum + d.value, 0) / 7
    const previous = data.slice(-14, -7).reduce((sum, d) => sum + d.value, 0) / 7

    if (previous === 0) return { direction: "neutral", percentage: 0 }

    const percentage = ((recent - previous) / previous) * 100
    const direction = percentage > 0 ? "up" : percentage < 0 ? "down" : "neutral"

    return { direction, percentage: Math.abs(percentage) }
  }

  return (
    <div className="space-y-6">
      {/* Chart Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Object.entries(chartData).map(([key, data]) => {
          const trend = calculateTrend(data)
          const currentValue = data[data.length - 1]?.value || 0

          return (
            <Card
              key={key}
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedChart === key ? "ring-2 ring-primary" : ""
              }`}
              onClick={() => setSelectedChart(key)}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium capitalize">
                  {key.replace(/([A-Z])/g, " $1").trim()}
                </CardTitle>
                {getChartIcon(key)}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {key === "revenue" ? `$${currentValue.toLocaleString()}` : currentValue.toLocaleString()}
                </div>
                <div className="flex items-center text-xs text-muted-foreground">
                  {trend.direction === "up" ? (
                    <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                  ) : trend.direction === "down" ? (
                    <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                  ) : (
                    <Activity className="h-3 w-3 text-gray-500 mr-1" />
                  )}
                  <span
                    className={
                      trend.direction === "up"
                        ? "text-green-500"
                        : trend.direction === "down"
                          ? "text-red-500"
                          : "text-gray-500"
                    }
                  >
                    {trend.percentage.toFixed(1)}% from last period
                  </span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Main Chart */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                {getChartIcon(selectedChart)}
                {selectedChart.charAt(0).toUpperCase() + selectedChart.slice(1)} Analytics
              </CardTitle>
              <CardDescription>Detailed {selectedChart} metrics for the selected time period</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Select value={chartType} onValueChange={setChartType}>
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="line">Line</SelectItem>
                  <SelectItem value="bar">Bar</SelectItem>
                  <SelectItem value="area">Area</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {renderChart(chartData[selectedChart as keyof typeof chartData], getChartColor(selectedChart))}
        </CardContent>
      </Card>

      {/* Additional Analytics */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Performance Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Breakdown</CardTitle>
            <CardDescription>System performance metrics by category</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { name: "API Response Time", value: 95, color: "bg-green-500" },
              { name: "Database Performance", value: 88, color: "bg-blue-500" },
              { name: "Cache Hit Rate", value: 92, color: "bg-purple-500" },
              { name: "Error Rate", value: 2, color: "bg-red-500", inverse: true },
            ].map((metric) => (
              <div key={metric.name} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{metric.name}</span>
                  <span className="font-medium">
                    {metric.value}%{metric.inverse && " (lower is better)"}
                  </span>
                </div>
                <Progress value={metric.inverse ? 100 - metric.value : metric.value} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Top Performing Modules */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Modules</CardTitle>
            <CardDescription>Modules ranked by user engagement and performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "CRM", users: 1247, performance: 96, growth: 12 },
                { name: "HRMS", users: 892, performance: 94, growth: 8 },
                { name: "Talent", users: 634, performance: 91, growth: 15 },
                { name: "Finance", users: 423, performance: 89, growth: 5 },
                { name: "Admin", users: 156, performance: 87, growth: -2 },
              ].map((module, index) => (
                <div key={module.name} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium">{module.name}</div>
                      <div className="text-sm text-muted-foreground">{module.users} active users</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{module.performance}%</div>
                    <div
                      className={`text-sm flex items-center ${
                        module.growth > 0 ? "text-green-600" : module.growth < 0 ? "text-red-600" : "text-gray-600"
                      }`}
                    >
                      {module.growth > 0 ? (
                        <TrendingUp className="h-3 w-3 mr-1" />
                      ) : module.growth < 0 ? (
                        <TrendingDown className="h-3 w-3 mr-1" />
                      ) : (
                        <Activity className="h-3 w-3 mr-1" />
                      )}
                      {Math.abs(module.growth)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Real-time Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Real-time Metrics
          </CardTitle>
          <CardDescription>Live system metrics updated every 30 seconds</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Active Sessions", value: "2,847", change: "+12", color: "text-blue-600" },
              { label: "Requests/min", value: "15.2K", change: "+5%", color: "text-green-600" },
              { label: "Avg Response", value: "245ms", change: "-8ms", color: "text-purple-600" },
              { label: "Error Rate", value: "0.02%", change: "-0.01%", color: "text-red-600" },
            ].map((metric) => (
              <div key={metric.label} className="text-center p-4 rounded-lg border">
                <div className={`text-2xl font-bold ${metric.color}`}>{metric.value}</div>
                <div className="text-sm text-muted-foreground">{metric.label}</div>
                <Badge variant="outline" className="mt-2">
                  {metric.change}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
