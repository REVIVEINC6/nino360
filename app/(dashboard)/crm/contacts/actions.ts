"use server"

import { z } from "zod"
import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { hasPermission } from "@/lib/rbac/server"
import { PERMISSIONS } from "@/lib/rbac/permissions"
import { generateText } from "ai"
import { appendAudit } from '@/lib/hash'
import { createFlacProvider } from '@/lib/security/flac-provider'
import { ensureWritePermissions } from '@/lib/security/flac'

// Core server actions for CRM contacts (single, non-duplicated module)

const contactSchema = z.object({
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  company: z.string().optional(),
  title: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  mobile: z.string().optional(),
  linkedin_url: z.string().optional(),
  tags: z.array(z.string()).optional(),
  notes: z.string().optional(),
})

const listContactsSchema = z.object({
  q: z.string().optional(),
  owner: z.string().optional(),
  accountId: z.string().uuid().optional(),
  tags: z.array(z.string()).optional(),
  engaged: z.enum(["any", "30d", "90d", "none"]).optional(),
  healthMin: z.number().min(0).max(100).optional(),
  healthMax: z.number().min(0).max(100).optional(),
  listId: z.string().uuid().optional(),
  page: z.number().min(1).default(1),
  pageSize: z.number().min(1).max(200).default(50),
})

type ContactInput = z.infer<typeof contactSchema>

async function makeClient() {
  return await createClient()
}

export async function getContext() {
  const supabase = await makeClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { data: profile } = await supabase.from("users").select("tenant_id").eq("id", user.id).single()
  if (!profile?.tenant_id) {
    // In development, provide a tolerant fallback so the CRM UI can render and
    // buttons remain interactive. In production we still enforce tenant presence.
    if (process.env.NODE_ENV !== "production") {
      console.warn("[contacts] No tenant found; returning dev fallback context")
      return {
        supabase,
        tenantId: null,
        myUserId: user.id,
        features: { copilot: false, sequences: false, audit: false, import: false, export: false },
        tags: [],
      }
    }
    throw new Error("No tenant found")
  }

  const [copilot, sequences, audit, importPerm, exportPerm] = await Promise.all([
    hasPermission(PERMISSIONS.TENANT_DASHBOARD_VIEW),
    hasPermission(PERMISSIONS.CRM_CONTACTS_CREATE),
    hasPermission(PERMISSIONS.ADMIN_AUDIT_READ),
    hasPermission(PERMISSIONS.CRM_CONTACTS_CREATE),
    hasPermission(PERMISSIONS.CRM_CONTACTS_READ),
  ])

  const { data: contacts } = await supabase.from("crm_contacts").select("tags").eq("tenant_id", profile.tenant_id)
  const allTags = new Set<string>()
  ;(contacts as any[] | undefined)?.forEach((c: any) => (c.tags || []).forEach((t: string) => allTags.add(t)))

  return {
    supabase,
    tenantId: profile.tenant_id,
    myUserId: user.id,
    features: { copilot, sequences, audit, import: importPerm, export: exportPerm },
    tags: Array.from(allTags).sort(),
  }
}

