"use server"

import { z } from "zod"
import { createServerClient, getUser } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { hasPermission, requirePermission } from "@/lib/rbac/server"
import { PERMISSIONS } from "@/lib/rbac/permissions"
import { applyFieldPermissions, ensureWritePermissions } from "@/lib/security/flac"
import { createFlacProvider } from "@/lib/security/flac-provider"
import { appendAudit } from '@/lib/hash'

const accountSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(2, "Name must be at least 2 characters"),
  domain: z.string().optional(),
  industry: z.string().optional(),
  size: z.string().optional(),
  owner_id: z.string().uuid().optional(),
  billing_client_id: z.string().uuid().optional(),
  status: z.enum(["active", "inactive", "prospect", "customer"]).default("active"),
})

export async function upsertAccount(input: unknown) {
  const supabase = await createServerClient()
  // Require either create or update permission
  const canWrite = await hasPermission(PERMISSIONS.CRM_CLIENTS_CREATE).catch(() => false) || (await hasPermission(PERMISSIONS.CRM_CLIENTS_UPDATE).catch(() => false))
  if (!canWrite) throw new Error(`Permission denied: ${PERMISSIONS.CRM_CLIENTS_CREATE} or ${PERMISSIONS.CRM_CLIENTS_UPDATE}`)

  const body = accountSchema.parse(input)

  // FLAC: ensure user can write the provided fields
  try {
    const { data: ctxUser } = await supabase.auth.getUser()
    const userId = ctxUser?.user?.id || ''
    const { data: profile } = await supabase.from('profiles').select('tenant_id').eq('id', userId).single()
    const tenantId = profile?.tenant_id || ''
    const provider = createFlacProvider(supabase)
    await ensureWritePermissions(provider, userId, tenantId, 'crm_accounts', body as any)
  } catch (err) {
    // Bubble FLAC deny errors
    if ((err as any)?.code === 'FLAC_DENIED') throw err
    console.warn('[accounts] FLAC write check failed, continuing:', err)
  }

  const { data, error } = await supabase.from("crm.accounts").upsert({ ...body }).select().single()

  if (error) throw new Error(error.message)

  // Append audit entry (best-effort)
  try {
    const { data: ctxUser } = await supabase.auth.getUser()
    const userId = ctxUser?.user?.id || null
    const tenantRes = await supabase.from('profiles').select('tenant_id').eq('id', userId).single()
    const tenantId = tenantRes?.data?.tenant_id || null
    await appendAudit({ tenantId, actorUserId: userId, action: 'crm.accounts.upsert', entity: 'account', entityId: data?.id || null, diff: data || {} })
  } catch (e) {
    console.warn('[accounts] audit append failed', e)
  }

  revalidatePath("/crm/accounts")
  return data
}

export async function deleteAccount(id: string) {
  const supabase = await createServerClient()
  await requirePermission(PERMISSIONS.CRM_CLIENTS_DELETE)

  const { data: ctxUser } = await supabase.auth.getUser()
  const userId = ctxUser?.user?.id || null

  const { error } = await supabase.from("crm.accounts").delete().eq("id", id)

  if (error) throw new Error(error.message)

  // Append audit for deletion
  try {
    const tenantRes = await supabase.from('profiles').select('tenant_id').eq('id', userId).single()
    const tenantId = tenantRes?.data?.tenant_id || null
    await appendAudit({ tenantId, actorUserId: userId, action: 'crm.accounts.delete', entity: 'account', entityId: id, diff: {} })
  } catch (e) {
    console.warn('[accounts] audit append failed', e)
  }

  revalidatePath("/crm/accounts")
  return { success: true }
}

export async function getAccounts(filters?: { status?: string; search?: string }) {
  const supabase = await createServerClient()
  // Allow read if the user has view permission
  if (!(await hasPermission(PERMISSIONS.CRM_CLIENTS_READ))) {
    throw new Error(`Permission denied: ${PERMISSIONS.CRM_CLIENTS_READ}`)
  }

  let query = supabase
    .from("crm.accounts")
    .select("*, owner:core.users!owner_id(id, email, full_name)")
    .order("created_at", { ascending: false })

  // scope to tenant
  try {
    const { data: ctxUser } = await supabase.auth.getUser()
    const userId = ctxUser?.user?.id
    if (userId) {
      const { data: profile } = await supabase.from("profiles").select("tenant_id").eq("id", userId).single()
      if (profile?.tenant_id) query = query.eq("tenant_id", profile.tenant_id)
    }
  } catch (e) {
    // ignore tenant scoping if auth fails
  }

  if (filters?.status) {
    query = query.eq("status", filters.status)
  }

  if (filters?.search) {
    query = query.ilike("name", `%${filters.search}%`)
  }

  const { data, error } = await query

  if (error) throw new Error(error.message)

  // Apply FLAC masking per row (best-effort)
  try {
    const { data: ctxUser } = await supabase.auth.getUser()
    const userId = ctxUser?.user?.id
    if (userId && data) {
      const provider = createFlacProvider(supabase)
      // fetch tenant once
      const { data: profile } = await supabase.from("profiles").select("tenant_id").eq("id", userId).single()
      const tenantId = profile?.tenant_id || ""
      for (let i = 0; i < data.length; i++) {
        // applyFieldPermissions may be no-op if flac is not configured
        // eslint-disable-next-line no-await-in-loop
        // @ts-ignore
        data[i] = await applyFieldPermissions(provider, userId, tenantId, "crm_accounts", data[i])
      }
    }
  } catch (err) {
    // Log but don't fail the listing
    console.warn("FLAC apply error for accounts listing:", err)
  }

  return data
}

export async function createClient(input: {
  name: string
  industry?: string
  tier?: string
  status?: string
  location?: string
  notes?: string
}) {
  try {
    const supabase = await createServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: "Unauthorized" }
    }

    const { data: profile } = await supabase.from("users").select("tenant_id").eq("id", user.id).single()

    if (!profile?.tenant_id) {
      return { success: false, error: "No tenant found" }
    }

    const { data, error } = await supabase
      .from("crm_contacts")
      .insert({
        tenant_id: profile.tenant_id,
        company: input.name,
        industry: input.industry,
        tier: input.tier,
        status: input.status || "prospect",
        location: input.location,
        notes: input.notes,
        created_by: user.id,
      })
      .select()
      .single()

    if (error) throw error

    revalidatePath("/crm")
    return { success: true, data }
  } catch (error) {
    console.error("[v0] Create client error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create client",
    }
  }
}
