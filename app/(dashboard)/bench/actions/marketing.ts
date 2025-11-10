"use server"

import { z } from "zod"
import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"

async function createClient(): Promise<any> {
  const cookieStore = await cookies()
  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    // adapter: map Next's cookie store to the shape expected by Supabase server client
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
      set(name: string, value: string, opts: any) {
        return cookieStore.set(name, value, opts)
      },
    } as unknown as any,
  })
}

const targetSchema = z.object({
  consultant_id: z.string().uuid(),
  account_name: z.string().min(1),
  contact_name: z.string().optional(),
  contact_email: z.string().email().optional(),
  contact_phone: z.string().optional(),
  channel: z.enum(["email", "linkedin", "phone", "portal"]).default("email"),
  notes: z.string().optional(),
})

export async function queueTarget(input: unknown) {
  const body = targetSchema.parse(input)
  const supabase = await createClient()

  const { data, error } = await supabase.from("bench.marketing_targets").insert(body).select().single()

  if (error) throw error

  return data
}

export async function updateTarget(id: string, patch: any) {
  const supabase = await createClient()

  const { data, error } = await supabase.from("bench.marketing_targets").update(patch).eq("id", id).select().single()

  if (error) throw error

  return data
}

export async function listTargets(consultant_id?: string) {
  const supabase = await createClient()

  let query = supabase.from("bench.marketing_targets").select("*").order("created_at", { ascending: false })

  if (consultant_id) {
    query = query.eq("consultant_id", consultant_id)
  }

  const { data, error } = await query

  if (error) throw error

  return data || []
}

export async function hotlistEmail(consultant_id: string) {
  const supabase = await createClient()

  // Get consultant data
  const { data: consultant, error } = await supabase
    .from("bench.consultants")
    .select("*")
    .eq("id", consultant_id)
    .single()

  if (error || !consultant) {
    throw new Error("Consultant not found")
  }

  const { data: emailData, error: emailError } = await supabase.functions.invoke("generate-hotlist-email", {
    body: { consultant },
  })

  if (emailError) {
    console.error("[v0] Error generating hotlist email:", emailError)
    throw new Error("Failed to generate hotlist email")
  }

  return emailData
}
