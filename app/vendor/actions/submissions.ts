"use server"

import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"

const createClient = async () => {
  const cookieStore = await cookies()
  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
    },
  })
}

export async function listSubmissions() {
  const supabase = await createClient()
  const { data, error } = await supabase.from("vms.submissions").select("*").order("created_at", { ascending: false })

  if (error) throw error
  return data
}

export async function createSubmission(row: any) {
  const supabase = await createClient()
  const { data, error } = await supabase.from("vms.submissions").insert(row).select().single()

  if (error) throw error
  return data
}
