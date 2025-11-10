import { createServerClient } from "@/lib/supabase/server"
import { getContext } from "@/app/(dashboard)/crm/dashboard/actions"
import { applyFieldPermissions } from "@/lib/security/flac"
import { createFlacProvider } from "@/lib/security/flac-provider"

/**
 * Fetch opportunities scoped to the current tenant and apply field-level
 * access control so callers only receive fields the viewer is allowed to see.
 */
export async function fetchOpportunities(filters?: { status?: string; stage_id?: string; search?: string }) {
  try {
    const supabase = await createServerClient()
    const { tenantId, userId } = await getContext()

    // If tenantId is not present (dev fallback) still allow but keep strict in prod
    if (!tenantId && process.env.NODE_ENV === "production") {
      throw new Error("No tenant context available")
    }

    let query = supabase
      .from("crm_opportunities")
      .select(`
        *,
        account:crm_accounts(id, name),
        contact:crm_contacts(id, first_name, last_name, email),
        stage:crm_opportunity_stages(id, name, win_prob),
        owner:core_users!owner_id(id, email, full_name)
      `)
      .order("created_at", { ascending: false })

  if (tenantId) query = query.eq("tenant_id", tenantId)

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

  const rows = (data || []) as Record<string, unknown>[]

    // Apply field-level permissions (FLAC) to each row before returning.
    // The FLAC provider is the default implementation in the app; applyFieldPermissions
    // expects a provider compatible with PermissionProvider. We import the module
    // that implements getUserFieldPermissions via RPC or DB (existing app conventions)
    const provider = createFlacProvider(supabase)

    const safeRows = [] as Record<string, unknown>[]
    for (const r of rows) {
      const masked = await applyFieldPermissions(provider, userId, tenantId || "", "crm_opportunities", r)
      safeRows.push(masked)
    }

    return safeRows
  } catch (error) {
    console.error("Fetch opportunities error:", error)
    return []
  }
}
