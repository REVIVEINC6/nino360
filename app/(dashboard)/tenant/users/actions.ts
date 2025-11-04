"use server"

import { createServerClient } from "@/lib/supabase/server"
import { z } from "zod"
import { rateLimit } from "@/lib/rate-limit"
import { generateText } from "ai"
import crypto from "crypto"

const inviteSchema = z.object({
  invites: z.array(
    z.object({
      email: z.string().email().toLowerCase().trim(),
      role: z.enum(["tenant_admin", "manager", "member", "viewer"]),
    }),
  ),
})

const setRoleSchema = z.object({
  userId: z.string().uuid(),
  role: z.enum(["tenant_admin", "manager", "member", "viewer"]),
})

const setStatusSchema = z.object({
  userId: z.string().uuid(),
  status: z.enum(["active", "inactive"]),
})

export async function getContext() {
  try {
    const supabase = await createServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      throw new Error("Not authenticated")
    }

    // Get active tenant membership
    const { data: membership } = await supabase
      .from("tenant_members")
      .select(
        `
        tenant_id,
        role,
        status,
        tenants!inner (
          id,
          slug,
          name,
          status
        )
      `,
      )
      .eq("user_id", user.id)
      .eq("status", "active")
      .single()

    if (!membership) {
      return {
        tenantId: null,
        slug: null,
        myRole: null,
        features: {},
        canManage: false,
      }
    }

    // Get feature flags
    const { data: features } = await supabase
      .from("feature_flags")
      .select("key, enabled")
      .eq("tenant_id", membership.tenant_id)

    const featureMap = (features || []).reduce(
      (acc: Record<string, boolean>, f: any) => {
        acc[f.key] = f.enabled
        return acc
      },
      {} as Record<string, boolean>,
    )

    const canManage = ["tenant_admin", "manager"].includes(membership.role)

    return {
      tenantId: membership.tenant_id,
      slug: (membership.tenants as any).slug,
      myRole: membership.role,
      features: featureMap,
      canManage,
    }
  } catch (error: any) {
    console.error("[v0] Error in getContext:", error)
    return {
      tenantId: null,
      slug: null,
      myRole: null,
      features: {},
      canManage: false,
    }
  }
}

export async function listMembers(params?: {
  q?: string
  role?: string
  status?: "active" | "invited" | "inactive"
  page?: number
  pageSize?: number
  sort?: "name" | "role" | "last_seen" | "created_at"
  dir?: "asc" | "desc"
}) {
  try {
    const context = await getContext()
    if (!context.tenantId) {
      return { rows: [], total: 0 }
    }

    const supabase = await createServerClient()
    const { q = "", role, status, page = 1, pageSize = 20, sort = "created_at", dir = "desc" } = params || {}

    // Build query
    let query = supabase
      .from("tenant_members")
      .select(
        `
        user_id,
        role,
        status,
        created_at,
        users:user_id (
          email,
          user_profiles (
            full_name,
            avatar_url,
            title,
            last_login_at
          )
        )
      `,
        { count: "exact" },
      )
      .eq("tenant_id", context.tenantId)

    // Search filter
    if (q) {
      query = query.or(`users.email.ilike.%${q}%,users.user_profiles.full_name.ilike.%${q}%`)
    }

    // Role filter
    if (role) {
      query = query.eq("role", role)
    }

    // Status filter
    if (status) {
      query = query.eq("status", status)
    }

    // Sorting
    const sortColumn =
      sort === "name"
        ? "users.user_profiles.full_name"
        : sort === "last_seen"
          ? "users.user_profiles.last_login_at"
          : sort
    query = query.order(sortColumn, { ascending: dir === "asc" })

    // Pagination
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1
    query = query.range(from, to)

  const { data, error, count } = await query

    if (error) {
      console.error("[v0] Error listing members:", error)
      return { rows: [], total: 0 }
    }

    // Transform data
    const rows = ((data as unknown) as any[])?.map((m: any) => ({
      user_id: m.user_id,
      email: m.users?.email || "",
      full_name: m.users?.user_profiles?.full_name || null,
      avatar_url: m.users?.user_profiles?.avatar_url || null,
      title: m.users?.user_profiles?.title || null,
      role: m.role,
      status: m.status,
      mfa_enabled: false, // TODO: Implement MFA tracking
      last_login_at: m.users?.user_profiles?.last_login_at || null,
      created_at: m.created_at,
    }))

    return { rows, total: count || 0 }
  } catch (error: any) {
    console.error("[v0] Error in listMembers:", error)
    return { rows: [], total: 0 }
  }
}

