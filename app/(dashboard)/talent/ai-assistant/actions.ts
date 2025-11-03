"use server"

import { createServerClient } from "@/lib/supabase/server"

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

  // Generate AI response (mock for now)
  const response = await generateAIResponse(message)

  // Save AI response
  await supabase.from("ai_messages").insert({
    conversation_id: convId,
    role: "assistant",
    content: response,
  })

  return { conversationId: convId, response }
}

async function generateAIResponse(message: string): Promise<string> {
  // Mock AI responses based on keywords
  const lowerMessage = message.toLowerCase()

  if (lowerMessage.includes("candidate") || lowerMessage.includes("resume")) {
    return "I can help you with candidate management. Would you like me to search for candidates, parse resumes, or provide candidate recommendations?"
  }

  if (lowerMessage.includes("job") || lowerMessage.includes("requisition")) {
    return "I can assist with job requisitions. I can help you create job postings, match candidates to jobs, or analyze job performance metrics."
  }

  if (lowerMessage.includes("interview")) {
    return "I can help schedule interviews, generate interview questions, or analyze interview feedback. What would you like to do?"
  }

  if (lowerMessage.includes("offer")) {
    return "I can assist with offer management. I can help generate offer letters, track offer status, or analyze offer acceptance rates."
  }

  if (lowerMessage.includes("analytics") || lowerMessage.includes("report")) {
    return "I can provide recruitment analytics including time-to-hire, source effectiveness, pipeline metrics, and quality of hire. What metrics would you like to see?"
  }

  return "I'm your AI recruitment assistant. I can help with candidate sourcing, job management, interview scheduling, offer generation, and analytics. How can I assist you today?"
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
