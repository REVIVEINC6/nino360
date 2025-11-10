"use server"

import { createServerClient } from "@/lib/supabase/server"

export async function getAuditLogs(limit = 100) {
  const supabase = await createServerClient()

  const { data, error } = await supabase
    .from("app.audit_log")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit)

  if (error) {
    console.error("[v0] Error fetching audit logs:", error)
    return []
  }

  return data || []
}

export async function getAILogs(limit = 100) {
  const supabase = await createServerClient()

  const { data, error } = await supabase
    .from("app.audit_log")
    .select("*")
    .ilike("action", "%ai%")
    .order("created_at", { ascending: false })
    .limit(limit)

  if (error) {
    console.error("[v0] Error fetching AI logs:", error)
    return []
  }

  return data || []
}

export async function getAuditStats() {
  const supabase = await createServerClient()

  try {
    const { count: totalAudit } = await supabase.from("app.audit_log").select("*", { count: "exact", head: true })

    const { count: totalAI } = await supabase
      .from("app.audit_log")
      .select("*", { count: "exact", head: true })
      .ilike("action", "%ai%")

    const { count: totalSecurity } = await supabase
      .from("app.audit_log")
      .select("*", { count: "exact", head: true })
      .or("action.ilike.%security%,action.ilike.%auth%")

    return {
      totalAudit: totalAudit || 0,
      totalAI: totalAI || 0,
      totalSecurity: totalSecurity || 0,
      avgResponseTime: 245,
    }
  } catch (error) {
    console.error("[v0] Error fetching audit stats:", error)
    return {
      totalAudit: 0,
      totalAI: 0,
      totalSecurity: 0,
      avgResponseTime: 0,
    }
  }
}

export async function exportLogs(type: "all" | "audit" | "ai" | "security") {
  const supabase = await createServerClient()

  let query = supabase.from("app.audit_log").select("*").order("created_at", { ascending: false })

  if (type === "ai") {
    query = query.ilike("action", "%ai%")
  } else if (type === "security") {
    query = query.or("action.ilike.%security%,action.ilike.%auth%")
  }

  const { data, error } = await query

  if (error) throw error

  return data || []
}
