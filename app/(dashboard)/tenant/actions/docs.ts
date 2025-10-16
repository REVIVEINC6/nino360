"use server"

import { createServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function uploadDoc(formData: FormData) {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  // Check feature access
  const hasFeature = await supabase.rpc("sec.has_feature", { p_feature_key: "tenant.docs" })
  if (!hasFeature) throw new Error("Feature not enabled")

  const file = formData.get("file") as File
  const title = formData.get("title") as string

  if (!file || !title) throw new Error("Missing file or title")

  const { data: membership } = await supabase.from("user_tenants").select("tenant_id").eq("user_id", user.id).single()

  if (!membership) throw new Error("No tenant found")

  const fileName = `${membership.tenant_id}/${Date.now()}-${file.name}`

  const { data: uploadData, error: uploadError } = await supabase.storage.from("tenant_docs").upload(fileName, file)

  if (uploadError) throw uploadError

  const {
    data: { publicUrl },
  } = supabase.storage.from("tenant_docs").getPublicUrl(fileName)

  // Create doc record
  const { data: doc, error: docError } = await supabase
    .from("docs")
    .insert({
      tenant_id: membership.tenant_id,
      title,
      file_url: publicUrl,
      mime: file.type,
      status: "processing",
      uploaded_by: user.id,
    })
    .select()
    .single()

  if (docError) throw docError

  // TODO: Call rag-embed edge function
  // await supabase.functions.invoke('rag-embed', { body: { doc_id: doc.id, file_url: publicUrl } })

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
