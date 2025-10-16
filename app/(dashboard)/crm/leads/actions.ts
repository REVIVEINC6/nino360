"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { z } from "zod"

// Validation Schemas
const leadSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  company: z.string().optional(),
  title: z.string().optional(),
  source: z.string().optional(),
  status: z.enum(["new", "contacted", "qualified", "unqualified", "converted"]).default("new"),
  score: z.number().min(0).max(100).optional(),
  notes: z.string().optional(),
})

type LeadInput = z.infer<typeof leadSchema>

// List Leads
export async function listLeads(filters?: {
  status?: string
  source?: string
  minScore?: number
  search?: string
  page?: number
  pageSize?: number
}) {
  try {
    const supabase = await createClient()

    // Get current user and tenant
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error("Unauthorized")

    const { data: profile } = await supabase.from("users").select("tenant_id").eq("id", user.id).single()

    if (!profile?.tenant_id) throw new Error("No tenant found")

    // Build query
    let query = supabase
      .from("crm_leads")
      .select("*", { count: "exact" })
      .eq("tenant_id", profile.tenant_id)
      .order("created_at", { ascending: false })

    // Apply filters
    if (filters?.status) {
      query = query.eq("status", filters.status)
    }
    if (filters?.source) {
      query = query.eq("source", filters.source)
    }
    if (filters?.minScore) {
      query = query.gte("score", filters.minScore)
    }
    if (filters?.search) {
      query = query.or(
        `first_name.ilike.%${filters.search}%,last_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%,company.ilike.%${filters.search}%`,
      )
    }

    // Pagination
    const page = filters?.page || 1
    const pageSize = filters?.pageSize || 50
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    query = query.range(from, to)

    const { data, error, count } = await query

    if (error) throw error

    return {
      success: true,
      data,
      pagination: {
        page,
        pageSize,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / pageSize),
      },
    }
  } catch (error) {
    console.error("[v0] Error listing leads:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to list leads",
    }
  }
}

// Get Lead by ID
export async function getLead(id: string) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error("Unauthorized")

    const { data, error } = await supabase.from("crm_leads").select("*").eq("id", id).single()

    if (error) throw error

    return { success: true, data }
  } catch (error) {
    console.error("[v0] Error getting lead:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get lead",
    }
  }
}

// Create Lead
export async function createLead(input: LeadInput) {
  try {
    // Validate input
    const validated = leadSchema.parse(input)

    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error("Unauthorized")

    const { data: profile } = await supabase.from("users").select("tenant_id").eq("id", user.id).single()

    if (!profile?.tenant_id) throw new Error("No tenant found")

    const { data, error } = await supabase
      .from("crm_leads")
      .insert({
        ...validated,
        tenant_id: profile.tenant_id,
        created_by: user.id,
      })
      .select()
      .single()

    if (error) throw error

    revalidatePath("/crm/leads")

    return { success: true, data }
  } catch (error) {
    console.error("[v0] Error creating lead:", error)
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: "Validation error",
        details: error.errors,
      }
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create lead",
    }
  }
}

// Update Lead
export async function updateLead(id: string, input: Partial<LeadInput>) {
  try {
    // Validate input
    const validated = leadSchema.partial().parse(input)

    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error("Unauthorized")

    const { data, error } = await supabase.from("crm_leads").update(validated).eq("id", id).select().single()

    if (error) throw error

    revalidatePath("/crm/leads")
    revalidatePath(`/crm/leads/${id}`)

    return { success: true, data }
  } catch (error) {
    console.error("[v0] Error updating lead:", error)
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: "Validation error",
        details: error.errors,
      }
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update lead",
    }
  }
}

// Delete Lead
export async function deleteLead(id: string) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error("Unauthorized")

    const { error } = await supabase.from("crm_leads").delete().eq("id", id)

    if (error) throw error

    revalidatePath("/crm/leads")

    return { success: true }
  } catch (error) {
    console.error("[v0] Error deleting lead:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete lead",
    }
  }
}

// Convert Lead to Contact/Opportunity
export async function convertLead(id: string, createOpportunity = false) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error("Unauthorized")

    // Get lead
    const { data: lead, error: leadError } = await supabase.from("crm_leads").select("*").eq("id", id).single()

    if (leadError) throw leadError

    // Create contact
    const { data: contact, error: contactError } = await supabase
      .from("crm_contacts")
      .insert({
        tenant_id: lead.tenant_id,
        first_name: lead.first_name,
        last_name: lead.last_name,
        email: lead.email,
        phone: lead.phone,
        company: lead.company,
        title: lead.title,
        created_by: user.id,
      })
      .select()
      .single()

    if (contactError) throw contactError

    // Create opportunity if requested
    let opportunity = null
    if (createOpportunity) {
      const { data: opp, error: oppError } = await supabase
        .from("crm_opportunities")
        .insert({
          tenant_id: lead.tenant_id,
          name: `${lead.company || lead.first_name} - Opportunity`,
          contact_id: contact.id,
          stage: "qualification",
          created_by: user.id,
        })
        .select()
        .single()

      if (oppError) throw oppError
      opportunity = opp
    }

    // Update lead status
    await supabase.from("crm_leads").update({ status: "converted" }).eq("id", id)

    revalidatePath("/crm/leads")
    revalidatePath("/crm/contacts")
    if (createOpportunity) revalidatePath("/crm/opportunities")

    return {
      success: true,
      data: { contact, opportunity },
    }
  } catch (error) {
    console.error("[v0] Error converting lead:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to convert lead",
    }
  }
}

// Bulk Update Leads
export async function bulkUpdateLeads(ids: string[], updates: Partial<LeadInput>) {
  try {
    const validated = leadSchema.partial().parse(updates)

    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error("Unauthorized")

    const { data, error } = await supabase.from("crm_leads").update(validated).in("id", ids).select()

    if (error) throw error

    revalidatePath("/crm/leads")

    return { success: true, data }
  } catch (error) {
    console.error("[v0] Error bulk updating leads:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to bulk update leads",
    }
  }
}
