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

export async function uploadProjectFile(input: FormData | File | { file: string; projectId?: string; category?: string; description?: string }) {
  const supabase = await createServerClient()

  let projectId: string | undefined
  let category: string | undefined
  let description: string | undefined
  let file: File | null = null
  let buffer: Buffer | null = null
  let filename = `${Date.now()}-upload`
  let fileType = "application/octet-stream"

  if (typeof (input as any)?.get === "function") {
    const fd = input as FormData
    projectId = fd.get("projectId") as string
    file = fd.get("file") as File
    category = fd.get("category") as string
    description = fd.get("description") as string
  } else if (typeof (input as any)?.arrayBuffer === "function") {
    file = input as File
  } else if (typeof (input as any)?.file === "string") {
    buffer = Buffer.from((input as any).file, "base64")
    projectId = (input as any).projectId
    category = (input as any).category
    description = (input as any).description
    filename = (input as any).filename || filename
    fileType = (input as any).contentType || fileType
  }

  if (!projectId) throw new Error("projectId required")
  if (!file && !buffer) throw new Error("No file provided")

  // Upload file to storage
  const fileName = `${Date.now()}-${filename}`
  const uploadPayload: any = buffer ? buffer : file!
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from("project-files")
    .upload(`${projectId}/${fileName}`, uploadPayload)

  if (uploadError) throw uploadError

  // Create file record
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { error } = await supabase.from("project_files").insert({
    project_id: projectId,
    file_name: filename,
    file_path: uploadData.path,
    file_size: buffer ? buffer.length : file!.size,
    file_type: fileType,
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
