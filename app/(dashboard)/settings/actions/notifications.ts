"use server"

import { createServerClient } from "@/lib/supabase/server"
import { appendAudit } from "@/lib/hash"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const notificationsSchema = z.object({
  email: z.object({
    enabled: z.boolean(),
    crm: z.boolean(),
    talent: z.boolean(),
    hrms: z.boolean(),
    finance: z.boolean(),
    bench: z.boolean(),
  }),
  inapp: z.object({
    enabled: z.boolean(),
    crm: z.boolean(),
    talent: z.boolean(),
    hrms: z.boolean(),
    finance: z.boolean(),
    bench: z.boolean(),
  }),
  digest: z.object({
    daily: z.boolean(),
    weekly: z.boolean(),
  }),
  quietHours: z.object({
    enabled: z.boolean(),
    start: z.string(),
    end: z.string(),
  }),
})

export async function getNotifications() {
  const supabase = await createServerClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()
  if (userError || !user) {
    throw new Error("Unauthorized")
  }

  const { data: prefs } = await supabase
    .from("user_preferences")
    .select("notifications")
    .eq("user_id", user.id)
    .single()

  const defaultNotifications = {
    email: { enabled: true, crm: true, talent: true, hrms: true, finance: true, bench: true },
    inapp: { enabled: true, crm: true, talent: true, hrms: true, finance: true, bench: true },
    digest: { daily: false, weekly: true },
    quietHours: { enabled: false, start: "22:00", end: "08:00" },
  }

  return (prefs?.notifications as any) || defaultNotifications
}

export async function saveNotifications(payload: z.infer<typeof notificationsSchema>) {
  const supabase = await createServerClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()
  if (userError || !user) {
    throw new Error("Unauthorized")
  }

  const validated = notificationsSchema.parse(payload)

  const { error: upsertError } = await supabase.from("user_preferences").upsert({
    user_id: user.id,
    notifications: validated,
    updated_at: new Date().toISOString(),
  })

  if (upsertError) {
    throw new Error(`Failed to save notifications: ${upsertError.message}`)
  }

  await appendAudit({
    tenantId: null,
    actorUserId: user.id,
    action: "settings:notifications:update",
    entity: "user_settings",
    entityId: user.id,
    diff: { notifications: validated },
  })

  revalidatePath("/settings/notifications")

  return { success: true }
}
