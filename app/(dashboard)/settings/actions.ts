"use server"

import { createServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function updateAccountSettings(formData: FormData) {
  const supabase = await createServerClient()

  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const phone = formData.get("phone") as string
  const title = formData.get("title") as string
  const department = formData.get("department") as string
  const location = formData.get("location") as string
  const bio = formData.get("bio") as string

  // Update user profile
  const { error } = await supabase
    .from("profiles")
    .update({
      name,
      email,
      phone,
      title,
      department,
      location,
      bio,
      updated_at: new Date().toISOString(),
    })
    .eq("id", (await supabase.auth.getUser()).data.user?.id)

  if (error) throw error

  revalidatePath("/settings/account")
  return { success: true }
}

export async function uploadAvatar(formData: FormData) {
  const supabase = await createServerClient()
  const file = formData.get("avatar") as File

  if (!file) throw new Error("No file provided")

  const user = (await supabase.auth.getUser()).data.user
  if (!user) throw new Error("Not authenticated")

  // Upload to storage
  const fileName = `${user.id}-${Date.now()}`
  const { error: uploadError } = await supabase.storage.from("avatars").upload(fileName, file)

  if (uploadError) throw uploadError

  // Get public URL
  const {
    data: { publicUrl },
  } = supabase.storage.from("avatars").getPublicUrl(fileName)

  // Update profile
  const { error: updateError } = await supabase.from("profiles").update({ avatar_url: publicUrl }).eq("id", user.id)

  if (updateError) throw updateError

  revalidatePath("/settings/account")
  return { success: true, avatarUrl: publicUrl }
}

export async function deleteAccount() {
  const supabase = await createServerClient()

  const user = (await supabase.auth.getUser()).data.user
  if (!user) throw new Error("Not authenticated")

  // Soft delete - mark as deleted
  const { error } = await supabase
    .from("profiles")
    .update({
      deleted_at: new Date().toISOString(),
      status: "deleted",
    })
    .eq("id", user.id)

  if (error) throw error

  // Sign out
  await supabase.auth.signOut()

  return { success: true }
}
