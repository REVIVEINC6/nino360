"use server"

import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"
import { z } from "zod"

const supa = () => {
  const c = cookies()
  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      get: (k) => c.get(k)?.value,
    },
  })
}

const schema = z.object({
  tenant_id: z.string().uuid(),
  plan_key: z.enum(["free", "starter", "pro", "enterprise"]),
  provider: z.string().default("stripe"),
  customer_id: z.string().optional(),
  subscription_id: z.string().optional(),
  status: z.enum(["active", "trialing", "past_due", "canceled"]).default("active"),
  notes: z.string().optional(),
})

export async function saveBilling(input: unknown) {
  const body = schema.parse(input)
  const s = supa()
  const { data, error } = await s.from("tenant_billing").upsert(body).select().single()
  if (error) throw error
  return data
}

export async function getBilling(tenant_id: string) {
  const s = supa()
  const { data } = await s.from("tenant_billing").select("*").eq("tenant_id", tenant_id).single()
  return data
}
