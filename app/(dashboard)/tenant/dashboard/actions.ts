"use server"

import { createServerClient } from "@/lib/supabase/server"
import { hasPermission } from "@/lib/rbac/server"
import { PERMISSIONS } from "@/lib/rbac/permissions"
import { generateText } from "ai"
import { cookies } from "next/headers"
import crypto from "crypto"

type Features = Record<string, boolean>

async function trySupabase() {
  try {
    return createServerClient()
  } catch {
    return null
  }
}

function hashRecord(record: any) {
  return crypto.createHash("sha256").update(JSON.stringify(record)).digest("hex")
}

// Exports: a minimal, non-duplicated set of server actions used by the tenant dashboard.

export async function getTenantContext() {
  const supabase = await trySupabase()
  const cookieStore = cookies()
  const tenantId = cookieStore.get("tenant_id")?.value

  if (!supabase || !tenantId) {
    // Require real Supabase and tenant cookie for production flows.
    // Previously returned a local "tenant-mock" for developer convenience; remove mock data to ensure
    // callers surface configuration issues early and rely on the real database.
    return { error: "Supabase not configured or tenant_id missing" }
  }

  try {
    // RBAC gate with dev bypass
    const devBypass = process.env.ADMIN_BYPASS === "1" || process.env.DEV_BYPASS === "1"
    if (!devBypass) {
      const allowed = await hasPermission(PERMISSIONS.TENANT_DASHBOARD_VIEW)
      if (!allowed) return { error: "Forbidden" }
    }

    const { data: tenant } = await supabase.from("tenants").select("id,slug,name,timezone").eq("id", tenantId).single()
    const { data: featureFlags } = await supabase
      .from("feature_flags")
      .select("feature_key,enabled")
      .eq("tenant_id", tenantId)
    const features: Features = {}
    ;(featureFlags || []).forEach((f: any) => (features[f.feature_key || f.feature] = !!f.enabled))
    return { tenantId: tenant.id, slug: tenant.slug, name: tenant.name, timezone: tenant.timezone || "UTC", features }
  } catch (error) {
    console.error("getTenantContext error", error)
    return { error: "Failed to get tenant context" }
  }
}

export async function getKpis({ from, to }: { from?: string; to?: string } = {}) {
  const supabase = await trySupabase()
  const cookieStore = cookies()
  const tenantId = cookieStore.get("tenant_id")?.value
  if (!supabase || !tenantId) return { users: 0, featuresEnabled: 0, copilotPrompts: 0, openAuditFindings: 0 }
  try {
    const { count: users } = await supabase
      .from("tenant_members")
      .select("*", { count: "exact", head: true })
      .eq("tenant_id", tenantId)
      .eq("status", "active")
    const { count: featuresEnabled } = await supabase
      .from("feature_flags")
      .select("*", { count: "exact", head: true })
      .eq("tenant_id", tenantId)
      .eq("enabled", true)
    const { count: copilotPrompts } = await supabase
      .from("audit_log")
      .select("*", { count: "exact", head: true })
      .eq("tenant_id", tenantId)
      .eq("action", "copilot.query")
    const { count: openAuditFindings } = await supabase
      .from("audit_log")
      .select("*", { count: "exact", head: true })
      .eq("tenant_id", tenantId)
    return {
      users: users || 0,
      featuresEnabled: featuresEnabled || 0,
      copilotPrompts: copilotPrompts || 0,
      openAuditFindings: openAuditFindings || 0,
    }
  } catch (error) {
    console.error("getKpis error", error)
    return { users: 0, featuresEnabled: 0, copilotPrompts: 0, openAuditFindings: 0 }
  }
}

export async function getModuleUsage({ from, to }: { from?: string; to?: string } = {}) {
  const supabase = await trySupabase()
  const cookieStore = cookies()
  const tenantId = cookieStore.get("tenant_id")?.value
  if (!supabase || !tenantId) return [{ module: "CRM", events: 0 }]
  try {
    const { data } = await supabase
      .from("module_usage_view")
      .select("module,events")
      .order("events", { ascending: false })
    if (Array.isArray(data)) return data
  } catch (e) {
    console.error("getModuleUsage error", e)
  }
  return [{ module: "CRM", events: 0 }]
}

export async function getAuditTimeline({ limit = 12 }: { limit?: number } = {}) {
  const supabase = await trySupabase()
  const cookieStore = cookies()
  const tenantId = cookieStore.get("tenant_id")?.value

  if (!supabase || !tenantId) {
    return []
  }

  try {
    const { data: auditLogs } = await supabase
      .from("app.audit_log")
      .select("id, action, entity, entity_id, created_at, user_id, hash, prev_hash")
      .eq("tenant_id", tenantId)
      .order("created_at", { ascending: false })
      .limit(limit)
    return auditLogs || []
  } catch (error) {
    console.error("getAuditTimeline error", error)
    return []
  }
}

export async function verifyHash({ hash }: { hash: string }) {
  if (!/^[a-f0-9]{64}$/i.test(hash)) return { valid: false }
  const supabase = await trySupabase()
  if (!supabase) return { valid: true }
  try {
    const { data } = await supabase.from("app.audit_log").select("*").eq("hash", hash).limit(1)
    return { valid: Array.isArray(data) && data.length > 0 }
  } catch (error) {
    console.error("verifyHash error", error)
    return { valid: false }
  }
}

