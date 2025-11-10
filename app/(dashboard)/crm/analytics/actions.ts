"use server"

import { getKpis, getPipelineHealth, aiDigest } from "@/app/(dashboard)/crm/dashboard/actions"
import { createServerClient } from "@/lib/supabase/server"
import { getContext } from "@/app/(dashboard)/crm/dashboard/actions"

export async function refreshAnalytics() {
  const supabase = await createServerClient()
  const { tenantId } = await getContext()

  // Optionally trigger a materialized view refresh
  try {
    await supabase.rpc("refresh_all_analytics_views", { p_tenant_id: tenantId })
  } catch (error) {
    console.warn("[v0] Failed to refresh analytics views:", error)
  }

  const kpis = await getKpis({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    to: new Date().toISOString(),
  })
  const pipeline = await getPipelineHealth({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    to: new Date().toISOString(),
  })

  return { ok: true, kpis, pipeline }
}

export async function exportOpportunitiesCsv() {
  const supabase = await createServerClient()

  const { data: rows, error } = await supabase
    .from("crm.opportunities")
    .select("id,name,amount,stage,owner_id,created_at")
    .limit(1000)

  if (error) {
    throw new Error(`Failed to export opportunities: ${error.message}`)
  }

  const headers = ["id", "name", "amount", "stage", "owner_id", "created_at"]
  const csv = [headers.join(",")]
    .concat((rows || []).map((r: any) => headers.map((h) => JSON.stringify(r[h] ?? "")).join(",")))
    .join("\n")

  return { csv }
}

export async function runAiDigest({ from, to }: { from: string; to: string }) {
  const { features } = await getContext()
  if (!features.copilot) throw new Error("AI Copilot feature not enabled")

  return await aiDigest({ from, to })
}
