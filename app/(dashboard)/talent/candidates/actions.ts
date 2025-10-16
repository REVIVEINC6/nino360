"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"
import { createClient } from "@/lib/supabase/server"

// Validation schemas
const candidateSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().optional(),
  location: z.string().optional(),
  current_title: z.string().optional(),
  current_company: z.string().optional(),
  linkedin_url: z.string().url().optional().or(z.literal("")),
  resume_url: z.string().optional(),
  skills: z.array(z.string()).optional(),
  experience_years: z.number().optional(),
  education: z.string().optional(),
  source: z.string().optional(),
  status: z.enum(["New", "Screening", "Interviewing", "Offered", "Hired", "Rejected", "Withdrawn"]).default("New"),
  rating: z.number().min(1).max(5).optional(),
  notes: z.string().optional(),
})

const candidateUpdateSchema = candidateSchema.partial().extend({
  id: z.string().uuid(),
})

// List candidates with filtering and pagination
export async function listCandidates(params?: {
  page?: number
  limit?: number
  status?: string
  source?: string
  search?: string
  skills?: string[]
  sortBy?: string
  sortOrder?: "asc" | "desc"
}) {
  try {
    const supabase = await createClient()
    const {
      page = 1,
      limit = 20,
      status,
      source,
      search,
      skills,
      sortBy = "created_at",
      sortOrder = "desc",
    } = params || {}

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error("Unauthorized")

    const { data: profile } = await supabase.from("profiles").select("tenant_id").eq("id", user.id).single()

    if (!profile?.tenant_id) throw new Error("Tenant not found")

    let query = supabase
      .from("candidates")
      .select("*, applications:applications(count)", { count: "exact" })
      .eq("tenant_id", profile.tenant_id)

    if (status) query = query.eq("status", status)
    if (source) query = query.eq("source", source)
    if (search) {
      query = query.or(
        `first_name.ilike.%${search}%,last_name.ilike.%${search}%,email.ilike.%${search}%,current_title.ilike.%${search}%`,
      )
    }
    if (skills?.length) {
      query = query.contains("skills", skills)
    }

    query = query.order(sortBy, { ascending: sortOrder === "asc" })

    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to)

    const { data, error, count } = await query

    if (error) throw error

    return {
      success: true,
      data,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    }
  } catch (error) {
    console.error("[v0] Error listing candidates:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to list candidates",
    }
  }
}

// Get single candidate
export async function getCandidate(id: string) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error("Unauthorized")

    const { data: profile } = await supabase.from("profiles").select("tenant_id").eq("id", user.id).single()

    if (!profile?.tenant_id) throw new Error("Tenant not found")

    const { data, error } = await supabase
      .from("candidates")
      .select(`
        *,
        applications:applications(
          id,
          job_id,
          stage,
          status,
          applied_at,
          job:job_requisitions(title, department)
        )
      `)
      .eq("id", id)
      .eq("tenant_id", profile.tenant_id)
      .single()

    if (error) throw error

    return { success: true, data }
  } catch (error) {
    console.error("[v0] Error getting candidate:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get candidate",
    }
  }
}

// Create candidate
export async function createCandidate(input: z.infer<typeof candidateSchema>) {
  try {
    const validated = candidateSchema.parse(input)
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error("Unauthorized")

    const { data: profile } = await supabase.from("profiles").select("tenant_id").eq("id", user.id).single()

    if (!profile?.tenant_id) throw new Error("Tenant not found")

    // Check for duplicate email
    const { data: existing } = await supabase
      .from("candidates")
      .select("id")
      .eq("tenant_id", profile.tenant_id)
      .eq("email", validated.email)
      .single()

    if (existing) {
      return { success: false, error: "Candidate with this email already exists" }
    }

    const { data, error } = await supabase
      .from("candidates")
      .insert({
        ...validated,
        tenant_id: profile.tenant_id,
        created_by: user.id,
      })
      .select()
      .single()

    if (error) throw error

    revalidatePath("/talent/candidates")
    return { success: true, data }
  } catch (error) {
    console.error("[v0] Error creating candidate:", error)
    if (error instanceof z.ZodError) {
      return { success: false, error: "Validation failed", details: error.errors }
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create candidate",
    }
  }
}