export async function listContacts(params: z.infer<typeof listContactsSchema>) {
  try {
    const validated = listContactsSchema.parse(params)
    const ctx = await getContext()
    const { supabase, tenantId, myUserId } = ctx

    // Avoid PostgREST relationship auto-joins that can fail if FKs/views aren't aligned in dev.
    // Select explicit columns from base table; client/UI can fetch related names separately as needed.
    let query = supabase
      .from("crm_contacts")
      .select(
        "id, tenant_id, first_name, last_name, company, title, email, phone, mobile, tags, notes, account_id, owner_id, created_at, updated_at, last_engaged_at, health_score",
        { count: "exact" }
      )
      .eq("tenant_id", tenantId)

    if (validated.q) query = query.or(`first_name.ilike.%${validated.q}%,last_name.ilike.%${validated.q}%,email.ilike.%${validated.q}%`)
    if (validated.owner === "me") query = query.eq("owner_id", myUserId)
    if (validated.accountId) query = query.eq("account_id", validated.accountId)
    if (validated.tags && validated.tags.length) query = query.contains("tags", validated.tags)

    if (validated.engaged && validated.engaged !== "any") {
      const now = new Date()
      const days = validated.engaged === "30d" ? 30 : validated.engaged === "90d" ? 90 : 0
      if (days > 0) {
        const d = new Date(now.setDate(now.getDate() - days)).toISOString()
        query = query.gte("last_engaged_at", d)
      } else if (validated.engaged === "none") {
        query = query.is("last_engaged_at", null)
      }
    }

    if (validated.healthMin !== undefined) query = query.gte("health_score", validated.healthMin)
    if (validated.healthMax !== undefined) query = query.lte("health_score", validated.healthMax)

    if (validated.listId) {
      const { data: members } = await supabase.from("crm_contact_list_members").select("contact_id").eq("list_id", validated.listId)
      const contactIds = (members as any[] | undefined)?.map((m: any) => m.contact_id) || []
      if (contactIds.length === 0) return { success: true, rows: [], total: 0, facets: [] }
      query = query.in("id", contactIds)
    }

    const from = (validated.page - 1) * validated.pageSize
    const to = from + validated.pageSize - 1
    query = query.range(from, to)
    query = query.order("created_at", { ascending: false })

    const { data, error, count } = await query
    if (error) throw error

    const { data: allContacts } = await supabase.from("crm_contacts").select("tags").eq("tenant_id", tenantId)
    const tagCounts = new Map<string, number>()
    ;(allContacts as any[] | undefined)?.forEach((c: any) => (c.tags || []).forEach((t: string) => tagCounts.set(t, (tagCounts.get(t) || 0) + 1)))
    const facets = Array.from(tagCounts.entries()).map(([tag, cnt]) => ({ tag, count: cnt })).sort((a, b) => b.count - a.count)

    return { success: true, rows: (data as any[]) || [], total: count || 0, facets }
  } catch (err) {
    const e = err as any
    console.error("[contacts] list error:", e)
    return { success: false, error: e?.message || String(e) }
  }
}

export async function getContact(id: string) {
  try {
    const ctx = await getContext()
    const { supabase, tenantId } = ctx
    const { data, error } = await supabase.from("crm_contacts").select("*").eq("id", id).eq("tenant_id", tenantId).single()
    if (error) throw error
    return { success: true, data }
  } catch (err) {
    const e = err as any
    console.error("[contacts] get error:", e)
    return { success: false, error: e?.message || String(e) }
  }
}

export async function createContact(input: ContactInput) {
  try {
    const validated = contactSchema.parse(input)
    const ctx = await getContext()
    const { supabase, tenantId, myUserId } = ctx
    // FLAC: ensure write permissions for the fields being created
    try {
      const provider = createFlacProvider(supabase)
      await ensureWritePermissions(provider, myUserId, tenantId || '', 'crm_contacts', validated as any)
    } catch (e) {
      // If FLAC denies, surface a clear error
      console.warn('[contacts] FLAC denied create:', e)
      return { success: false, error: 'Write permission denied for some fields' }
    }

    const { data, error } = await supabase.from("crm_contacts").insert({ ...validated, tenant_id: tenantId, created_by: myUserId }).select().single()
    if (error) throw error
    // Audit
    try { await appendAudit({ tenantId, actorUserId: myUserId, action: 'crm.contacts.create', entity: 'contact', entityId: data?.id || null, diff: data || {} }) } catch (e) { console.warn('[contacts] audit create failed', e) }
    revalidatePath("/crm/contacts")
    return { success: true, data }
  } catch (err) {
    const e = err as any
    console.error("[contacts] create error:", e)
    if (e?.name === "ZodError") return { success: false, error: "Validation error", details: e.errors }
    return { success: false, error: e?.message || String(e) }
  }
}

export async function updateContact(id: string, input: Partial<ContactInput>) {
  try {
    const validated = contactSchema.partial().parse(input)
    const ctx = await getContext()
    const { supabase, tenantId } = ctx
    // FLAC: ensure write permissions on fields
    try {
      const provider = createFlacProvider(supabase)
      await ensureWritePermissions(provider, ctx.myUserId, tenantId || '', 'crm_contacts', validated as any)
    } catch (e) {
      console.warn('[contacts] FLAC denied update:', e)
      return { success: false, error: 'Write permission denied for some fields' }
    }

    const { data, error } = await supabase.from("crm_contacts").update(validated).eq("id", id).eq("tenant_id", tenantId).select().single()
    if (error) throw error
    try { await appendAudit({ tenantId, actorUserId: ctx.myUserId, action: 'crm.contacts.update', entity: 'contact', entityId: id, diff: validated as any }) } catch (e) { console.warn('[contacts] audit update failed', e) }
    revalidatePath("/crm/contacts")
    revalidatePath(`/crm/contacts/${id}`)
    return { success: true, data }
  } catch (err) {
    const e = err as any
    console.error("[contacts] update error:", e)
    if (e?.name === "ZodError") return { success: false, error: "Validation error", details: e.errors }
    return { success: false, error: e?.message || String(e) }
  }
}

