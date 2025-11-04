"use server"

import { createClient } from "@/lib/supabase/server"
import { generateText } from "ai"

export async function predictOutcome(
  modelType: string,
  features: Record<string, unknown>,
  tenantId: string,
): Promise<{
  prediction: number
  confidence: number
  factors: Array<{ name: string; impact: number }>
}> {
  const supabase = await createClient()

  // Check cache first
  const cacheKey = `${modelType}:${JSON.stringify(features)}`
  const { data: cached } = await supabase
    .from("ml_predictions_cache")
    .select("*")
    .eq("tenant_id", tenantId)
    .eq("cache_key", cacheKey)
    .gte("expires_at", new Date().toISOString())
    .single()

  if (cached) {
    return cached.prediction_data
  }

  // Generate prediction using AI
  const { text } = await generateText({
    model: "openai/gpt-4o",
    prompt: `You are a machine learning model for ${modelType}. 
    
Given these features: ${JSON.stringify(features)}

Provide a prediction with:
1. Predicted value (0-100)
2. Confidence score (0-100)
3. Top 3 factors influencing the prediction with impact scores

Format as JSON: { prediction: number, confidence: number, factors: [{ name: string, impact: number }] }`,
  })

  try {
    const result = JSON.parse(text)

    // Cache the prediction
    await supabase.from("ml_predictions_cache").insert({
      tenant_id: tenantId,
      cache_key: cacheKey,
      model_type: modelType,
      prediction_data: result,
      expires_at: new Date(Date.now() + 3600000).toISOString(), // 1 hour
    })

    return result
  } catch {
    return {
      prediction: 50,
      confidence: 0,
      factors: [],
    }
  }
}
