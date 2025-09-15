"use client"

import { DropdownMenuItem } from "@/components/ui/dropdown-menu"

import { DropdownMenuContent } from "@/components/ui/dropdown-menu"

import { DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

import { DropdownMenu } from "@/components/ui/dropdown-menu"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Shield,
  Users,
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  Cpu,
  Brain,
  Zap,
  Lock,
  RefreshCw,
  Download,
  MoreHorizontal,
} from "lucide-react"
import { toast } from "sonner"

interface SystemMetrics {
  cpu: number
  memory: number
  disk: number
  network: number
  uptime: string
  activeUsers: number
  totalTenants: number
  securityScore: number
  complianceScore: number
}

interface SecurityAlert {
  id: string
  type: "critical" | "warning" | "info"
  title: string
  description: string
  timestamp: string
  status: "new" | "acknowledged" | "resolved"
}

interface UserActivity {
  id: string
  user: string
  action: string
  resource: string
  timestamp: string
  status: "success" | "failed" | "pending"
  ip: string
  location: string
}

interface AIInsight {
  id: string
  type: "optimization" | "security" | "performance" | "cost"
  title: string
  description: string
  confidence: number
  impact: "low" | "medium" | "high"
  recommendation: string
  timestamp: string
}

export function AdminModule() {
  const [activeTab, setActiveTab] = useState("overview")
  const [loading, setLoading] = useState(false)
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics>({
    cpu: 67,
    memory: 72,
    disk: 45,
    network: 23,
    uptime: "15d 7h 23m",
    activeUsers: 1247,
    totalTenants: 156,
    securityScore: 94,
    complianceScore: 98,
  })

  const [securityAlerts, setSecurityAlerts] = useState<SecurityAlert[]>([
    {
      id: "1",
      type: "critical",
      title: "Suspicious Login Activity",
      description: "Multiple failed login attempts detected from IP 192.168.1.100",
      timestamp: "2 minutes ago",
      status: "new",
    },
    {
      id: "2",
      type: "warning",
      title: "High CPU Usage",
      description: "CPU usage has been above 80% for the last 15 minutes",
      timestamp: "15 minutes ago",
      status: "acknowledged",
    },
    {
      id: "3",
      type: "info",
      title: "System Update Available",
      description: "Security update v2.1.4 is available for installation",
      timestamp: "1 hour ago",
      status: "new",
    },
  ])

  const [userActivity, setUserActivity] = useState<UserActivity[]>([
    {
      id: "1",
      user: "john.doe@acme.com",
      action: "Login",
      resource: "Admin Dashboard",
      timestamp: "2 minutes ago",
      status: "success",
      ip: "192.168.1.50",
      location: "New York, US",
    },
    {
      id: "2",
      user: "sarah.smith@techcorp.com",
      action: "Create",
      resource: "User Account",
      timestamp: "5 minutes ago",
      status: "success",
      ip: "10.0.0.25",
      location: "San Francisco, US",
    },
    {
      id: "3",
      user: "admin@system.local",
      action: "Update",
      resource: "Security Policy",
      timestamp: "10 minutes ago",
      status: "success",
      ip: "127.0.0.1",
      location: "Local",
    },
  ])

  const [aiInsights, setAiInsights] = useState<AIInsight[]>([
    {
      id: "1",
      type: "optimization",
      title: "Database Query Optimization",
      description: "Detected slow queries that can be optimized for 23% performance improvement",
      confidence: 92,
      impact: "high",
      recommendation: "Add indexes to frequently queried columns",
      timestamp: "1 hour ago",
    },
    {
      id: "2",
      type: "security",
      title: "Unusual Access Pattern",
      description: "AI detected unusual access patterns from 3 user accounts",
      confidence: 78,
      impact: "medium",
      recommendation: "Review user permissions and enable additional monitoring",
      timestamp: "2 hours ago",
    },
    {
      id: "3",
      type: "cost",
      title: "Resource Optimization",
      description: "Identified underutilized resources that could save $1,200/month",
      confidence: 85,
      impact: "medium",
      recommendation: "Scale down unused compute instances",
      timestamp: "3 hours ago",
    },
  ])

  const refreshMetrics = async () => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Update metrics with slight variations
      setSystemMetrics((prev) => ({
        ...prev,
        cpu: Math.max(30, Math.min(90, prev.cpu + (Math.random() - 0.5) * 10)),
        memory: Math.max(40, Math.min(95, prev.memory + (Math.random() - 0.5) * 8)),
        disk: Math.max(20, Math.min(80, prev.disk + (Math.random() - 0.5) * 5)),
        network: Math.max(10, Math.min(50, prev.network + (Math.random() - 0.5) * 15)),
        activeUsers: prev.activeUsers + Math.floor((Math.random() - 0.5) * 20),
      }))

      toast.success("Metrics refreshed successfully")
    } catch (error) {
      toast.error("Failed to refresh metrics")
    } finally {
      setLoading(false)
    }
  }

  const handleAlertAction = async (alertId: string, action: "acknowledge" | "resolve" | "dismiss") => {
    try {
      setSecurityAlerts((prev) =>
        prev.map((alert) =>
          alert.id === alertId
            ? {
                ...alert,
                status: action === "dismiss" ? "resolved" : action === "acknowledge" ? "acknowledged" : "resolved",
              }
            : alert,
        ),
      )
      toast.success(`Alert ${action}d successfully`)
    } catch (error) {
      toast.error(`Failed to ${action} alert`)
    }
  }

  const implementAIRecommendation = async (insightId: string) => {
    try {
      setLoading(true)
      // Simulate implementation
      await new Promise((resolve) => setTimeout(resolve, 2000))

      setAiInsights((prev) => prev.filter((insight) => insight.id !== insightId))
      toast.success("AI recommendation implemented successfully")
    } catch (error) {
      toast.error("Failed to implement recommendation")
    } finally {
      setLoading(false)
    }
  }

  const exportData = async (type: string) => {
    try {
      setLoading(true)
      // Simulate export
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const data =
        type === "metrics"
          ? systemMetrics
          : type === "alerts"
            ? securityAlerts
            : type === "activity"
              ? userActivity
              : aiInsights

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `admin-${type}-${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast.success(`${type} data exported successfully`)
    } catch (error) {
      toast.error("Failed to export data")
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
      case "resolved":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "failed":
      case "critical":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "pending":
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case "acknowledged":
        return <Clock className="h-4 w-4 text-blue-500" />
      default:
        return <Activity className="h-4 w-4 text-gray-500" />
    }
  }

  const getAlertColor = (type: string) => {
    switch (type) {
      case "critical":
        return "border-red-200 bg-red-50"
      case "warning":
        return "border-yellow-200 bg-yellow-50"
      case "info":
        return "border-blue-200 bg-blue-50"
      default:
        return "border-gray-200 bg-gray-50"
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Auto-refresh metrics every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (activeTab === "overview") {
        refreshMetrics()
      }
    }, 30000)

    return () => clearInterval(interval)
  }, [activeTab])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Admin Control Center</h2>
          <p className="text-muted-foreground">AI-powered system monitoring and management dashboard</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => exportData("metrics")} disabled={loading}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm" onClick={refreshMetrics} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemMetrics.activeUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              +12% from last hour
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tenants</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemMetrics.totalTenants}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              +3 new this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security Score</CardTitle>
            <Lock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemMetrics.securityScore}%</div>
            <p className="text-xs text-muted-foreground">
              <CheckCircle className="h-3 w-3 inline mr-1 text-green-500" />
              Excellent
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Uptime</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemMetrics.uptime}</div>
            <p className="text-xs text-muted-foreground">
              <CheckCircle className="h-3 w-3 inline mr-1 text-green-500" />
              99.9% availability
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">System Overview</TabsTrigger>
          <TabsTrigger value="security">Security Center</TabsTrigger>
          <TabsTrigger value="activity">User Activity</TabsTrigger>
          <TabsTrigger value="ai-insights">AI Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* System Resources */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cpu className="h-5 w-5" />
                  System Resources
                </CardTitle>
                <CardDescription>Real-time resource utilization</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">CPU Usage</span>
                    <span className="text-sm text-muted-foreground">{systemMetrics.cpu}%</span>
                  </div>
                  <Progress value={systemMetrics.cpu} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Memory Usage</span>
                    <span className="text-sm text-muted-foreground">{systemMetrics.memory}%</span>
                  </div>
                  <Progress value={systemMetrics.memory} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Disk Usage</span>
                    <span className="text-sm text-muted-foreground">{systemMetrics.disk}%</span>
                  </div>
                  <Progress value={systemMetrics.disk} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Network I/O</span>
                    <span className="text-sm text-muted-foreground">{systemMetrics.network}%</span>
                  </div>
                  <Progress value={systemMetrics.network} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Compliance Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Compliance Status
                </CardTitle>
                <CardDescription>Regulatory compliance overview</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">{systemMetrics.complianceScore}%</div>
                  <p className="text-sm text-muted-foreground">Overall Compliance Score</p>
                </div>

                <div className="space-y-3">
                  {[
                    { name: "GDPR", status: "compliant", score: 98 },
                    { name: "SOC 2", status: "compliant", score: 96 },
                    { name: "ISO 27001", status: "compliant", score: 94 },
                    { name: "HIPAA", status: "review", score: 89 },
                  ].map((item) => (
                    <div key={item.name} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{item.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">{item.score}%</span>
                        {item.status === "compliant" ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-yellow-500" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Security Alerts</h3>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => exportData("alerts")}>
                <Download className="h-4 w-4 mr-2" />
                Export Alerts
              </Button>
              <Badge variant="destructive">{securityAlerts.filter((alert) => alert.status === "new").length} New</Badge>
            </div>
          </div>

          <div className="space-y-4">
            {securityAlerts.map((alert) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-lg border ${getAlertColor(alert.type)}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    {getStatusIcon(alert.type)}
                    <div>
                      <h4 className="font-semibold">{alert.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{alert.description}</p>
                      <p className="text-xs text-muted-foreground mt-2">{alert.timestamp}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={alert.status === "new" ? "destructive" : "secondary"}>{alert.status}</Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => handleAlertAction(alert.id, "acknowledge")}>
                          Acknowledge
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleAlertAction(alert.id, "resolve")}>
                          Resolve
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleAlertAction(alert.id, "dismiss")}>
                          Dismiss
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Recent User Activity</h3>
            <Button variant="outline" size="sm" onClick={() => exportData("activity")}>
              <Download className="h-4 w-4 mr-2" />
              Export Activity
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="space-y-0">
                {userActivity.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 border-b last:border-b-0"
                  >
                    <div className="flex items-center gap-3">
                      {getStatusIcon(activity.status)}
                      <div>
                        <p className="font-medium">{activity.user}</p>
                        <p className="text-sm text-muted-foreground">
                          {activity.action} {activity.resource}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {activity.location} • {activity.ip}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{activity.timestamp}</p>
                      <Badge variant={activity.status === "success" ? "default" : "destructive"}>
                        {activity.status}
                      </Badge>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai-insights" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">AI-Powered Insights</h3>
            <Button variant="outline" size="sm" onClick={() => exportData("insights")}>
              <Download className="h-4 w-4 mr-2" />
              Export Insights
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {aiInsights.map((insight) => (
              <motion.div
                key={insight.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-6 rounded-lg border bg-gradient-to-br from-blue-50 to-indigo-50"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-blue-600" />
                    <Badge className={getImpactColor(insight.impact)}>{insight.impact} impact</Badge>
                  </div>
                  <Badge variant="outline">{insight.confidence}% confidence</Badge>
                </div>

                <h4 className="font-semibold mb-2">{insight.title}</h4>
                <p className="text-sm text-muted-foreground mb-4">{insight.description}</p>

                <div className="bg-white/50 p-3 rounded border mb-4">
                  <p className="text-sm font-medium mb-1">Recommendation:</p>
                  <p className="text-sm text-muted-foreground">{insight.recommendation}</p>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{insight.timestamp}</span>
                  <Button size="sm" onClick={() => implementAIRecommendation(insight.id)} disabled={loading}>
                    <Zap className="h-4 w-4 mr-2" />
                    Implement
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>

          {aiInsights.length === 0 && (
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <div className="text-center">
                  <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No AI Insights Available</h3>
                  <p className="text-muted-foreground">
                    AI is analyzing your system. Check back later for recommendations.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
