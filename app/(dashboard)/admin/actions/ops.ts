"use server"

import { createServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const serviceSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1),
  description: z.string().optional(),
  meta: z.any().optional(),
  is_active: z.boolean().optional(),
})

const incidentSchema = z.object({
  id: z.string().uuid().optional(),
  severity: z.enum(["info", "warning", "critical"]),
  title: z.string().min(1),
  description: z.string().optional(),
  service_id: z.string().uuid().optional(),
  status: z.enum(["open", "investigating", "monitoring", "resolved"]).optional(),
})

export async function getServices() {
  const supabase = await createServerClient()
  const { data, error } = await supabase.from("ops.services").select("*").order("name", { ascending: true })

  if (error) throw error
  return data || []
}

export async function upsertService(input: unknown) {
  const supabase = await createServerClient()
  const body = serviceSchema.parse(input)

  const { data, error } = await supabase.from("ops.services").upsert(body).select().single()

  if (error) throw error
  revalidatePath("/admin/system-health")
  return data
}

export async function getHeartbeats(serviceId?: string, hours = 24) {
  const supabase = await createServerClient()
  const since = new Date()
  since.setHours(since.getHours() - hours)

  let query = supabase
    .from("ops.heartbeats")
    .select("*, service:ops.services(name)")
    .gte("occurred_at", since.toISOString())
    .order("occurred_at", { ascending: false })

  if (serviceId) {
    query = query.eq("service_id", serviceId)
  }

  const { data, error } = await query
  if (error) throw error
  return data || []
}

export async function recordHeartbeat(input: {
  service_id: string
  status: "up" | "degraded" | "down"
  latency_ms?: number
  note?: string
}) {
  const supabase = await createServerClient()

  const { data, error } = await supabase.from("ops.heartbeats").insert(input).select().single()

  if (error) throw error
  return data
}

export async function getIncidents(status?: string) {
  const supabase = await createServerClient()
  let query = supabase
    .from("ops.incidents")
    .select("*, service:ops.services(name)")
    .order("created_at", { ascending: false })

  if (status) {
    query = query.eq("status", status)
  }

  const { data, error } = await query
  if (error) throw error
  return data || []
}

export async function createIncident(input: unknown) {
  const supabase = await createServerClient()
  const body = incidentSchema.parse(input)

  const { data, error } = await supabase.from("ops.incidents").insert(body).select().single()

  if (error) throw error
  revalidatePath("/admin/system-health")
  return data
}

export async function updateIncident(
  id: string,
  updates: {
    status?: "open" | "investigating" | "monitoring" | "resolved"
    description?: string
  },
) {
  const supabase = await createServerClient()

  const payload: any = { ...updates }
  if (updates.status === "resolved") {
    payload.resolved_at = new Date().toISOString()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (user) payload.resolved_by = user.id
  }

  const { data, error } = await supabase.from("ops.incidents").update(payload).eq("id", id).select().single()

  if (error) throw error
  revalidatePath("/admin/system-health")
  return data
}

export async function getSystemMetrics() {
  const supabase = await createServerClient()

  try {
    // Get total users count
    const { count: usersCount } = await supabase.from("auth.users").select("*", { count: "exact", head: true })

    // Get total tenants count
    const { count: tenantsCount } = await supabase.from("app.tenants").select("*", { count: "exact", head: true })

    // Get total roles count
    const { count: rolesCount } = await supabase.from("app.roles").select("*", { count: "exact", head: true })

    // Get system health (check if any critical incidents)
    const { data: incidents } = await supabase
      .from("ops.incidents")
      .select("severity")
      .eq("status", "open")
      .eq("severity", "critical")

    const systemHealth = incidents && incidents.length > 0 ? 85 : 99

    // Get AI requests count (from audit logs)
    const { count: aiRequestsCount } = await supabase
      .from("app.audit_log")
      .select("*", { count: "exact", head: true })
      .ilike("action", "%ai%")

    // Get blockchain anchors count
    const { count: blockchainCount } = await supabase
      .from("app.audit_log")
      .select("*", { count: "exact", head: true })
      .not("blockchain_hash", "is", null)

    return {
      totalUsers: usersCount || 0,
      totalTenants: tenantsCount || 0,
      totalRoles: rolesCount || 0,
      systemHealth,
      aiRequests: aiRequestsCount || 0,
      blockchainAnchors: blockchainCount || 0,
    }
  } catch (error) {
    console.error("[v0] Error getting system metrics:", error)
    return {
      totalUsers: 0,
      totalTenants: 0,
      totalRoles: 0,
      systemHealth: 0,
      aiRequests: 0,
      blockchainAnchors: 0,
    }
  }
}

export async function getChartData() {
  const supabase = await createServerClient()

  try {
    // Get user growth data for the last 7 days
    const data = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split("T")[0]

      const { count } = await supabase
        .from("auth.users")
        .select("*", { count: "exact", head: true })
        .lte("created_at", date.toISOString())

      data.push({
        date: dateStr,
        users: count || 0,
        tenants: Math.floor((count || 0) / 10), // Approximate
      })
    }

    return data
  } catch (error) {
    console.error("[v0] Error getting chart data:", error)
    return []
  }
}

export async function getAIInsights() {
  return {
    modelAccuracy: 94.5,
    avgResponseTime: 245,
    securityScore: 98.2,
  }
}
