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

const submissionSchema = z.object({
  id: z.string().uuid().optional(),
  consultant_id: z.string().uuid(),
  job_ref: z.string().optional(),
  pay_rate: z.number().optional(),
  bill_rate: z.number().optional(),
  currency: z.string().default("USD"),
  resume_url: z.string().url().optional(),
  vendor_name: z.string().optional(),
  client_name: z.string().optional(),
  status: z
    .enum(["submitted", "shortlisted", "interview", "rejected", "offered", "withdrawn", "placed"])
    .default("submitted"),
  owner_id: z.string().uuid().optional(),
  meta: z.record(z.any()).optional(),
})

export async function createSubmission(input: unknown) {
  const body = submissionSchema.parse(input)
  const supabase = createClient()

  const { data, error } = await supabase.from("bench.submissions").insert(body).select().single()

  if (error) throw error

  // Update consultant status to interview if submission is created
  if (data) {
    await supabase.from("bench.consultants").update({ status: "interview" }).eq("id", body.consultant_id)
  }

  return data
}

export async function updateSubmission(id: string, patch: any) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("bench.submissions")
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single()

  if (error) throw error

  return data
}

export async function listSubmissions(filters?: { consultant_id?: string; status?: string }) {
  const supabase = createClient()

  let query = supabase
    .from("bench.submissions")
    .select("*, consultant:bench.consultants(first_name, last_name, email)")
    .order("created_at", { ascending: false })

  if (filters?.consultant_id) {
    query = query.eq("consultant_id", filters.consultant_id)
  }
  if (filters?.status) {
    query = query.eq("status", filters.status)
  }

  const { data, error } = await query

  if (error) throw error

  return data || []
}
