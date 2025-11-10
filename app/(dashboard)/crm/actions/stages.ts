"use server"

import { createServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function getStages() {
  const supabase = await createServerClient()

  const { data, error } = await supabase
    .from("crm.opportunity_stages")
    .select("*")
    .order("position", { ascending: true })

  if (error) throw new Error(error.message)

  return data
}

export async function bootstrapStages() {
  const supabase = await createServerClient()

  const stages = [
    { name: "Prospect", position: 1, win_prob: 10 },
    { name: "Qualified", position: 2, win_prob: 30 },
    { name: "Proposal", position: 3, win_prob: 60 },
    { name: "Negotiation", position: 4, win_prob: 80 },
    { name: "Closed Won", position: 5, win_prob: 100 },
  ]

  for (const stage of stages) {
    await supabase.from("crm.opportunity_stages").upsert(stage)
  }

  revalidatePath("/crm/pipeline")
  return { ok: true }
}
