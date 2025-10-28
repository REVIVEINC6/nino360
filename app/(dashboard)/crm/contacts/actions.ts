"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { hasPermission } from "@/lib/rbac/server"
import { PERMISSIONS } from "@/lib/rbac/permissions"
import { generateText } from "ai"

const contactSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  mobile: z.string().optional(),
  company: z.string().optional(),
  title: z.string().optional(),
  department: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  postal_code: z.string().optional(),
  linkedin_url: z.string().url().optional().or(z.literal("")),
  twitter_handle: z.string().optional(),
  notes: z.string().optional(),
  tags: z.array(z.string()).optional(),
})

type ContactInput = z.infer<typeof contactSchema>

// Context & Feature Flags
export async function getContext() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { data: profile } = await supabase.from("users").select("tenant_id").eq("id", user.id).single()

  if (!profile?.tenant_id) throw new Error("No tenant found")

  const [copilot, sequences, audit, importPerm, exportPerm] = await Promise.all([
    hasPermission(PERMISSIONS.TENANT_DASHBOARD_VIEW),
    hasPermission(PERMISSIONS.CRM_CONTACTS_CREATE),
    hasPermission(PERMISSIONS.ADMIN_AUDIT_READ),
    hasPermission(PERMISSIONS.CRM_CONTACTS_CREATE),
    hasPermission(PERMISSIONS.CRM_CONTACTS_READ),
  ])

  // Get unique tags
  const { data: contacts } = await supabase.from("crm_contacts").select("tags").eq("tenant_id", profile.tenant_id)

  const allTags = new Set<string>()
  ;(contacts as any[] | undefined)?.forEach((c: any) => (c.tags || []).forEach((t: string) => allTags.add(t)))

  return {
    tenantId: profile.tenant_id,
    myUserId: user.id,
    features: {
      copilot,
      sequences,
      audit,
      import: importPerm,
      export: exportPerm,
    },
    tags: Array.from(allTags).sort(),
  }
}

// Enhanced list with advanced filters
const listContactsSchema = z.object({
  q: z.string().optional(),
  owner: z.enum(["me", "team", "all"]).or(z.string()).optional(),
  accountId: z.string().uuid().optional(),
  tags: z.array(z.string()).optional(),
  engaged: z.enum(["any", "30d", "90d", "none"]).optional(),
  healthMin: z.number().min(0).max(100).optional(),
  healthMax: z.number().min(0).max(100).optional(),
  listId: z.string().uuid().optional(),
  view: z.enum(["table", "profile"]).optional(),
  page: z.number().min(1).default(1),
  pageSize: z.number().min(1).max(100).default(50),
  sort: z.string().optional(),
  dir: z.enum(["asc", "desc"]).optional(),
})

