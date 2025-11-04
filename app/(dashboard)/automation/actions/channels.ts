"use server"

import { z } from "zod"
import { createServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

const channelSchema = z.object({
  id: z.string().uuid().optional(),
  kind: z.enum(["email", "slack", "teams", "sms", "webhook"]),
  name: z.string().min(1, "Name is required"),
  config: z.any(),
  is_active: z.boolean().default(true),
})

export async function upsertChannel(input: unknown) {
  const supabase = await createServerClient()
  const body = channelSchema.parse(input)

  const { data, error } = await supabase.from("auto.channels").upsert(body).select().single()

  if (error) throw new Error(error.message)

  revalidatePath("/automation/settings")
  return data
}

export async function listChannels() {
  const supabase = await createServerClient()

  const { data, error } = await supabase.from("auto.channels").select("*").order("created_at", { ascending: false })

  if (error) throw new Error(error.message)
  return data || []
}

export async function deleteChannel(id: string) {
  const supabase = await createServerClient()

  const { error } = await supabase.from("auto.channels").delete().eq("id", id)

  if (error) throw new Error(error.message)

  revalidatePath("/automation/settings")
  return { success: true }
}
