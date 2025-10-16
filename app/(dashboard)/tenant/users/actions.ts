"use server"

import { createServerClient } from "@/lib/supabase/server"
import { z } from "zod"
import { rateLimit } from "@/lib/rate-limit"

// Validation schemas
const inviteSchema = z.object({
  email: z.string().email(),
  role: z.enum(["tenant_admin", "manager", "member", "viewer"]),
})

const bulkInviteSchema = z.object({
  emails: z.array(z.string().email()),
  role: z.enum(["tenant_admin", "manager", "member", "viewer"]),
})

const updateRoleSchema = z.object({
  user_id: z.string().uuid(),
  role: z.enum(["tenant_admin", "manager", "member", "viewer"]),
})

// Helper to get current tenant
async function getCurrentTenant() {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Not authenticated")
  }

  // Get tenant from cookie or primary tenant
  const { data: membership } = await supabase
    .from("tenant_members")
    .select("tenant_id, tenants(id, slug, name)")
    .eq("user_id", user.id)
    .eq("status", "active")
    .single()

  if (!membership) {
    throw new Error("No tenant membership found")
  }

  return {
    tenant_id: membership.tenant_id,
    user_id: user.id,
  }
}

// Helper to verify tenant admin
async function verifyTenantAdmin() {
  const supabase = await createServerClient()
  const { tenant_id, user_id } = await getCurrentTenant()

  const { data: member } = await supabase
    .from("tenant_members")
    .select("role")
    .eq("tenant_id", tenant_id)
    .eq("user_id", user_id)
    .single()

  if (!member || !["tenant_admin", "manager"].includes(member.role)) {
    throw new Error("Insufficient permissions")
  }

  return { tenant_id, user_id }
}

// List tenant members
export async function listTenantMembers(params: {
  q?: string
  page?: number
  per?: number
  role?: string
  status?: string
  sortBy?: string
  sortOrder?: string
}) {
  try {
    const { tenant_id } = await getCurrentTenant()
    const supabase = await createServerClient()

    const { q = "", page = 1, per = 20, role, status, sortBy = "joined_at", sortOrder = "desc" } = params

    let query = supabase
      .from("tenant_members")
      .select(
        `
        user_id,
        role,
        status,
        joined_at,
        invited_at,
        users:user_id (
          email,
          full_name
        )
      `,
        { count: "exact" },
      )
      .eq("tenant_id", tenant_id)

    // Search
    if (q) {
      query = query.or(`users.email.ilike.%${q}%,users.full_name.ilike.%${q}%`)
    }

    // Filters
    if (role) {
      query = query.eq("role", role)
    }
    if (status) {
      query = query.eq("status", status)
    }

    // Sorting
    query = query.order(sortBy, { ascending: sortOrder === "asc" })

    // Pagination
    const from = (page - 1) * per
    const to = from + per - 1
    query = query.range(from, to)

    const { data, error, count } = await query

    if (error) {
      console.error("[v0] Error listing members:", error)
      return { members: [], total: 0, error: error.message }
    }

    const members = data.map((m: any) => ({
      user_id: m.user_id,
      email: m.users?.email || "",
      full_name: m.users?.full_name || "",
      role: m.role,
      status: m.status,
      joined_at: m.joined_at,
      invited_at: m.invited_at,
    }))

    return { members, total: count || 0 }
  } catch (error: any) {
    console.error("[v0] Error in listTenantMembers:", error)
    return { members: [], total: 0, error: error.message }
  }
}

// Invite user
export async function inviteUser(input: z.infer<typeof inviteSchema>) {
  try {
    await rateLimit("invite-user", 10, 60000) // 10 per minute
    const { tenant_id, user_id } = await verifyTenantAdmin()
    const validated = inviteSchema.parse(input)
    const supabase = await createServerClient()

    // Check if user already exists
    const { data: existingUser } = await supabase.from("users").select("id").eq("email", validated.email).single()

    if (existingUser) {
      // Check if already a member
      const { data: existingMember } = await supabase
        .from("tenant_members")
        .select("*")
        .eq("tenant_id", tenant_id)
        .eq("user_id", existingUser.id)
        .single()

      if (existingMember) {
        return { error: "User is already a member" }
      }
    }

    // Create invitation
    const token = crypto.randomUUID()
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7) // 7 days

    const { error: inviteError } = await supabase.from("invitations").insert({
      tenant_id,
      email: validated.email,
      role: validated.role,
      token,
      invited_by: user_id,
      expires_at: expiresAt.toISOString(),
      status: "pending",
    })

    if (inviteError) {
      console.error("[v0] Error creating invitation:", inviteError)
      return { error: inviteError.message }
    }

    // TODO: Send invitation email

    // Audit log
    await supabase.from("audit_log").insert({
      tenant_id,
      user_id,
      action: "invite_user",
      resource: "tenant_member",
      payload: { email: validated.email, role: validated.role },
    })

    return { success: true }
  } catch (error: any) {
    console.error("[v0] Error in inviteUser:", error)
    return { error: error.message }
  }
}

