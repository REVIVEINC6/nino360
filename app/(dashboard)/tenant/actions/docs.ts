"use server"

import { createServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function uploadDoc(input: FormData | File | { file: string; title?: string }) {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  // Check feature access
  const hasFeature = await supabase.rpc("sec.has_feature", { p_feature_key: "tenant.docs" })
  if (!hasFeature) throw new Error("Feature not enabled")

  let file: File | null = null
  let buffer: Buffer | null = null
  let title: string | null = null

  if (typeof (input as any)?.get === "function") {
    const fd = input as FormData
    file = fd.get("file") as File | null
    title = (fd.get("title") as string) || null
  } else if (typeof (input as any)?.arrayBuffer === "function") {
    file = input as File
  } else if (typeof (input as any)?.file === "string") {
    buffer = Buffer.from((input as any).file, "base64")
    title = (input as any).title || null
  }

  if (!file && !buffer) throw new Error("Missing file or title")

  const { data: membership } = await supabase.from("user_tenants").select("tenant_id").eq("user_id", user.id).single()

  if (!membership) throw new Error("No tenant found")

  const filename = file?.name || `upload-${Date.now()}`
  const fileKey = `${membership.tenant_id}/${Date.now()}-${filename}`

  // Upload via storage client: if we have a Buffer, pass it; if File, pass File directly
  const uploadTarget: any = buffer ? buffer : file!
  const { data: uploadData, error: uploadError } = await supabase.storage.from("tenant_docs").upload(fileKey, uploadTarget)

  if (uploadError) throw uploadError

  const {
    data: { publicUrl },
  } = supabase.storage.from("tenant_docs").getPublicUrl(fileKey)

  // Create doc record
  const { data: doc, error: docError } = await supabase
    .from("docs")
    .insert({
      tenant_id: membership.tenant_id,
      title: title || filename,
      file_url: publicUrl,
      mime: file?.type || "application/octet-stream",
      status: "processing",
      uploaded_by: user.id,
    })
    .select()
    .single()

  if (docError) throw docError

  revalidatePath("/tenant/configuration")
  return doc
}

export async function listDocs() {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return []

  const { data } = await supabase.from("docs").select("*").order("created_at", { ascending: false })

  return data || []
}

export async function deleteDoc(id: string) {
  const supabase = await createServerClient()

  const { error } = await supabase.from("docs").delete().eq("id", id)

  if (error) throw error

  revalidatePath("/tenant/configuration")
}