export async function deleteContact(id: string) {
  try {
    const ctx = await getContext()
    const { supabase, tenantId } = ctx
    const { error } = await supabase.from("crm_contacts").delete().eq("id", id).eq("tenant_id", tenantId)
    if (error) throw error
    try { await appendAudit({ tenantId, actorUserId: ctx.myUserId, action: 'crm.contacts.delete', entity: 'contact', entityId: id, diff: {} }) } catch (e) { console.warn('[contacts] audit delete failed', e) }
    revalidatePath("/crm/contacts")
    return { success: true }
  } catch (err) {
    const e = err as any
    console.error("[contacts] delete error:", e)
    return { success: false, error: e?.message || String(e) }
  }
}

export async function reassignContacts(input: { ids: string[]; owner_id: string }) {
  try {
    const ctx = await getContext()
    const { supabase, tenantId } = ctx
    const { error } = await supabase.from("crm_contacts").update({ owner_id: input.owner_id }).in("id", input.ids).eq("tenant_id", tenantId)
    if (error) throw error
    revalidatePath("/crm/contacts")
    return { success: true, count: input.ids.length }
  } catch (err) {
    const e = err as any
    console.error("[contacts] reassign error:", e)
    return { success: false, error: e?.message || String(e) }
  }
}

// Lists and segments
export async function listLists() {
  try {
    const ctx = await getContext()
    const { supabase, tenantId } = ctx
    const { data, error } = await supabase.from("crm_contact_lists").select("id,name,kind,created_at").eq("tenant_id", tenantId).order("name")
    if (error) throw error
    return { success: true, data: (data as any[]) || [] }
  } catch (err) {
    const e = err as any
    console.error("[contacts] listLists error:", e)
    return { success: false, error: e?.message || String(e) }
  }
}

export async function upsertList(input: { id?: string; name: string; kind: "static" | "segment"; definition?: any }) {
  try {
    const ctx = await getContext()
    const { supabase, tenantId, myUserId } = ctx
    if (input.id) {
      const { data, error } = await supabase.from("crm_contact_lists").update({ name: input.name, kind: input.kind, definition: input.definition || {} }).eq("id", input.id).eq("tenant_id", tenantId).select().single()
      if (error) throw error
      revalidatePath("/crm/contacts")
      return { success: true, data }
    }
    const { data, error } = await supabase.from("crm_contact_lists").insert({ tenant_id: tenantId, name: input.name, kind: input.kind, definition: input.definition || {}, created_by: myUserId }).select().single()
    if (error) throw error
    revalidatePath("/crm/contacts")
    return { success: true, data }
  } catch (err) {
    const e = err as any
    console.error("[contacts] upsertList error:", e)
    return { success: false, error: e?.message || String(e) }
  }
}

export async function subscribeToList(input: { listId: string; contactIds: string[] }) {
  try {
    const ctx = await getContext()
    const { supabase, tenantId } = ctx
    const records = input.contactIds.map((contactId) => ({ list_id: input.listId, contact_id: contactId, tenant_id: tenantId }))
    const { error } = await supabase.from("crm_contact_list_members").upsert(records, { onConflict: "list_id,contact_id" })
    if (error) throw error
    revalidatePath("/crm/contacts")
    return { success: true }
  } catch (err) {
    const e = err as any
    console.error("[contacts] subscribeToList error:", e)
    return { success: false, error: e?.message || String(e) }
  }
}

export async function removeFromList(input: { listId: string; contactIds: string[] }) {
  try {
    const ctx = await getContext()
    const { supabase, tenantId } = ctx
    const { error } = await supabase.from("crm_contact_list_members").delete().eq("list_id", input.listId).in("contact_id", input.contactIds).eq("tenant_id", tenantId)
    if (error) throw error
    revalidatePath("/crm/contacts")
    return { success: true }
  } catch (err) {
    const e = err as any
    console.error("[contacts] removeFromList error:", e)
    return { success: false, error: e?.message || String(e) }
  }
}

