"use server"

import { getKpis, getPipelineHealth, aiDigest } from "@/app/(dashboard)/crm/dashboard/actions"
import { createServerClient } from "@/lib/supabase/server"
import { getContext } from "@/app/(dashboard)/crm/dashboard/actions"

export async function refreshAnalytics() {
  // Re-run core queries and return a lightweight success payload
  const supabase = await createServerClient()
  const { tenantId } = await getContext()

  try {
    const kpis = await getKpis({ from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), to: new Date().toISOString() })
    const pipeline = await getPipelineHealth({ from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), to: new Date().toISOString() })

    // Optionally trigger a materialized view refresh (no-op if not present)
    try {
      await supabase.rpc("refresh_all_analytics_views", { p_tenant_id: tenantId })
    } catch {
      // ignore if RPC not available in dev
    }

    return { ok: true, kpis, pipeline }
  } catch (e) {
    const msg = (e as any)?.message || String(e)
    console.error("[v0] refreshAnalytics error:", msg)

    // Dev fallback when PostgREST schema is missing (PGRST205) or other DB errors
    if (process.env.NODE_ENV !== "production") {
      console.warn("[v0] refreshAnalytics: returning mock data due to DB error in development")
      const mockKpis = {
        pipeline: 1250000,
        mtdRevenue: 320000,
        winRate: 32.4,
        avgCycleDays: 42,
        deltas: { pipeline: 4.2, mtdRevenue: 3.1, winRate: 1.2, avgCycleDays: -1 },
      }
      const mockPipeline = { byStage: [{ stage: "Qualified", count: 45, amount: 340000 }], aging: [] }
      return { ok: true, kpis: mockKpis, pipeline: mockPipeline, _mock: true }
    }

    return { ok: false }
  }
}

export async function exportOpportunitiesCsv() {
  const supabase = await createServerClient()
  // Simple export: return CSV string for download
  try {
    const { data: rows, error } = await supabase.from("crm.opportunities").select("id,name,amount,stage,owner_id,created_at").limit(1000)
    if (error) throw error

    const headers = ["id", "name", "amount", "stage", "owner_id", "created_at"]
    const csv = [headers.join(",")].concat((rows || []).map((r: any) => headers.map((h) => JSON.stringify(r[h] ?? "")).join(","))).join("\n")

    return { csv }
  } catch (e) {
    console.error("[v0] exportOpportunitiesCsv error:", (e as any)?.message || e)
    if (process.env.NODE_ENV !== "production") {
      // Return a small sample CSV so developers can test downloads
      const sample = `id,name,amount,stage,owner_id,created_at\n1,Test Opportunity,10000,Qualified,0001,${new Date().toISOString()}`
      return { csv: sample, _mock: true }
    }
    throw e
  }
}

export async function runAiDigest({ from, to }: { from: string; to: string }) {
  const { features } = await getContext()
  if (!features.copilot) throw new Error("AI Copilot feature not enabled")
  try {
    return await aiDigest({ from, to })
  } catch (e) {
    console.error("[v0] runAiDigest error:", (e as any)?.message || e)
    if (process.env.NODE_ENV !== "production") {
      return {
        text: "Mock AI digest: CRM is performing within expected ranges. Focus on converting qualified deals and reduce negotiation stage time.",
        actions: [
          { label: "View Pipeline", href: "/crm/opportunities" },
          { label: "Review At-Risk", href: "/crm/opportunities?filter=at-risk" },
        ],
        tokens: 0,
        cost: 0,
        _mock: true,
      }
    }
    throw e
  }
}
