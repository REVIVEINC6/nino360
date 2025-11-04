import { createServerClient } from "@/lib/supabase/server"

export async function fetchLeads() {
  try {
    const supabase = await createServerClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return []
    }

    const { data: leads, error } = await supabase
      .from("crm_leads")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("[v0] Error listing leads:", error)
      return []
    }

    return leads || []
  } catch (error) {
    console.error("[v0] Error listing leads:", error)
    return []
  }
}
