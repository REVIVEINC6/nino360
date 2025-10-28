"use server"

import { createServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function getProjectFiles(projectId: string) {
  const supabase = await createServerClient()

  const { data, error } = await supabase
    .from("project_files")
    .select(`
      *,
      uploaded_by_user:profiles!project_files_uploaded_by_fkey(
        id,
        full_name,
        avatar_url
      )
    `)
    .eq("project_id", projectId)
    .order("uploaded_at", { ascending: false })

  if (error) throw error
  return data
}

export async function uploadProjectFile(formData: FormData) {
  const supabase = await createServerClient()

  const projectId = formData.get("projectId") as string
  const file = formData.get("file") as File
  const category = formData.get("category") as string
  const description = formData.get("description") as string

  // Upload file to storage
  const fileName = `${Date.now()}-${file.name}`
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from("project-files")
    .upload(`${projectId}/${fileName}`, file)

  if (uploadError) throw uploadError

  // Create file record
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { error } = await supabase.from("project_files").insert({
    project_id: projectId,
    file_name: file.name,
    file_path: uploadData.path,
    file_size: file.size,
    file_type: file.type,
    category,
    description,
    uploaded_by: user?.id,
  })

  if (error) throw error

  revalidatePath(`/projects/${projectId}/files`)
  return { success: true }
}

export async function deleteProjectFile(fileId: string, projectId: string) {
  const supabase = await createServerClient()

  // Get file path
  const { data: file } = await supabase.from("project_files").select("file_path").eq("id", fileId).single()

  if (file) {
    // Delete from storage
    await supabase.storage.from("project-files").remove([file.file_path])
  }

  // Delete record
  const { error } = await supabase.from("project_files").delete().eq("id", fileId)

  if (error) throw error

  revalidatePath(`/projects/${projectId}/files`)
  return { success: true }
}
