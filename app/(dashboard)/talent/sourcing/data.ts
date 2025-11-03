import { createServerClient } from "@/lib/supabase/server"

export async function fetchContext() {
  try {
    const supabase = await createServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return {
        tenantId: "",
        tz: "UTC",
        features: { copilot: false, audit: false },
        intakeAlias: null,
        poolsCount: 0,
      }
    }

    const { data: profile } = await supabase.from("profiles").select("tenant_id").eq("id", user.id).single()

    if (!profile?.tenant_id) {
      return {
        tenantId: "",
        tz: "UTC",
        features: { copilot: false, audit: false },
        intakeAlias: null,
        poolsCount: 0,
      }
    }

    // Get intake alias
    const { data: alias } = await supabase
      .from("email_intake_aliases")
      .select("key")
      .eq("tenant_id", profile.tenant_id)
      .eq("active", true)
      .single()

    // Get pools count
    const { count: poolsCount } = await supabase
      .from("pools")
      .select("*", { count: "exact", head: true })
      .eq("tenant_id", profile.tenant_id)

    return {
      tenantId: profile.tenant_id,
      tz: "UTC",
      features: { copilot: true, audit: true },
      intakeAlias: alias?.key || null,
      poolsCount: poolsCount || 0,
    }
  } catch (error) {
    console.error("[v0] Error getting context:", error)
    return {
      tenantId: "",
      tz: "UTC",
      features: { copilot: false, audit: false },
      intakeAlias: null,
      poolsCount: 0,
    }
  }
}

export async function fetchSourcingAnalytics() {
  try {
    const supabase = await createServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return null

    const { data: profile } = await supabase.from("profiles").select("tenant_id").eq("id", user.id).single()

    if (!profile?.tenant_id) return null

    const { data, error } = await supabase
      .from("sourcing_analytics")
      .select("*")
      .eq("tenant_id", profile.tenant_id)
      .single()

    if (error) {
      console.error("[v0] Error getting analytics:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("[v0] Error getting analytics:", error)
    return null
  }
}

export async function fetchSourcingInsights() {
  try {
    const supabase = await createServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return []

    const { data: profile } = await supabase.from("profiles").select("tenant_id").eq("id", user.id).single()

    if (!profile?.tenant_id) return []

    const { data: insights, error } = await supabase
      .from("sourcing_insights")
      .select("*")
      .eq("tenant_id", profile.tenant_id)
      .eq("user_id", user.id)
      .gte("expires_at", new Date().toISOString())
      .order("created_at", { ascending: false })

    if (error) {
      console.error("[v0] Error getting insights:", error)
      return []
    }

    return insights || []
  } catch (error) {
    console.error("[v0] Error getting insights:", error)
    return []
  }
}
