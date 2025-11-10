"use server"

import { createServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const flagSchema = z.object({
  id: z.string().uuid().optional(),
  key: z.string().min(2).max(100),
  description: z.string().optional(),
  default_state: z.boolean().default(false),
})

const rolloutSchema = z.object({
  flag_id: z.string().uuid(),
  tenant_id: z.string().uuid().optional(),
  user_id: z.string().uuid().optional(),
  segment: z.string().optional(),
  state: z.boolean(),
  percentage: z.number().min(0).max(100).optional(),
  start_at: z.string().optional(),
  end_at: z.string().optional(),
})

export async function getFlags() {
  const supabase = await createServerClient()
  const { data, error } = await supabase.from("ff.flags").select("*").order("created_at", { ascending: false })

  if (error) throw error
  return data || []
}

export async function upsertFlag(input: unknown) {
  const supabase = await createServerClient()
  const body = flagSchema.parse(input)

  const { data, error } = await supabase.from("ff.flags").upsert(body).select().single()

  if (error) throw error
  revalidatePath("/admin/feature-flags")
  return data
}

export async function deleteFlag(id: string) {
  const supabase = await createServerClient()
  const { error } = await supabase.from("ff.flags").delete().eq("id", id)

  if (error) throw error
  revalidatePath("/admin/feature-flags")
}

export async function getRollouts(flagId: string) {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from("ff.rollouts")
    .select("*, tenant:core.tenants(name), user:core.users(email)")
    .eq("flag_id", flagId)
    .order("created_at", { ascending: false })

  if (error) throw error
  return data || []
}

export async function createRollout(input: unknown) {
  const supabase = await createServerClient()
  const body = rolloutSchema.parse(input)

  const { data, error } = await supabase.from("ff.rollouts").insert(body).select().single()

  if (error) throw error
  revalidatePath("/admin/feature-flags")
  return data
}

export async function deleteRollout(id: string) {
  const supabase = await createServerClient()
  const { error } = await supabase.from("ff.rollouts").delete().eq("id", id)

  if (error) throw error
  revalidatePath("/admin/feature-flags")
}
