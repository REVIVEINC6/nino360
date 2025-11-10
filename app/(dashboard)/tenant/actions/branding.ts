"use server"

import { z } from "zod"
import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"

const supa = async () => {
  const c = await cookies()
  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      get: (k: string) => c.get(k)?.value,
    },
  })
}


const schema = z.object({
  tenant_id: z.string().uuid(),
  logo_url: z.string().url().optional().or(z.literal("")),
  favicon_url: z.string().url().optional().or(z.literal("")),
  primary_color: z.string(),
  secondary_color: z.string(),
  accent_color: z.string(),
  dark_mode: z.boolean(),
  login_bg_url: z.string().url().optional().or(z.literal("")),
  email_brand_header: z.string().optional(),
})

export async function saveBranding(input: unknown) {
  const body = schema.parse(input)

  const s = await supa()
  const { data, error } = await s.from("tenant_branding").upsert(body).select().single()
  if (error) throw error
  return data
}

export async function getBranding(tenant_id: string) {
  const s = await supa()
  const { data } = await s.from("tenant_branding").select("*").eq("tenant_id", tenant_id).single()
  return data
}
