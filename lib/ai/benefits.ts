"use server"

import { generateText } from "ai"

/**
 * Explain plan trade-offs (no medical advice)
 */
export async function explainPlanTradeoffs(plans: any[]) {
  try {
    const planSummaries = plans
      .map((p) => `${p.name} (${p.type}): ${p.calc_rule?.kind || "standard"} pricing`)
      .join("\n")

    const { text } = await generateText({
      model: "openai/gpt-5-mini",
      prompt: `You are a benefits advisor assistant. Compare the following benefits plans and explain the trade-offs in simple terms. Do NOT provide medical advice.

Plans:
${planSummaries}

Provide a brief comparison focusing on coverage tiers, costs, and typical use cases. Keep it under 200 words.`,
    })

    return {
      success: true,
      explanation: text,
    }
  } catch (error) {
    console.error("[v0] explainPlanTradeoffs error:", error)
    return {
      success: false,
      error: "Failed to explain plan trade-offs",
    }
  }
}

/**
 * Draft enrollment reminder
 */
export async function draftEnrollmentReminder(employeeName: string, windowEnds: string) {
  try {
    const { text } = await generateText({
      model: "openai/gpt-5-mini",
      prompt: `Draft a friendly reminder email for ${employeeName} about completing their benefits enrollment by ${windowEnds}. Keep it professional, concise, and encouraging. Include a call-to-action to complete enrollment.`,
    })

    return {
      success: true,
      reminder: text,
    }
  } catch (error) {
    console.error("[v0] draftEnrollmentReminder error:", error)
    return {
      success: false,
      error: "Failed to draft reminder",
    }
  }
}

/**
 * Flag high employer cost growth
 */
export async function flagCostGrowth(currentCost: number, priorYearCost: number) {
  const growthPercent = ((currentCost - priorYearCost) / priorYearCost) * 100

  if (growthPercent > 15) {
    return {
      flagged: true,
      message: `Employer cost increased by ${growthPercent.toFixed(1)}% vs prior year. Consider reviewing plan options or cost-sharing strategies.`,
      growthPercent,
    }
  }

  return {
    flagged: false,
    growthPercent,
  }
}