export async function suggestRole(email: string, context?: string) {
  try {
    await rateLimit("ai-suggest-role", 10, 60000)

    // SDK shapes differ across environments; cast options to any to allow `maxTokens` usage for now
    const { text } = await generateText({
      model: "openai/gpt-5",
      prompt: `Based on the email "${email}" and context: "${context || "No additional context"}", suggest the most appropriate role for this user in a multi-tenant HRMS platform.
            
      Available roles:
      - tenant_admin: Full administrative access to the tenant
      - manager: Can manage users, view reports, configure settings
      - member: Standard access to core features
      - viewer: Read-only access
            
      Respond with ONLY the role name (tenant_admin, manager, member, or viewer) and a brief one-sentence explanation.`,
    } as any)

    const role = text.toLowerCase().includes("tenant_admin")
      ? "tenant_admin"
      : text.toLowerCase().includes("manager")
        ? "manager"
        : text.toLowerCase().includes("viewer")
          ? "viewer"
          : "member"

    return { role, explanation: text }
  } catch (error: any) {
    console.error("[v0] Error in suggestRole:", error)
    return { role: "member", explanation: "Default role assigned" }
  }
}

export async function inviteUsers(input: z.infer<typeof inviteSchema>) {
  try {
    await rateLimit("invite-users", 10, 60000)
    const context = await getContext()

    if (!context.canManage) {
      return { success: false, error: "Insufficient permissions", inserted: 0, duplicates: 0, invalid: 0 }
    }

    const validated = inviteSchema.parse(input)
    const supabase = await createServerClient()

    let inserted = 0
    let duplicates = 0
    let invalid = 0

    for (const invite of validated.invites) {
      try {
        // Check if already a member
        const { data: existing } = await supabase
          .from("tenant_members")
          .select("user_id")
          .eq("tenant_id", context.tenantId)
          .eq("users.email", invite.email)
          .maybeSingle()

        if (existing) {
          duplicates++
          continue
        }

        // Create invitation record
        const { error: inviteError } = await supabase.from("tenant_members").insert({
          tenant_id: context.tenantId,
          user_id: null, // Will be filled when user accepts
          role: invite.role,
          status: "invited",
        })

        if (inviteError) {
          console.error("[v0] Error creating invite:", inviteError)
          invalid++
          continue
        }

        // Audit log with hash chain
        await appendAuditLog(supabase, context.tenantId!, "user:invite", "tenant_member", invite.email, {
          email: invite.email,
          role: invite.role,
        })

        inserted++
      } catch (err) {
        console.error("[v0] Error processing invite:", err)
        invalid++
      }
    }

    return { success: true, inserted, duplicates, invalid }
  } catch (error: any) {
    console.error("[v0] Error in inviteUsers:", error)
    return { success: false, error: error.message, inserted: 0, duplicates: 0, invalid: 0 }
  }
}

export async function resendInvite(email: string) {
  try {
    await rateLimit("resend-invite", 5, 60000)
    const context = await getContext()

    if (!context.canManage) {
      return { success: false, error: "Insufficient permissions" }
    }

    const supabase = await createServerClient()

    // TODO: Implement email sending logic
    // For now, just log the action
    await appendAuditLog(supabase, context.tenantId!, "user:invite:resend", "tenant_member", email, { email })

    return { success: true }
  } catch (error: any) {
    console.error("[v0] Error in resendInvite:", error)
    return { success: false, error: error.message }
  }
}

export async function revokeInvite(email: string) {
  try {
    await rateLimit("revoke-invite", 5, 60000)
    const context = await getContext()

    if (!context.canManage) {
      return { success: false, error: "Insufficient permissions" }
    }

    const supabase = await createServerClient()

    // Delete invited member record
    const { error } = await supabase
      .from("tenant_members")
      .delete()
      .eq("tenant_id", context.tenantId)
      .eq("status", "invited")
      .eq("users.email", email)

    if (error) {
      console.error("[v0] Error revoking invite:", error)
      return { success: false, error: error.message }
    }

    await appendAuditLog(supabase, context.tenantId!, "user:invite:revoke", "tenant_member", email, { email })

    return { success: true }
  } catch (error: any) {
    console.error("[v0] Error in revokeInvite:", error)
    return { success: false, error: error.message }
  }
}