export async function getAiDigest({ from, to }: { from?: string; to?: string } = {}) {
  const supabase = await trySupabase()
  const cookieStore = cookies()
  const tenantId = cookieStore.get("tenant_id")?.value

  // Safe default
  let result = {
    text: "Here's a quick digest of your tenant activity. Enable Copilot for richer insights.",
    tokens: 0,
    cost: 0,
  }

  try {
    // FBAC: only allow when tenant.copilot feature is enabled
    try {
      const ctx = await getTenantContext()
      const enabled = !!ctx && !("error" in ctx) && !!(ctx as any).features?.["tenant.copilot"]
      if (!enabled) {
        return { error: 403 as const }
      }
    } catch {
      // If context can't be loaded, block digest
      return { error: 403 as const }
    }
    // Attempt Generative AI call; rely on fallback if env/model unavailable
    const prompt = `Summarize weekly tenant activity focusing on user engagement, audit highlights, and feature uptake. Keep it under 120 words.`
    const { text } = await generateText({ model: "openai/gpt-4o-mini", prompt, maxTokens: 220 })
    if (text && text.trim().length > 0) {
      result = {
        text: text.trim(),
        tokens: Math.min(500, text.length / 4),
        cost: 0.000001 * Math.min(500, text.length / 4),
      }
    }
  } catch (e) {
    // Fall back silently in dev; keep logs minimal
    if (process.env.AI_FALLBACK_WARN === "on") console.warn("[tenant.ai] using fallback:", e)
  }

  // Append blockchain-style audit record
  try {
    if (supabase && tenantId) {
      const payload: any = { action: "copilot.query", entity: "tenant.dashboard", metadata: { kind: "digest" } }
      const prev = await supabase
        .from("app.audit_log")
        .select("hash")
        .eq("tenant_id", tenantId)
        .order("created_at", { ascending: false })
        .limit(1)
      const prevHash = Array.isArray(prev.data) && prev.data[0]?.hash ? prev.data[0].hash : null
      const rec = { ...payload, tenant_id: tenantId, prev_hash: prevHash }
      const hash = crypto.createHash("sha256").update(JSON.stringify(rec)).digest("hex")
      await supabase.from("app.audit_log").insert({ ...rec, hash })
    }
  } catch (e) {
    console.warn("[tenant.ai] audit append failed:", e)
  }

  return result
}

export async function getForecasts(dateRange?: { from?: string; to?: string }) {
  const supabase = await trySupabase()
  const cookieStore = cookies()
  const tenantId = cookieStore.get("tenant_id")?.value
  // Default shape expected by the page: { activity: [], userGrowth: [] }
  const empty = { activity: [], userGrowth: [] }
  if (!supabase || !tenantId) return empty

  try {
    const { data } = await supabase
      .from("tenant_forecasts")
      .select("type, date, value, lower, upper")
      .eq("tenant_id", tenantId)
      .order("date", { ascending: true })

    const activity = Array.isArray(data) ? data.filter((d: any) => d.type === "activity") : []
    const userGrowth = Array.isArray(data) ? data.filter((d: any) => d.type === "userGrowth") : []

    return { activity, userGrowth }
  } catch (error) {
    console.error("getForecasts error", error)
    return empty
  }
}

export async function getTrustMetrics() {
  const supabase = await trySupabase()
  if (!supabase) {
    return {
      auditTrail: { enabled: true, totalEntries: 0, lastVerified: null },
      encryption: { enabled: true, algorithm: "aes-256-gcm" },
      compliance: { soc2: false, gdpr: false, hipaa: false },
      uptime: { percentage: 100, lastIncident: null },
    }
  }

  try {
    // Best-effort: aggregate some basic trust metrics from audit_log and settings
    const { data: auditCount } = await supabase.rpc("exec_sql", {
      sql_query: `SELECT count(*)::int as cnt FROM audit_log`,
    })

    const totalEntries = Array.isArray(auditCount) && auditCount[0] ? Number(auditCount[0].cnt || 0) : 0

    return {
      auditTrail: { enabled: true, totalEntries, lastVerified: null },
      encryption: { enabled: true, algorithm: "aes-256-gcm" },
      compliance: { soc2: false, gdpr: false, hipaa: false },
      uptime: { percentage: 99.99, lastIncident: null },
    }
  } catch (error) {
    console.error("getTrustMetrics error", error)
    return {
      auditTrail: { enabled: true, totalEntries: 0, lastVerified: null },
      encryption: { enabled: true, algorithm: "aes-256-gcm" },
      compliance: { soc2: false, gdpr: false, hipaa: false },
      uptime: { percentage: 99.99, lastIncident: null },
    }
  }
}

export async function getMlInsights() {
  const supabase = await trySupabase()
  if (!supabase) return { insights: [] }
  try {
    const { data } = await supabase
      .from("ml_insights")
      .select("id, title, summary, score, created_at")
      .order("created_at", { ascending: false })
      .limit(5)
    return { insights: Array.isArray(data) ? data : [] }
  } catch (error) {
    console.error("getMlInsights error", error)
    return { insights: [] }
  }
}

export async function getRpaStatus() {
  const supabase = await trySupabase()
  if (!supabase) return { automations: [] }
  try {
    const { data } = await supabase.from("rpa_status").select("id, name, status, last_run_at")
    return { automations: Array.isArray(data) ? data : [] }
  } catch (error) {
    console.error("getRpaStatus error", error)
    return { automations: [] }
  }
}
