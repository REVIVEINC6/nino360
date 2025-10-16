"use server"

import { z } from "zod"
import { createServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

const opportunitySchema = z.object({
  id: z.string().uuid().optional(),
  account_id: z.string().uuid().optional(),
  contact_id: z.string().uuid().optional(),
  title: z.string().min(2, "Title must be at least 2 characters"),
  amount: z.number().min(0).default(0),
  currency: z.string().default("USD"),
  stage_id: z.string().uuid().optional(),
  close_date: z.string().optional(),
  owner_id: z.string().uuid().optional(),
  status: z.enum(["open", "won", "lost", "withdrawn"]).default("open"),
  probability: z.number().min(0).max(100).default(0),
})

export async function upsertOpportunity(input: unknown) {
  const supabase = await createServerClient()
  const body = opportunitySchema.parse(input)

  const { data, error } = await supabase.from("crm.opportunities").upsert(body).select().single()

  if (error) throw new Error(error.message)

  revalidatePath("/crm/opportunities")
  revalidatePath("/crm/pipeline")
  return data
}

export async function moveOpportunity({ id, stage_id }: { id: string; stage_id: string }) {
  const supabase = await createServerClient()

  const { data, error } = await supabase
    .from("crm.opportunities")
    .update({ stage_id, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single()

  if (error) throw new Error(error.message)

  revalidatePath("/crm/pipeline")
  return data
}

export async function deleteOpportunity(id: string) {
  const supabase = await createServerClient()

  const { error } = await supabase.from("crm.opportunities").delete().eq("id", id)

  if (error) throw new Error(error.message)

  revalidatePath("/crm/opportunities")
  revalidatePath("/crm/pipeline")
  return { success: true }
}

export async function getOpportunities(filters?: { status?: string; stage_id?: string; search?: string }) {
  const supabase = await createServerClient()

  let query = supabase
    .from("crm.opportunities")
    .select(`
      *,
      account:crm.accounts(id, name),
      contact:crm.contacts(id, first_name, last_name, email),
      stage:crm.opportunity_stages(id, name, win_prob),
      owner:core.users!owner_id(id, email, full_name)
    `)
    .order("created_at", { ascending: false })

  if (filters?.status) {
    query = query.eq("status", filters.status)
  }

  if (filters?.stage_id) {
    query = query.eq("stage_id", filters.stage_id)
  }

  if (filters?.search) {
    query = query.ilike("title", `%${filters.search}%`)
  }

  const { data, error } = await query

  if (error) throw new Error(error.message)

  return data
}
