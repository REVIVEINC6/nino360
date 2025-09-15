"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  BarChart3,
  TrendingUp,
  Users,
  DollarSign,
  Target,
  CalendarIcon,
  Download,
  Share,
  RefreshCw,
  Eye,
  MoreHorizontal,
  FileText,
  PieChart,
  LineChart,
  Activity,
  Zap,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
} from "lucide-react"
import { format } from "date-fns"

// Types
interface ReportMetric {
  id: string
  name: string
  value: number
  previousValue: number
  unit: string
  format: "number" | "currency" | "percentage"
  trend: "up" | "down" | "stable"
  change: number
  category: string
}

interface Report {
  id: string
  name: string
  description: string
  category: "sales" | "marketing" | "customer" | "performance" | "financial"
  type: "standard" | "custom" | "scheduled"
  status: "ready" | "generating" | "scheduled"
  lastGenerated: Date
  nextScheduled?: Date
  frequency?: "daily" | "weekly" | "monthly" | "quarterly"
  recipients: string[]
  metrics: string[]
  createdBy: string
  createdAt: Date
}

interface ChartData {
  name: string
  value: number
  change?: number
  trend?: "up" | "down" | "stable"
}

// Mock data
const mockMetrics: ReportMetric[] = [
  {
    id: "metric-1",
    name: "Total Revenue",
    value: 1250000,
    previousValue: 1180000,
    unit: "$",
    format: "currency",
    trend: "up",
    change: 5.9,
    category: "financial",
  },
  {
    id: "metric-2",
    name: "New Customers",
    value: 342,
    previousValue: 298,
    unit: "",
    format: "number",
    trend: "up",
    change: 14.8,
    category: "sales",
  },
  {
    id: "metric-3",
    name: "Conversion Rate",
    value: 24.5,
    previousValue: 26.2,
    unit: "%",
    format: "percentage",
    trend: "down",
    change: -6.5,
    category: "marketing",
  },
  {
    id: "metric-4",
    name: "Customer Satisfaction",
    value: 4.6,
    previousValue: 4.8,
    unit: "/5",
    format: "number",
    trend: "down",
    change: -4.2,
    category: "customer",
  },
  {
    id: "metric-5",
    name: "Average Deal Size",
    value: 15400,
    previousValue: 14200,
    unit: "$",
    format: "currency",
    trend: "up",
    change: 8.5,
    category: "sales",
  },
  {
    id: "metric-6",
    name: "Sales Cycle Length",
    value: 45,
    previousValue: 52,
    unit: " days",
    format: "number",
    trend: "down",
    change: -13.5,
    category: "performance",
  },
]

const mockReports: Report[] = [
  {
    id: "report-1",
    name: "Monthly Sales Performance",
    description: "Comprehensive overview of sales metrics, pipeline, and team performance",
    category: "sales",
    type: "scheduled",
    status: "ready",
    lastGenerated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    nextScheduled: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000),
    frequency: "monthly",
    recipients: ["sales@company.com", "management@company.com"],
    metrics: ["Total Revenue", "New Customers", "Average Deal Size"],
    createdBy: "Sarah Johnson",
    createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
  },
  {
    id: "report-2",
    name: "Customer Acquisition Analysis",
    description: "Detailed analysis of customer acquisition channels and conversion rates",
    category: "marketing",
    type: "standard",
    status: "ready",
    lastGenerated: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    recipients: ["marketing@company.com"],
    metrics: ["Conversion Rate", "New Customers", "Customer Satisfaction"],
    createdBy: "Michael Chen",
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
  },
  {
    id: "report-3",
    name: "Weekly Pipeline Review",
    description: "Weekly snapshot of sales pipeline, opportunities, and forecasts",
    category: "sales",
    type: "scheduled",
    status: "scheduled",
    lastGenerated: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    nextScheduled: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    frequency: "weekly",
    recipients: ["sales-team@company.com"],
    metrics: ["Sales Cycle Length", "Average Deal Size"],
    createdBy: "Emily Rodriguez",
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
  },
  {
    id: "report-4",
    name: "Customer Health Dashboard",
    description: "Real-time view of customer satisfaction, support tickets, and retention",
    category: "customer",
    type: "custom",
    status: "generating",
    lastGenerated: new Date(Date.now() - 3 * 60 * 60 * 1000),
    recipients: ["support@company.com", "success@company.com"],
    metrics: ["Customer Satisfaction"],
    createdBy: "David Park",
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
  },
]

