"use client"

import { useState } from "react"
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
  Settings,
  BarChart3,
  CheckCircle,
  AlertTriangle,
  Brain,
  Zap,
  UserPlus,
  RefreshCw,
} from "lucide-react"
import { AIInsightsDrawer } from "@/components/tenant/ai-insights-drawer"

interface TenantMetric {
  label: string
  value: string | number
  change: string
  trend: "up" | "down" | "neutral"
  icon: any
}

interface TenantAlert {
  id: string
  type: "info" | "warning" | "error" | "success"
  title: string
  message: string
  timestamp: Date
  actionRequired: boolean
}

const tenantMetrics: TenantMetric[] = [
  {
    label: "Active Tenants",
    value: 247,
    change: "+12%",
    trend: "up",
    icon: Building2,
  },
  {
    label: "Total Users",
    value: "15.2K",
    change: "+8.5%",
    trend: "up",
    icon: Users,
  },
  {
    label: "System Uptime",
    value: "99.9%",
    change: "+0.1%",
    trend: "up",
    icon: Activity,
  },
  {
    label: "Monthly Revenue",
    value: "$124K",
    change: "+15.3%",
    trend: "up",
    icon: DollarSign,
  },
]

const recentAlerts: TenantAlert[] = [
  {
    id: "1",
    type: "warning",
    title: "Storage Limit Approaching",
    message: "Tenant 'Acme Corp' is at 85% of their storage limit",
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    actionRequired: true,
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
  },
  {
    id: "4",
    type: "success",
    title: "Backup Completed",
    message: "Daily backup completed successfully for all tenants",
    timestamp: new Date(Date.now() - 45 * 60 * 1000),
    actionRequired: false,
  },
]

export default function TenantDashboard() {
  const [isLoading, setIsLoading] = useState(false)
  const [alerts, setAlerts] = useState<TenantAlert[]>(recentAlerts)
  const [selectedTab, setSelectedTab] = useState("overview")

  const refreshData = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsLoading(false)
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

  return (
    <div className="flex-1 space-y-6 p-6 bg-gradient-to-br from-gray-50 to-white">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tenant Management Dashboard</h1>
          <p className="text-muted-foreground">Monitor and manage all tenant operations from a centralized dashboard</p>
        </div>
        <div className="flex items-center gap-3">
          <AIInsightsDrawer
            module="tenant"
            context="dashboard"
            trigger={
              <Button variant="outline" className="bg-gradient-to-r from-purple-500 to-blue-500 text-white border-0">
                <Brain className="h-4 w-4 mr-2" />
                AI Insights
              </Button>
            }
          />
          <Button variant="outline" onClick={refreshData} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {tenantMetrics.map((metric) => {
          const IconComponent = metric.icon
          return (
            <Card key={metric.label} className="border-0 shadow-md bg-white/60 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{metric.label}</CardTitle>
                <IconComponent className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <TrendingUp
                    className={`h-3 w-3 mr-1 ${
                      metric.trend === "up"
                        ? "text-green-500"
                        : metric.trend === "down"
                          ? "text-red-500"
                          : "text-gray-500"
                    }`}
                  />
                  <span
                    className={
                      metric.trend === "up"
                        ? "text-green-600"
                        : metric.trend === "down"
                          ? "text-red-600"
                          : "text-gray-600"
                    }
                  >
                    {metric.change} from last month
                  </span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Main Content Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tenants">Tenants</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Recent Alerts */}
            <Card className="border-0 shadow-md bg-white/60 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Recent Alerts
                </CardTitle>
                <CardDescription>Latest system alerts and notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {alerts.slice(0, 4).map((alert) => (
                  <div key={alert.id} className="flex items-start gap-3 p-3 rounded-lg bg-white/50">
                    {getAlertIcon(alert.type)}
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium">{alert.title}</h4>
                        <Badge variant="outline" className={`text-xs ${getAlertBadgeColor(alert.type)}`}>
                          {alert.type}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{alert.message}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">{alert.timestamp.toLocaleTimeString()}</span>
                        {alert.actionRequired && (
                          <Button size="sm" variant="outline" className="h-6 text-xs bg-transparent">
                            Take Action
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* System Health */}
            <Card className="border-0 shadow-md bg-white/60 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  System Health
                </CardTitle>
                <CardDescription>Real-time system performance metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">CPU Usage</span>
                    <span className="text-sm text-muted-foreground">45%</span>
                  </div>
                  <Progress value={45} className="h-2" />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Memory Usage</span>
                    <span className="text-sm text-muted-foreground">62%</span>
                  </div>
                  <Progress value={62} className="h-2" />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Storage Usage</span>
                    <span className="text-sm text-muted-foreground">78%</span>
                  </div>
                  <Progress value={78} className="h-2" />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Network I/O</span>
                    <span className="text-sm text-muted-foreground">34%</span>
                  </div>
                  <Progress value={34} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="border-0 shadow-md bg-white/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Quick Actions
              </CardTitle>
              <CardDescription>Common tenant management tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
                  <UserPlus className="h-6 w-6" />
                  <span className="text-sm">Add Tenant</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
                  <Settings className="h-6 w-6" />
                  <span className="text-sm">Configure</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
                  <BarChart3 className="h-6 w-6" />
                  <span className="text-sm">View Reports</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
                  <Shield className="h-6 w-6" />
                  <span className="text-sm">Security</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tenants" className="space-y-6">
          <Card className="border-0 shadow-md bg-white/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Tenant Overview</CardTitle>
              <CardDescription>Manage and monitor all tenant accounts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Tenant Management</h3>
                <p className="text-muted-foreground mb-4">Detailed tenant management interface coming soon</p>
                <Button>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add New Tenant
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card className="border-0 shadow-md bg-white/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Analytics Dashboard</CardTitle>
              <CardDescription>Comprehensive analytics and reporting</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Advanced Analytics</h3>
                <p className="text-muted-foreground mb-4">Detailed analytics dashboard with charts and insights</p>
                <Button>
                  <TrendingUp className="h-4 w-4 mr-2" />
                  View Full Analytics
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card className="border-0 shadow-md bg-white/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>System Settings</CardTitle>
              <CardDescription>Configure system-wide settings and preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Settings className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Configuration Panel</h3>
                <p className="text-muted-foreground mb-4">System configuration and settings management</p>
                <Button>
                  <Settings className="h-4 w-4 mr-2" />
                  Open Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
