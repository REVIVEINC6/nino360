import type { NextRequest } from "next/server"
import { getUserWithTenant } from "@/lib/auth-server"
import { successResponse, errorResponse, unauthorizedResponse, validationErrorResponse } from "@/lib/api-response"
import { apiRateLimiter } from "@/lib/rate-limiter"
import { createServerSupabaseClient } from "@/lib/supabase-server"
import { z } from "zod"

const createLeadSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  company: z.string().optional(),
  title: z.string().optional(),
  source: z.string().optional(),
  status: z
    .enum(["new", "contacted", "qualified", "proposal", "negotiation", "closed_won", "closed_lost"])
    .default("new"),
  value: z.number().min(0).optional(),
  notes: z.string().optional(),
})

export async function GET(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimitResult = await apiRateLimiter.checkLimit(request)
    if (!rateLimitResult.allowed) {
      return errorResponse("Rate limit exceeded", 429)
    }

    const userContext = await getUserWithTenant()
    if (!userContext) {
      return unauthorizedResponse()
    }

    const { userData } = userContext
    const supabase = await createServerSupabaseClient()
    const { searchParams } = new URL(request.url)

    // Pagination
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Math.min(Number.parseInt(searchParams.get("limit") || "20"), 100)
    const offset = (page - 1) * limit

    // Filters
    const status = searchParams.get("status")
    const source = searchParams.get("source")
    const search = searchParams.get("search")
    const assignedTo = searchParams.get("assigned_to")

    let query = supabase
      .from("crm_leads")
      .select(`
        *,
        assigned_user:users!crm_leads_assigned_to_fkey(first_name, last_name, email),
        activities:crm_activities(id, type, created_at)
      `)
      .eq("tenant_id", userData.tenant_id)

    // Apply filters
    if (status) {
      query = query.eq("status", status)
    }
    if (source) {
      query = query.eq("source", source)
    }
    if (assignedTo) {
      query = query.eq("assigned_to", assignedTo)
    }
    if (search) {
      query = query.or(
        `first_name.ilike.%${search}%,last_name.ilike.%${search}%,email.ilike.%${search}%,company.ilike.%${search}%`,
      )
    }

    // Get total count
    const { count } = await query.select("*", { count: "exact", head: true })

    // Get paginated results
    const { data: leads, error } = await query
      .range(offset, offset + limit - 1)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Leads fetch error:", error)
      return errorResponse("Failed to fetch leads", 500)
    }

    return successResponse({
      leads,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    })
  } catch (error) {
    console.error("Get leads error:", error)
    return errorResponse("Internal server error", 500)
  }
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimitResult = await apiRateLimiter.checkLimit(request)
    if (!rateLimitResult.allowed) {
      return errorResponse("Rate limit exceeded", 429)
    }

    const userContext = await getUserWithTenant()
    if (!userContext) {
      return unauthorizedResponse()
    }

    const { user, userData } = userContext
    const body = await request.json()

    // Validation
    const validationResult = createLeadSchema.safeParse(body)
    if (!validationResult.success) {
      return validationErrorResponse(validationResult.error.errors)
    }

    const leadData = validationResult.data
    const supabase = await createServerSupabaseClient()

    // Create lead
    const { data: newLead, error: createError } = await supabase
      .from("crm_leads")
      .insert({
        ...leadData,
        first_name: leadData.firstName,
        last_name: leadData.lastName,
        tenant_id: userData.tenant_id,
        created_by: user.id,
        assigned_to: user.id, // Assign to creator by default
      })
      .select(`
        *,
        assigned_user:users!crm_leads_assigned_to_fkey(first_name, last_name, email)
      `)
      .single()

    if (createError) {
      console.error("Lead creation error:", createError)
      return errorResponse("Failed to create lead", 500)
    }

    // Log lead creation
    await supabase.from("audit_logs").insert({
      tenant_id: userData.tenant_id,
      user_id: user.id,
      action: "lead_created",
      resource_type: "lead",
      resource_id: newLead.id,
      details: {
        lead_name: `${leadData.firstName} ${leadData.lastName}`,
        company: leadData.company,
        ip_address: request.ip,
      },
    })

    // Create initial activity
    await supabase.from("crm_activities").insert({
      tenant_id: userData.tenant_id,
      lead_id: newLead.id,
      type: "lead_created",
      description: `Lead created by ${userData.first_name} ${userData.last_name}`,
      created_by: user.id,
    })

    return successResponse(newLead, "Lead created successfully", 201)
  } catch (error) {
    console.error("Create lead error:", error)
    return errorResponse("Internal server error", 500)
  }
}
