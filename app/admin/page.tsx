"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Users,
  Building2,
  Server,
  Activity,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Database,
  Shield,
  HardDrive,
} from "lucide-react"
import { AdminLayoutWrapper } from "@/components/layout/admin-layout-wrapper"

export default function AdminOverviewPage() {
  const systemStats = {
    totalUsers: 12847,
    activeTenants: 156,
    systemUptime: 99.8,
    storageUsed: 67.3,
    cpuUsage: 23.5,
    memoryUsage: 45.2,
    activeConnections: 1247,
    pendingTasks: 23,
  }

  const recentAlerts = [
    { id: 1, type: "warning", message: "High memory usage on server-03", time: "2 minutes ago" },
    { id: 2, type: "info", message: "Backup completed successfully", time: "15 minutes ago" },
    { id: 3, type: "error", message: "Failed login attempts detected", time: "1 hour ago" },
    { id: 4, type: "success", message: "System update deployed", time: "2 hours ago" },
  ]

  const tenantActivity = [
    { name: "Acme Corporation", users: 245, status: "active", lastActive: "2 minutes ago" },
    { name: "TechStart Inc", users: 89, status: "active", lastActive: "5 minutes ago" },
    { name: "Global Solutions", users: 156, status: "trial", lastActive: "1 hour ago" },
    { name: "DataFlow Ltd", users: 78, status: "suspended", lastActive: "2 days ago" },
  ]

  return (
    <AdminLayoutWrapper
      title="System Administration"
      subtitle="Platform overview and system monitoring"
      currentPage="overview"
    >
      <div className="space-y-6">
        {/* System Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{systemStats.totalUsers.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="inline h-3 w-3 mr-1" />
                +12% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Tenants</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{systemStats.activeTenants}</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="inline h-3 w-3 mr-1" />
                +3 new this week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">System Uptime</CardTitle>
              <Server className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{systemStats.systemUptime}%</div>
              <p className="text-xs text-muted-foreground">
                <CheckCircle className="inline h-3 w-3 mr-1 text-green-500" />
                All systems operational
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Connections</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{systemStats.activeConnections.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Real-time connections</p>
            </CardContent>
          </Card>
        </div>

        {/* System Resources */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HardDrive className="h-5 w-5" />
                System Resources
              </CardTitle>
              <CardDescription>Current resource utilization</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Storage Usage</span>
                  <span>{systemStats.storageUsed}%</span>
                </div>
                <Progress value={systemStats.storageUsed} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>CPU Usage</span>
                  <span>{systemStats.cpuUsage}%</span>
                </div>
                <Progress value={systemStats.cpuUsage} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Memory Usage</span>
                  <span>{systemStats.memoryUsage}%</span>
                </div>
                <Progress value={systemStats.memoryUsage} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Recent Alerts
              </CardTitle>
              <CardDescription>System notifications and alerts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentAlerts.map((alert) => (
                  <div key={alert.id} className="flex items-start gap-3 p-3 rounded-lg border">
                    <div
                      className={`w-2 h-2 rounded-full mt-2 ${
                        alert.type === "error"
                          ? "bg-red-500"
                          : alert.type === "warning"
                            ? "bg-yellow-500"
                            : alert.type === "success"
                              ? "bg-green-500"
                              : "bg-blue-500"
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{alert.message}</p>
                      <p className="text-xs text-muted-foreground">{alert.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tenant Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Tenant Activity
            </CardTitle>
            <CardDescription>Recent tenant activity and status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tenantActivity.map((tenant, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                      {tenant.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium">{tenant.name}</p>
                      <p className="text-sm text-muted-foreground">{tenant.users} users</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge
                      variant={
                        tenant.status === "active" ? "default" : tenant.status === "trial" ? "secondary" : "destructive"
                      }
                    >
                      {tenant.status}
                    </Badge>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Last active</p>
                      <p className="text-sm font-medium">{tenant.lastActive}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
                <Users className="h-6 w-6" />
                Manage Users
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
                <Building2 className="h-6 w-6" />
                Add Tenant
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
                <Shield className="h-6 w-6" />
                Security Audit
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
                <Database className="h-6 w-6" />
                Backup System
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayoutWrapper>
  )
}
