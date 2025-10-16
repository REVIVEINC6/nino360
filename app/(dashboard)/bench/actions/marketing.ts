"use server"

import { z } from "zod"
import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"

const createClient = () => {
  const cookieStore = cookies()
  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
    },
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
  const supabase = createClient()

  const { data, error } = await supabase.from("bench.marketing_targets").insert(body).select().single()

  if (error) throw error

  return data
}

export async function updateTarget(id: string, patch: any) {
  const supabase = createClient()

  const { data, error } = await supabase.from("bench.marketing_targets").update(patch).eq("id", id).select().single()

  if (error) throw error

  return data
}

export async function listTargets(consultant_id?: string) {
  const supabase = createClient()

  let query = supabase.from("bench.marketing_targets").select("*").order("created_at", { ascending: false })

  if (consultant_id) {
    query = query.eq("consultant_id", consultant_id)
  }

  const { data, error } = await query

  if (error) throw error

  return data || []
}

export async function hotlistEmail(consultant_id: string) {
  const supabase = createClient()

  // Get consultant data
  const { data: consultant } = await supabase.from("bench.consultants").select("*").eq("id", consultant_id).single()

  if (!consultant) {
    throw new Error("Consultant not found")
  }

  // Generate AI hotlist email (placeholder - would call edge function)
  const subject = `Available: ${consultant.primary_skill} - ${consultant.experience_years}+ years`
  const body = `Hi,

I wanted to share a highly skilled ${consultant.primary_skill} consultant who is immediately available:

Name: ${consultant.first_name} ${consultant.last_name}
Experience: ${consultant.experience_years} years
Skills: ${(consultant.skills || []).join(", ")}
Work Authorization: ${consultant.work_authorization}
Location: ${consultant.location}
Rate: $${consultant.current_rate}/hr
Availability: ${consultant.availability_date}

${consultant.summary || ""}

Please let me know if you have any suitable opportunities.

Best regards`

  return { subject, body }
}
