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

const placementSchema = z.object({
  id: z.string().uuid().optional(),
  consultant_id: z.string().uuid(),
  client_name: z.string().min(1),
  project_name: z.string().optional(),
  start_date: z.string(),
  end_date: z.string().optional(),
  pay_rate: z.number().optional(),
  bill_rate: z.number().optional(),
  currency: z.string().default("USD"),
  location: z.string().optional(),
  employment_type: z.string().default("contract"),
  po_number: z.string().optional(),
  notes: z.string().optional(),
})

export async function createPlacement(input: unknown) {
  const body = placementSchema.parse(input)
  const supabase = createClient()

  const { data, error } = await supabase.from("bench.placements").insert(body).select().single()

  if (error) throw error

  // Trigger will auto-update consultant status to 'deployed'

  return data
}

export async function updatePlacement(id: string, patch: any) {
  const supabase = createClient()

  const { data, error } = await supabase.from("bench.placements").update(patch).eq("id", id).select().single()

  if (error) throw error

  return data
}

export async function listPlacements(consultant_id?: string) {
  const supabase = createClient()

  let query = supabase
    .from("bench.placements")
    .select("*, consultant:bench.consultants(first_name, last_name, email, primary_skill)")
    .order("start_date", { ascending: false })

  if (consultant_id) {
    query = query.eq("consultant_id", consultant_id)
  }

  const { data, error } = await query

  if (error) throw error

  return data || []
}
