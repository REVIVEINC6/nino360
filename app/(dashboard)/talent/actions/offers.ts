"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function getOffers(applicationId?: string) {
  const supabase = await createClient()

  let query = supabase
    .from("offers")
    .select(`
      *,
      application:applications(
        *,
        job:jobs(title),
        candidate:candidates(full_name, email)
      ),
      created_by:users(full_name)
    `)
    .order("created_at", { ascending: false })

  if (applicationId) {
    query = query.eq("application_id", applicationId)
  }

  const { data, error } = await query

  if (error) {
    console.error("[v0] Error fetching offers:", error)
    return []
  }

  return data || []
}

export async function createOffer(formData: FormData) {
  const supabase = await createClient()

  const offerData = {
    application_id: formData.get("application_id") as string,
    base: Number.parseFloat(formData.get("base") as string),
    bonus: Number.parseFloat(formData.get("bonus") as string) || null,
    benefits: JSON.parse((formData.get("benefits") as string) || "{}"),
    status: "draft",
  }

  const { error } = await supabase.from("offers").insert(offerData)

  if (error) {
    console.error("[v0] Error creating offer:", error)
    return { error: error.message }
  }

  revalidatePath("/talent/offers")
  return { success: true }
}

export async function updateOfferStatus(id: string, status: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("offers")
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)

  if (error) {
    console.error("[v0] Error updating offer:", error)
    return { error: error.message }
  }

  revalidatePath("/talent/offers")
  return { success: true }
}

export async function generateOfferLetter(offerId: string) {
  // TODO: Integrate with AI router for offer letter generation
  // For now, return placeholder
  return {
    letter_url: "/offers/sample-offer-letter.pdf",
  }
}