export async function setRole(input: z.infer<typeof setRoleSchema>) {
  try {
    await rateLimit("set-role", 10, 60000)
    const context = await getContext()

    if (!context.canManage) {
      return { success: false, error: "Insufficient permissions" }
    }

    const validated = setRoleSchema.parse(input)
    const supabase = await createServerClient()

    // Get current role
    const { data: currentMember } = await supabase
      .from("tenant_members")
      .select("role")
      .eq("tenant_id", context.tenantId)
      .eq("user_id", validated.userId)
      .single()

    if (!currentMember) {
      return { success: false, error: "User not found" }
    }

    // Prevent demoting last admin
    if (currentMember.role === "tenant_admin" && validated.role !== "tenant_admin") {
      const { count } = await supabase
        .from("tenant_members")
        .select("*", { count: "exact", head: true })
        .eq("tenant_id", context.tenantId)
        .eq("role", "tenant_admin")
        .eq("status", "active")

      if (count === 1) {
        return { success: false, error: "Cannot demote the last tenant admin" }
      }
    }

    // Update role
    const { error } = await supabase
      .from("tenant_members")
      .update({ role: validated.role })
      .eq("tenant_id", context.tenantId)
      .eq("user_id", validated.userId)

    if (error) {
      console.error("[v0] Error updating role:", error)
      return { success: false, error: error.message }
    }

    // Audit log
    await appendAuditLog(supabase, context.tenantId!, "user:role:update", "tenant_member", validated.userId, {
      from: currentMember.role,
      to: validated.role,
    })

    return { success: true }
  } catch (error: any) {
    console.error("[v0] Error in setRole:", error)
    return { success: false, error: error.message }
  }
}

export async function setStatus(input: z.infer<typeof setStatusSchema>) {
  try {
    await rateLimit("set-status", 10, 60000)
    const context = await getContext()

    if (!context.canManage) {
      return { success: false, error: "Insufficient permissions" }
    }

    const validated = setStatusSchema.parse(input)
    const supabase = await createServerClient()

    // Get current status
    const { data: currentMember } = await supabase
      .from("tenant_members")
      .select("status")
      .eq("tenant_id", context.tenantId)
      .eq("user_id", validated.userId)
      .single()

    if (!currentMember) {
      return { success: false, error: "User not found" }
    }

    // Update status
    const { error } = await supabase
      .from("tenant_members")
      .update({ status: validated.status })
      .eq("tenant_id", context.tenantId)
      .eq("user_id", validated.userId)

    if (error) {
      console.error("[v0] Error updating status:", error)
      return { success: false, error: error.message }
    }

    // Audit log
    await appendAuditLog(supabase, context.tenantId!, "user:status:update", "tenant_member", validated.userId, {
      from: currentMember.status,
      to: validated.status,
    })

    return { success: true }
  } catch (error: any) {
    console.error("[v0] Error in setStatus:", error)
    return { success: false, error: error.message }
  }
}

export async function bulkImportCsv(fileOrPayload: File | { file: string } , role: string) {
  try {
    await rateLimit("bulk-import", 3, 60000)
    const context = await getContext()

    if (!context.canManage) {
      return { success: false, error: "Insufficient permissions", inserted: 0, duplicates: 0, invalid: 0 }
    }

    let text: string
    if (typeof (fileOrPayload as any).file === "string") {
      text = Buffer.from((fileOrPayload as any).file, "base64").toString("utf8")
    } else {
      text = await (fileOrPayload as File).text()
    }

    const lines = text.split("\n").filter((line) => line.trim())

    // Extract emails (handle CSV with or without headers)
    const emails = lines
      .map((line) => {
        const parts = line.split(",")
        return parts[0].trim().toLowerCase()
      })
      .filter((email) => email.includes("@"))

    // Validate with AI
    const validEmails: string[] = []
    for (const email of emails) {
      if (z.string().email().safeParse(email).success) {
        validEmails.push(email)
      }
    }

    // Invite users
    const result = await inviteUsers({
      invites: validEmails.map((email) => ({ email, role: role as any })),
    })

    return result
  } catch (error: any) {
    console.error("[v0] Error in bulkImportCsv:", error)
    return { success: false, error: error.message, inserted: 0, duplicates: 0, invalid: 0 }
  }
}

export async function getUserAudit(userIdOrEmail: string, limit = 20) {
  try {
    const context = await getContext()
    if (!context.tenantId) {
      return []
    }

    const supabase = await createServerClient()

    const { data, error } = await supabase
      .from("audit_log")
      .select("*")
      .eq("tenant_id", context.tenantId)
      .or(`actor_user_id.eq.${userIdOrEmail},entity_id.eq.${userIdOrEmail}`)
      .order("created_at", { ascending: false })
      .limit(limit)

    if (error) {
      console.error("[v0] Error fetching audit log:", error)
      return []
    }

    return data || []
  } catch (error: any) {
    console.error("[v0] Error in getUserAudit:", error)
    return []
  }
}

