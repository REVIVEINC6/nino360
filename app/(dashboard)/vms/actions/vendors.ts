"use server"

import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"
import { z } from "zod"

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

export async function listVendors() {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("vms.tenant_vendors")
    .select("*, vendor:vms.vendor_orgs(*)")
    .order("created_at", { ascending: false })

  if (error) throw error
  return data
}

const vendorSchema = z.object({
  name: z.string().min(2),
  legal_name: z.string().optional(),
  website: z.string().url().optional(),
})

export async function createVendor(input: unknown) {
  const body = vendorSchema.parse(input)
  const supabase = createClient()

  const { data: org, error } = await supabase
    .from("vms.vendor_orgs")
    .insert({
      name: body.name,
      legal_name: body.legal_name,
      website: body.website,
      status: "pending",
    })
    .select()
    .single()

  if (error) throw error

  // Link to current tenant
  const { error: linkErr } = await supabase.from("vms.tenant_vendors").insert({
    vendor_id: org.id,
    onboarding_status: "invited",
  })

  if (linkErr) throw linkErr
  return org
}

export async function inviteVendor({
  vendor_id,
  email,
  role = "admin",
}: {
  vendor_id: string
  email: string
  role?: "owner" | "admin" | "member" | "billing"
}) {
  // Call edge function to send invite email
  await fetch(process.env.SUPABASE_FUNCTIONS_URL + "/send-vendor-invite", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
    },
    body: JSON.stringify({ vendor_id, email, role }),
  })

  return { ok: true }
}
