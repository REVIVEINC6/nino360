"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import {
  Brain,
  Target,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  Activity,
  Lightbulb,
  MessageSquare,
  Settings,
  RefreshCw,
  Download,
  Share,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Filter,
  MoreHorizontal,
} from "lucide-react"
import AIChatInterface from "@/components/ai/ai-chat-interface"

// Types
interface Insight {
  id: string
  title: string
  description: string
  type: "positive" | "negative" | "neutral" | "warning"
  impact: "high" | "medium" | "low"
  category: "performance" | "efficiency" | "cost" | "quality" | "compliance" | "growth"
  value?: number
  change?: number
  trend?: "up" | "down" | "stable"
  timestamp: Date
  source: string
  actionable: boolean
  actions?: string[]
}

interface Metric {
  id: string
  name: string
  value: number
  previousValue: number
  unit: string
  format: "number" | "percentage" | "currency" | "duration"
  category: string
  trend: "up" | "down" | "stable"
  target?: number
  benchmark?: number
  lastUpdated: Date
}

interface Prediction {
  id: string
  title: string
  description: string
  confidence: number
  timeframe: string
  impact: "high" | "medium" | "low"
  category: string
  probability: number
  factors: string[]
  recommendations: string[]
}

interface AIInsightsData {
  insights: Insight[]
  metrics: Metric[]
  predictions: Prediction[]
  summary: {
    totalInsights: number
    criticalAlerts: number
    improvementOpportunities: number
    performanceScore: number
    lastUpdated: Date
  }
}

// Mock data
const mockInsights: Insight[] = [
  {
    id: "insight-1",
    title: "Employee Productivity Surge",
    description:
      "Team productivity has increased by 23% this quarter, primarily driven by improved remote work policies and new collaboration tools.",
    type: "positive",
    impact: "high",
    category: "performance",
    value: 23,
    change: 5.2,
    trend: "up",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    source: "HRMS Analytics",
    actionable: true,
    actions: ["Scale successful practices", "Document best practices", "Share insights with other teams"],
  },
  {
    id: "insight-2",
    title: "Recruitment Cost Optimization",
    description:
      "AI-powered candidate screening has reduced time-to-hire by 40% and decreased recruitment costs by $50K this quarter.",
    type: "positive",
    impact: "high",
    category: "cost",
    value: 50000,
    change: -15.3,
    trend: "down",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    source: "Talent Management",
    actionable: true,
    actions: ["Expand AI screening", "Train recruiters", "Optimize job postings"],
  },
  {
    id: "insight-3",
    title: "Customer Satisfaction Decline",
    description:
      "Customer satisfaction scores have dropped by 8% in the past month, with response time being the primary concern.",
    type: "negative",
    impact: "medium",
    category: "quality",
    value: -8,
    change: -2.1,
    trend: "down",
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
    source: "CRM Analytics",
    actionable: true,
    actions: ["Improve response times", "Additional training", "Process optimization"],
  },
  {
    id: "insight-4",
    title: "Compliance Risk Alert",
    description:
      "Several processes are approaching compliance deadlines. Immediate action required to avoid potential penalties.",
    type: "warning",
    impact: "high",
    category: "compliance",
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
    source: "Compliance Monitor",
    actionable: true,
    actions: ["Review pending items", "Assign responsible parties", "Set up automated reminders"],
  },
]

const mockMetrics: Metric[] = [
  {
    id: "metric-1",
    name: "Employee Satisfaction",
    value: 87,
    previousValue: 82,
    unit: "%",
    format: "percentage",
    category: "HR",
    trend: "up",
    target: 90,
    benchmark: 85,
    lastUpdated: new Date(),
  },
  {
    id: "metric-2",
    name: "Revenue Growth",
    value: 125000,
    previousValue: 118000,
    unit: "$",
    format: "currency",
    category: "Finance",
    trend: "up",
    target: 130000,
    benchmark: 120000,
    lastUpdated: new Date(),
  },
  {
    id: "metric-3",
    name: "Customer Retention",
    value: 94.2,
    previousValue: 96.1,
    unit: "%",
    format: "percentage",
    category: "Sales",
    trend: "down",
    target: 95,
    benchmark: 92,
    lastUpdated: new Date(),
  },
  {
    id: "metric-4",
    name: "Average Response Time",
    value: 2.3,
    previousValue: 3.1,
    unit: "hours",
    format: "duration",
    category: "Support",
    trend: "down",
    target: 2,
    benchmark: 4,
    lastUpdated: new Date(),
  },
]

