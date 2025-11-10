"use server"

import { generateText } from "ai"

export async function explainRiskSpike(metric: string, data: any[], context?: string) {
  try {
    const { text } = await generateText({
      model: "openai/gpt-5-mini",
      prompt: `You are a compliance analyst. Explain why the following metric spiked:

Metric: ${metric}
Data: ${JSON.stringify(data, null, 2)}
${context ? `Additional context: ${context}` : ""}

Provide a concise analysis (2-3 paragraphs) identifying:
1. The spike pattern and timing
2. Likely root causes (segment by org/manager/location if relevant)
3. Recommended actions to address the issue`,
    })

    return {
      success: true,
      explanation: text,
    }
  } catch (error) {
    console.error("[v0] explainRiskSpike error:", error)
    return {
      success: false,
      error: "Failed to explain risk spike",
    }
  }
}

export async function draftReminder(kind: string, overdueItems: any[]) {
  try {
    const { text } = await generateText({
      model: "openai/gpt-5-mini",
      prompt: `You are an HR compliance assistant. Draft a professional reminder email for the following overdue items:

Type: ${kind}
Overdue items: ${overdueItems.length}
Sample items: ${JSON.stringify(overdueItems.slice(0, 3), null, 2)}

Write a concise, professional email reminder that:
1. Clearly states what is overdue
2. Emphasizes the importance of compliance
3. Provides a clear call-to-action
4. Maintains a supportive, non-punitive tone`,
    })

    return {
      success: true,
      message: text,
    }
  } catch (error) {
    console.error("[v0] draftReminder error:", error)
    return {
      success: false,
      error: "Failed to draft reminder",
    }
  }
}

export async function suggestControls(frameworkKey: string, requirement: string) {
  try {
    const { text } = await generateText({
      model: "openai/gpt-5-mini",
      prompt: `You are a compliance expert. Suggest specific controls to satisfy the following requirement:

Framework: ${frameworkKey}
Requirement: ${requirement}

Provide 3-5 specific, actionable controls that would help pass this requirement. For each control, include:
1. Control name
2. Description
3. Evidence type needed (POLICY, TRAINING, I9, IMMIGRATION, RETENTION, DOC, BACKGROUND)
4. Implementation guidance`,
    })

    return {
      success: true,
      suggestions: text,
    }
  } catch (error) {
    console.error("[v0] suggestControls error:", error)
    return {
      success: false,
      error: "Failed to suggest controls",
    }
  }
}
