"use server"

import { createServerClient } from "@/lib/supabase/server"
import { generateText } from "ai"

export async function sendMessage(message: string, conversationId?: string) {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error("Unauthorized")

  // Create or get conversation
  let convId = conversationId
  if (!convId) {
    const { data: conv } = await supabase
      .from("ai_conversations")
      .insert({
        user_id: user.id,
        title: message.substring(0, 50),
        context: { module: "talent" },
      })
      .select()
      .single()
    convId = conv?.id
  }

  // Save user message
  await supabase.from("ai_messages").insert({
    conversation_id: convId,
    role: "user",
    content: message,
  })

  const response = await generateAIResponse(message, user.id)

  // Save AI response
  await supabase.from("ai_messages").insert({
    conversation_id: convId,
    role: "assistant",
    content: response,
  })

  return { conversationId: convId, response }
}

async function generateAIResponse(message: string, userId: string): Promise<string> {
  const supabase = await createServerClient()

  // Get user context and recent activity
  const { data: context } = await supabase
    .from("user_activity")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(10)

  // Get relevant data for RAG
  const { data: candidates } = await supabase.from("ats.candidates").select("id, full_name, headline, status").limit(5)

  const { data: jobs } = await supabase.from("ats.jobs").select("id, title, status").eq("status", "open").limit(5)

  const model = process.env.AI_MODEL || "openai/gpt-4o-mini"
  const prompt = `You are an AI recruitment assistant for Nino360 HRMS.

User context: ${JSON.stringify(context || [])}
Recent candidates: ${JSON.stringify(candidates || [])}
Open jobs: ${JSON.stringify(jobs || [])}

User question: ${message}

Provide a helpful, specific response based on the available data. If you need to perform an action, explain what action and how it would be done.`

  try {
    const { text } = await generateText({
      model: model as any,
      prompt,
      maxTokens: 500,
    })
    return text
  } catch (error) {
    console.error("[v0] AI response generation failed:", error)
    return "I'm having trouble connecting to the AI service. Please try again or contact support if the issue persists."
  }
}

export async function getConversations() {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error("Unauthorized")

  const { data } = await supabase
    .from("ai_conversations")
    .select("*")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false })
    .limit(10)

  return data || []
}

export async function getMessages(conversationId: string) {
  const supabase = await createServerClient()

  const { data } = await supabase
    .from("ai_messages")
    .select("*")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true })

  return data || []
}
