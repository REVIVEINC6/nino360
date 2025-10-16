"use server"

import { createClient } from "@/lib/supabase/server"

export async function getAuditChain(limit = 100) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("secx.audit_chain")
    .select(`
      *,
      actor:core.users!actor_user_id(email, full_name)
    `)
    .order("created_at", { ascending: false })
    .limit(limit)

  if (error) throw error
  return data || []
}

export async function verifyAuditChain() {
  const supabase = await createClient()

  const { data: chain, error } = await supabase
    .from("secx.audit_chain")
    .select("id, prev_hash, curr_hash, module, action, resource, payload")
    .order("created_at", { ascending: true })

  if (error) throw error
  if (!chain || chain.length === 0) return { valid: true, errors: [] }

  const errors: string[] = []

  for (let i = 0; i < chain.length; i++) {
    const record = chain[i]
    const expectedPrev = i === 0 ? null : chain[i - 1].curr_hash

    if (record.prev_hash !== expectedPrev) {
      errors.push(`Chain break at record ${record.id}: expected prev_hash ${expectedPrev}, got ${record.prev_hash}`)
    }
  }

  return { valid: errors.length === 0, errors }
}

export async function getAnchors() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("secx.anchors")
    .select("*")
    .order("anchored_at", { ascending: false })
    .limit(50)

  if (error) throw error
  return data || []
}

export async function appendAudit(module: string, action: string, resource: string, payload: any = {}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  const { data: userTenant } = await supabase
    .from("core.user_tenants")
    .select("tenant_id")
    .eq("user_id", user.id)
    .single()

  if (!userTenant) throw new Error("No tenant found")

  const { data, error } = await supabase.rpc("secx.append_audit", {
    _tenant: userTenant.tenant_id,
    _actor: user.id,
    _module: module,
    _action: action,
    _resource: resource,
    _payload: payload,
  })

  if (error) throw error
  return data
}
