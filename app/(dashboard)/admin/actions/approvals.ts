"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function listApprovals(status?: string) {
  const supabase = await createClient()

  let query = supabase
    .from("admin_approvals")
    .select(`
      *,
      decided_by_user:users!admin_approvals_decided_by_fkey(email, display_name)
    `)
    .order("created_at", { ascending: false })

  if (status) {
    query = query.eq("status", status)
  }

  const { data, error } = await query

  if (error) throw error
  return data || []
}

export async function createApproval(input: {
  kind: "invite" | "join_request" | "role_change"
  subject: Record<string, any>
}) {
  const supabase = await createClient()

  // Get current tenant
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  const { data: userTenant } = await supabase.from("user_tenants").select("tenant_id").eq("user_id", user.id).single()

  if (!userTenant) throw new Error("No tenant found")

  const { data, error } = await supabase
    .from("admin_approvals")
    .insert({
      tenant_id: userTenant.tenant_id,
      kind: input.kind,
      subject: input.subject,
      status: "pending",
    })
    .select()
    .single()

  if (error) throw error

  // Log audit
  await supabase.from("audit_logs").insert({
    tenant_id: userTenant.tenant_id,
    user_id: user.id,
    action: "create",
    resource_type: "admin_approval",
    resource_id: data.id,
    details: { kind: input.kind, subject: input.subject },
  })

  revalidatePath("/admin/approvals")
  return data
}

export async function decideApproval(input: {
  approval_id: string
  decision: "approved" | "rejected" | "revoked"
  comment?: string
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  // Get approval
  const { data: approval, error: fetchError } = await supabase
    .from("admin_approvals")
    .select("*")
    .eq("id", input.approval_id)
    .single()

  if (fetchError) throw fetchError

  // Update approval status
  const { error: updateError } = await supabase
    .from("admin_approvals")
    .update({
      status: input.decision,
      decided_by: user.id,
      decided_at: new Date().toISOString(),
      comment: input.comment,
    })
    .eq("id", input.approval_id)

  if (updateError) throw updateError

  // Execute approval logic based on kind
  if (input.decision === "approved") {
    const subject = approval.subject as any

    if (approval.kind === "invite") {
      // Add user to tenant with requested roles
      // This would typically call an edge function or handle invite acceptance
      // For now, just log it
    } else if (approval.kind === "join_request") {
      // Add user to tenant
      if (subject.user_id) {
        await supabase.from("user_tenants").insert({
          user_id: subject.user_id,
          tenant_id: approval.tenant_id,
        })
      }
    } else if (approval.kind === "role_change") {
      // Update user roles
      if (subject.user_id && subject.requested_roles) {
        for (const roleKey of subject.requested_roles) {
          const { data: role } = await supabase.from("roles").select("id").eq("key", roleKey).single()

          if (role) {
            await supabase.from("user_roles").insert({
              user_id: subject.user_id,
              role_id: role.id,
              tenant_id: approval.tenant_id,
            })
          }
        }
      }
    }
  }

  // Log audit
  await supabase.from("audit_logs").insert({
    tenant_id: approval.tenant_id,
    user_id: user.id,
    action: input.decision,
    resource_type: "admin_approval",
    resource_id: input.approval_id,
    details: { kind: approval.kind, comment: input.comment },
  })

  revalidatePath("/admin/approvals")
}
