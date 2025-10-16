"use server"

import { z } from "zod"
import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"

const supa = () => {
  const c = cookies()
  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      get: (k) => c.get(k)?.value,
    },
  })
}

const schema = z.object({
  id: z.string().uuid().optional(),
  tenant_id: z.string().uuid(),
  key: z.string(),
  subject: z.string(),
  body_html: z.string(),
  body_text: z.string().optional(),
})

export async function saveTemplate(input: unknown) {
  const body = schema.parse(input)
  const s = supa()
  const { data, error } = await s.from("email_templates").upsert(body).select().single()
  if (error) throw error
  return data
}

export async function listTemplates(tenant_id: string) {
  const s = supa()
  const { data, error } = await s.from("email_templates").select("*").eq("tenant_id", tenant_id)
  if (error) throw error
  return data || []
}

export async function deleteTemplate(id: string) {
  const s = supa()
  const { error } = await s.from("email_templates").delete().eq("id", id)
  if (error) throw error
}