const mockChartData: ChartData[] = [
  { name: "Jan", value: 980000, change: 5.2, trend: "up" },
  { name: "Feb", value: 1050000, change: 7.1, trend: "up" },
  { name: "Mar", value: 1180000, change: 12.4, trend: "up" },
  { name: "Apr", value: 1250000, change: 5.9, trend: "up" },
  { name: "May", value: 1320000, change: 5.6, trend: "up" },
  { name: "Jun", value: 1280000, change: -3.0, trend: "down" },
]

export default function CRMReportsPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedDateRange, setSelectedDateRange] = useState<Date | undefined>(new Date())
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedReport, setSelectedReport] = useState<string>("all")
  const [isGenerating, setIsGenerating] = useState(false)
  const [metrics, setMetrics] = useState<ReportMetric[]>(mockMetrics)
  const [reports, setReports] = useState<Report[]>(mockReports)

  // Filter reports based on category
  const filteredReports = reports.filter((report) => selectedCategory === "all" || report.category === selectedCategory)

  // Format metric value
  const formatMetricValue = (metric: ReportMetric): string => {
    switch (metric.format) {
      case "currency":
        return new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          minimumFractionDigits: 0,
        }).format(metric.value)
      case "percentage":
        return `${metric.value}%`
      default:
        return `${metric.value.toLocaleString()}${metric.unit}`
    }
  }

  // Get trend icon
  const getTrendIcon = (trend: string, isNegativeGood = false) => {
    if (trend === "stable") return <Minus className="h-4 w-4 text-muted-foreground" />

    const isPositive = trend === "up"
    const shouldShowGreen = isNegativeGood ? !isPositive : isPositive

    return isPositive ? (
      <ArrowUpRight className={`h-4 w-4 ${shouldShowGreen ? "text-green-500" : "text-red-500"}`} />
    ) : (
      <ArrowDownRight className={`h-4 w-4 ${shouldShowGreen ? "text-green-500" : "text-red-500"}`} />
    )
  }

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "ready":
        return "bg-green-500"
      case "generating":
        return "bg-blue-500"
      case "scheduled":
        return "bg-yellow-500"
      default:
        return "bg-gray-500"
    }
  }

  // Get category icon
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "sales":
        return <DollarSign className="h-4 w-4" />
      case "marketing":
        return <Target className="h-4 w-4" />
      case "customer":
        return <Users className="h-4 w-4" />
      case "performance":
        return <Activity className="h-4 w-4" />
      case "financial":
        return <BarChart3 className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  // Generate report
  const generateReport = async (reportId: string) => {
    setIsGenerating(true)
    try {
      // Simulate report generation
      await new Promise((resolve) => setTimeout(resolve, 3000))

      setReports((prev) =>
        prev.map((report) =>
          report.id === reportId ? { ...report, status: "ready", lastGenerated: new Date() } : report,
        ),
      )
    } catch (error) {
      console.error("Failed to generate report:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">CRM Reports</h1>
          <p className="text-muted-foreground">Comprehensive analytics and insights for your sales and customer data</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline">
            <Share className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button>
            <FileText className="h-4 w-4 mr-2" />
            Create Report
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Filters */}
          <div className="flex items-center gap-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="gap-2 bg-transparent">
                  <CalendarIcon className="h-4 w-4" />
                  {selectedDateRange ? format(selectedDateRange, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={selectedDateRange} onSelect={setSelectedDateRange} initialFocus />
              </PopoverContent>
            </Popover>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="sales">Sales</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
                <SelectItem value="customer">Customer</SelectItem>
                <SelectItem value="performance">Performance</SelectItem>
                <SelectItem value="financial">Financial</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {metrics.map((metric, index) => (
              <motion.div
                key={metric.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-muted-foreground">{metric.name}</p>
                      <Badge variant="outline" className="text-xs">
                        {metric.category}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-2xl font-bold">{formatMetricValue(metric)}</p>
                      <div className="flex items-center gap-1">
                        {getTrendIcon(metric.trend, metric.name.includes("Cycle") || metric.name.includes("Time"))}
                        <span
                          className={`text-sm font-medium ${
                            metric.trend === "up"
                              ? metric.name.includes("Cycle") || metric.name.includes("Time")
                                ? "text-green-500"
                                : "text-green-500"
                              : metric.trend === "down"
                                ? (
                                    metric.name.includes("Cycle") || metric.name.includes("Time")
                                      ? "text-green-500"
                                      : "text-red-500"
                                  )
                                : "text-muted-foreground"
                          }`}
                        >
                          {Math.abs(metric.change)}%
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      vs previous period: {formatMetricValue({ ...metric, value: metric.previousValue })}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Revenue Trend Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Revenue Trend</CardTitle>
              <CardDescription>Monthly revenue performance over the last 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <LineChart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Revenue trend chart would be displayed here</p>
                  <p className="text-sm">Integration with charting library required</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Insights */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Key Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Strong Revenue Growth</p>
                      <p className="text-sm text-muted-foreground">
                        Revenue increased by 5.9% this month, exceeding targets
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <TrendingUp className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Customer Acquisition Up</p>
                      <p className="text-sm text-muted-foreground">
                        New customer acquisitions increased by 14.8% this period
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Conversion Rate Declining</p>
                      <p className="text-sm text-muted-foreground">
                        Marketing conversion rate dropped by 6.5% - needs attention
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Performance vs Targets
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "Revenue Target", current: 1250000, target: 1200000, unit: "$" },
                    { name: "New Customers", current: 342, target: 300, unit: "" },
                    { name: "Satisfaction Score", current: 4.6, target: 4.8, unit: "/5" },
                  ].map((item) => {
                    const percentage = (item.current / item.target) * 100
                    const isAboveTarget = percentage >= 100

                    return (
                      <div key={item.name} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>{item.name}</span>
                          <span className={`font-medium ${isAboveTarget ? "text-green-600" : "text-red-600"}`}>
                            {item.unit === "$" ? "$" : ""}
                            {item.current.toLocaleString()}
                            {item.unit !== "$" ? item.unit : ""} / {item.unit === "$" ? "$" : ""}
                            {item.target.toLocaleString()}
                            {item.unit !== "$" ? item.unit : ""}
                          </span>
                        </div>
                        <Progress
                          value={Math.min(percentage, 100)}
                          className={`h-2 ${isAboveTarget ? "" : "bg-red-100"}`}
                        />
                        <p className="text-xs text-muted-foreground">
                          {percentage.toFixed(1)}% of target {isAboveTarget ? "achieved" : "remaining"}
                        </p>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports" className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="sales">Sales</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="customer">Customer</SelectItem>
                  <SelectItem value="performance">Performance</SelectItem>
                  <SelectItem value="financial">Financial</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button>
              <FileText className="h-4 w-4 mr-2" />
              Create Custom Report
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredReports.map((report, index) => (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">{getCategoryIcon(report.category)}</div>
                        <div>
                          <CardTitle className="text-lg">{report.name}</CardTitle>
                          <CardDescription className="mt-1">{report.description}</CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${getStatusColor(report.status)}`} />
                        <Badge variant="outline" className="text-xs capitalize">
                          {report.status}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="font-medium">Type</p>
                          <p className="text-muted-foreground capitalize">{report.type}</p>
                        </div>
                        <div>
                          <p className="font-medium">Category</p>
                          <p className="text-muted-foreground capitalize">{report.category}</p>
                        </div>
                        <div>
                          <p className="font-medium">Last Generated</p>
                          <p className="text-muted-foreground">{report.lastGenerated.toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="font-medium">Created By</p>
                          <p className="text-muted-foreground">{report.createdBy}</p>
                        </div>
                      </div>

                      {report.frequency && (
                        <div>
                          <p className="font-medium text-sm">Schedule</p>
                          <p className="text-muted-foreground text-sm capitalize">
                            {report.frequency}
                            {report.nextScheduled && <span> - Next: {report.nextScheduled.toLocaleDateString()}</span>}
                          </p>
                        </div>
                      )}

                      <div>
                        <p className="font-medium text-sm mb-2">Key Metrics</p>
                        <div className="flex flex-wrap gap-1">
                          {report.metrics.map((metric) => (
                            <Badge key={metric} variant="secondary" className="text-xs">
                              {metric}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <Separator />

                      <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => generateReport(report.id)}
                            disabled={isGenerating || report.status === "generating"}
                          >
                            {report.status === "generating" ? (
                              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                            ) : (
                              <Eye className="h-4 w-4 mr-2" />
                            )}
                            {report.status === "generating" ? "Generating..." : "View"}
                          </Button>
                          <Button size="sm" variant="outline">
                            <Download className="h-4 w-4 mr-2" />
                            Export
                          </Button>
                        </div>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Report Usage */}
            <Card>
              <CardHeader>
                <CardTitle>Report Usage Analytics</CardTitle>
                <CardDescription>Most accessed and valuable reports</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "Monthly Sales Performance", views: 156, trend: "up" },
                    { name: "Customer Acquisition Analysis", views: 89, trend: "up" },
                    { name: "Weekly Pipeline Review", views: 234, trend: "stable" },
                    { name: "Customer Health Dashboard", views: 67, trend: "down" },
                  ].map((item) => (
                    <div key={item.name} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">{item.name}</p>
                        <p className="text-xs text-muted-foreground">{item.views} views this month</p>
                      </div>
                      {getTrendIcon(item.trend)}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Performance Insights */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Insights</CardTitle>
                <CardDescription>Key insights from your data analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <TrendingUp className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Revenue Acceleration</p>
                      <p className="text-xs text-muted-foreground">Q2 revenue growth is 23% higher than Q1</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Users className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Customer Retention</p>
                      <p className="text-xs text-muted-foreground">Customer retention rate improved to 94.2%</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-purple-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Sales Efficiency</p>
                      <p className="text-xs text-muted-foreground">Average sales cycle reduced by 13.5%</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Analytics Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Comprehensive Analytics Dashboard</CardTitle>
              <CardDescription>Interactive charts and detailed breakdowns of your CRM data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <PieChart className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">Advanced Analytics Dashboard</p>
                  <p className="text-sm">
                    Interactive charts, drill-down capabilities, and real-time data visualization
                  </p>
                  <p className="text-xs mt-2">Integration with charting library required for full functionality</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Scheduled Tab */}
        <TabsContent value="scheduled" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Scheduled Reports</h2>
              <p className="text-muted-foreground">Manage automated report generation and distribution</p>
            </div>
            <Button>
              <CalendarIcon className="h-4 w-4 mr-2" />
              Schedule New Report
            </Button>
          </div>

          <div className="space-y-4">
            {reports
              .filter((report) => report.type === "scheduled")
              .map((report, index) => (
                <motion.div
                  key={report.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="p-2 rounded-lg bg-primary/10">{getCategoryIcon(report.category)}</div>
                          <div>
                            <h3 className="font-semibold">{report.name}</h3>
                            <p className="text-sm text-muted-foreground">{report.description}</p>
                            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                              <span>Frequency: {report.frequency}</span>
                              <span>Recipients: {report.recipients.length}</span>
                              {report.nextScheduled && <span>Next: {report.nextScheduled.toLocaleDateString()}</span>}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${getStatusColor(report.status)}`} />
                          <Badge variant="outline" className="text-xs capitalize">
                            {report.status}
                          </Badge>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
