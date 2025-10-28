import { createClient } from "@/lib/supabase/server"

export async function fetchRequisitions(params?: {
  status?: string[]
  department?: string[]
  page?: number
  pageSize?: number
}) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return { rows: [], total: 0 }

    const { data: userTenant } = await supabase.from("user_tenants").select("tenant_id").eq("user_id", user.id).single()

    if (!userTenant?.tenant_id) return { rows: [], total: 0 }

    let query = supabase
      .from("talent.requisitions")
      .select(
        `
        id, title, department, location, employment_type, seniority, openings, 
        status, created_at, ai_score, ml_fill_probability, ai_insights,
        blockchain_hash,
        hiring_manager:users!hiring_manager(id, full_name),
        recruiter:users!recruiter_id(id, full_name)
      `,
        { count: "exact" },
      )
      .eq("tenant_id", userTenant.tenant_id)

    if (params?.status?.length) {
      query = query.in("status", params.status)
    }
    if (params?.department?.length) {
      query = query.in("department", params.department)
    }

    const page = params?.page || 1
    const pageSize = params?.pageSize || 20
    const from = (page - 1) * pageSize

    query = query.order("created_at", { ascending: false }).range(from, from + pageSize - 1)

    const { data, error, count } = await query

    if (error) {
      console.error("[v0] Error fetching requisitions:", error)
      return { rows: [], total: 0 }
    }

    const rows = (data || []).map((row: any) => ({
      ...row,
      age_days: Math.floor((Date.now() - new Date(row.created_at).getTime()) / (1000 * 60 * 60 * 24)),
    }))

    return { rows, total: count || 0 }
  } catch (error) {
    console.error("[v0] Error in fetchRequisitions:", error)
    return { rows: [], total: 0 }
  }
}

export async function fetchRequisitionStats() {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return null

    const { data: userTenant } = await supabase.from("user_tenants").select("tenant_id").eq("user_id", user.id).single()

    if (!userTenant?.tenant_id) return null

    const { data: reqs } = await supabase
      .from("talent.requisitions")
      .select("status, openings, ai_score, ml_fill_probability")
      .eq("tenant_id", userTenant.tenant_id)

    if (!reqs) return null

    const total = reqs.length
    const open = reqs.filter((r) => r.status === "open").length
    const totalOpenings = reqs.filter((r) => r.status === "open").reduce((sum, r) => sum + (r.openings || 0), 0)
    const avgAiScore = reqs.reduce((sum, r) => sum + (r.ai_score || 0), 0) / total
    const avgFillProb = reqs.reduce((sum, r) => sum + (r.ml_fill_probability || 0), 0) / total

    return {
      total,
      open,
      totalOpenings,
      avgAiScore: avgAiScore || 0.85,
      avgFillProb: avgFillProb || 0.75,
    }
  } catch (error) {
    console.error("[v0] Error fetching requisition stats:", error)
    return null
  }
}
