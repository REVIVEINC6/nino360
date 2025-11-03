"use server"

import { createServerClient } from "@/lib/supabase/server"
import { generateText } from "ai"

export async function chatWithAI(message: string, conversationId: string | null) {
  const supabase = await createServerClient()

  try {
    // Get user context
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error("Unauthorized")

    // Generate AI response using Vercel AI SDK
    const { text } = await generateText({
      model: process.env.AI_MODEL || "openai/gpt-4o-mini",
      prompt: `You are a helpful CRM AI assistant. The user asked: "${message}". 
      
      Provide a helpful, concise response. If the request involves CRM actions like:
      - Drafting emails
      - Analyzing deals
      - Scheduling meetings
      - Generating reports
      
      Provide the response and suggest actionable next steps.`,
    })

    // Determine if there are actionable items
  const actions: Array<{ type: string; label: string; data?: any }> = []
    if (message.toLowerCase().includes("email") || message.toLowerCase().includes("draft")) {
      actions.push({
        type: "draft_email",
        label: "Open Email Draft",
        data: { template: "follow_up" },
      })
    }
    if (message.toLowerCase().includes("meeting") || message.toLowerCase().includes("schedule")) {
      actions.push({
        type: "schedule_meeting",
        label: "Schedule Meeting",
        data: { type: "calendar" },
      })
    }

    return {
      message: text,
      conversationId: conversationId || Date.now().toString(),
      actions: actions.length > 0 ? actions : undefined,
    }
  } catch (error) {
    console.error("Error in chatWithAI:", error)
    throw new Error("Failed to get AI response")
  }
}

export async function saveConversation({
  conversationId,
  userMessage,
  assistantMessage,
}: {
  conversationId: string
  userMessage: string
  assistantMessage: string
}) {
  const supabase = await createServerClient()

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error("Unauthorized")

    // Save to database
    await supabase.from("crm_ai_conversations").insert({
      conversation_id: conversationId,
      user_id: user.id,
      user_message: userMessage,
      assistant_message: assistantMessage,
    })

    return { success: true }
  } catch (error) {
    console.error("Error saving conversation:", error)
    throw new Error("Failed to save conversation")
  }
}

export async function getConversationHistory() {
  const supabase = await createServerClient()

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error("Unauthorized")

    const { data, error } = await supabase
      .from("crm_ai_conversations")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true })
      .limit(50)

    if (error) throw error

    // Transform to message format
  const messages: Array<{ id: string; role: "user" | "assistant"; content: any; timestamp: Date; conversation_id: any }> = []
    for (const conv of data || []) {
      messages.push({
        id: `${conv.id}-user`,
        role: "user" as const,
        content: conv.user_message,
        timestamp: new Date(conv.created_at),
        conversation_id: conv.conversation_id,
      })
      messages.push({
        id: `${conv.id}-assistant`,
        role: "assistant" as const,
        content: conv.assistant_message,
        timestamp: new Date(conv.created_at),
        conversation_id: conv.conversation_id,
      })
    }

    return messages
  } catch (error) {
    console.error("Error getting conversation history:", error)
    return []
  }
}
