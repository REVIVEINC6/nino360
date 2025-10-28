"use server"

import { generateText } from "ai"

export async function draftFeedback(prompt: string, context?: string) {
  try {
    const { text } = await generateText({
      model: "openai/gpt-5-mini",
      prompt: `You are a performance management assistant. Draft constructive, professional feedback based on the following request:

${prompt}

${context ? `Additional context: ${context}` : ""}

Guidelines:
- Be specific and actionable
- Balance strengths with growth areas
- Avoid bias and use inclusive language
- Focus on behaviors and outcomes, not personality
- Suggest concrete next steps

Format the feedback in clear paragraphs.`,
    })

    return {
      success: true,
      feedback: text,
    }
  } catch (error) {
    console.error("[v0] draftFeedback error:", error)
    return {
      success: false,
      error: "Failed to draft feedback",
    }
  }
}

export async function summarizeReview(selfRating: any, mgrRating: any, peerFeedback?: any[]) {
  try {
    const { text } = await generateText({
      model: "openai/gpt-5-mini",
      prompt: `You are a performance management assistant. Summarize the following performance review data into a concise executive summary highlighting key strengths, growth areas, and overall assessment:

Self Rating: ${JSON.stringify(selfRating)}

Manager Rating: ${JSON.stringify(mgrRating)}

${peerFeedback && peerFeedback.length > 0 ? `Peer Feedback: ${JSON.stringify(peerFeedback)}` : ""}

Provide a 2-3 paragraph summary that synthesizes all perspectives.`,
    })

    return {
      success: true,
      summary: text,
    }
  } catch (error) {
    console.error("[v0] summarizeReview error:", error)
    return {
      success: false,
      error: "Failed to summarize review",
    }
  }
}

export async function suggestGoal(role: string, competencies: string[], context?: string) {
  try {
    const { text } = await generateText({
      model: "openai/gpt-5-mini",
      prompt: `You are a performance management assistant. Suggest a SMART goal for an employee in the following role:

Role: ${role}
Key Competencies: ${competencies.join(", ")}
${context ? `Additional Context: ${context}` : ""}

Provide a goal that is:
- Specific: Clear and well-defined
- Measurable: Has quantifiable metrics
- Achievable: Realistic given the role
- Relevant: Aligned with competencies
- Time-bound: Has a clear deadline

Format: Return just the goal title and description, separated by a newline.`,
    })

    const [title, ...descParts] = text.split("\n")
    const description = descParts.join("\n").trim()

    return {
      success: true,
      title: title.trim(),
      description,
    }
  } catch (error) {
    console.error("[v0] suggestGoal error:", error)
    return {
      success: false,
      error: "Failed to suggest goal",
    }
  }
}

export async function detectBias(feedbackText: string) {
  try {
    const { text } = await generateText({
      model: "openai/gpt-5-mini",
      prompt: `You are a fairness and bias detection assistant. Analyze the following performance feedback for potential bias issues:

Feedback: ${feedbackText}

Check for:
- Gender bias (gendered language, stereotypes)
- Recency bias (overemphasis on recent events)
- Leniency/severity bias (consistently too positive or negative)
- Halo/horn effect (one trait influencing overall assessment)
- Vague or non-actionable language

Return a JSON object with:
{
  "hasBias": boolean,
  "issues": ["issue1", "issue2"],
  "suggestions": ["suggestion1", "suggestion2"]
}`,
    })

    const result = JSON.parse(text)
    return {
      success: true,
      ...result,
    }
  } catch (error) {
    console.error("[v0] detectBias error:", error)
    return {
      success: false,
      error: "Failed to detect bias",
      hasBias: false,
      issues: [],
      suggestions: [],
    }
  }
}

export async function coachTone(feedbackText: string) {
  try {
    const { text } = await generateText({
      model: "openai/gpt-5-mini",
      prompt: `You are a communication coach. Analyze the tone of the following performance feedback and suggest improvements:

Feedback: ${feedbackText}

Assess:
- Is it constructive and professional?
- Does it balance positive and developmental feedback?
- Is it specific and actionable?
- Does it avoid harsh or demotivating language?

Provide 2-3 specific suggestions to improve the tone and delivery.`,
    })

    return {
      success: true,
      suggestions: text,
    }
  } catch (error) {
    console.error("[v0] coachTone error:", error)
    return {
      success: false,
      error: "Failed to coach tone",
    }
  }
}
