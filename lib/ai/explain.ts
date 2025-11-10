"use server"

import { generateText } from "ai"
import { hasFeature } from "@/lib/fbac"

export async function explainMetric(input: {
  question: string
  metric: string
  aggregates: Record<string, any>
  scope: { from: string; to: string }
}) {
  const hasAiExplain = await hasFeature("ai.explain")
  if (!hasAiExplain) {
    return {
      success: false,
      error: "AI Explain feature is not enabled for your tenant",
    }
  }

  try {
    const { text } = await generateText({
      model: "openai/gpt-5-mini",
      prompt: `You are an HR analytics assistant. Answer the following question about a metric:

Question: ${input.question}
Metric: ${input.metric}
Time Period: ${input.scope.from} to ${input.scope.to}

Aggregated Data:
${JSON.stringify(input.aggregates, null, 2)}

Provide a concise explanation (2-3 paragraphs) that:
1. Summarizes the key trend or pattern
2. Identifies the top 3 contributing segments or factors
3. Suggests potential root causes or areas to investigate

Be specific and cite the data provided. Do not make assumptions beyond what the data shows.`,
    })

    return {
      success: true,
      explanation: text,
    }
  } catch (error) {
    console.error("[v0] explainMetric error:", error)
    return {
      success: false,
      error: "Failed to generate explanation",
    }
  }
}

export async function forecastMetric(input: { metric: string; historicalData: any[]; horizon: number }) {
  const hasForecast = await hasFeature("ai.forecast")
  if (!hasForecast) {
    return {
      success: false,
      error: "AI Forecast feature is not enabled for your tenant",
    }
  }

  try {
    // Simple deterministic forecast (stub for production ARIMA/ETS)
    const values = input.historicalData.map((d) => d.value || 0)
    const avg = values.reduce((sum, v) => sum + v, 0) / values.length
    const trend = values.length > 1 ? (values[values.length - 1] - values[0]) / (values.length - 1) : 0

  const forecast: { period: number; predicted: number; lower: number; upper: number }[] = []
    for (let i = 1; i <= input.horizon; i++) {
      const predicted = avg + trend * (values.length + i)
      forecast.push({
        period: i,
        predicted: Math.max(0, Math.round(predicted)),
        lower: Math.max(0, Math.round(predicted * 0.9)),
        upper: Math.round(predicted * 1.1),
      })
    }

    return {
      success: true,
      forecast,
      note: "Forecast is a simple trend projection. Use for planning purposes only.",
    }
  } catch (error) {
    console.error("[v0] forecastMetric error:", error)
    return {
      success: false,
      error: "Failed to generate forecast",
    }
  }
}
