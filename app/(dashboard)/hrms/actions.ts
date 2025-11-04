"use server"

import { createServerClient } from "@/lib/supabase/server"

export async function getHRMSMetrics(tenantId: string) {
  const supabase = await createServerClient()

  const [
    { count: totalEmployees },
    { count: activeEmployees },
    { count: onLeave },
    { count: pendingReviews },
    { count: openPositions },
    { count: newHires },
  ] = await Promise.all([
    supabase.from("employees").select("*", { count: "exact", head: true }).eq("tenant_id", tenantId),
    supabase
      .from("employees")
      .select("*", { count: "exact", head: true })
      .eq("tenant_id", tenantId)
      .eq("status", "active"),
    supabase
      .from("time_off_requests")
      .select("*", { count: "exact", head: true })
      .eq("tenant_id", tenantId)
      .eq("status", "approved")
      .gte("end_date", new Date().toISOString()),
    supabase
      .from("performance_reviews")
      .select("*", { count: "exact", head: true })
      .eq("tenant_id", tenantId)
      .eq("status", "pending"),
    supabase
      .from("job_requisitions")
      .select("*", { count: "exact", head: true })
      .eq("tenant_id", tenantId)
      .eq("status", "open"),
    supabase
      .from("employees")
      .select("*", { count: "exact", head: true })
      .eq("tenant_id", tenantId)
      .gte("hire_date", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()),
  ])

  return {
    totalEmployees: totalEmployees || 0,
    activeEmployees: activeEmployees || 0,
    onLeave: onLeave || 0,
    pendingReviews: pendingReviews || 0,
    openPositions: openPositions || 0,
    newHires: newHires || 0,
  }
}

export async function getRecentActivity(tenantId: string) {
  const supabase = await createServerClient()

  const { data } = await supabase
    .from("hrms_activity")
    .select("*")
    .eq("tenant_id", tenantId)
    .order("created_at", { ascending: false })
    .limit(10)

  return data || []
}

export async function getDepartmentMetrics(tenantId: string) {
  const supabase = await createServerClient()

  const { data } = await supabase
    .from("employees")
    .select("department")
    .eq("tenant_id", tenantId)
    .eq("status", "active")

  const departments = data?.reduce(
    (acc, emp) => {
      const dept = emp.department || "Unassigned"
      acc[dept] = (acc[dept] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  return Object.entries(departments || {}).map(([name, count]) => ({ name, count }))
}

export async function getAttritionRate(tenantId: string) {
  const supabase = await createServerClient()

  const startOfYear = new Date(new Date().getFullYear(), 0, 1).toISOString()

  const [{ count: totalEmployees }, { count: terminated }] = await Promise.all([
    supabase.from("employees").select("*", { count: "exact", head: true }).eq("tenant_id", tenantId),
    supabase
      .from("employees")
      .select("*", { count: "exact", head: true })
      .eq("tenant_id", tenantId)
      .eq("status", "terminated")
      .gte("termination_date", startOfYear),
  ])

  const rate = totalEmployees ? ((terminated || 0) / totalEmployees) * 100 : 0

  return {
    rate: rate.toFixed(1),
    terminated: terminated || 0,
    total: totalEmployees || 0,
  }
}
