"use server"

import { z } from "zod"
import { createServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

const documentSchema = z.object({
  id: z.string().uuid().optional(),
  account_id: z.string().uuid().optional(),
  opportunity_id: z.string().uuid().optional(),
  title: z.string().min(2, "Title must be at least 2 characters"),
  kind: z.enum(["proposal", "quote", "msa", "nda", "sow", "other"]),
  file_url: z.string().url("Must be a valid URL"),
  mime: z.string().optional(),
  status: z.enum(["draft", "shared", "viewed", "signed", "expired", "void"]).default("draft"),
  expires_at: z.string().optional(),
})

export async function upsertDocument(input: unknown) {
  const supabase = await createServerClient()
  const body = documentSchema.parse(input)

  const { data, error } = await supabase.from("crm.documents").upsert(body).select().single()

  if (error) throw new Error(error.message)

  revalidatePath("/crm/documents")
  return data
}

export async function shareWithPortal({
  opportunity_id,
  document_id,
  portal_account_id,
}: {
  opportunity_id?: string
  document_id?: string
  portal_account_id: string
}) {
  const supabase = await createServerClient()

  // Get current tenant_id
  const { data: tenantData } = await supabase.rpc("exec_sql", {
    q: "select sec.current_tenant_id()",
  })

  const { error } = await supabase.from("cportal.shares").insert({
    portal_account_id,
    tenant_id: tenantData,
    opportunity_id,
    document_id,
  })

  if (error) throw new Error(error.message)

  revalidatePath("/crm/documents")
  return { ok: true }
}

export async function getDocuments(filters?: { opportunity_id?: string; kind?: string }) {
  const supabase = await createServerClient()

  let query = supabase
    .from("crm.documents")
    .select(`
      *,
      account:crm.accounts(id, name),
      opportunity:crm.opportunities(id, title),
      created_by_user:core.users!created_by(id, email, full_name)
    `)
    .order("created_at", { ascending: false })

  if (filters?.opportunity_id) {
    query = query.eq("opportunity_id", filters.opportunity_id)
  }

  if (filters?.kind) {
    query = query.eq("kind", filters.kind)
  }

  const { data, error } = await query

  if (error) throw new Error(error.message)

  return data
}
