"use server"

import { createServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function getRateCards() {
  const supabase = await createServerClient()

  const { data, error } = await supabase
    .from("vms.rate_cards")
    .select("*, vendor:vms.vendors(name)")
    .order("effective_date", { ascending: false })

  if (error) throw error
  return data || []
}

export async function createRateCard(formData: FormData) {
  const supabase = await createServerClient()

  const rateCard = {
    vendor_id: formData.get("vendor_id"),
    skill: formData.get("skill"),
    rate: formData.get("rate"),
    currency: formData.get("currency"),
    effective_date: formData.get("effective_date"),
    expiry_date: formData.get("expiry_date"),
  }

  const { error } = await supabase.from("vms.rate_cards").insert(rateCard)

  if (error) throw error

  revalidatePath("/vms/rate-cards")
  return { success: true }
}
