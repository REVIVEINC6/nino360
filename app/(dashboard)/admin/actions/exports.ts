"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function getExportJobs() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("exp.jobs")
    .select(`
      *,
      requester:core.users!requester_user_id(email, full_name)
    `)
    .order("created_at", { ascending: false })
    .limit(100)

  if (error) throw error
  return data || []
}

export async function createExportJob(
  kind: "gdpr_subject" | "tenant_export" | "audit_log" | "i9_bundle" | "immigration" | "dlp_report",
  params: any = {},
) {
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

  const { data, error } = await supabase
    .from("exp.jobs")
    .insert({
      tenant_id: userTenant.tenant_id,
      requester_user_id: user.id,
      kind,
      params,
    })
    .select()
    .single()

  if (error) throw error

  revalidatePath("/admin/exports")
  return data
}

export async function getLegalHolds() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("exp.legal_holds")
    .select(`
      *,
      creator:core.users!created_by(email, full_name),
      releaser:core.users!released_by(email, full_name)
    `)
    .order("created_at", { ascending: false })

  if (error) throw error
  return data || []
}

export async function createLegalHold(hold: {
  case_name: string
  description?: string
  scope: any
}) {
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

  const { data, error } = await supabase
    .from("exp.legal_holds")
    .insert({
      tenant_id: userTenant.tenant_id,
      created_by: user.id,
      ...hold,
    })
    .select()
    .single()

  if (error) throw error

  revalidatePath("/admin/exports")
  return data
}

export async function releaseLegalHold(id: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  const { data, error } = await supabase
    .from("exp.legal_holds")
    .update({
      status: "released",
      released_by: user.id,
      released_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single()

  if (error) throw error

  revalidatePath("/admin/exports")
  return data
}