export async function listContacts(params: z.infer<typeof listContactsSchema>) {
  try {
    const validated = listContactsSchema.parse(params)
    const supabase = await createClient()
    const { tenantId, myUserId } = await getContext()

    let query = supabase
      .from("crm_contacts")
      .select(
        `
        *,
        account:account_id(id, name),
        owner:owner_id(id, full_name, avatar_url)
      `,
        { count: "exact" },
      )
      .eq("tenant_id", tenantId)

    // Search filter
    if (validated.q) {
      query = query.or(
        `first_name.ilike.%${validated.q}%,last_name.ilike.%${validated.q}%,email.ilike.%${validated.q}%`,
      )
    }

    // Owner filter
    if (validated.owner === "me") {
      query = query.eq("owner_id", myUserId)
    } else if (validated.owner === "team") {
      // Get team members (same tenant)
      const { data: teamMembers } = await supabase.from("users").select("id").eq("tenant_id", tenantId)
  const teamIds = (teamMembers as any[] | undefined)?.map((m: any) => m.id) || []
      query = query.in("owner_id", teamIds)
    } else if (validated.owner && validated.owner !== "all") {
      query = query.eq("owner_id", validated.owner)
    }

    // Account filter
    if (validated.accountId) {
      query = query.eq("account_id", validated.accountId)
    }

    // Tags filter
    if (validated.tags && validated.tags.length > 0) {
      query = query.contains("tags", validated.tags)
    }

    // Engagement filter
    if (validated.engaged) {
      const now = new Date()
      if (validated.engaged === "30d") {
        const date = new Date(now.setDate(now.getDate() - 30))
        query = query.gte("last_engaged_at", date.toISOString())
      } else if (validated.engaged === "90d") {
        const date = new Date(now.setDate(now.getDate() - 90))
        query = query.gte("last_engaged_at", date.toISOString())
      } else if (validated.engaged === "none") {
        query = query.is("last_engaged_at", null)
      }
    }

    // Health score filter
    if (validated.healthMin !== undefined) {
      query = query.gte("health_score", validated.healthMin)
    }
    if (validated.healthMax !== undefined) {
      query = query.lte("health_score", validated.healthMax)
    }

    // List filter
    if (validated.listId) {
      const { data: members } = await supabase
        .from("crm_contact_list_members")
        .select("contact_id")
        .eq("list_id", validated.listId)
  const contactIds = (members as any[] | undefined)?.map((m: any) => m.contact_id) || []
      if (contactIds.length > 0) {
        query = query.in("id", contactIds)
      } else {
        return { success: true, rows: [], total: 0, facets: [] }
      }
    }

    // Sorting
    const sortField = validated.sort || "created_at"
    const sortDir = validated.dir || "desc"
    query = query.order(sortField, { ascending: sortDir === "asc" })

    // Pagination
    const from = (validated.page - 1) * validated.pageSize
    const to = from + validated.pageSize - 1
    query = query.range(from, to)

    const { data, error, count } = await query

    if (error) throw error

    // Get tag facets
    const { data: allContacts } = await supabase.from("crm_contacts").select("tags").eq("tenant_id", tenantId)

    const tagCounts = new Map<string, number>()
    ;(allContacts as any[] | undefined)?.forEach((c: any) => {
      ;(c.tags || []).forEach((tag: string) => {
        tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1)
      })
    })

    const facets = Array.from(tagCounts.entries())
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)

    return {
      success: true,
      rows: (data as any[]) || [],
      total: count || 0,
      facets,
    }
  } catch (error) {
    console.error("[v0] Error listing contacts:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to list contacts",
    }
  }
}

export async function getContact(id: string) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error("Unauthorized")

    const { data, error } = await supabase.from("crm_contacts").select("*").eq("id", id).single()

    if (error) throw error

    return { success: true, data }
  } catch (error) {
    console.error("[v0] Error getting contact:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get contact",
    }
  }
}

export async function createContact(input: ContactInput) {
  try {
    const validated = contactSchema.parse(input)

    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error("Unauthorized")

    const { data: profile } = await supabase.from("users").select("tenant_id").eq("id", user.id).single()

    if (!profile?.tenant_id) throw new Error("No tenant found")

    const { data, error } = await supabase
      .from("crm_contacts")
      .insert({
        ...validated,
        tenant_id: profile.tenant_id,
        created_by: user.id,
      })
      .select()
      .single()

    if (error) throw error

    revalidatePath("/crm/contacts")

    return { success: true, data }
  } catch (error) {
    console.error("[v0] Error creating contact:", error)
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: "Validation error",
        details: error.errors,
      }
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create contact",
    }
  }
}

export async function updateContact(id: string, input: Partial<ContactInput>) {
  try {
    const validated = contactSchema.partial().parse(input)

    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error("Unauthorized")

    const { data, error } = await supabase.from("crm_contacts").update(validated).eq("id", id).select().single()

    if (error) throw error

    revalidatePath("/crm/contacts")
    revalidatePath(`/crm/contacts/${id}`)

    return { success: true, data }
  } catch (error) {
    console.error("[v0] Error updating contact:", error)
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: "Validation error",
        details: error.errors,
      }
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update contact",
    }
  }
}

export async function deleteContact(id: string) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error("Unauthorized")

    const { error } = await supabase.from("crm_contacts").delete().eq("id", id)

    if (error) throw error

    revalidatePath("/crm/contacts")

    return { success: true }
  } catch (error) {
    console.error("[v0] Error deleting contact:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete contact",
    }
  }
}

export async function reassignContacts(input: { ids: string[]; owner_id: string }) {
  try {
    const supabase = await createClient()
    const { tenantId } = await getContext()

    const { error } = await supabase
      .from("crm_contacts")
      .update({ owner_id: input.owner_id })
      .in("id", input.ids)
      .eq("tenant_id", tenantId)

    if (error) throw error

    revalidatePath("/crm/contacts")

    return { success: true, count: input.ids.length }
  } catch (error) {
    console.error("[v0] Error reassigning contacts:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to reassign contacts",
    }
  }
}

