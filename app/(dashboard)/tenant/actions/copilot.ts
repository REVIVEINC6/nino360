"use server"

import { createServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function createThread(title?: string) {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { data: membership } = await supabase.from("user_tenants").select("tenant_id").eq("user_id", user.id).single()

  if (!membership) throw new Error("No tenant found")

  const { data, error } = await supabase
    .from("threads")
    .insert({
      tenant_id: membership.tenant_id,
      user_id: user.id,
      title: title || "New Conversation",
    })
    .select()
    .single()

  if (error) throw error

  revalidatePath("/tenant/copilot")
  return data
}

export async function askTenantCopilot({ thread_id, prompt }: { thread_id?: string; prompt: string }) {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  // Check feature access
  const hasFeature = await supabase.rpc("sec.has_feature", { p_feature_key: "tenant.copilot" })
  if (!hasFeature) throw new Error("Feature not enabled")

  let threadId = thread_id

  // Create thread if not provided
  if (!threadId) {
    const thread = await createThread()
    threadId = thread.id
  }

  // TODO: Call rag-query to get relevant chunks
  // const { data: chunks } = await supabase.functions.invoke('rag-query', {
  //   body: { query: prompt, top_k: 6 }
  // })

  // TODO: Call ai-router with system prompt + citations
  // const { data: response } = await supabase.functions.invoke('ai-router', {
  //   body: {
  //     model: 'gpt-4',
  //     messages: [
  //       { role: 'system', content: 'Use citations from provided documents.' },
  //       { role: 'user', content: prompt }
  //     ]
  //   }
  // })

  // Save messages
  await supabase.from("messages").insert([
    {
      thread_id: threadId,
      role: "user",
      content: prompt,
    },
    {
      thread_id: threadId,
      role: "assistant",
      content: "This is a placeholder response. Edge functions need to be deployed.",
      meta: { tokens: 0, cost: 0, citations: [] },
    },
  ])

  revalidatePath("/tenant/copilot")
  return { thread_id: threadId }
}

export async function getThreads() {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return []

  const { data } = await supabase.from("threads").select("*").order("updated_at", { ascending: false })

  return data || []
}

export async function getMessages(threadId: string) {
  const supabase = await createServerClient()

  const { data } = await supabase
    .from("messages")
    .select("*")
    .eq("thread_id", threadId)
    .order("created_at", { ascending: true })

  return data || []
}
