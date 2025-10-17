"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Users,
  Building2,
  Shield,
  Activity,
  AlertCircle,
  Sparkles,
  Lock,
  Zap,
  TrendingUp,
  TrendingDown,
} from "lucide-react"
import { createBrowserClient } from "@supabase/ssr"
import { Area, AreaChart, Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import Link from "next/link"
import { hasPermission } from "@/lib/rbac/server"
import { PERMISSIONS } from "@/lib/rbac/permissions"

interface KPI {
  tenant_id: string
  tenant_name: string
  users_count: number
  role_bindings: number
  events_24h: number
}

interface AIInsight {
  type: "warning" | "info" | "success"
  title: string
  description: string
  action?: { label: string; href: string }
}

export function AdminDashboardContent() {
  const [kpis, setKpis] = useState<KPI[]>([])
  const [loading, setLoading] = useState(true)
  const [aiInsights, setAiInsights] = useState<AIInsight[]>([])
  const [permissions, setPermissions] = useState({
    canManageUsers: false,
    canManageTenants: false,
    canViewAudit: false,
  })

  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    )

    async function loadData() {
      // Load KPIs
      const { data: kpiData, error: kpiError } = await supabase.from("admin_kpis").select("*")

      if (!kpiError && kpiData) {
        setKpis(kpiData)

        // Generate AI insights based on KPIs
        generateAIInsights(kpiData)
      }

      // Check permissions
      const [canManageUsers, canManageTenants, canViewAudit] = await Promise.all([
        hasPermission(PERMISSIONS.ADMIN_USERS_UPDATE),
        hasPermission(PERMISSIONS.ADMIN_TENANTS_UPDATE),
        hasPermission(PERMISSIONS.ADMIN_AUDIT_READ),
      ])

      setPermissions({ canManageUsers, canManageTenants, canViewAudit })
      setLoading(false)
    }

    loadData()

    // Real-time subscriptions
    const channel = supabase
      .channel("admin-kpis")
      .on("postgres_changes", { event: "*", schema: "core", table: "users" }, loadData)
      .on("postgres_changes", { event: "*", schema: "core", table: "user_tenants" }, loadData)
      .on("postgres_changes", { event: "*", schema: "core", table: "user_roles" }, loadData)
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  function generateAIInsights(data: KPI[]) {
    const insights: AIInsight[] = []

    // Analyze tenant activity
    const inactiveTenants = data.filter((kpi) => kpi.events_24h === 0)
    if (inactiveTenants.length > 0) {
      insights.push({
        type: "warning",
        title: `${inactiveTenants.length} Inactive Tenants`,
        description: "No activity in the last 24 hours. Consider reaching out for engagement.",
        action: { label: "View Tenants", href: "/admin/tenants" },
      })
    }

    // Analyze user growth
    const totalUsers = data.reduce((sum, kpi) => sum + kpi.users_count, 0)
    if (totalUsers > 100) {
      insights.push({
        type: "success",
        title: "Strong User Growth",
        description: `${totalUsers} total users across all tenants. Platform adoption is healthy.`,
      })
    }

    // Analyze role distribution
    const avgRolesPerUser = data.reduce((sum, kpi) => sum + kpi.role_bindings, 0) / totalUsers
    if (avgRolesPerUser > 2) {
      insights.push({
        type: "info",
        title: "High Role Complexity",
        description: "Average of 2+ roles per user. Review RBAC configuration for optimization.",
        action: { label: "Review Roles", href: "/admin/roles" },
      })
    }

    setAiInsights(insights)
  }

  const totals = kpis.reduce(
    (acc, kpi) => ({
      users: acc.users + kpi.users_count,
      roles: acc.roles + kpi.role_bindings,
      events: acc.events + kpi.events_24h,
    }),
    { users: 0, roles: 0, events: 0 },
  )

  const tenantChartData = kpis.map((kpi) => ({
    name: kpi.tenant_name.substring(0, 15),
    users: kpi.users_count,
    roles: kpi.role_bindings,
  }))

  const activityChartData = kpis.map((kpi) => ({
    name: kpi.tenant_name.substring(0, 15),
    events: kpi.events_24h,
  }))

  if (loading) {
    return <div className="p-6">Loading...</div>
  }

  if (kpis.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center space-y-3">
          <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
          <p className="text-lg font-medium">No data available</p>
          <p className="text-sm text-muted-foreground">Create tenants and invite users to see metrics</p>
          {permissions.canManageTenants && (
            <Button asChild className="mt-4">
              <Link href="/admin/tenants">Create Tenant</Link>
            </Button>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tenants</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Active organizations</p>
            {permissions.canManageTenants && (
              <Button asChild variant="link" size="sm" className="mt-2 h-auto p-0">
                <Link href="/admin/tenants">Manage Tenants</Link>
              </Button>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totals.users}</div>
            <p className="text-xs text-muted-foreground mt-1">Across all tenants</p>
            {permissions.canManageUsers && (
              <Button asChild variant="link" size="sm" className="mt-2 h-auto p-0">
                <Link href="/admin/users">Manage Users</Link>
              </Button>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Role Assignments</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totals.roles}</div>
            <p className="text-xs text-muted-foreground mt-1">Total permissions granted</p>
            <Button asChild variant="link" size="sm" className="mt-2 h-auto p-0">
              <Link href="/admin/roles">View Roles</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Events (24h)</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totals.events}</div>
            <p className="text-xs text-muted-foreground mt-1">System activity</p>
            {permissions.canViewAudit && (
              <Button asChild variant="link" size="sm" className="mt-2 h-auto p-0">
                <Link href="/admin/audit-ai">View Audit Logs</Link>
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      {/* AI Insights */}
      {aiInsights.length > 0 && (
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <CardTitle>AI Insights</CardTitle>
            </div>
            <CardDescription>Automated analysis and recommendations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {aiInsights.map((insight, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-card border">
                <div className="mt-0.5">
                  {insight.type === "warning" && <AlertCircle className="h-5 w-5 text-yellow-500" />}
                  {insight.type === "success" && <TrendingUp className="h-5 w-5 text-green-500" />}
                  {insight.type === "info" && <TrendingDown className="h-5 w-5 text-blue-500" />}
                </div>
                <div className="flex-1 space-y-1">
                  <p className="font-medium">{insight.title}</p>
                  <p className="text-sm text-muted-foreground">{insight.description}</p>
                  {insight.action && (
                    <Button asChild variant="link" size="sm" className="h-auto p-0">
                      <Link href={insight.action.href}>{insight.action.label}</Link>
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common administrative tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            {permissions.canManageUsers && (
              <Button asChild variant="outline" className="justify-start bg-transparent">
                <Link href="/admin/users">
                  <Users className="mr-2 h-4 w-4" />
                  Manage Users
                </Link>
              </Button>
            )}
            {permissions.canManageTenants && (
              <Button asChild variant="outline" className="justify-start bg-transparent">
                <Link href="/admin/tenants">
                  <Building2 className="mr-2 h-4 w-4" />
                  Manage Tenants
                </Link>
              </Button>
            )}
            <Button asChild variant="outline" className="justify-start bg-transparent">
              <Link href="/admin/roles">
                <Shield className="mr-2 h-4 w-4" />
                Roles & Permissions
              </Link>
            </Button>
            {permissions.canViewAudit && (
              <Button asChild variant="outline" className="justify-start bg-transparent">
                <Link href="/admin/security">
                  <Lock className="mr-2 h-4 w-4" />
                  Security & Audit
                </Link>
              </Button>
            )}
            <Button asChild variant="outline" className="justify-start bg-transparent">
              <Link href="/admin/system-health">
                <Activity className="mr-2 h-4 w-4" />
                System Health
              </Link>
            </Button>
            <Button asChild variant="outline" className="justify-start bg-transparent">
              <Link href="/admin/automation">
                <Zap className="mr-2 h-4 w-4" />
                Automation Rules
              </Link>
            </Button>
            <Button asChild variant="outline" className="justify-start bg-transparent">
              <Link href="/admin/genai">
                <Sparkles className="mr-2 h-4 w-4" />
                GenAI Config
              </Link>
            </Button>
            <Button asChild variant="outline" className="justify-start bg-transparent">
              <Link href="/admin/api-gateway">
                <Zap className="mr-2 h-4 w-4" />
                API Gateway
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Users & Roles by Tenant</CardTitle>
            <CardDescription>Distribution across organizations</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                users: {
                  label: "Users",
                  color: "hsl(var(--chart-1))",
                },
                roles: {
                  label: "Roles",
                  color: "hsl(var(--chart-2))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={tenantChartData}>
                  <XAxis dataKey="name" fontSize={12} />
                  <YAxis fontSize={12} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="users" fill="var(--color-users)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="roles" fill="var(--color-roles)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Activity (24h)</CardTitle>
            <CardDescription>Events by tenant</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                events: {
                  label: "Events",
                  color: "hsl(var(--chart-3))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={activityChartData}>
                  <XAxis dataKey="name" fontSize={12} />
                  <YAxis fontSize={12} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    type="monotone"
                    dataKey="events"
                    stroke="var(--color-events)"
                    fill="var(--color-events)"
                    fillOpacity={0.2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Tenant Overview Table */}
      <Card>
        <CardHeader>
          <CardTitle>Tenant Overview</CardTitle>
          <CardDescription>Per-tenant statistics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {kpis.map((kpi) => (
              <div key={kpi.tenant_id} className="flex items-center justify-between border-b pb-3 last:border-0">
                <div>
                  <p className="font-medium">{kpi.tenant_name}</p>
                  <p className="text-sm text-muted-foreground">{kpi.tenant_id}</p>
                </div>
                <div className="flex gap-6 text-sm">
                  <div className="text-center">
                    <p className="font-semibold">{kpi.users_count}</p>
                    <p className="text-muted-foreground">Users</p>
                  </div>
                  <div className="text-center">
                    <p className="font-semibold">{kpi.role_bindings}</p>
                    <p className="text-muted-foreground">Roles</p>
                  </div>
                  <div className="text-center">
                    <p className="font-semibold">{kpi.events_24h}</p>
                    <p className="text-muted-foreground">Events</p>
                  </div>
                  {permissions.canManageTenants && (
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/admin/tenants?id=${kpi.tenant_id}`}>View</Link>
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