// Lists & Segments
export async function listLists() {
  try {
    const supabase = await createClient()
    const { tenantId } = await getContext()

    const { data, error } = await supabase
      .from("crm_contact_lists")
      .select(`
        id,
        name,
        kind,
        created_at,
        members:crm_contact_list_members(count)
      `)
      .eq("tenant_id", tenantId)
      .order("name")

    if (error) throw error

    return {
      success: true,
      data:
        (data as any[] | undefined)?.map((list: any) => ({
          id: list.id,
          name: list.name,
          kind: list.kind,
          count: list.members?.[0]?.count || 0,
        })) || [],
    }
  } catch (error) {
    console.error("[v0] Error listing lists:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to list lists",
    }
  }
}

export async function upsertList(input: {
  id?: string
  name: string
  kind: "static" | "segment"
  definition?: any
}) {
  try {
    const supabase = await createClient()
    const { tenantId, myUserId } = await getContext()

    if (input.id) {
      const { data, error } = await supabase
        .from("crm_contact_lists")
        .update({
          name: input.name,
          kind: input.kind,
          definition: input.definition || {},
        })
        .eq("id", input.id)
        .eq("tenant_id", tenantId)
        .select()
        .single()

      if (error) throw error
      revalidatePath("/crm/contacts")
      return { success: true, data }
    } else {
      const { data, error } = await supabase
        .from("crm_contact_lists")
        .insert({
          tenant_id: tenantId,
          name: input.name,
          kind: input.kind,
          definition: input.definition || {},
          created_by: myUserId,
        })
        .select()
        .single()

      if (error) throw error
      revalidatePath("/crm/contacts")
      return { success: true, data }
    }
  } catch (error) {
    console.error("[v0] Error upserting list:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to save list",
    }
  }
}

export async function subscribeToList(input: { listId: string; contactIds: string[] }) {
  try {
    const supabase = await createClient()
    const { tenantId } = await getContext()

    const records = input.contactIds.map((contactId) => ({
      list_id: input.listId,
      contact_id: contactId,
      tenant_id: tenantId,
    }))

    const { error } = await supabase
      .from("crm_contact_list_members")
      .upsert(records, { onConflict: "list_id,contact_id" })

    if (error) throw error

    revalidatePath("/crm/contacts")
    return { success: true }
  } catch (error) {
    console.error("[v0] Error subscribing to list:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to add to list",
    }
  }
}

export async function removeFromList(input: { listId: string; contactIds: string[] }) {
  try {
    const supabase = await createClient()
    const { tenantId } = await getContext()

    const { error } = await supabase
      .from("crm_contact_list_members")
      .delete()
      .eq("list_id", input.listId)
      .in("contact_id", input.contactIds)
      .eq("tenant_id", tenantId)

    if (error) throw error

    revalidatePath("/crm/contacts")
    return { success: true }
  } catch (error) {
    console.error("[v0] Error removing from list:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to remove from list",
    }
  }
}

// AI Enrichment & Dedupe
export async function aiEnrichContact(id: string) {
  try {
    const { features } = await getContext()
    if (!features.copilot) {
      throw new Error("AI Copilot feature not enabled")
    }

    const supabase = await createClient()
    const { tenantId } = await getContext()

    const { data: contact } = await supabase
      .from("crm_contacts")
      .select("*")
      .eq("id", id)
      .eq("tenant_id", tenantId)
      .single()

    if (!contact) throw new Error("Contact not found")

    // Simulate AI enrichment (in production, call external APIs)
    const prompt = `Enrich contact data for: ${contact.first_name} ${contact.last_name}, ${contact.title || "Unknown title"} at ${contact.company || "Unknown company"}. 
    Provide: job seniority level, industry insights, company size estimate, and suggested health score (0-100).
    Return as JSON with keys: seniority, industry, company_size, health_score_delta, confidence.`

    const { text } = await generateText({
      model: "openai/gpt-4o-mini",
      prompt,
      maxTokens: 300,
    })

    let enrichment = {}
    try {
      enrichment = JSON.parse(text)
    } catch {
      enrichment = { raw: text, confidence: 0.5 }
    }

    const healthDelta = (enrichment as any).health_score_delta || 0
    const newHealthScore = Math.max(0, Math.min(100, (contact.health_score || 50) + healthDelta))

    const { error } = await supabase
      .from("crm_contacts")
      .update({
        enrichment,
        health_score: newHealthScore,
      })
      .eq("id", id)
      .eq("tenant_id", tenantId)

    if (error) throw error

    revalidatePath("/crm/contacts")
    revalidatePath(`/crm/contacts/${id}`)

    return { success: true, enrichment, health_score: newHealthScore }
  } catch (error) {
    console.error("[v0] Error enriching contact:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to enrich contact",
    }
  }
}

