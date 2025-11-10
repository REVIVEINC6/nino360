"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import crypto from "crypto"

// Optional OpenAI REST helper
async function openAIChat(messages: Array<{ role: "system" | "user"; content: string }>) {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) return null
  try {
    const resp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        messages,
        temperature: 0.2,
      }),
    })
    if (!resp.ok) return null
    const data = await resp.json()
    const text = data?.choices?.[0]?.message?.content as string | undefined
    return text ?? null
  } catch {
    return null
  }
}

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

    if (!profile?.tenant_id) {
      if (process.env.NODE_ENV !== "production") {
        console.warn("[leads] No tenant found; returning dev fallback context")
        return {
          tenantId: null,
          userId: user.id,
        }
      }
      throw new Error("No tenant found")
    }

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

// Live AI validation for lead input
export async function aiValidateLead(input: Partial<LeadInput>) {
  try {
    // Basic validations first
    const issues: string[] = []
    if (input.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(input.email)) {
      issues.push("Email format looks invalid")
    }
    if ((input.first_name?.length ?? 0) === 0) issues.push("First name is required")
    if ((input.last_name?.length ?? 0) === 0) issues.push("Last name is required")

    // Ask OpenAI for suggestions if configured
    const ai = await openAIChat([
      {
        role: "system",
        content:
          "You are an assistant that validates CRM leads. Return concise improvement suggestions as a bullet list.",
      },
      {
        role: "user",
        content: `Validate this lead JSON and suggest improvements: ${JSON.stringify(input)}`,
      },
    ])

    return {
      success: true,
      issues,
      suggestions: ai ?? null,
    }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Validation failed" }
  }
}

// Predictive ML scoring (AI optional, with heuristic fallback)
export async function scoreLead(input: Partial<LeadInput>) {
  try {
    let score = 0
    // Heuristic signals
    if (input.company) score += 20
    if (input.title) score += 15
    if (input.email?.endsWith(".io") || input.email?.endsWith(".ai")) score += 10
    if (input.source === "referral") score += 20
    if (input.source === "event") score += 10
    if ((input.notes?.length ?? 0) > 50) score += 5
    score = Math.max(0, Math.min(85, score))

    // OpenAI refinement
    const ai = await openAIChat([
      {
        role: "system",
        content:
          "You score sales leads from 0-100. Consider intent, seniority, fit, and completeness. Return a single integer.",
      },
      { role: "user", content: `Lead JSON: ${JSON.stringify(input)}` },
    ])
    if (ai) {
      const n = parseInt(ai.match(/\d+/)?.[0] ?? "", 10)
      if (!Number.isNaN(n)) score = Math.max(score, Math.min(100, Math.max(0, n)))
    }
    return { success: true, score }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Scoring failed" }
  }
}

// Natural language filter → structured filters
export async function nlFilterToQuery(nl: string) {
  try {
    const base = { status: undefined as string | undefined, source: undefined as string | undefined, minScore: undefined as number | undefined, search: undefined as string | undefined }
    const text = nl.toLowerCase()
    if (text.includes("qualified")) base.status = "qualified"
    if (text.includes("converted")) base.status = "converted"
    const scoreMatch = text.match(/score\s*[>\-]\s*(\d{1,3})/)
    if (scoreMatch) base.minScore = Math.min(100, parseInt(scoreMatch[1], 10))
    const fromSource = (s: string) => (text.includes(s) ? s : undefined)
    base.source = fromSource("referral") || fromSource("event") || fromSource("website") || fromSource("social")

    // AI enhancement if available
    const ai = await openAIChat([
      { role: "system", content: "Map a natural language request to a JSON filter object with keys: status, source, minScore, search. Keep it short." },
      { role: "user", content: nl },
    ])
    if (ai) {
      try {
        const parsed = JSON.parse(ai)
        return { success: true, filters: { ...base, ...parsed } }
      } catch {
        // fall through
      }
    }
    return { success: true, filters: base }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Parsing failed" }
  }
}

// Enrich a lead via external API (if configured)
export async function enrichLead(input: Partial<LeadInput>) {
  try {
    const url = process.env.ENRICH_API_URL
    const key = process.env.ENRICH_API_KEY
    if (!url || !key) return { success: true, data: { enrichment: null } }
    const resp = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify({ lead: input }),
    })
    if (!resp.ok) return { success: true, data: { enrichment: null } }
    const data = await resp.json()
    return { success: true, data }
  } catch {
    return { success: true, data: { enrichment: null } }
  }
}

// Batch enrich and score without persisting (preview)
export async function batchEnrichAndScore(inputs: Partial<LeadInput>[]) {
  const results = [] as Array<{ enrichment: any; score: number }>
  for (const input of inputs) {
    const [enrich, score] = await Promise.all([enrichLead(input), scoreLead(input)])
    results.push({ enrichment: enrich?.data ?? null, score: (score as any)?.score ?? 0 })
  }
  return { success: true, results }
}

// Import from LinkedIn (stub): validates URL and defers to integration
export async function importFromLinkedIn(linkedInUrl: string) {
  try {
    if (!/^https:\/\/(www\.)?linkedin\.com\//i.test(linkedInUrl)) {
      return { success: false, error: "Please provide a valid LinkedIn URL" }
    }
    // Real implementation requires LinkedIn API/integration consent. Provide placeholder.
    return {
      success: false,
      error: "LinkedIn import not configured. Connect a compliant data provider or upload CSV.",
    }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Import failed" }
  }
}

// Trigger RPA/automation (logs execution)
export async function runAutomation(rule: string, payload: any) {
  try {
    const supabase = await createClient()
    await supabase.from("automation_executions").insert({
      execution_type: "rule",
      status: "pending",
      trigger_data: { rule, payload },
    })
    return { success: true }
  } catch {
    return { success: false, error: "Automation not available" }
  }
}

// Anchor a lead hash into audit logs (blockchain-ready)
export async function anchorLeadHash(leadId: string, payload: any) {
  try {
    const hash = crypto.createHash("sha256").update(JSON.stringify(payload)).digest("hex")
    const supabase = await createClient()
    await supabase.from("audit_logs").insert({
      action: "LEAD_HASH_ANCHORED",
      resource_type: "crm_lead",
      resource_id: leadId,
      metadata: { hash },
    })
    return { success: true, hash }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Anchor failed" }
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

    // AI validation (non-blocking)
    const [validation, aiScore] = await Promise.all([
      aiValidateLead(validated).catch(() => null),
      scoreLead(validated).catch(() => null),
    ])

    const initialScore = typeof (aiScore as any)?.score === "number" ? (aiScore as any).score : validated.score ?? 0

    const { data, error } = await supabase
      .from("crm_leads")
      .insert({
        ...validated,
        score: initialScore,
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
    if (error && typeof error === "object" && "errors" in (error as any)) {
      return {
        success: false,
        error: "Validation error",
        details: (error as any).errors,
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
    if (error && typeof error === "object" && "errors" in (error as any)) {
      return {
        success: false,
        error: "Validation error",
        details: (error as any).errors,
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