export async function aiEnrichContact(id: string) {
  try {
    const ctx = await getContext()
    const { supabase, features } = ctx
    if (!features.copilot) throw new Error("AI Copilot disabled")
    const { data: contact } = await supabase.from("crm_contacts").select("*").eq("id", id).eq("tenant_id", ctx.tenantId).single()
    if (!contact) throw new Error("Contact not found")
    const prompt = `Enrich contact: ${contact.first_name || ""} ${contact.last_name || ""}`
    const { text } = await generateText({ model: "openai/gpt-4o-mini", prompt, maxTokens: 200 })
    let enrichment: any = {}
    try { enrichment = JSON.parse(text) } catch { enrichment = { raw: text } }
    const healthDelta = enrichment.health_score_delta || 0
    const newHealth = Math.max(0, Math.min(100, (contact.health_score || 50) + healthDelta))
    const { error } = await supabase.from("crm_contacts").update({ enrichment, health_score: newHealth }).eq("id", id).eq("tenant_id", ctx.tenantId)
    if (error) throw error
    revalidatePath("/crm/contacts")
    revalidatePath(`/crm/contacts/${id}`)
    return { success: true, enrichment, health_score: newHealth }
  } catch (err) {
    const e = err as any
    console.error("[contacts] aiEnrichContact error:", e)
    return { success: false, error: e?.message || String(e) }
  }
}

export async function checkDedupe(input: { email?: string; name?: string; account?: string }) {
  try {
    const ctx = await getContext()
    const { supabase, tenantId } = ctx
    const matches: any[] = []
    if (input.email) {
      const { data } = await supabase.from("crm_contacts").select("id, first_name, last_name, email, company").eq("tenant_id", tenantId).ilike("email", input.email).limit(5)
      if (data) matches.push(...(data as any[]).map(d => ({ ...d, match_type: 'email' })))
    }
    if (input.name) {
      const [first, ...rest] = input.name.split(' ')
      const last = rest.join(' ')
      const { data } = await supabase.from("crm_contacts").select("id, first_name, last_name, email, company").eq("tenant_id", tenantId).ilike("first_name", `%${first}%`).ilike("last_name", `%${last}%`).limit(5)
      if (data) matches.push(...(data as any[]).map(d => ({ ...d, match_type: 'name' })))
    }
    const unique = Array.from(new Map(matches.map(m => [m.id, m])).values())
    return { success: true, matches: unique }
  } catch (err) {
    const e = err as any
    console.error("[contacts] checkDedupe error:", e)
    return { success: false, error: e?.message || String(e) }
  }
}

export async function mergeContacts(primaryId: string, duplicateIds: string[]) {
  try {
    const ctx = await getContext()
    const { supabase, tenantId } = ctx
    const { data: contacts } = await supabase.from("crm_contacts").select("*").in("id", [primaryId, ...duplicateIds]).eq("tenant_id", tenantId)
    if (!contacts || contacts.length < 2) throw new Error("Contacts not found")
    const primary = (contacts as any[]).find(c => c.id === primaryId)
    const duplicates = (contacts as any[]).filter(c => c.id !== primaryId)
    if (!primary) throw new Error("Primary not found")
    const merged: any = { ...primary }
    duplicates.forEach(d => { Object.keys(d).forEach((k: string) => { if (d[k] && !merged[k]) merged[k] = d[k] }); if (d.tags) merged.tags = Array.from(new Set([...(merged.tags || []), ...d.tags])) })
    const { error: updErr } = await supabase.from("crm_contacts").update(merged).eq("id", primaryId).eq("tenant_id", tenantId)
    if (updErr) throw updErr
    await supabase.from("crm_activities").update({ contact_id: primaryId }).in("contact_id", duplicateIds).eq("tenant_id", tenantId)
    await supabase.from("crm_contact_files").update({ contact_id: primaryId }).in("contact_id", duplicateIds).eq("tenant_id", tenantId)
    await supabase.from("crm_contact_list_members").update({ contact_id: primaryId }).in("contact_id", duplicateIds).eq("tenant_id", tenantId)
    const { error: delErr } = await supabase.from("crm_contacts").delete().in("id", duplicateIds).eq("tenant_id", tenantId)
    if (delErr) throw delErr
    revalidatePath("/crm/contacts")
    revalidatePath(`/crm/contacts/${primaryId}`)
    return { success: true, merged: primaryId }
  } catch (err) {
    const e = err as any
    console.error("[contacts] mergeContacts error:", e)
    return { success: false, error: e?.message || String(e) }
  }
}