export async function checkDedupe(input: { email?: string; name?: string; account?: string }) {
  try {
    const supabase = await createClient()
    const { tenantId } = await getContext()

    const matches: any[] = []

    // Check by email
    if (input.email) {
      const { data } = await supabase
        .from("crm_contacts")
        .select("id, first_name, last_name, email, company")
        .eq("tenant_id", tenantId)
        .ilike("email", input.email)
        .limit(5)

  if (data) matches.push(...(data as any[]).map((d: any) => ({ ...d, match_type: "email" })))
    }

    // Check by name + company
    if (input.name && input.account) {
      const [firstName, ...lastNameParts] = input.name.split(" ")
      const lastName = lastNameParts.join(" ")

      const { data } = await supabase
        .from("crm_contacts")
        .select("id, first_name, last_name, email, company")
        .eq("tenant_id", tenantId)
        .ilike("first_name", `%${firstName}%`)
        .ilike("last_name", `%${lastName}%`)
        .limit(5)

  if (data) matches.push(...(data as any[]).map((d: any) => ({ ...d, match_type: "name" })))
    }

    // Deduplicate matches by id
    const uniqueMatches = Array.from(new Map(matches.map((m) => [m.id, m])).values())

    return { success: true, matches: uniqueMatches }
  } catch (error) {
    console.error("[v0] Error checking duplicates:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to check duplicates",
    }
  }
}

// Merge Contacts
export async function mergeContacts(primaryId: string, duplicateIds: string[]) {
  try {
    const supabase = await createClient()
    const { tenantId } = await getContext()

    // Get all contacts
    const { data: contacts } = await supabase
      .from("crm_contacts")
      .select("*")
      .in("id", [primaryId, ...duplicateIds])
      .eq("tenant_id", tenantId)

    if (!contacts || contacts.length < 2) {
      throw new Error("Contacts not found")
    }

  const primary = (contacts as any[]).find((c: any) => c.id === primaryId)
  const duplicates = (contacts as any[]).filter((c: any) => c.id !== primaryId)

    if (!primary) throw new Error("Primary contact not found")

    // Merge fields (non-null from duplicates)
    const merged: any = { ...primary }
    duplicates.forEach((dup: any) => {
      Object.keys(dup).forEach((key: string) => {
        if (dup[key] && !merged[key]) {
          merged[key] = dup[key]
        }
      })
      // Merge tags
      if (dup.tags) {
        merged.tags = Array.from(new Set([...(merged.tags || []), ...dup.tags]))
      }
    })

    // Update primary contact
    const { error: updateError } = await supabase
      .from("crm_contacts")
      .update(merged)
      .eq("id", primaryId)
      .eq("tenant_id", tenantId)

    if (updateError) throw updateError

    // Reattach activities
    await supabase
      .from("crm_activities")
      .update({ contact_id: primaryId })
      .in("contact_id", duplicateIds)
      .eq("tenant_id", tenantId)

    // Reattach files
    await supabase
      .from("crm_contact_files")
      .update({ contact_id: primaryId })
      .in("contact_id", duplicateIds)
      .eq("tenant_id", tenantId)

    // Reattach list memberships
    await supabase
      .from("crm_contact_list_members")
      .update({ contact_id: primaryId })
      .in("contact_id", duplicateIds)
      .eq("tenant_id", tenantId)

    // Delete duplicates
    const { error: deleteError } = await supabase
      .from("crm_contacts")
      .delete()
      .in("id", duplicateIds)
      .eq("tenant_id", tenantId)

    if (deleteError) throw deleteError

    revalidatePath("/crm/contacts")
    revalidatePath(`/crm/contacts/${primaryId}`)

    return { success: true, merged: primaryId }
  } catch (error) {
    console.error("[v0] Error merging contacts:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to merge contacts",
    }
  }
}