// Update candidate
export async function updateCandidate(input: z.infer<typeof candidateUpdateSchema>) {
  try {
    const validated = candidateUpdateSchema.parse(input)
    const { id, ...updates } = validated
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error("Unauthorized")

    const { data: profile } = await supabase.from("profiles").select("tenant_id").eq("id", user.id).single()

    if (!profile?.tenant_id) throw new Error("Tenant not found")

    const { data, error } = await supabase
      .from("candidates")
      .update(updates)
      .eq("id", id)
      .eq("tenant_id", profile.tenant_id)
      .select()
      .single()

    if (error) throw error

    revalidatePath("/talent/candidates")
    revalidatePath(`/talent/candidates/${id}`)
    return { success: true, data }
  } catch (error) {
    console.error("[v0] Error updating candidate:", error)
    if (error instanceof z.ZodError) {
      return { success: false, error: "Validation failed", details: error.errors }
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update candidate",
    }
  }
}

// Delete candidate
export async function deleteCandidate(id: string) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error("Unauthorized")

    const { data: profile } = await supabase.from("profiles").select("tenant_id").eq("id", user.id).single()

    if (!profile?.tenant_id) throw new Error("Tenant not found")

    const { error } = await supabase.from("candidates").delete().eq("id", id).eq("tenant_id", profile.tenant_id)

    if (error) throw error

    revalidatePath("/talent/candidates")
    return { success: true }
  } catch (error) {
    console.error("[v0] Error deleting candidate:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete candidate",
    }
  }
}

// Bulk operations
export async function bulkUpdateCandidates(ids: string[], updates: Partial<z.infer<typeof candidateSchema>>) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error("Unauthorized")

    const { data: profile } = await supabase.from("profiles").select("tenant_id").eq("id", user.id).single()

    if (!profile?.tenant_id) throw new Error("Tenant not found")

    const { data, error } = await supabase
      .from("candidates")
      .update(updates)
      .in("id", ids)
      .eq("tenant_id", profile.tenant_id)
      .select()

    if (error) throw error

    revalidatePath("/talent/candidates")
    return { success: true, data, count: data.length }
  } catch (error) {
    console.error("[v0] Error bulk updating candidates:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to bulk update candidates",
    }
  }
}

// Search candidates with full-text search
export async function searchCandidates(
  query: string,
  filters?: {
    status?: string[]
    skills?: string[]
    experience_min?: number
    experience_max?: number
  },
) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error("Unauthorized")

    const { data: profile } = await supabase.from("profiles").select("tenant_id").eq("id", user.id).single()

    if (!profile?.tenant_id) throw new Error("Tenant not found")

    let dbQuery = supabase
      .from("candidates")
      .select("*")
      .eq("tenant_id", profile.tenant_id)
      .or(
        `first_name.ilike.%${query}%,last_name.ilike.%${query}%,email.ilike.%${query}%,current_title.ilike.%${query}%,skills.cs.{${query}}`,
      )

    if (filters?.status?.length) {
      dbQuery = dbQuery.in("status", filters.status)
    }
    if (filters?.skills?.length) {
      dbQuery = dbQuery.contains("skills", filters.skills)
    }
    if (filters?.experience_min !== undefined) {
      dbQuery = dbQuery.gte("experience_years", filters.experience_min)
    }
    if (filters?.experience_max !== undefined) {
      dbQuery = dbQuery.lte("experience_years", filters.experience_max)
    }

    const { data, error } = await dbQuery.limit(50)

    if (error) throw error

    return { success: true, data }
  } catch (error) {
    console.error("[v0] Error searching candidates:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to search candidates",
    }
  }
}