export async function listActivities(contactId: string, limit = 100) {
  try {
    const ctx = await getContext()
    const { supabase, tenantId } = ctx
    const { data, error } = await supabase.from("crm_activities").select("id, type, subject, body, when_at, created_by, owner:owner_id(full_name, avatar_url)").eq("tenant_id", tenantId).eq("contact_id", contactId).order("when_at", { ascending: false }).limit(limit)
    if (error) throw error
    return { success: true, data: data || [] }
  } catch (err) {
    const e = err as any
    console.error("[contacts] listActivities error:", e)
    return { success: false, error: e?.message || String(e) }
  }
}

export async function addActivity(contactId: string, input: { type: string; subject?: string; body?: string; data?: any }) {
  try {
    const ctx = await getContext()
    const { supabase, tenantId, myUserId } = ctx
    const { data, error } = await supabase.from("crm_activities").insert({ tenant_id: tenantId, contact_id: contactId, entity_type: "contact", entity_id: contactId, type: input.type, subject: input.subject, body: input.body, data: input.data || {}, created_by: myUserId, owner_id: myUserId }).select().single()
    if (error) throw error
    revalidatePath(`/crm/contacts/${contactId}`)
    return { success: true, data }
  } catch (err) {
    const e = err as any
    console.error("[contacts] addActivity error:", e)
    return { success: false, error: e?.message || String(e) }
  }
}

export async function listTasks(contactId: string) {
  try {
    const ctx = await getContext()
    const { supabase, tenantId } = ctx
    const { data, error } = await supabase.from("crm_tasks").select("id, title, description, due_date, status, priority, owner:owner_id(full_name)").eq("tenant_id", tenantId).eq("contact_id", contactId).order("due_date", { ascending: true })
    if (error) throw error
    return { success: true, data: data || [] }
  } catch (err) {
    const e = err as any
    console.error("[contacts] listTasks error:", e)
    return { success: false, error: e?.message || String(e) }
  }
}

export async function setTaskStatus(id: string, status: "open" | "done" | "cancelled") {
  try {
    const ctx = await getContext()
    const { supabase, tenantId } = ctx
    const update: any = { status }
    if (status === "done") update.completed_at = new Date().toISOString()
    const { error } = await supabase.from("crm_tasks").update(update).eq("id", id).eq("tenant_id", tenantId)
    if (error) throw error
    revalidatePath("/crm/contacts")
    return { success: true }
  } catch (err) {
    const e = err as any
    console.error("[contacts] setTaskStatus error:", e)
    return { success: false, error: e?.message || String(e) }
  }
}

export async function getAuditMini(contactId: string, limit = 10) {
  try {
    const ctx = await getContext()
    const { supabase, tenantId, features } = ctx
    if (!features.audit) return { success: true, data: [] }
    const { data, error } = await supabase.from("app_audit_log").select("id, created_at, action, entity_type, entity_id, hash").eq("tenant_id", tenantId).eq("entity_id", contactId).order("created_at", { ascending: false }).limit(limit)
    if (error) throw error
    return { success: true, data: data || [] }
  } catch (err) {
    const e = err as any
    console.error("[contacts] getAuditMini error:", e)
    return { success: false, error: e?.message || String(e) }
  }
}

export async function verifyHash(hash: string) {
  try {
    const ctx = await getContext()
    const { supabase, tenantId } = ctx
    const { data: record } = await supabase.from("app_audit_log").select("*").eq("hash", hash).eq("tenant_id", tenantId).single()
    if (!record) return { valid: false, error: "Record not found" }
    return { valid: true, record: { action: record.action, entity: record.entity_type, timestamp: record.created_at } }
  } catch (err) {
    const e = err as any
    console.error("[contacts] verifyHash error:", e)
    return { valid: false, error: e?.message || String(e) }
  }
}