const mockPredictions: Prediction[] = [
  {
    id: "pred-1",
    title: "Q4 Revenue Forecast",
    description: "Based on current trends, Q4 revenue is projected to exceed targets by 12%",
    confidence: 87,
    timeframe: "Next Quarter",
    impact: "high",
    category: "Revenue",
    probability: 0.87,
    factors: ["Seasonal trends", "New product launches", "Market expansion"],
    recommendations: ["Increase inventory", "Scale marketing", "Prepare for demand"],
  },
  {
    id: "pred-2",
    title: "Talent Shortage Risk",
    description: "High probability of talent shortage in engineering roles within 6 months",
    confidence: 73,
    timeframe: "6 months",
    impact: "medium",
    category: "HR",
    probability: 0.73,
    factors: ["Market competition", "Skill requirements", "Compensation trends"],
    recommendations: ["Start early recruitment", "Upskill current team", "Review compensation"],
  },
]

export default function AIInsightsDrawer({
  trigger,
  module = "general",
  context = {},
}: {
  trigger?: React.ReactNode
  module?: string
  context?: Record<string, any>
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("chat")
  const [data, setData] = useState<AIInsightsData>({
    insights: mockInsights,
    metrics: mockMetrics,
    predictions: mockPredictions,
    summary: {
      totalInsights: mockInsights.length,
      criticalAlerts: mockInsights.filter((i) => i.type === "warning" || i.impact === "high").length,
      improvementOpportunities: mockInsights.filter((i) => i.actionable).length,
      performanceScore: 78,
      lastUpdated: new Date(),
    },
  })
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Refresh data
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))
      // In real implementation, fetch fresh data from API
      setData((prev) => ({
        ...prev,
        summary: {
          ...prev.summary,
          lastUpdated: new Date(),
        },
      }))
    } catch (error) {
      console.error("Failed to refresh insights:", error)
    } finally {
      setIsRefreshing(false)
    }
  }, [])

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(handleRefresh, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [handleRefresh])

  // Format metric value
  const formatMetricValue = (metric: Metric): string => {
    switch (metric.format) {
      case "currency":
        return new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          minimumFractionDigits: 0,
        }).format(metric.value)
      case "percentage":
        return `${metric.value}%`
      case "duration":
        return `${metric.value} ${metric.unit}`
      default:
        return `${metric.value.toLocaleString()} ${metric.unit}`
    }
  }

  // Get trend icon
  const getTrendIcon = (trend: "up" | "down" | "stable", type?: "positive" | "negative") => {
    if (trend === "stable") return <Minus className="h-4 w-4 text-muted-foreground" />
    if (trend === "up") {
      return type === "negative" ? (
        <ArrowUpRight className="h-4 w-4 text-red-500" />
      ) : (
        <ArrowUpRight className="h-4 w-4 text-green-500" />
      )
    }
    return type === "negative" ? (
      <ArrowDownRight className="h-4 w-4 text-green-500" />
    ) : (
      <ArrowDownRight className="h-4 w-4 text-red-500" />
    )
  }

  // Get insight icon
  const getInsightIcon = (type: string) => {
    switch (type) {
      case "positive":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "negative":
        return <AlertTriangle className="h-5 w-5 text-red-500" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      default:
        return <Lightbulb className="h-5 w-5 text-blue-500" />
    }
  }

  const defaultTrigger = (
    <Button variant="outline" className="gap-2 bg-transparent">
      <Brain className="h-4 w-4" />
      AI Insights
      {data.summary.criticalAlerts > 0 && (
        <Badge variant="destructive" className="ml-1 h-5 w-5 p-0 text-xs">
          {data.summary.criticalAlerts}
        </Badge>
      )}
    </Button>
  )

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>{trigger || defaultTrigger}</SheetTrigger>
      <SheetContent side="right" className="w-full sm:w-[600px] lg:w-[800px] p-0">
        <div className="flex flex-col h-full">
          <SheetHeader className="p-6 pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Brain className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <SheetTitle className="text-xl">AI Insights</SheetTitle>
                  <SheetDescription className="capitalize">{module} Module Intelligence</SheetDescription>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
                  <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
                </Button>
                <Button variant="ghost" size="sm">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </SheetHeader>

          <div className="flex-1 overflow-hidden">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
              <div className="px-6">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="chat" className="gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Chat
                  </TabsTrigger>
                  <TabsTrigger value="insights" className="gap-2">
                    <Lightbulb className="h-4 w-4" />
                    Insights
                    {data.summary.criticalAlerts > 0 && (
                      <Badge variant="destructive" className="ml-1 h-4 w-4 p-0 text-xs">
                        {data.summary.criticalAlerts}
                      </Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="metrics" className="gap-2">
                    <BarChart3 className="h-4 w-4" />
                    Metrics
                  </TabsTrigger>
                </TabsList>
              </div>

              <div className="flex-1 overflow-hidden">
                <TabsContent value="chat" className="h-full m-0 p-6 pt-4">
                  <AIChatInterface module={module} context={context} className="h-full" />
                </TabsContent>

                <TabsContent value="insights" className="h-full m-0 p-6 pt-4">
                  <ScrollArea className="h-full">
                    <div className="space-y-6">
                      {/* Summary Cards */}
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <Card>
                          <CardContent className="p-4">
                            <div className="flex items-center gap-2">
                              <Lightbulb className="h-4 w-4 text-blue-500" />
                              <span className="text-sm font-medium">Total Insights</span>
                            </div>
                            <p className="text-2xl font-bold mt-1">{data.summary.totalInsights}</p>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="p-4">
                            <div className="flex items-center gap-2">
                              <AlertTriangle className="h-4 w-4 text-red-500" />
                              <span className="text-sm font-medium">Critical Alerts</span>
                            </div>
                            <p className="text-2xl font-bold mt-1">{data.summary.criticalAlerts}</p>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="p-4">
                            <div className="flex items-center gap-2">
                              <Target className="h-4 w-4 text-green-500" />
                              <span className="text-sm font-medium">Opportunities</span>
                            </div>
                            <p className="text-2xl font-bold mt-1">{data.summary.improvementOpportunities}</p>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="p-4">
                            <div className="flex items-center gap-2">
                              <Activity className="h-4 w-4 text-purple-500" />
                              <span className="text-sm font-medium">Performance</span>
                            </div>
                            <div className="mt-1">
                              <p className="text-2xl font-bold">{data.summary.performanceScore}%</p>
                              <Progress value={data.summary.performanceScore} className="h-1 mt-1" />
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      {/* Insights List */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold">Recent Insights</h3>
                          <Button variant="outline" size="sm">
                            <Filter className="h-4 w-4 mr-2" />
                            Filter
                          </Button>
                        </div>
                        {data.insights.map((insight, index) => (
                          <motion.div
                            key={insight.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                          >
                            <Card className="hover:shadow-md transition-shadow">
                              <CardContent className="p-4">
                                <div className="flex items-start gap-3">
                                  {getInsightIcon(insight.type)}
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                      <h4 className="font-semibold">{insight.title}</h4>
                                      <Badge
                                        variant={
                                          insight.impact === "high"
                                            ? "destructive"
                                            : insight.impact === "medium"
                                              ? "default"
                                              : "secondary"
                                        }
                                        className="text-xs"
                                      >
                                        {insight.impact} impact
                                      </Badge>
                                      <Badge variant="outline" className="text-xs">
                                        {insight.category}
                                      </Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground mb-3">{insight.description}</p>
                                    {insight.actions && insight.actions.length > 0 && (
                                      <div className="space-y-2">
                                        <p className="text-xs font-medium">Recommended Actions:</p>
                                        <div className="flex flex-wrap gap-2">
                                          {insight.actions.map((action, actionIndex) => (
                                            <Button
                                              key={actionIndex}
                                              variant="outline"
                                              size="sm"
                                              className="h-7 text-xs bg-transparent"
                                            >
                                              {action}
                                            </Button>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                    <div className="flex items-center justify-between mt-3 pt-3 border-t">
                                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                        <span>{insight.source}</span>
                                        <span>{insight.timestamp.toLocaleTimeString()}</span>
                                      </div>
                                      {insight.trend && insight.value && (
                                        <div className="flex items-center gap-1">
                                          {getTrendIcon(insight.trend, insight.type)}
                                          <span className="text-sm font-medium">
                                            {insight.value > 0 ? "+" : ""}
                                            {insight.value}
                                            {insight.category === "cost" ? "" : "%"}
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        ))}
                      </div>

                      {/* Predictions */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">AI Predictions</h3>
                        {data.predictions.map((prediction, index) => (
                          <motion.div
                            key={prediction.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                          >
                            <Card>
                              <CardContent className="p-4">
                                <div className="flex items-start gap-3">
                                  <div className="p-2 rounded-lg bg-purple-100">
                                    <Sparkles className="h-4 w-4 text-purple-600" />
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                      <h4 className="font-semibold">{prediction.title}</h4>
                                      <Badge variant="outline" className="text-xs">
                                        {prediction.confidence}% confidence
                                      </Badge>
                                      <Badge variant="secondary" className="text-xs">
                                        {prediction.timeframe}
                                      </Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground mb-3">{prediction.description}</p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      <div>
                                        <p className="text-xs font-medium mb-2">Key Factors:</p>
                                        <ul className="text-xs text-muted-foreground space-y-1">
                                          {prediction.factors.map((factor, factorIndex) => (
                                            <li key={factorIndex} className="flex items-center gap-2">
                                              <div className="w-1 h-1 bg-muted-foreground rounded-full" />
                                              {factor}
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                      <div>
                                        <p className="text-xs font-medium mb-2">Recommendations:</p>
                                        <div className="flex flex-wrap gap-1">
                                          {prediction.recommendations.map((rec, recIndex) => (
                                            <Badge key={recIndex} variant="outline" className="text-xs">
                                              {rec}
                                            </Badge>
                                          ))}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="metrics" className="h-full m-0 p-6 pt-4">
                  <ScrollArea className="h-full">
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">Key Performance Metrics</h3>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Export
                          </Button>
                          <Button variant="outline" size="sm">
                            <Share className="h-4 w-4 mr-2" />
                            Share
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {data.metrics.map((metric, index) => (
                          <motion.div
                            key={metric.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                          >
                            <Card className="hover:shadow-md transition-shadow">
                              <CardContent className="p-4">
                                <div className="flex items-center justify-between mb-3">
                                  <div>
                                    <h4 className="font-semibold text-sm">{metric.name}</h4>
                                    <p className="text-xs text-muted-foreground">{metric.category}</p>
                                  </div>
                                  <Badge variant="outline" className="text-xs">
                                    {metric.category}
                                  </Badge>
                                </div>

                                <div className="flex items-end justify-between mb-3">
                                  <div>
                                    <p className="text-2xl font-bold">{formatMetricValue(metric)}</p>
                                    <div className="flex items-center gap-1 mt-1">
                                      {getTrendIcon(metric.trend)}
                                      <span className="text-xs text-muted-foreground">
                                        vs {formatMetricValue({ ...metric, value: metric.previousValue })}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-xs text-muted-foreground">Target</p>
                                    <p className="text-sm font-medium">
                                      {metric.target ? formatMetricValue({ ...metric, value: metric.target }) : "N/A"}
                                    </p>
                                  </div>
                                </div>

                                {metric.target && (
                                  <div className="space-y-2">
                                    <div className="flex justify-between text-xs">
                                      <span>Progress to Target</span>
                                      <span>{Math.round((metric.value / metric.target) * 100)}%</span>
                                    </div>
                                    <Progress value={(metric.value / metric.target) * 100} className="h-2" />
                                  </div>
                                )}

                                <div className="flex items-center justify-between mt-3 pt-3 border-t text-xs text-muted-foreground">
                                  <span>Updated {metric.lastUpdated.toLocaleTimeString()}</span>
                                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                    <MoreHorizontal className="h-3 w-3" />
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </ScrollArea>
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

// Named exports for compatibility
export { AIInsightsDrawer }
export { AIInsightsDrawer as AiInsightsDrawer }
