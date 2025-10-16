"use server"

import { generateText } from "ai"

/**
 * Recommend merit and promotion adjustments based on performance and market data
 */
export async function recommendCompensation(input: {
  employeeName: string
  currentBase: number
  currentBand: string
  performanceRating: number
  compaRatio: number
  rangePenetration: number
  tenure: number
  lastIncrease: number
}) {
  try {
    const { text } = await generateText({
      model: "openai/gpt-5-mini",
      prompt: `You are a compensation analyst. Recommend merit increase and/or promotion for the following employee:

Employee: ${input.employeeName}
Current Base: $${input.currentBase.toLocaleString()}
Current Band: ${input.currentBand}
Performance Rating: ${input.performanceRating}/5
Compa Ratio: ${input.compaRatio}%
Range Penetration: ${input.rangePenetration}%
Tenure: ${input.tenure} years
Last Increase: ${input.lastIncrease}%

Provide:
1. Recommended merit increase percentage (0-10%)
2. Whether promotion is warranted (yes/no)
3. Brief justification (2-3 sentences)

Format as JSON:
{
  "meritPct": number,
  "promotion": boolean,
  "justification": "string"
}`,
    })

    const recommendation = JSON.parse(text)
    return {
      success: true,
      recommendation,
    }
  } catch (error) {
    console.error("[v0] recommendCompensation error:", error)
    return {
      success: false,
      error: "Failed to generate recommendation",
    }
  }
}

/**
 * Draft compensation letter
 */
export async function draftCompLetter(input: {
  employeeName: string
  currentBase: number
  newBase: number
  meritPct: number
  effectiveDate: string
  bonusAmount?: number
  stockUnits?: number
}) {
  try {
    const { text } = await generateText({
      model: "openai/gpt-5-mini",
      prompt: `Draft a professional compensation letter for the following:

Employee: ${input.employeeName}
Current Base: $${input.currentBase.toLocaleString()}
New Base: $${input.newBase.toLocaleString()}
Merit Increase: ${input.meritPct}%
Effective Date: ${input.effectiveDate}
${input.bonusAmount ? `Bonus: $${input.bonusAmount.toLocaleString()}` : ""}
${input.stockUnits ? `Stock Units: ${input.stockUnits}` : ""}

Write a warm, professional letter in markdown format with:
1. Congratulations on performance
2. Details of compensation changes
3. Effective date
4. Next steps

Keep it concise (3-4 paragraphs).`,
    })

    return {
      success: true,
      letter: text,
    }
  } catch (error) {
    console.error("[v0] draftCompLetter error:", error)
    return {
      success: false,
      error: "Failed to draft letter",
    }
  }
}

/**
 * Check for pay equity issues
 */
export async function checkPayEquity(input: {
  proposals: Array<{
    employeeName: string
    currentBase: number
    proposedBase: number
    band: string
    compaRatio: number
    gender?: string
    ethnicity?: string
  }>
}) {
  try {
    const { text } = await generateText({
      model: "openai/gpt-5-mini",
      prompt: `Analyze the following compensation proposals for potential pay equity issues:

${JSON.stringify(input.proposals, null, 2)}

Identify:
1. Any significant disparities by band
2. Outliers (compa ratio < 80 or > 120)
3. Potential bias patterns
4. Recommendations for fairness

Format as JSON:
{
  "issues": [{ "type": "string", "description": "string", "severity": "low|medium|high" }],
  "recommendations": ["string"]
}`,
    })

    const analysis = JSON.parse(text)
    return {
      success: true,
      analysis,
    }
  } catch (error) {
    console.error("[v0] checkPayEquity error:", error)
    return {
      success: false,
      error: "Failed to analyze pay equity",
    }
  }
}
