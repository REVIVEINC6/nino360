"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  BarChart3,
  TrendingUp,
  Users,
  Building2,
  DollarSign,
  Activity,
  Globe,
  Calendar,
  Download,
  RefreshCw,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"

interface AnalyticsData {
  overview: {
    totalTenants: number
    activeUsers: number
    revenue: number
    growth: number
  }
  trends: {
    period: string
    tenants: number
    users: number
    revenue: number
    change: number
  }[]
  regions: {
    name: string
    tenants: number
    users: number
    revenue: number
    growth: number
  }[]
  performance: {
    metric: string
    value: number
    target: number
    trend: "up" | "down" | "stable"
    change: number
  }[]
}

export default function TenantAnalytics() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState("30d")
  const [selectedMetric, setSelectedMetric] = useState("all")

  useEffect(() => {
    // Simulate loading analytics data
    const loadAnalytics = async () => {
      setLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setAnalyticsData({
        overview: {
          totalTenants: 247,
          activeUsers: 12847,
          revenue: 2847392,
          growth: 18.5,
        },
        trends: [
          { period: "Jan", tenants: 180, users: 8500, revenue: 1800000, change: 12 },
          { period: "Feb", tenants: 195, users: 9200, revenue: 2100000, change: 8.3 },
          { period: "Mar", tenants: 210, users: 10100, revenue: 2350000, change: 7.7 },
          { period: "Apr", tenants: 225, users: 11200, revenue: 2580000, change: 7.1 },
          { period: "May", tenants: 240, users: 12100, revenue: 2720000, change: 6.7 },
          { period: "Jun", tenants: 247, users: 12847, revenue: 2847392, change: 2.9 },
        ],
        regions: [
          { name: "North America", tenants: 98, users: 5124, revenue: 1138957, growth: 15.2 },
          { name: "Europe", tenants: 76, users: 3892, revenue: 912847, growth: 22.1 },
          { name: "Asia Pacific", tenants: 52, users: 2847, revenue: 634829, growth: 28.7 },
          { name: "Latin America", tenants: 21, users: 984, revenue: 160759, growth: 12.4 },
        ],
        performance: [
          { metric: "User Adoption Rate", value: 87, target: 85, trend: "up", change: 5.2 },
          { metric: "Tenant Retention", value: 94, target: 90, trend: "up", change: 2.1 },
          { metric: "Revenue per Tenant", value: 11534, target: 10000, trend: "up", change: 15.3 },
          { metric: "Support Ticket Resolution", value: 92, target: 95, trend: "down", change: -1.8 },
          { metric: "System Uptime", value: 99.7, target: 99.5, trend: "stable", change: 0.1 },
          { metric: "API Response Time", value: 142, target: 200, trend: "up", change: -12.5 },
        ],
      })

      setLoading(false)
    }

    loadAnalytics()
  }, [timeRange])

  const getTrendIcon = (trend: string, change: number) => {
    if (trend === "up" || change > 0) {
      return <ArrowUpRight className="h-4 w-4 text-green-600" />
    } else if (trend === "down" || change < 0) {
      return <ArrowDownRight className="h-4 w-4 text-red-600" />
    }
    return <Activity className="h-4 w-4 text-gray-600" />
  }

  const getTrendColor = (trend: string, change: number) => {
    if (trend === "up" || change > 0) {
      return "text-green-600"
    } else if (trend === "down" || change < 0) {
      return "text-red-600"
    }
    return "text-gray-600"
  }

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (!analyticsData) return null

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tenant Analytics</h1>
          <p className="text-gray-600 mt-1">Comprehensive analytics and insights across all tenants</p>
        </div>
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2 bg-transparent">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          <Button className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Total Tenants</p>
                  <p className="text-3xl font-bold mt-2">{analyticsData.overview.totalTenants}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <ArrowUpRight className="h-4 w-4 text-blue-200" />
                    <span className="text-blue-100 text-sm">+12% this month</span>
                  </div>
                </div>
                <Building2 className="h-12 w-12 text-blue-200" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="border-0 shadow-lg bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-100 text-sm font-medium">Active Users</p>
                  <p className="text-3xl font-bold mt-2">{analyticsData.overview.activeUsers.toLocaleString()}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <ArrowUpRight className="h-4 w-4 text-emerald-200" />
                    <span className="text-emerald-100 text-sm">+8.3% growth</span>
                  </div>
                </div>
                <Users className="h-12 w-12 text-emerald-200" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Total Revenue</p>
                  <p className="text-3xl font-bold mt-2">${(analyticsData.overview.revenue / 1000000).toFixed(1)}M</p>
                  <div className="flex items-center gap-1 mt-1">
                    <ArrowUpRight className="h-4 w-4 text-purple-200" />
                    <span className="text-purple-100 text-sm">+{analyticsData.overview.growth}% YoY</span>
                  </div>
                </div>
                <DollarSign className="h-12 w-12 text-purple-200" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="border-0 shadow-lg bg-gradient-to-r from-orange-600 to-red-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium">Avg Revenue/Tenant</p>
                  <p className="text-3xl font-bold mt-2">
                    ${Math.round(analyticsData.overview.revenue / analyticsData.overview.totalTenants).toLocaleString()}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <ArrowUpRight className="h-4 w-4 text-orange-200" />
                    <span className="text-orange-100 text-sm">+5.7% increase</span>
                  </div>
                </div>
                <BarChart3 className="h-12 w-12 text-orange-200" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Main Analytics Content */}
      <Tabs defaultValue="trends" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="trends">Growth Trends</TabsTrigger>
          <TabsTrigger value="regions">Regional Analysis</TabsTrigger>
          <TabsTrigger value="performance">Performance Metrics</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Tenant Growth Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.trends.map((trend, index) => (
                    <div key={trend.period} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-sm font-medium text-blue-600">
                          {trend.period}
                        </div>
                        <div>
                          <p className="font-medium">{trend.tenants} Tenants</p>
                          <p className="text-sm text-gray-600">{trend.users.toLocaleString()} Users</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${(trend.revenue / 1000000).toFixed(1)}M</p>
                        <div className="flex items-center gap-1">
                          {getTrendIcon("up", trend.change)}
                          <span className={`text-sm ${getTrendColor("up", trend.change)}`}>+{trend.change}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Key Metrics Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Monthly Recurring Revenue</span>
                    <span className="font-bold text-green-600">$237K</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Customer Acquisition Cost</span>
                    <span className="font-bold text-blue-600">$1,247</span>
                  </div>
                  <Progress value={72} className="h-2" />
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Customer Lifetime Value</span>
                    <span className="font-bold text-purple-600">$18,934</span>
                  </div>
                  <Progress value={92} className="h-2" />
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Churn Rate</span>
                    <span className="font-bold text-red-600">2.1%</span>
                  </div>
                  <Progress value={21} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="regions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Regional Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {analyticsData.regions.map((region, index) => (
                  <motion.div
                    key={region.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="p-6 rounded-lg border hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-lg">{region.name}</h3>
                      <Badge
                        className={region.growth > 20 ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}
                      >
                        +{region.growth}% growth
                      </Badge>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Tenants</span>
                        <span className="font-medium">{region.tenants}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Active Users</span>
                        <span className="font-medium">{region.users.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Revenue</span>
                        <span className="font-medium">${(region.revenue / 1000).toFixed(0)}K</span>
                      </div>
                      <div className="pt-2">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-gray-500">Market Share</span>
                          <span className="text-xs text-gray-500">
                            {((region.tenants / analyticsData.overview.totalTenants) * 100).toFixed(1)}%
                          </span>
                        </div>
                        <Progress
                          value={(region.tenants / analyticsData.overview.totalTenants) * 100}
                          className="h-2"
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Performance Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {analyticsData.performance.map((metric, index) => (
                  <motion.div
                    key={metric.metric}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="p-6 rounded-lg border"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-medium">{metric.metric}</h3>
                      <div className="flex items-center gap-1">
                        {getTrendIcon(metric.trend, metric.change)}
                        <span className={`text-sm font-medium ${getTrendColor(metric.trend, metric.change)}`}>
                          {metric.change > 0 ? "+" : ""}
                          {metric.change}%
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold">
                          {metric.metric.includes("Time")
                            ? `${metric.value}ms`
                            : metric.metric.includes("Revenue")
                              ? `$${metric.value.toLocaleString()}`
                              : `${metric.value}${metric.metric.includes("Rate") || metric.metric.includes("Uptime") ? "%" : ""}`}
                        </span>
                        <span className="text-sm text-gray-600">
                          Target:{" "}
                          {metric.metric.includes("Time")
                            ? `${metric.target}ms`
                            : metric.metric.includes("Revenue")
                              ? `$${metric.target.toLocaleString()}`
                              : `${metric.target}${metric.metric.includes("Rate") || metric.metric.includes("Uptime") ? "%" : ""}`}
                        </span>
                      </div>
                      <Progress
                        value={
                          metric.metric.includes("Time")
                            ? Math.max(0, 100 - (metric.value / metric.target) * 100)
                            : (metric.value / metric.target) * 100
                        }
                        className="h-2"
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Key Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-blue-600" />
                    <span className="font-medium text-blue-800">Growth Opportunity</span>
                  </div>
                  <p className="text-sm text-blue-700">
                    Asia Pacific region shows 28.7% growth rate, highest among all regions. Consider increasing
                    marketing investment in this region.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-yellow-50 border border-yellow-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="h-4 w-4 text-yellow-600" />
                    <span className="font-medium text-yellow-800">Performance Alert</span>
                  </div>
                  <p className="text-sm text-yellow-700">
                    Support ticket resolution rate is below target at 92%. Review support processes and consider
                    additional staffing.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <span className="font-medium text-green-800">Revenue Success</span>
                  </div>
                  <p className="text-sm text-green-700">
                    Revenue per tenant exceeded target by 15.3%. Current upselling strategies are highly effective.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-xs font-medium text-blue-600">
                      1
                    </div>
                    <div>
                      <p className="font-medium text-sm">Expand Asia Pacific Operations</p>
                      <p className="text-xs text-gray-600">High growth potential with 28.7% increase</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                    <div className="w-6 h-6 rounded-full bg-yellow-100 flex items-center justify-center text-xs font-medium text-yellow-600">
                      2
                    </div>
                    <div>
                      <p className="font-medium text-sm">Improve Support Response Time</p>
                      <p className="text-xs text-gray-600">Target 95% resolution rate within SLA</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-xs font-medium text-green-600">
                      3
                    </div>
                    <div>
                      <p className="font-medium text-sm">Scale Successful Upselling</p>
                      <p className="text-xs text-gray-600">Apply proven strategies to other regions</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