// List invitations
export async function listInvitations() {
  try {
    const { tenant_id } = await getCurrentTenant()
    const supabase = await createServerClient()

    const { data, error } = await supabase
      .from("invitations")
      .select(
        `
        *,
        invited_by_user:invited_by (
          email
        )
      `,
      )
      .eq("tenant_id", tenant_id)
      .eq("status", "pending")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("[v0] Error listing invitations:", error)
      return { invitations: [], error: error.message }
    }

    const invitations = data.map((inv: any) => ({
      ...inv,
      invited_by_email: inv.invited_by_user?.email || "",
    }))

    return { invitations }
  } catch (error: any) {
    console.error("[v0] Error in listInvitations:", error)
    return { invitations: [], error: error.message }
  }
}

// Resend invite
export async function resendInvite(inviteId: string) {
  try {
    await rateLimit("resend-invite", 5, 60000) // 5 per minute
    await verifyTenantAdmin()
    const supabase = await createServerClient()

    // Update expires_at
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7)

    const { error } = await supabase
      .from("invitations")
      .update({ expires_at: expiresAt.toISOString() })
      .eq("id", inviteId)

    if (error) {
      console.error("[v0] Error resending invite:", error)
      return { error: error.message }
    }

    // TODO: Resend invitation email

    return { success: true }
  } catch (error: any) {
    console.error("[v0] Error in resendInvite:", error)
    return { error: error.message }
  }
}

// Cancel invite
export async function cancelInvite(inviteId: string) {
  try {
    await verifyTenantAdmin()
    const supabase = await createServerClient()

    const { error } = await supabase.from("invitations").update({ status: "cancelled" }).eq("id", inviteId)

    if (error) {
      console.error("[v0] Error cancelling invite:", error)
      return { error: error.message }
    }

    return { success: true }
  } catch (error: any) {
    console.error("[v0] Error in cancelInvite:", error)
    return { error: error.message }
  }
}

// Update member role
export async function updateMemberRole(input: z.infer<typeof updateRoleSchema>) {
  try {
    await rateLimit("update-role", 10, 60000) // 10 per minute
    const { tenant_id, user_id } = await verifyTenantAdmin()
    const validated = updateRoleSchema.parse(input)
    const supabase = await createServerClient()

    const { error } = await supabase
      .from("tenant_members")
      .update({ role: validated.role })
      .eq("tenant_id", tenant_id)
      .eq("user_id", validated.user_id)

    if (error) {
      console.error("[v0] Error updating role:", error)
      return { error: error.message }
    }

    // Audit log
    await supabase.from("audit_log").insert({
      tenant_id,
      user_id,
      action: "update_member_role",
      resource: "tenant_member",
      payload: { target_user_id: validated.user_id, new_role: validated.role },
    })

    return { success: true }
  } catch (error: any) {
    console.error("[v0] Error in updateMemberRole:", error)
    return { error: error.message }
  }
}

// Remove member
export async function removeMember(userId: string) {
  try {
    await rateLimit("remove-member", 5, 60000) // 5 per minute
    const { tenant_id, user_id } = await verifyTenantAdmin()
    const supabase = await createServerClient()

    // Prevent self-removal
    if (userId === user_id) {
      return { error: "Cannot remove yourself" }
    }

    const { error } = await supabase.from("tenant_members").delete().eq("tenant_id", tenant_id).eq("user_id", userId)

    if (error) {
      console.error("[v0] Error removing member:", error)
      return { error: error.message }
    }

    // Audit log
    await supabase.from("audit_log").insert({
      tenant_id,
      user_id,
      action: "remove_member",
      resource: "tenant_member",
      payload: { removed_user_id: userId },
    })

    return { success: true }
  } catch (error: any) {
    console.error("[v0] Error in removeMember:", error)
    return { error: error.message }
  }
}

