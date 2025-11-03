"use server"

import { z } from "zod"
import { createServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

const accountSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(2, "Name must be at least 2 characters"),
  domain: z.string().optional(),
  industry: z.string().optional(),
  size: z.string().optional(),
  owner_id: z.string().uuid().optional(),
  billing_client_id: z.string().uuid().optional(),
  status: z.enum(["active", "inactive", "prospect", "customer"]).default("active"),
})

export async function upsertAccount(input: unknown) {
  const supabase = await createServerClient()
  const body = accountSchema.parse(input)

  const { data, error } = await supabase.from("crm.accounts").upsert(body).select().single()

  if (error) throw new Error(error.message)

  revalidatePath("/crm/accounts")
  return data
}

export async function deleteAccount(id: string) {
  const supabase = await createServerClient()

  const { error } = await supabase.from("crm.accounts").delete().eq("id", id)

  if (error) throw new Error(error.message)

  revalidatePath("/crm/accounts")
  return { success: true }
}

export async function getAccounts(filters?: { status?: string; search?: string }) {
  const supabase = await createServerClient()

  let query = supabase
    .from("crm.accounts")
    .select("*, owner:core.users!owner_id(id, email, full_name)")
    .order("created_at", { ascending: false })

  if (filters?.status) {
    query = query.eq("status", filters.status)
  }

  if (filters?.search) {
    query = query.ilike("name", `%${filters.search}%`)
  }

  const { data, error } = await query

  if (error) throw new Error(error.message)

  return data
}

export async function createClient(input: {
  name: string
  industry?: string
  tier?: string
  status?: string
  location?: string
  notes?: string
}) {
  try {
    const supabase = await createServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: "Unauthorized" }
    }

    const { data: profile } = await supabase.from("users").select("tenant_id").eq("id", user.id).single()

    if (!profile?.tenant_id) {
      return { success: false, error: "No tenant found" }
    }

    const { data, error } = await supabase
      .from("crm_contacts")
      .insert({
        tenant_id: profile.tenant_id,
        company: input.name,
        industry: input.industry,
        tier: input.tier,
        status: input.status || "prospect",
        location: input.location,
        notes: input.notes,
        created_by: user.id,
      })
      .select()
      .single()

    if (error) throw error

    revalidatePath("/crm")
    return { success: true, data }
  } catch (error) {
    console.error("[v0] Create client error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create client",
    }
  }
}
