"use server"

import { z } from "zod"
import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { checkRateLimit, getRateLimitKey, RATE_LIMITS } from "@/lib/rate-limit"

const inviteSchema = z.object({
  email: z.string().email(),
  role_id: z.string().uuid(),
  tenant_id: z.string().uuid(),
})

export async function createInvitation(input: unknown) {
  const { email, role_id, tenant_id } = inviteSchema.parse(input)
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  const rateLimitKey = getRateLimitKey(user.id, "invite_user")
  const allowed = await checkRateLimit(rateLimitKey, RATE_LIMITS.INVITE_USER)

  if (!allowed) {
    throw new Error("Rate limit exceeded. Please try again later.")
  }

  // Verify user is admin
  const { data: roles } = await supabase
    .from("user_roles")
    .select("roles(key)")
    .eq("user_id", user.id)
    .in("roles.key", ["master_admin", "super_admin", "admin"])

  if (!roles || roles.length === 0) {
    throw new Error("Unauthorized: Admin role required")
  }

  // Generate token
  const token = crypto.randomUUID()

  const { data, error } = await supabase
    .from("invitations")
    .insert({
      tenant_id,
      email,
      role_id,
      token,
      invited_by: user.id,
    })
    .select()
    .single()

  if (error) throw error

  // Log audit
  await supabase.from("audit_logs").insert({
    tenant_id,
    user_id: user.id,
    action: "create",
    resource_type: "invitation",
    resource_id: data.id,
    details: { email, role_id },
  })

  revalidatePath("/admin/invitations")
  return data
}
