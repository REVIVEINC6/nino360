"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart3,
  Users,
  Building2,
  DollarSign,
  Activity,
  RefreshCw,
  Download,
  AlertTriangle,
  CheckCircle,
  Clock,
} from "lucide-react"
import { useDashboard } from "@/hooks/use-dashboard"
import { AIInsightsPanel } from "@/components/dashboard/ai-insights-panel"
import { toast } from "sonner"

function DashboardMetrics({ metrics }: { metrics: any }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.totalUsers.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">+12% from last month</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Tenants</CardTitle>
          <Building2 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.activeTenants}</div>
          <p className="text-xs text-muted-foreground">+8% from last month</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Revenue</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${metrics.revenue.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">+{metrics.growthRate.toFixed(1)}% from last month</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">System Health</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.systemHealth}%</div>
          <p className="text-xs text-muted-foreground">All systems operational</p>
        </CardContent>
      </Card>
    </div>
  )
}

function SystemStatus({ systemStatus }: { systemStatus: any }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>System Status</CardTitle>
        <CardDescription>Real-time system performance metrics</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{systemStatus.cpu}%</div>
            <div className="text-sm text-muted-foreground">CPU Usage</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{systemStatus.memory}%</div>
            <div className="text-sm text-muted-foreground">Memory</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{systemStatus.storage}%</div>
            <div className="text-sm text-muted-foreground">Storage</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{systemStatus.network}%</div>
            <div className="text-sm text-muted-foreground">Network</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span className="text-sm">Uptime: {systemStatus.uptime}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-blue-500" />
            <span className="text-sm">Last Backup: {new Date(systemStatus.lastBackup).toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-purple-500" />
            <span className="text-sm">Active Connections: {systemStatus.activeConnections}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function ModuleStats({ moduleStats }: { moduleStats: any[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Module Performance</CardTitle>
        <CardDescription>Performance metrics for all active modules</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {moduleStats.map((module) => (
            <div key={module.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="flex flex-col">
                  <span className="font-medium">{module.name}</span>
                  <span className="text-sm text-muted-foreground">v{module.version}</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-sm font-medium">{module.usage}%</div>
                  <div className="text-xs text-muted-foreground">Usage</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-medium">{module.performance}%</div>
                  <div className="text-xs text-muted-foreground">Performance</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-medium">{module.users}</div>
                  <div className="text-xs text-muted-foreground">Users</div>
                </div>
                <Badge
                  variant={
                    module.status === "active"
                      ? "default"
                      : module.status === "maintenance"
                        ? "secondary"
                        : "destructive"
                  }
                >
                  {module.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function RecentActivity({ recentActivity }: { recentActivity: any[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest system activities and user actions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recentActivity.slice(0, 10).map((activity) => (
            <div key={activity.id} className="flex items-center gap-3 p-2 border-l-2 border-l-blue-500 bg-blue-50/50">
              <div className="flex-1">
                <div className="font-medium text-sm">{activity.title}</div>
                <div className="text-xs text-muted-foreground">{activity.description}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {activity.user} • {activity.timestamp}
                </div>
              </div>
              <Badge variant="outline" className="text-xs">
                {activity.module}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default function DashboardPage() {
  const { dashboardData, loading, error, refreshData, exportData, implementAIRecommendation, dismissAIRecommendation } =
    useDashboard()

  const handleExport = async (format: "csv" | "json" | "pdf") => {
    try {
      await exportData(format)
      toast.success(`Dashboard data exported as ${format.toUpperCase()}`)
    } catch (error) {
      toast.error("Failed to export dashboard data")
    }
  }

  const handleImplementRecommendation = async (id: string) => {
    try {
      await implementAIRecommendation(id)
      toast.success("AI recommendation implemented successfully")
    } catch (error) {
      toast.error("Failed to implement recommendation")
    }
  }

  const handleDismissRecommendation = async (id: string) => {
    try {
      await dismissAIRecommendation(id)
      toast.success("Recommendation dismissed")
    } catch (error) {
      toast.error("Failed to dismiss recommendation")
    }
  }

  if (loading) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                <div className="h-4 w-4 bg-muted animate-pulse rounded" />
              </CardHeader>
              <CardContent>
                <div className="h-8 w-16 bg-muted animate-pulse rounded mb-2" />
                <div className="h-3 w-24 bg-muted animate-pulse rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <Card className="w-full max-w-md">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Error Loading Dashboard</h3>
              <p className="text-muted-foreground text-center mb-4">{error.message}</p>
              <Button onClick={() => refreshData()}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (!dashboardData) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <Card className="w-full max-w-md">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <BarChart3 className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Data Available</h3>
              <p className="text-muted-foreground text-center">Dashboard data is not available at the moment.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={() => refreshData()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleExport("csv")}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="ai-insights">AI Insights</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <DashboardMetrics metrics={dashboardData.metrics} />

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <div className="col-span-4">
              <SystemStatus systemStatus={dashboardData.systemStatus} />
            </div>
            <div className="col-span-3">
              <ModuleStats moduleStats={dashboardData.moduleStats} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="ai-insights" className="space-y-4">
          <AIInsightsPanel
            insights={dashboardData.aiInsights}
            onImplement={handleImplementRecommendation}
            onDismiss={handleDismissRecommendation}
          />
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <SystemStatus systemStatus={dashboardData.systemStatus} />
            <ModuleStats moduleStats={dashboardData.moduleStats} />
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <RecentActivity recentActivity={dashboardData.recentActivity} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
