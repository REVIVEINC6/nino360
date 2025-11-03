"use server"

import { createClient } from "@/lib/supabase/server"
import { generateText } from "ai"

export async function getPersonalizedInsights(userId: string, context: string) {
  const supabase = await createClient()

  // Get user interaction history
  const { data: interactions } = await supabase
    .from("user_interactions")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(50)

  if (!interactions || interactions.length === 0) {
    return {
      insights: [],
      recommendations: [],
    }
  }

  // Analyze patterns using Theory of Mind
  const { text } = await generateText({
    model: "openai/gpt-4o",
    prompt: `Analyze this user's behavior patterns and provide personalized insights:
    
Context: ${context}
Recent Interactions: ${JSON.stringify(interactions)}

Provide:
1. 3 personalized insights about their work patterns
2. 3 actionable recommendations to improve their workflow
3. Predicted next actions they might take

Format as JSON with keys: insights, recommendations, predictions`,
  })

  try {
    return JSON.parse(text)
  } catch {
    return {
      insights: [],
      recommendations: [],
      predictions: [],
    }
  }
}

export async function trackUserInteraction(
  userId: string,
  action: string,
  context: Record<string, unknown>,
  tenantId: string,
) {
  const supabase = await createClient()

  await supabase.from("user_interactions").insert({
    user_id: userId,
    tenant_id: tenantId,
    action,
    context,
    created_at: new Date().toISOString(),
  })
}
