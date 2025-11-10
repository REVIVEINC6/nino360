"use server"

import { createClient } from "@/lib/supabase/server"

export async function sendAIMessage(message: string, conversationId?: string) {
  const supabase = await createClient()

  try {
    // Store user message
    const { data: userMsg, error: userError } = await supabase
      .from("talent_ai_conversations")
      .insert({
        conversation_id: conversationId || crypto.randomUUID(),
        role: "user",
        content: message,
        tenant_id: "default",
      })
      .select()
      .single()

    if (userError) throw userError

    // Generate AI response (placeholder - integrate with AI SDK)
    const aiResponse = `I understand you want to ${message}. Let me help you with that.`

    // Store AI response
    const { data: aiMsg, error: aiError } = await supabase
      .from("talent_ai_conversations")
      .insert({
        conversation_id: userMsg.conversation_id,
        role: "assistant",
        content: aiResponse,
        tenant_id: "default",
      })
      .select()
      .single()

    if (aiError) throw aiError

    return { success: true, message: aiMsg }
  } catch (error) {
    console.error("Error sending AI message:", error)
    return { success: false, error: "Failed to send message" }
  }
}

export async function getConversationHistory(conversationId: string) {
  const supabase = await createClient()

  try {
    const { data, error } = await supabase
      .from("talent_ai_conversations")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true })

    if (error) throw error

    return { success: true, messages: data }
  } catch (error) {
    console.error("Error fetching conversation:", error)
    return { success: false, error: "Failed to fetch conversation" }
  }
}
