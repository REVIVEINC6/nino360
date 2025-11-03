"use server"

import { z } from "zod"
import { createServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

const clientSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(2, "Name must be at least 2 characters"),
  legal_name: z.string().optional(),
  tax_id: z.string().optional(),
  billing_email: z.string().email().optional(),
  billing_address: z
    .object({
      street: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      zip: z.string().optional(),
      country: z.string().optional(),
    })
    .optional(),
  currency: z.string().default("USD"),
  payment_terms: z.string().default("NET30"),
  status: z.enum(["active", "inactive"]).default("active"),
})

export async function upsertClient(input: unknown) {
  try {
    const body = clientSchema.parse(input)
    const supabase = await createServerClient()

    const { data, error } = await supabase.from("finance.clients").upsert(body).select().single()

    if (error) throw error

    // Audit log
    await supabase.rpc("finance.audit", {
      _action: body.id ? "update" : "create",
      _resource: "client",
      _payload: data,
    })

    revalidatePath("/finance/clients")
    return { success: true, data }
  } catch (error) {
    console.error("[v0] Error upserting client:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to save client" }
  }
}

export async function deleteClient(id: string) {
  try {
    const supabase = await createServerClient()

    const { error } = await supabase.from("finance.clients").delete().eq("id", id)

    if (error) throw error

    await supabase.rpc("finance.audit", {
      _action: "delete",
      _resource: "client",
      _payload: { id },
    })

    revalidatePath("/finance/clients")
    return { success: true }
  } catch (error) {
    console.error("[v0] Error deleting client:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to delete client" }
  }
}

export async function getClients() {
  try {
    const supabase = await createServerClient()

    const { data, error } = await supabase.from("finance.clients").select("*").order("name")

    if (error) throw error

    return { success: true, data }
  } catch (error) {
    console.error("[v0] Error fetching clients:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to fetch clients" }
  }
}
