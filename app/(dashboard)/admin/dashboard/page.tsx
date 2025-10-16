"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Building2, Shield, Activity, AlertCircle } from "lucide-react"
import { createBrowserClient } from "@supabase/ssr"
import { Area, AreaChart, Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface KPI {
  tenant_id: string
  tenant_name: string
  users_count: number
  role_bindings: number
  events_24h: number
}

export default function AdminDashboard() {
  const [kpis, setKpis] = useState<KPI[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    )

    async function loadKPIs() {
      const { data, error } = await supabase.from("admin_kpis").select("*")

      if (!error && data) {
        setKpis(data)
      }
      setLoading(false)
    }

    loadKPIs()

    const channel = supabase
      .channel("admin-kpis")
      .on("postgres_changes", { event: "*", schema: "core", table: "users" }, loadKPIs)
      .on("postgres_changes", { event: "*", schema: "core", table: "user_tenants" }, loadKPIs)
      .on("postgres_changes", { event: "*", schema: "core", table: "user_roles" }, loadKPIs)
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

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
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">System-wide metrics and insights</p>
        </div>
        <Card>
          <CardContent className="py-12 text-center space-y-3">
            <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
            <p className="text-lg font-medium">No data available</p>
            <p className="text-sm text-muted-foreground">Create tenants and invite users to see metrics</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">System-wide metrics and insights</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tenants</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Active organizations</p>
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
          </CardContent>
        </Card>
      </div>

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
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
