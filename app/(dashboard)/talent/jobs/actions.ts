"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"
import { createClient } from "@/lib/supabase/server"

// Validation schemas
const jobSchema = z.object({
  title: z.string().min(1, "Title is required"),
  department: z.string().min(1, "Department is required"),
  location: z.string().min(1, "Location is required"),
  employment_type: z.enum(["Full-time", "Part-time", "Contract", "Temporary"]),
  experience_level: z.enum(["Entry", "Mid", "Senior", "Lead", "Executive"]),
  description: z.string().min(1, "Description is required"),
  requirements: z.string().optional(),
  responsibilities: z.string().optional(),
  salary_min: z.number().optional(),
  salary_max: z.number().optional(),
  status: z.enum(["Draft", "Open", "On Hold", "Closed", "Cancelled"]).default("Draft"),
  hiring_manager_id: z.string().uuid().optional(),
  recruiter_id: z.string().uuid().optional(),
  positions: z.number().int().positive().default(1),
  priority: z.enum(["Low", "Medium", "High", "Urgent"]).default("Medium"),
})

const jobUpdateSchema = jobSchema.partial().extend({
  id: z.string().uuid(),
})

// List jobs with filtering and pagination
export async function listJobs(params?: {
  page?: number
  limit?: number
  status?: string
  department?: string
  search?: string
  sortBy?: string
  sortOrder?: "asc" | "desc"
}) {
  try {
    const supabase = await createClient()
    const { page = 1, limit = 20, status, department, search, sortBy = "created_at", sortOrder = "desc" } = params || {}

    // Get current user and tenant
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error("Unauthorized")

    const { data: profile } = await supabase.from("profiles").select("tenant_id").eq("id", user.id).single()

    if (!profile?.tenant_id) throw new Error("Tenant not found")

    // Build query
    let query = supabase
      .from("job_requisitions")
      .select("*, hiring_manager:profiles!hiring_manager_id(full_name), recruiter:profiles!recruiter_id(full_name)", {
        count: "exact",
      })
      .eq("tenant_id", profile.tenant_id)

    // Apply filters
    if (status) query = query.eq("status", status)
    if (department) query = query.eq("department", department)
    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%,location.ilike.%${search}%`)
    }

    // Apply sorting
    query = query.order(sortBy, { ascending: sortOrder === "asc" })

    // Apply pagination
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
    console.error("[v0] Error listing jobs:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to list jobs",
    }
  }
}

// Get single job
export async function getJob(id: string) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error("Unauthorized")

    const { data: profile } = await supabase.from("profiles").select("tenant_id").eq("id", user.id).single()

    if (!profile?.tenant_id) throw new Error("Tenant not found")

    const { data, error } = await supabase
      .from("job_requisitions")
      .select(`
        *,
        hiring_manager:profiles!hiring_manager_id(id, full_name, email),
        recruiter:profiles!recruiter_id(id, full_name, email),
        applications:applications(count)
      `)
      .eq("id", id)
      .eq("tenant_id", profile.tenant_id)
      .single()

    if (error) throw error

    return { success: true, data }
  } catch (error) {
    console.error("[v0] Error getting job:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get job",
    }
  }
}

// Create job
export async function createJob(input: z.infer<typeof jobSchema>) {
  try {
    const validated = jobSchema.parse(input)
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error("Unauthorized")

    const { data: profile } = await supabase.from("profiles").select("tenant_id").eq("id", user.id).single()

    if (!profile?.tenant_id) throw new Error("Tenant not found")

    const { data, error } = await supabase
      .from("job_requisitions")
      .insert({
        ...validated,
        tenant_id: profile.tenant_id,
        created_by: user.id,
      })
      .select()
      .single()

    if (error) throw error

    revalidatePath("/talent/jobs")
    return { success: true, data }
  } catch (error) {
    console.error("[v0] Error creating job:", error)
    if (error instanceof z.ZodError) {
      return { success: false, error: "Validation failed", details: error.errors }
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create job",
    }
  }
}

// Update job
export async function updateJob(input: z.infer<typeof jobUpdateSchema>) {
  try {
    const validated = jobUpdateSchema.parse(input)
    const { id, ...updates } = validated
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error("Unauthorized")

    const { data: profile } = await supabase.from("profiles").select("tenant_id").eq("id", user.id).single()

    if (!profile?.tenant_id) throw new Error("Tenant not found")

    const { data, error } = await supabase
      .from("job_requisitions")
      .update(updates)
      .eq("id", id)
      .eq("tenant_id", profile.tenant_id)
      .select()
      .single()

    if (error) throw error

    revalidatePath("/talent/jobs")
    revalidatePath(`/talent/jobs/${id}`)
    return { success: true, data }
  } catch (error) {
    console.error("[v0] Error updating job:", error)
    if (error instanceof z.ZodError) {
      return { success: false, error: "Validation failed", details: error.errors }
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update job",
    }
  }
}

// Delete job
export async function deleteJob(id: string) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error("Unauthorized")

    const { data: profile } = await supabase.from("profiles").select("tenant_id").eq("id", user.id).single()

    if (!profile?.tenant_id) throw new Error("Tenant not found")

    const { error } = await supabase.from("job_requisitions").delete().eq("id", id).eq("tenant_id", profile.tenant_id)

    if (error) throw error

    revalidatePath("/talent/jobs")
    return { success: true }
  } catch (error) {
    console.error("[v0] Error deleting job:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete job",
    }
  }
}

// Bulk operations
export async function bulkUpdateJobs(ids: string[], updates: Partial<z.infer<typeof jobSchema>>) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error("Unauthorized")

    const { data: profile } = await supabase.from("profiles").select("tenant_id").eq("id", user.id).single()

    if (!profile?.tenant_id) throw new Error("Tenant not found")

    const { data, error } = await supabase
      .from("job_requisitions")
      .update(updates)
      .in("id", ids)
      .eq("tenant_id", profile.tenant_id)
      .select()

    if (error) throw error

    revalidatePath("/talent/jobs")
    return { success: true, data, count: data.length }
  } catch (error) {
    console.error("[v0] Error bulk updating jobs:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to bulk update jobs",
    }
  }
}

export async function bulkDeleteJobs(ids: string[]) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error("Unauthorized")

    const { data: profile } = await supabase.from("profiles").select("tenant_id").eq("id", user.id).single()

    if (!profile?.tenant_id) throw new Error("Tenant not found")

    const { error } = await supabase.from("job_requisitions").delete().in("id", ids).eq("tenant_id", profile.tenant_id)

    if (error) throw error

    revalidatePath("/talent/jobs")
    return { success: true, count: ids.length }
  } catch (error) {
    console.error("[v0] Error bulk deleting jobs:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to bulk delete jobs",
    }
  }
}

// Search jobs with full-text search
export async function searchJobs(
  query: string,
  filters?: {
    status?: string[]
    department?: string[]
    location?: string[]
    employment_type?: string[]
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
      .from("job_requisitions")
      .select("*")
      .eq("tenant_id", profile.tenant_id)
      .or(`title.ilike.%${query}%,description.ilike.%${query}%,requirements.ilike.%${query}%,location.ilike.%${query}%`)

    // Apply filters
    if (filters?.status?.length) {
      dbQuery = dbQuery.in("status", filters.status)
    }
    if (filters?.department?.length) {
      dbQuery = dbQuery.in("department", filters.department)
    }
    if (filters?.location?.length) {
      dbQuery = dbQuery.in("location", filters.location)
    }
    if (filters?.employment_type?.length) {
      dbQuery = dbQuery.in("employment_type", filters.employment_type)
    }

    const { data, error } = await dbQuery.limit(50)

    if (error) throw error

    return { success: true, data }
  } catch (error) {
    console.error("[v0] Error searching jobs:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to search jobs",
    }
  }
}