// Bulk invite
export async function bulkInvite(input: z.infer<typeof bulkInviteSchema>) {
  try {
    await rateLimit("bulk-invite", 3, 60000) // 3 per minute
    const { tenant_id, user_id } = await verifyTenantAdmin()
    const validated = bulkInviteSchema.parse(input)
    const supabase = await createServerClient()

    let invited = 0
    const errors: string[] = []

    for (const email of validated.emails) {
      try {
        // Check if user already exists
        const { data: existingUser } = await supabase.from("users").select("id").eq("email", email).single()

        if (existingUser) {
          // Check if already a member
          const { data: existingMember } = await supabase
            .from("tenant_members")
            .select("*")
            .eq("tenant_id", tenant_id)
            .eq("user_id", existingUser.id)
            .single()

          if (existingMember) {
            errors.push(`${email}: Already a member`)
            continue
          }
        }

        // Create invitation
        const token = crypto.randomUUID()
        const expiresAt = new Date()
        expiresAt.setDate(expiresAt.getDate() + 7)

        const { error: inviteError } = await supabase.from("invitations").insert({
          tenant_id,
          email,
          role: validated.role,
          token,
          invited_by: user_id,
          expires_at: expiresAt.toISOString(),
          status: "pending",
        })

        if (inviteError) {
          errors.push(`${email}: ${inviteError.message}`)
        } else {
          invited++
        }
      } catch (err: any) {
        errors.push(`${email}: ${err.message}`)
      }
    }

    // Audit log
    await supabase.from("audit_log").insert({
      tenant_id,
      user_id,
      action: "bulk_invite",
      resource: "tenant_member",
      payload: { invited, errors },
    })

    return { invited, errors }
  } catch (error: any) {
    console.error("[v0] Error in bulkInvite:", error)
    return { invited: 0, errors: [error.message] }
  }
}

// Export members
export async function exportMembers(q?: string) {
  try {
    await rateLimit("export-members", 3, 60000) // 3 per minute
    const { tenant_id } = await getCurrentTenant()
    const supabase = await createServerClient()

    let query = supabase
      .from("tenant_members")
      .select(
        `
        user_id,
        role,
        status,
        joined_at,
        users:user_id (
          email,
          full_name
        )
      `,
      )
      .eq("tenant_id", tenant_id)

    if (q) {
      query = query.or(`users.email.ilike.%${q}%,users.full_name.ilike.%${q}%`)
    }

    const { data, error } = await query

    if (error) {
      throw new Error(error.message)
    }

    // Generate CSV
    const headers = ["Email", "Full Name", "Role", "Status", "Joined"]
    const rows = data.map((m: any) => [
      m.users?.email || "",
      m.users?.full_name || "",
      m.role,
      m.status,
      m.joined_at ? new Date(m.joined_at).toLocaleDateString() : "",
    ])

    const csv = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n")

    return csv
  } catch (error: any) {
    console.error("[v0] Error in exportMembers:", error)
    throw error
  }
}

// Get member details
export async function getMemberDetails(userId: string) {
  try {
    const { tenant_id } = await getCurrentTenant()
    const supabase = await createServerClient()

    // Get member info
    const { data: member } = await supabase
      .from("tenant_members")
      .select(
        `
        *,
        users:user_id (
          email,
          full_name
        )
      `,
      )
      .eq("tenant_id", tenant_id)
      .eq("user_id", userId)
      .single()

    if (!member) {
      throw new Error("Member not found")
    }

    // Get permissions (from role)
    const { data: rolePerms } = await supabase
      .from("role_permissions")
      .select(
        `
        permissions:permission_id (
          key,
          description
        )
      `,
      )
      .eq("role_id", member.role)

    // Get activity logs
    const { data: activity } = await supabase
      .from("audit_log")
      .select("*")
      .eq("tenant_id", tenant_id)
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(10)

    return {
      member,
      permissions: rolePerms?.map((rp: any) => rp.permissions) || [],
      activity: activity || [],
    }
  } catch (error: any) {
    console.error("[v0] Error in getMemberDetails:", error)
    throw error
  }
}