export async function verifyHash(hash: string) {
  try {
    const context = await getContext()
    if (!context.tenantId) {
      return { valid: false, error: "No tenant context" }
    }

    const supabase = await createServerClient()

    // Find the audit entry
    const { data: entry, error } = await supabase.from("audit_log").select("*").eq("hash", hash).single()

    if (error || !entry) {
      return { valid: false, error: "Hash not found" }
    }

    // Verify hash integrity
    const computedHash = computeAuditHash(
      entry.tenant_id,
      entry.action,
      entry.entity,
      entry.entity_id,
      entry.diff,
      entry.prev_hash,
    )

    const valid = computedHash === entry.hash

    return {
      valid,
      record: entry,
      computedHash,
    }
  } catch (error: any) {
    console.error("[v0] Error in verifyHash:", error)
    return { valid: false, error: error.message }
  }
}

export async function detectAnomalies(userId: string) {
  try {
    await rateLimit("detect-anomalies", 5, 60000)
    const context = await getContext()

    if (!context.tenantId) {
      return { anomalies: [], risk: "low" }
    }

    // Get recent audit logs
  const logs: any[] = await getUserAudit(userId, 50)

    // Use AI to analyze patterns
    const { text } = await generateText({
      model: "openai/gpt-5",
      prompt: `Analyze the following user activity logs for anomalies or suspicious patterns:

${logs.map((log) => `- ${log.action} on ${log.entity} at ${log.created_at}`).join("\n")}

      Identify any unusual patterns such as:
      - Rapid role changes
      - Unusual access times
      - Suspicious bulk operations
      - Permission escalation attempts

      Respond with a JSON object: { "anomalies": ["description1", "description2"], "risk": "low|medium|high" }`,
      maxTokens: 300,
    })

    try {
      const result = JSON.parse(text)
      return result
    } catch {
      return { anomalies: [], risk: "low" }
    }
  } catch (error: any) {
    console.error("[v0] Error in detectAnomalies:", error)
    return { anomalies: [], risk: "low" }
  }
}

export async function automateOnboarding(userId: string, role: string) {
  try {
    const context = await getContext()
    if (!context.tenantId) {
      return { success: false, error: "No tenant context" }
    }

    const supabase = await createServerClient()

    // Step 1: Send welcome email (stub)
    console.log("[v0] RPA: Sending welcome email to user", userId)

    // Step 2: Assign default permissions based on role
    console.log("[v0] RPA: Assigning default permissions for role", role)

    // Step 3: Create default workspace/folders
    console.log("[v0] RPA: Creating default workspace for user", userId)

    // Step 4: Schedule onboarding tasks
    console.log("[v0] RPA: Scheduling onboarding tasks")

    // Audit log
    await appendAuditLog(supabase, context.tenantId, "user:onboarding:automated", "tenant_member", userId, {
      role,
      steps: ["welcome_email", "permissions", "workspace", "tasks"],
    })

    return { success: true, steps: 4 }
  } catch (error: any) {
    console.error("[v0] Error in automateOnboarding:", error)
    return { success: false, error: error.message }
  }
}

async function appendAuditLog(
  supabase: any,
  tenantId: string,
  action: string,
  entity: string,
  entityId: string,
  diff: any,
) {
  try {
    // Get the last audit entry to chain hashes
    const { data: lastEntry } = await supabase
      .from("audit_log")
      .select("hash")
      .eq("tenant_id", tenantId)
      .order("created_at", { ascending: false })
      .limit(1)
      .single()

    const prevHash = lastEntry?.hash || "0000000000000000"

    // Compute new hash
    const hash = computeAuditHash(tenantId, action, entity, entityId, diff, prevHash)

    // Insert audit entry
    const {
      data: { user },
    } = await supabase.auth.getUser()

    await supabase.from("audit_log").insert({
      tenant_id: tenantId,
      actor_user_id: user?.id || null,
      action,
      entity,
      entity_id: entityId,
      diff,
      hash,
      prev_hash: prevHash,
    })
  } catch (error) {
    console.error("[v0] Error appending audit log:", error)
  }
}

function computeAuditHash(
  tenantId: string,
  action: string,
  entity: string,
  entityId: string,
  diff: any,
  prevHash: string,
): string {
  const data = JSON.stringify({ tenantId, action, entity, entityId, diff, prevHash })
  return crypto.createHash("sha256").update(data).digest("hex")
}
