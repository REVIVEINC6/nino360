"use server"

import { createServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const modelSchema = z.object({
  id: z.string().uuid().optional(),
  tenant_id: z.string().uuid().optional(),
  name: z.string().min(1),
  kind: z.enum(["chat", "embedding", "vision", "moderation", "function"]),
  provider: z.string().min(1),
  endpoint: z.string().optional(),
  api_key_alias: z.string().optional(),
  default_params: z.any().optional(),
  is_default: z.boolean().optional(),
  is_active: z.boolean().optional(),
})

const policySchema = z.object({
  id: z.string().uuid().optional(),
  tenant_id: z.string().uuid().optional(),
  name: z.string().min(1),
  moderation: z.any().optional(),
  redaction: z.any().optional(),
  output_limits: z.any().optional(),
  temperature_range: z.array(z.number()).optional(),
  allowed_tools: z.array(z.string()).optional(),
})

const bindingSchema = z.object({
  id: z.string().uuid().optional(),
  tenant_id: z.string().uuid().optional(),
  module: z.string().min(1),
  use_case: z.string().min(1),
  model_id: z.string().uuid().optional(),
  policy_id: z.string().uuid().optional(),
  enabled: z.boolean().optional(),
})

export async function getModels() {
  const supabase = await createServerClient()
  const { data, error } = await supabase.from("ai.models").select("*").order("created_at", { ascending: false })

  if (error) throw error
  return data || []
}

export async function upsertModel(input: unknown) {
  const supabase = await createServerClient()
  const body = modelSchema.parse(input)

  const { data, error } = await supabase.from("ai.models").upsert(body).select().single()

  if (error) throw error
  revalidatePath("/admin/genai")
  return data
}

export async function getPolicies() {
  const supabase = await createServerClient()
  const { data, error } = await supabase.from("ai.policies").select("*").order("created_at", { ascending: false })

  if (error) throw error
  return data || []
}

export async function upsertPolicy(input: unknown) {
  const supabase = await createServerClient()
  const body = policySchema.parse(input)

  const { data, error } = await supabase.from("ai.policies").upsert(body).select().single()

  if (error) throw error
  revalidatePath("/admin/genai")
  return data
}

export async function getBindings() {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from("ai.bindings")
    .select("*, model:ai.models(name), policy:ai.policies(name)")
    .order("module", { ascending: true })

  if (error) throw error
  return data || []
}

export async function upsertBinding(input: unknown) {
  const supabase = await createServerClient()
  const body = bindingSchema.parse(input)

  const { data, error } = await supabase.from("ai.bindings").upsert(body).select().single()

  if (error) throw error
  revalidatePath("/admin/genai")
  return data
}
