"use server"

import { createServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import crypto from "crypto"

const apiSchema = z.object({
  id: z.string().uuid().optional(),
  tenant_id: z.string().uuid().optional(),
  name: z.string().min(1),
  base_path: z.string().min(1),
  is_public: z.boolean().optional(),
  rate_limit_per_min: z.number().min(1).optional(),
  quota_per_day: z.number().min(1).optional(),
})

const routeSchema = z.object({
  id: z.string().uuid().optional(),
  api_id: z.string().uuid(),
  method: z.enum(["GET", "POST", "PUT", "PATCH", "DELETE"]),
  path: z.string().min(1),
  target: z.string().min(1),
  auth_required: z.boolean().optional(),
  scope_required: z.string().optional(),
})

export async function getApis() {
  const supabase = await createServerClient()
  const { data, error } = await supabase.from("apigw.apis").select("*").order("created_at", { ascending: false })

  if (error) throw error
  return data || []
}

export async function upsertApi(input: unknown) {
  const supabase = await createServerClient()
  const body = apiSchema.parse(input)

  const { data, error } = await supabase.from("apigw.apis").upsert(body).select().single()

  if (error) throw error
  revalidatePath("/admin/api-gateway")
  return data
}

export async function getKeys(apiId?: string) {
  const supabase = await createServerClient()
  let query = supabase.from("apigw.keys").select("*, api:apigw.apis(name)").order("created_at", { ascending: false })

  if (apiId) {
    query = query.eq("api_id", apiId)
  }

  const { data, error } = await query
  if (error) throw error
  return data || []
}

export async function issueKey(input: {
  api_id: string
  name: string
  scopes: string[]
  expires_at?: string
}) {
  const supabase = await createServerClient()

  // Generate API key
  const raw = "NINO_" + crypto.randomBytes(24).toString("base64url")
  const hashed = crypto.createHash("sha256").update(raw).digest("hex")

  const { data, error } = await supabase
    .from("apigw.keys")
    .insert({
      api_id: input.api_id,
      name: input.name,
      hashed_key: hashed,
      scopes: input.scopes,
      expires_at: input.expires_at,
    })
    .select()
    .single()

  if (error) throw error
  revalidatePath("/admin/api-gateway")

  return { key: raw, record: data }
}

export async function revokeKey(id: string) {
  const supabase = await createServerClient()
  const { error } = await supabase.from("apigw.keys").update({ is_active: false }).eq("id", id)

  if (error) throw error
  revalidatePath("/admin/api-gateway")
}

export async function getRoutes(apiId?: string) {
  const supabase = await createServerClient()
  let query = supabase.from("apigw.routes").select("*, api:apigw.apis(name)").order("path", { ascending: true })

  if (apiId) {
    query = query.eq("api_id", apiId)
  }

  const { data, error } = await query
  if (error) throw error
  return data || []
}

export async function upsertRoute(input: unknown) {
  const supabase = await createServerClient()
  const body = routeSchema.parse(input)

  const { data, error } = await supabase.from("apigw.routes").upsert(body).select().single()

  if (error) throw error
  revalidatePath("/admin/api-gateway")
  return data
}

export async function getUsageStats(apiId?: string, days = 7) {
  const supabase = await createServerClient()
  const since = new Date()
  since.setDate(since.getDate() - days)

  let query = supabase.from("apigw.usage").select("*").gte("occurred_at", since.toISOString())

  if (apiId) {
    query = query.eq("api_id", apiId)
  }

  const { data, error } = await query
  if (error) throw error
  return data || []
}
