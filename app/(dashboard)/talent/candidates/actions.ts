"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"
import { createClient } from "@/lib/supabase/server"

// Validation schemas
const candidateSchema = z.object({
  candidate_id: z.string().optional(), // OOC-1042 format
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().optional(),
  mobile: z.string().optional(),
  candidate_status: z.string().default("Available"), // Available, Placed, etc.
  owner: z.string().optional(),
  job_title: z.string().optional(),
  work_authorization: z.string().optional(), // H1-B, Green Card, Citizen, etc.
  years_of_experience: z.union([z.string(), z.number()]).optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  address: z.string().optional(),
  zip_code: z.string().optional(),
  skills: z.union([z.array(z.string()), z.string()]).optional(), // Can be array or comma-separated string
  linkedin_url: z.string().url().optional().or(z.literal("")),
  willing_to_relocate: z.union([z.boolean(), z.string()]).optional(),
  inactive_start_date: z.string().optional(),
  inactive_end_date: z.string().optional(),
  expected_rate: z.union([z.string(), z.number()]).optional(),

  // Legacy fields for backward compatibility
  location: z.string().optional(),
  current_title: z.string().optional(),
  current_company: z.string().optional(),
  resume_url: z.string().optional(),
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
  candidate_status?: string
  source?: string
  search?: string
  skills?: string[]
  work_authorization?: string
  state?: string
  experience_min?: number
  experience_max?: number
  sortBy?: string
  sortOrder?: "asc" | "desc"
}) {
  try {
    const supabase = await createClient()
    const {
      page = 1,
      limit = 20,
      status,
      candidate_status,
      source,
      search,
      skills,
      work_authorization,
      state,
      experience_min,
      experience_max,
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
    if (candidate_status) query = query.eq("candidate_status", candidate_status)
    if (source) query = query.eq("source", source)
    if (work_authorization) query = query.eq("work_authorization", work_authorization)
    if (state) query = query.eq("state", state)

    if (search) {
      query = query.or(
        `first_name.ilike.%${search}%,last_name.ilike.%${search}%,email.ilike.%${search}%,job_title.ilike.%${search}%,current_title.ilike.%${search}%,candidate_id.ilike.%${search}%`,
      )
    }

    if (skills?.length) {
      query = query.contains("skills", skills)
    }

    if (experience_min !== undefined) {
      query = query.gte("years_of_experience", experience_min)
    }
    if (experience_max !== undefined) {
      query = query.lte("years_of_experience", experience_max)
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
        `first_name.ilike.%${query}%,last_name.ilike.%${query}%,email.ilike.%${query}%,job_title.ilike.%${query}%,skills.cs.{${query}}`,
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

// Import candidates from CSV
export async function importCandidatesFromCsv(csvUrl: string) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error("Unauthorized")

    const { data: profile } = await supabase.from("profiles").select("tenant_id").eq("id", user.id).single()
    if (!profile?.tenant_id) throw new Error("Tenant not found")

    // Fetch CSV data
    const response = await fetch(csvUrl)
    const csvText = await response.text()

    // Parse CSV (simple implementation - in production use a proper CSV parser)
    const lines = csvText.split("\n")
    const headers = lines[0].split(",").map((h) => h.trim().replace(/"/g, ""))

    const candidates = []
    const errors = []

    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue

      const values = lines[i].split(",").map((v) => v.trim().replace(/"/g, ""))
      const candidate: any = {}

      headers.forEach((header, index) => {
        const value = values[index]

        // Map CSV headers to database fields
        switch (header) {
          case "Candidate ID":
            candidate.candidate_id = value
            break
          case "First Name":
            candidate.first_name = value
            break
          case "Last Name":
            candidate.last_name = value
            break
          case "Email":
            candidate.email = value
            break
          case "Phone":
            candidate.phone = value
            break
          case "Mobile":
            candidate.mobile = value
            break
          case "Candidate Status":
            candidate.candidate_status = value
            break
          case "Owner":
            candidate.owner = value
            break
          case "Job Title":
            candidate.job_title = value
            candidate.current_title = value // Also set legacy field
            break
          case "Work Authorization":
            candidate.work_authorization = value
            break
          case "Years of Experience":
            candidate.years_of_experience = value ? Number.parseInt(value) : null
            candidate.experience_years = value ? Number.parseInt(value) : null
            break
          case "City":
            candidate.city = value
            break
          case "State":
            candidate.state = value
            break
          case "Address":
            candidate.address = value
            break
          case "Zip Code":
            candidate.zip_code = value
            break
          case "Skills":
            // Parse comma-separated skills
            candidate.skills = value ? value.split(",").map((s) => s.trim()) : []
            break
          case "LinkedIn Url":
            candidate.linkedin_url = value
            break
          case "Willing to relocate":
            candidate.willing_to_relocate = value?.toLowerCase() === "yes"
            break
          case "Expected Rate":
            candidate.expected_rate = value
            break
        }
      })

      // Set location from city/state
      if (candidate.city && candidate.state) {
        candidate.location = `${candidate.city}, ${candidate.state}`
      }

      // Add tenant and user info
      candidate.tenant_id = profile.tenant_id
      candidate.created_by = user.id
      candidate.status = "New"

      candidates.push(candidate)
    }

    // Bulk insert
    const { data, error } = await supabase.from("candidates").insert(candidates).select()

    if (error) throw error

    revalidatePath("/talent/candidates")
    return {
      success: true,
      data,
      imported: data?.length || 0,
      errors: errors.length > 0 ? errors : undefined,
    }
  } catch (error) {
    console.error("[v0] Error importing candidates:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to import candidates",
    }
  }
}
