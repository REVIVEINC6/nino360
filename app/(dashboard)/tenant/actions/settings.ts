"use server"

import { z } from "zod"
import { createServerClient } from "@/lib/supabase/server"

const schema = z.object({
  tenant_id: z.string().uuid(),
  legal_name: z.string().min(2),
  address_line1: z.string().optional(),
  address_line2: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  zipcode: z.string().optional(),
  website: z.string().url().optional().or(z.literal("")),
  timezone: z.string().default("UTC"),
  locale: z.string().default("en-US"),
  fiscal_year_start: z.number().int().min(1).max(12).default(4),
  currency: z.string().default("USD"),
})

export async function saveSettings(input: unknown) {
  const body = schema.parse(input)
  const s = await createServerClient()
  const { data, error } = await s.rpc("upsert_tenant_settings", {
    _row: body as any,
  })
  if (error) throw error
  return data
}

export async function getSettings(tenant_id: string) {
  const s = await createServerClient()
  const { data, error } = await s.from("tenant_settings").select("*").eq("tenant_id", tenant_id).single()
  if (error && error.code !== "PGRST116") throw error
  return data
}
