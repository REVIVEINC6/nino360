import { createServerClient } from "@/lib/supabase/server"

export async function fetchOpportunities(filters?: { status?: string; stage_id?: string; search?: string }) {
  try {
    const supabase = await createServerClient()

    let query = supabase
      .from("crm.opportunities")
      .select(`
        *,
        account:crm.accounts(id, name),
        contact:crm.contacts(id, first_name, last_name, email),
        stage:crm.opportunity_stages(id, name, win_prob),
        owner:core.users!owner_id(id, email, full_name)
      `)
      .order("created_at", { ascending: false })

    if (filters?.status) {
      query = query.eq("status", filters.status)
    }

    if (filters?.stage_id) {
      query = query.eq("stage_id", filters.stage_id)
    }

    if (filters?.search) {
      query = query.ilike("title", `%${filters.search}%`)
    }

    const { data, error } = await query

    if (error) {
      console.error("Fetch opportunities error:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Fetch opportunities error:", error)
    return []
  }
}