// Activities, Tasks, Files
export async function listActivities(contactId: string, limit = 100) {
  try {
    const supabase = await createClient()
    const { tenantId } = await getContext()

    const { data, error } = await supabase
      .from("crm_activities")
      .select(`
        id,
        type,
        subject,
        body,
        when_at,
        created_by,
        owner:owner_id(full_name, avatar_url)
      `)
      .eq("tenant_id", tenantId)
      .eq("contact_id", contactId)
      .order("when_at", { ascending: false })
      .limit(limit)

    if (error) throw error

    return { success: true, data: data || [] }
  } catch (error) {
    console.error("[v0] Error listing activities:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to list activities",
    }
  }
}

export async function addActivity(
  contactId: string,
  input: { type: string; subject?: string; body?: string; data?: any },
) {
  try {
    const supabase = await createClient()
    const { tenantId, myUserId } = await getContext()

    const { data, error } = await supabase
      .from("crm_activities")
      .insert({
        tenant_id: tenantId,
        contact_id: contactId,
        entity_type: "contact",
        entity_id: contactId,
        type: input.type,
        subject: input.subject,
        body: input.body,
        data: input.data || {},
        created_by: myUserId,
        owner_id: myUserId,
      })
      .select()
      .single()

    if (error) throw error

    revalidatePath(`/crm/contacts/${contactId}`)

    return { success: true, data }
  } catch (error) {
    console.error("[v0] Error adding activity:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to add activity",
    }
  }
}

export async function listTasks(contactId: string) {
  try {
    const supabase = await createClient()
    const { tenantId } = await getContext()

    const { data, error } = await supabase
      .from("crm_tasks")
      .select(`
        id,
        title,
        description,
        due_date,
        status,
        priority,
        owner:owner_id(full_name)
      `)
      .eq("tenant_id", tenantId)
      .eq("contact_id", contactId)
      .order("due_date", { ascending: true })

    if (error) throw error

    return { success: true, data: data || [] }
  } catch (error) {
    console.error("[v0] Error listing tasks:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to list tasks",
    }
  }
}

export async function setTaskStatus(id: string, status: "open" | "done" | "cancelled") {
  try {
    const supabase = await createClient()
    const { tenantId } = await getContext()

    const update: any = { status }
    if (status === "done") {
      update.completed_at = new Date().toISOString()
    }

    const { error } = await supabase.from("crm_tasks").update(update).eq("id", id).eq("tenant_id", tenantId)

    if (error) throw error

    revalidatePath("/crm/contacts")

    return { success: true }
  } catch (error) {
    console.error("[v0] Error updating task:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update task",
    }
  }
}

// Audit Verify
export async function getAuditMini(contactId: string, limit = 10) {
  try {
    const { features } = await getContext()
    if (!features.audit) return { success: true, data: [] }

    const supabase = await createClient()
    const { tenantId } = await getContext()

    const { data, error } = await supabase
      .from("app_audit_log")
      .select("id, created_at, action, entity_type, entity_id, hash")
      .eq("tenant_id", tenantId)
      .eq("entity_id", contactId)
      .order("created_at", { ascending: false })
      .limit(limit)

    if (error) throw error

    return { success: true, data: data || [] }
  } catch (error) {
    console.error("[v0] Error getting audit:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get audit",
    }
  }
}

export async function verifyHash(hash: string) {
  try {
    const supabase = await createClient()
    const { tenantId } = await getContext()

    const { data: record } = await supabase
      .from("app_audit_log")
      .select("*")
      .eq("hash", hash)
      .eq("tenant_id", tenantId)
      .single()

    if (!record) {
      return { valid: false, error: "Record not found" }
    }

    // Simple validation (in production, verify full chain)
    return {
      valid: true,
      record: {
        action: record.action,
        entity: record.entity_type,
        timestamp: record.created_at,
      },
    }
  } catch (error) {
    console.error("[v0] Error verifying hash:", error)
    return {
      valid: false,
      error: error instanceof Error ? error.message : "Failed to verify hash",
    }
  }
}
