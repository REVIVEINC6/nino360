import type { NextRequest } from "next/server"
import { getUserWithTenant } from "@/lib/auth-server"
import {
  successResponse,
  errorResponse,
  unauthorizedResponse,
  notFoundResponse,
  validationErrorResponse,
} from "@/lib/api-response"
import { apiRateLimiter } from "@/lib/rate-limiter"
import { createServerSupabaseClient } from "@/lib/supabase-server"
import { z } from "zod"

const updateLeadSchema = z.object({
  firstName: z.string().min(1, "First name is required").optional(),
  lastName: z.string().min(1, "Last name is required").optional(),
  email: z.string().email("Invalid email address").optional(),
  phone: z.string().optional(),
  company: z.string().optional(),
  title: z.string().optional(),
  source: z.string().optional(),
  status: z.enum(["new", "contacted", "qualified", "proposal", "negotiation", "closed_won", "closed_lost"]).optional(),
  value: z.number().min(0).optional(),
  notes: z.string().optional(),
  assignedTo: z.string().uuid().optional(),
})

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
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

    // Get lead with related data
    const { data: lead, error } = await supabase
      .from("crm_leads")
      .select(`
        *,
        assigned_user:users!crm_leads_assigned_to_fkey(first_name, last_name, email),
        activities:crm_activities(
          id,
          type,
          description,
          created_at,
          created_by_user:users!crm_activities_created_by_fkey(first_name, last_name)
        )
      `)
      .eq("id", params.id)
      .eq("tenant_id", userData.tenant_id)
      .single()

    if (error || !lead) {
      return notFoundResponse("Lead not found")
    }

    return successResponse(lead)
  } catch (error) {
    console.error("Get lead error:", error)
    return errorResponse("Internal server error", 500)
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
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
    const validationResult = updateLeadSchema.safeParse(body)
    if (!validationResult.success) {
  return validationErrorResponse(validationResult.error.issues)
    }

    const updates = validationResult.data
    const supabase = await createServerSupabaseClient()

    // Check if lead exists and belongs to tenant
    const { data: existingLead, error: fetchError } = await supabase
      .from("crm_leads")
      .select("*")
      .eq("id", params.id)
      .eq("tenant_id", userData.tenant_id)
      .single()

    if (fetchError || !existingLead) {
      return notFoundResponse("Lead not found")
    }

    // Update lead
    const { data: updatedLead, error: updateError } = await supabase
      .from("crm_leads")
      .update({
        ...(updates.firstName && { first_name: updates.firstName }),
        ...(updates.lastName && { last_name: updates.lastName }),
        ...(updates.email && { email: updates.email }),
        ...(updates.phone && { phone: updates.phone }),
        ...(updates.company && { company: updates.company }),
        ...(updates.title && { title: updates.title }),
        ...(updates.source && { source: updates.source }),
        ...(updates.status && { status: updates.status }),
        ...(updates.value !== undefined && { value: updates.value }),
        ...(updates.notes && { notes: updates.notes }),
        ...(updates.assignedTo && { assigned_to: updates.assignedTo }),
        updated_at: new Date().toISOString(),
      })
      .eq("id", params.id)
      .select(`
        *,
        assigned_user:users!crm_leads_assigned_to_fkey(first_name, last_name, email)
      `)
      .single()

    if (updateError) {
      console.error("Lead update error:", updateError)
      return errorResponse("Failed to update lead", 500)
    }

    // Log lead update
    await supabase.from("audit_logs").insert({
      tenant_id: userData.tenant_id,
      user_id: user.id,
      action: "lead_updated",
      resource_type: "lead",
      resource_id: params.id,
      details: {
        updated_fields: Object.keys(updates),
        previous_status: existingLead.status,
        new_status: updates.status,
        ip_address: request.ip,
      },
    })

    // Create activity for status change
    if (updates.status && updates.status !== existingLead.status) {
      await supabase.from("crm_activities").insert({
        tenant_id: userData.tenant_id,
        lead_id: params.id,
        type: "status_changed",
        description: `Status changed from ${existingLead.status} to ${updates.status}`,
        created_by: user.id,
      })
    }

    return successResponse(updatedLead, "Lead updated successfully")
  } catch (error) {
    console.error("Update lead error:", error)
    return errorResponse("Internal server error", 500)
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
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
    const supabase = await createServerSupabaseClient()

    // Check if lead exists and belongs to tenant
    const { data: existingLead, error: fetchError } = await supabase
      .from("crm_leads")
      .select("*")
      .eq("id", params.id)
      .eq("tenant_id", userData.tenant_id)
      .single()

    if (fetchError || !existingLead) {
      return notFoundResponse("Lead not found")
    }

    // Soft delete (update status to deleted)
    const { error: deleteError } = await supabase
      .from("crm_leads")
      .update({
        status: "deleted",
        deleted_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", params.id)

    if (deleteError) {
      console.error("Lead deletion error:", deleteError)
      return errorResponse("Failed to delete lead", 500)
    }

    // Log lead deletion
    await supabase.from("audit_logs").insert({
      tenant_id: userData.tenant_id,
      user_id: user.id,
      action: "lead_deleted",
      resource_type: "lead",
      resource_id: params.id,
      details: {
        lead_name: `${existingLead.first_name} ${existingLead.last_name}`,
        company: existingLead.company,
        ip_address: request.ip,
      },
    })

    return successResponse(null, "Lead deleted successfully")
  } catch (error) {
    console.error("Delete lead error:", error)
    return errorResponse("Internal server error", 500)
  }
}
