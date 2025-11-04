"use server"
import { createServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { logAudit } from "@/lib/audit/server"
import { hasPermission, requirePermission } from "@/lib/rbac/server"
import { PERMISSIONS } from "@/lib/rbac/permissions"
import {
  hotlistRequirementSchema,
  type HotlistRequirementInput,
  hotlistRequirementFiltersSchema,
  type HotlistRequirementFilters,
} from "@/lib/hotlist/validators"

/**
 * Get hotlist requirements with filters
 */
export async function getHotlistRequirements(filters?: HotlistRequirementFilters) {
  const validatedFilters = hotlistRequirementFiltersSchema.parse(filters || {})
  const { page, limit, status, urgency, client_id, search } = validatedFilters

  const allowed = await hasPermission(PERMISSIONS.HOTLIST_REQUIREMENTS_READ)
  if (!allowed) {
    return {
      requirements: [],
      total: 0,
      page,
      limit,
      totalPages: 0,
    }
  }

  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return {
      requirements: [],
      total: 0,
      page,
      limit,
      totalPages: 0,
    }
  }

  const tenantId = user.user_metadata?.tenant_id
  if (!tenantId) {
    return {
      requirements: [],
      total: 0,
      page,
      limit,
      totalPages: 0,
    }
  }

  let query = supabase
    .from("bench.hotlist_requirements")
    .select(
      `
      *,
      client:crm.accounts(id, name),
      owner:core.users!owner_id(id, email, full_name),
      created_by_user:core.users!created_by(id, email, full_name)
    `,
      { count: "exact" },
    )
    .eq("tenant_id", tenantId)
    .order("created_at", { ascending: false })

  if (status) query = query.eq("status", status)
  if (urgency) query = query.eq("urgency", urgency)
  if (client_id) query = query.eq("client_id", client_id)
  if (search) query = query.ilike("title", `%${search}%`)

  // Pagination
  const from = (page - 1) * limit
  const to = from + limit - 1
  query = query.range(from, to)

  const { data, error, count } = await query
  if (error) {
    console.error("[v0] Error fetching hotlist requirements:", error)
    return {
      requirements: [],
      total: 0,
      page,
      limit,
      totalPages: 0,
    }
  }

  return {
    requirements: data || [],
    total: count || 0,
    page,
    limit,
    totalPages: Math.ceil((count || 0) / limit),
  }
}

/**
 * Create hotlist requirement
 */
export async function createHotlistRequirement(input: HotlistRequirementInput) {
  await requirePermission(PERMISSIONS.HOTLIST_REQUIREMENTS_WRITE)

  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error("Unauthorized")

  const tenantId = user.user_metadata?.tenant_id
  if (!tenantId) throw new Error("No tenant found")

  const body = hotlistRequirementSchema.parse(input)

  const { data, error } = await supabase
    .from("bench.hotlist_requirements")
    .insert({
      ...body,
      tenant_id: tenantId,
      created_by: user.id,
      owner_id: user.id,
    })
    .select()
    .single()

  if (error) throw new Error(error.message)

  await logAudit({
    tenantId,
    userId: user.id,
    action: "hotlist.requirement.created",
    entity: "hotlist_requirement",
    entityId: data.id,
    metadata: { title: body.title, urgency: body.urgency },
  })

  revalidatePath("/hotlist")
  revalidatePath("/hotlist/requirements")
  return data
}

/**
 * Update hotlist requirement
 */
export async function updateHotlistRequirement(id: string, input: Partial<HotlistRequirementInput>) {
  await requirePermission(PERMISSIONS.HOTLIST_REQUIREMENTS_WRITE)

  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error("Unauthorized")

  const tenantId = user.user_metadata?.tenant_id
  if (!tenantId) throw new Error("No tenant found")

  const { data, error } = await supabase
    .from("bench.hotlist_requirements")
    .update(input)
    .eq("id", id)
    .eq("tenant_id", tenantId)
    .select()
    .single()

  if (error) throw new Error(error.message)

  await logAudit({
    tenantId,
    userId: user.id,
    action: "hotlist.requirement.updated",
    entity: "hotlist_requirement",
    entityId: id,
    metadata: input,
  })

  revalidatePath("/hotlist")
  revalidatePath("/hotlist/requirements")
  return data
}

/**
 * Toggle requirement urgency
 */
export async function toggleRequirementUrgency(id: string, urgency: "critical" | "high" | "medium" | "low") {
  await requirePermission(PERMISSIONS.HOTLIST_REQUIREMENTS_URGENT)

  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error("Unauthorized")

  const tenantId = user.user_metadata?.tenant_id
  if (!tenantId) throw new Error("No tenant found")

  const { data, error } = await supabase
    .from("bench.hotlist_requirements")
    .update({ urgency })
    .eq("id", id)
    .eq("tenant_id", tenantId)
    .select()
    .single()

  if (error) throw new Error(error.message)

  await logAudit({
    tenantId,
    userId: user.id,
    action: "hotlist.requirement.urgency_changed",
    entity: "hotlist_requirement",
    entityId: id,
    metadata: { urgency },
  })

  revalidatePath("/hotlist")
  revalidatePath("/hotlist/requirements")
  return data
}

/**
 * Close requirement
 */
export async function closeRequirement(id: string, reason?: string) {
  await requirePermission(PERMISSIONS.HOTLIST_REQUIREMENTS_WRITE)

  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error("Unauthorized")

  const tenantId = user.user_metadata?.tenant_id
  if (!tenantId) throw new Error("No tenant found")

  const { data, error } = await supabase
    .from("bench.hotlist_requirements")
    .update({
      status: "closed",
      actual_fill_date: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("tenant_id", tenantId)
    .select()
    .single()

  if (error) throw new Error(error.message)

  await logAudit({
    tenantId,
    userId: user.id,
    action: "hotlist.requirement.closed",
    entity: "hotlist_requirement",
    entityId: id,
    metadata: { reason },
  })

  revalidatePath("/hotlist")
  revalidatePath("/hotlist/requirements")
  return data
}

export const getRequirements = getHotlistRequirements
export const createRequirement = createHotlistRequirement
