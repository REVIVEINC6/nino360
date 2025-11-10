"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"
import { createServerClient } from "@/lib/supabase/server"

const customerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  code: z.string().optional(),
  contact: z
    .object({
      email: z.string().email().optional(),
      phone: z.string().optional(),
      address: z.string().optional(),
    })
    .optional(),
  terms: z.string().default("NET30"),
  currency: z.string().default("USD"),
  notes: z.string().optional(),
})

export async function listCustomers() {
  const supabase = await createServerClient()

  const { data, error } = await supabase.from("customers").select("*").order("name")

  if (error) {
    console.error("[v0] Error listing customers:", error)
    return []
  }

  return data || []
}

export async function getCustomer(id: string) {
  const supabase = await createServerClient()

  const { data, error } = await supabase.from("customers").select("*").eq("id", id).single()

  if (error) {
    console.error("[v0] Error getting customer:", error)
    return null
  }

  return data
}

export async function upsertCustomer(input: z.infer<typeof customerSchema> & { id?: string }) {
  const supabase = await createServerClient()
  const validated = customerSchema.parse(input)

  const payload = {
    ...validated,
    contact: validated.contact || {},
    updated_at: new Date().toISOString(),
  }

  if (input.id) {
    const { error } = await supabase.from("customers").update(payload).eq("id", input.id)

    if (error) throw error
  } else {
    const { error } = await supabase.from("customers").insert(payload)

    if (error) throw error
  }

  revalidatePath("/finance/accounts-receivable")
  return { success: true }
}

export async function deleteCustomer(id: string) {
  const supabase = await createServerClient()

  const { error } = await supabase.from("customers").delete().eq("id", id)

  if (error) throw error

  revalidatePath("/finance/accounts-receivable")
  return { success: true }
}
