"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Building2,
  Users,
  Activity,
  TrendingUp,
  DollarSign,
  Shield,
  Bell,
  BarChart3,
  CheckCircle,
  AlertTriangle,
  Zap,
  UserPlus,
  RefreshCw,
  Eye,
  ArrowUpRight,
  Clock,
  Server,
} from "lucide-react"
import { useRouter } from "next/navigation"

interface TenantMetric {
  label: string
  value: string | number
  change: string
  trend: "up" | "down" | "neutral"
  icon: any
  color: string
}

interface TenantAlert {
  id: string
  type: "info" | "warning" | "error" | "success"
  title: string
  message: string
  timestamp: Date
  actionRequired: boolean
  action?: () => void
}

interface SystemHealth {
  metric: string
  value: number
  status: "good" | "warning" | "critical"
  description: string
}

export default function TenantOverview() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedTab, setSelectedTab] = useState("overview")
  const [metrics, setMetrics] = useState<TenantMetric[]>([])
  const [alerts, setAlerts] = useState<TenantAlert[]>([])
  const [systemHealth, setSystemHealth] = useState<SystemHealth[]>([])

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setMetrics([
      {
        label: "Active Tenants",
        value: 247,
        change: "+12%",
        trend: "up",
        icon: Building2,
        color: "text-blue-600",
      },
      {
        label: "Total Users",
        value: "15.2K",
        change: "+8.5%",
        trend: "up",
        icon: Users,
        color: "text-green-600",
      },
      {
        label: "System Uptime",
        value: "99.9%",
        change: "+0.1%",
        trend: "up",
        icon: Activity,
        color: "text-emerald-600",
      },
      {
        label: "Monthly Revenue",
        value: "$124K",
        change: "+15.3%",
        trend: "up",
        icon: DollarSign,
        color: "text-purple-600",
      },
    ])

    setAlerts([
      {
        id: "1",
        type: "warning",
        title: "Storage Limit Approaching",
        message: "Tenant 'Acme Corp' is at 85% of their storage limit",
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        actionRequired: true,
        action: () => router.push("/tenant/data"),
      },
      {
        id: "2",
        type: "info",
        title: "New Tenant Onboarded",
        message: "TechStart Inc. has been successfully onboarded",
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        actionRequired: false,
      },
      {
        id: "3",
        type: "error",
        title: "Integration Failure",
        message: "Salesforce integration failed for GlobalTech Ltd",
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        actionRequired: true,
        action: () => router.push("/tenant/integrations"),
      },
      {
        id: "4",
        type: "success",
        title: "Backup Completed",
        message: "Daily backup completed successfully for all tenants",
        timestamp: new Date(Date.now() - 45 * 60 * 1000),
        actionRequired: false,
      },
    ])

    setSystemHealth([
      { metric: "CPU Usage", value: 45, status: "good", description: "Normal operation" },
      { metric: "Memory Usage", value: 62, status: "good", description: "Within acceptable range" },
      { metric: "Storage Usage", value: 78, status: "warning", description: "Consider cleanup" },
      { metric: "Network I/O", value: 34, status: "good", description: "Low traffic" },
    ])

    setIsLoading(false)
  }

  const refreshData = async () => {
    await loadDashboardData()
  }

  const getAlertIcon = (type: TenantAlert["type"]) => {
    switch (type) {
      case "error":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      default:
        return <Bell className="h-4 w-4 text-blue-500" />
    }
  }

  const getAlertBadgeColor = (type: TenantAlert["type"]) => {
    switch (type) {
      case "error":
        return "bg-red-100 text-red-800 border-red-200"
      case "warning":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "success":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-blue-100 text-blue-800 border-blue-200"
    }
  }

  const getHealthColor = (status: SystemHealth["status"]) => {
    switch (status) {
      case "critical":
        return "text-red-600"
      case "warning":
        return "text-yellow-600"
      default:
        return "text-green-600"
    }
  }

  const quickActions = [
    {
      title: "Add Tenant",
      description: "Onboard new tenant",
      icon: UserPlus,
      action: () => router.push("/tenant/onboarding"),
      color: "bg-blue-500 hover:bg-blue-600",
    },
    {
      title: "View Directory",
      description: "Browse all tenants",
      icon: Building2,
      action: () => router.push("/tenant/directory"),
      color: "bg-green-500 hover:bg-green-600",
    },
    {
      title: "Analytics",
      description: "View detailed reports",
      icon: BarChart3,
      action: () => router.push("/tenant/analytics"),
      color: "bg-purple-500 hover:bg-purple-600",
    },
    {
      title: "Security",
      description: "Manage security settings",
      icon: Shield,
      action: () => router.push("/tenant/security"),
      color: "bg-red-500 hover:bg-red-600",
    },
  ]

  if (isLoading) {
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

  return (
    <div className="flex-1 space-y-6 p-6 bg-gradient-to-br from-gray-50 to-white">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tenant Management Dashboard</h1>
          <p className="text-muted-foreground">Monitor and manage all tenant operations from a centralized dashboard</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={refreshData} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button
            onClick={() => router.push("/tenant/analytics")}
            className="bg-gradient-to-r from-purple-500 to-blue-500"
          >
            <Eye className="h-4 w-4 mr-2" />
            View Analytics
          </Button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric, index) => {
          const IconComponent = metric.icon
          return (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="border-0 shadow-md bg-white/60 backdrop-blur-sm hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{metric.label}</CardTitle>
                  <IconComponent className={`h-4 w-4 ${metric.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metric.value}</div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <ArrowUpRight className={`h-3 w-3 mr-1 ${metric.color}`} />
                    <span className={metric.color}>{metric.change} from last month</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Main Content Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="health">System Health</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
          <TabsTrigger value="actions">Quick Actions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Recent Activity */}
            <Card className="border-0 shadow-md bg-white/60 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
                <CardDescription>Latest tenant management activities</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-white/50">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">New tenant "DataFlow Ltd" onboarded</p>
                      <p className="text-xs text-muted-foreground">2 minutes ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-white/50">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">User permissions updated for Acme Corp</p>
                      <p className="text-xs text-muted-foreground">15 minutes ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-white/50">
                    <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Billing cycle completed for 45 tenants</p>
                      <p className="text-xs text-muted-foreground">1 hour ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-white/50">
                    <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">System maintenance completed</p>
                      <p className="text-xs text-muted-foreground">3 hours ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Top Tenants */}
            <Card className="border-0 shadow-md bg-white/60 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Top Performing Tenants
                </CardTitle>
                <CardDescription>Tenants with highest activity and revenue</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {[
                    { name: "Acme Corporation", users: 245, revenue: "$125K", growth: "+15%" },
                    { name: "TechStart Inc", users: 189, revenue: "$89K", growth: "+12%" },
                    { name: "Global Solutions", users: 156, revenue: "$78K", growth: "+8%" },
                    { name: "DataFlow Ltd", users: 134, revenue: "$67K", growth: "+22%" },
                  ].map((tenant, index) => (
                    <div key={tenant.name} className="flex items-center justify-between p-3 rounded-lg bg-white/50">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-medium">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{tenant.name}</p>
                          <p className="text-xs text-muted-foreground">{tenant.users} users</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-sm">{tenant.revenue}</p>
                        <p className="text-xs text-green-600">{tenant.growth}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="health" className="space-y-6">
          <Card className="border-0 shadow-md bg-white/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="h-5 w-5" />
                System Health Monitoring
              </CardTitle>
              <CardDescription>Real-time system performance metrics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {systemHealth.map((health, index) => (
                <motion.div
                  key={health.metric}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{health.metric}</span>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-medium ${getHealthColor(health.status)}`}>{health.value}%</span>
                      <Badge
                        variant="outline"
                        className={`text-xs ${
                          health.status === "critical"
                            ? "border-red-200 text-red-800"
                            : health.status === "warning"
                              ? "border-yellow-200 text-yellow-800"
                              : "border-green-200 text-green-800"
                        }`}
                      >
                        {health.status}
                      </Badge>
                    </div>
                  </div>
                  <Progress
                    value={health.value}
                    className={`h-2 ${
                      health.status === "critical"
                        ? "[&>div]:bg-red-500"
                        : health.status === "warning"
                          ? "[&>div]:bg-yellow-500"
                          : "[&>div]:bg-green-500"
                    }`}
                  />
                  <p className="text-xs text-muted-foreground">{health.description}</p>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-6">
          <Card className="border-0 shadow-md bg-white/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                System Alerts & Notifications
              </CardTitle>
              <CardDescription>Recent alerts and system notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {alerts.map((alert, index) => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-start gap-3 p-4 rounded-lg bg-white/50 hover:bg-white/70 transition-colors"
                >
                  {getAlertIcon(alert.type)}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium">{alert.title}</h4>
                      <Badge variant="outline" className={`text-xs ${getAlertBadgeColor(alert.type)}`}>
                        {alert.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{alert.message}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {alert.timestamp.toLocaleTimeString()}
                      </div>
                      {alert.actionRequired && alert.action && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={alert.action}
                          className="h-7 text-xs bg-transparent"
                        >
                          Take Action
                        </Button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="actions" className="space-y-6">
          <Card className="border-0 shadow-md bg-white/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Quick Actions
              </CardTitle>
              <CardDescription>Common tenant management tasks and shortcuts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {quickActions.map((action, index) => {
                  const IconComponent = action.icon
                  return (
                    <motion.div
                      key={action.title}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <Button
                        variant="outline"
                        className={`h-24 flex-col gap-2 bg-transparent hover:shadow-md transition-all ${action.color} text-white border-0`}
                        onClick={action.action}
                      >
                        <IconComponent className="h-6 w-6" />
                        <div className="text-center">
                          <div className="text-sm font-medium">{action.title}</div>
                          <div className="text-xs opacity-90">{action.description}</div>
                        </div>
                      </Button>
                    </motion.div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
