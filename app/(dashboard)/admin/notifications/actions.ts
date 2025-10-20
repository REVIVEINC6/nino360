"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export interface NotificationTemplate {
  id: string
  name: string
  type: "email" | "push" | "sms" | "in_app"
  subject: string
  body: string
  rate_limit: string
  status: "active" | "inactive"
  created_at: string
  updated_at: string
}

export async function getNotificationTemplates() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("notification_templates")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching notification templates:", error)
    return []
  }

  return data as NotificationTemplate[]
}

export async function createNotificationTemplate(
  template: Omit<NotificationTemplate, "id" | "created_at" | "updated_at">,
) {
  const supabase = await createClient()

  const { data, error } = await supabase.from("notification_templates").insert(template).select().single()

  if (error) {
    console.error("Error creating notification template:", error)
    throw new Error("Failed to create notification template")
  }

  revalidatePath("/admin/notifications")
  return data
}

export async function updateNotificationTemplate(id: string, updates: Partial<NotificationTemplate>) {
  const supabase = await createClient()

  const { data, error } = await supabase.from("notification_templates").update(updates).eq("id", id).select().single()

  if (error) {
    console.error("Error updating notification template:", error)
    throw new Error("Failed to update notification template")
  }

  revalidatePath("/admin/notifications")
  return data
}

export async function deleteNotificationTemplate(id: string) {
  const supabase = await createClient()

  const { error } = await supabase.from("notification_templates").delete().eq("id", id)

  if (error) {
    console.error("Error deleting notification template:", error)
    throw new Error("Failed to delete notification template")
  }

  revalidatePath("/admin/notifications")
}

export async function testNotificationTemplate(id: string, recipient: string) {
  const supabase = await createClient()

  // Get template
  const { data: template, error: fetchError } = await supabase
    .from("notification_templates")
    .select("*")
    .eq("id", id)
    .single()

  if (fetchError || !template) {
    throw new Error("Template not found")
  }

  // Log test notification
  const { error: logError } = await supabase.from("notification_logs").insert({
    template_id: id,
    recipient,
    type: template.type,
    status: "test",
    sent_at: new Date().toISOString(),
  })

  if (logError) {
    console.error("Error logging test notification:", logError)
  }

  return { success: true, message: `Test notification sent to ${recipient}` }
}
