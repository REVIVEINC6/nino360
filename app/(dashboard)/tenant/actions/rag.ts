"use server"

import { createServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function createThread(title?: string) {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { data, error } = await supabase
    .from("rag.threads")
    .insert({
      title: title || "New Conversation",
      started_by: user.id,
    })
    .select()
    .single()

  if (error) throw error
  revalidatePath("/tenant/copilot")
  return data
}

export async function getThreads() {
  const supabase = await createServerClient()

  const { data, error } = await supabase.from("rag.threads").select("*").order("created_at", { ascending: false })

  if (error) throw error
  return data || []
}

export async function getMessages(threadId: string) {
  const supabase = await createServerClient()

  const { data, error } = await supabase
    .from("rag.messages")
    .select("*")
    .eq("thread_id", threadId)
    .order("created_at", { ascending: true })

  if (error) throw error
  return data || []
}

export async function askCopilot(threadId: string, prompt: string) {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  // Save user message
  await supabase.from("rag.messages").insert({
    thread_id: threadId,
    role: "user",
    content: prompt,
    tokens: Math.ceil(prompt.length / 4),
  })

  // TODO: Call RAG query + AI router edge function
  // For now, return a placeholder response
  const response = `I understand you're asking about: "${prompt}". The RAG system will retrieve relevant documents and provide an AI-generated response with citations.`

  // Save assistant message
  await supabase.from("rag.messages").insert({
    thread_id: threadId,
    role: "assistant",
    content: response,
    tokens: Math.ceil(response.length / 4),
    cost: 0.0001,
  })

  revalidatePath(`/tenant/copilot`)
  return response
}

export async function uploadDocument(formData: FormData) {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const file = formData.get("file") as File
  if (!file) throw new Error("No file provided")

  // Upload to storage
  const fileName = `${Date.now()}-${file.name}`
  const { data: uploadData, error: uploadError } = await supabase.storage.from("rag_docs").upload(fileName, file)

  if (uploadError) throw uploadError

  // Get public URL
  const {
    data: { publicUrl },
  } = supabase.storage.from("rag_docs").getPublicUrl(fileName)

  // Create doc record
  const { data, error } = await supabase
    .from("rag.docs")
    .insert({
      title: file.name,
      file_url: publicUrl,
      mime: file.type,
      status: "processing",
      uploaded_by: user.id,
    })
    .select()
    .single()

  if (error) throw error

  // TODO: Trigger rag-embed edge function

  revalidatePath("/tenant/copilot")
  return data
}

export async function getDocuments() {
  const supabase = await createServerClient()

  const { data, error } = await supabase.from("rag.docs").select("*").order("created_at", { ascending: false })

  if (error) throw error
  return data || []
}
