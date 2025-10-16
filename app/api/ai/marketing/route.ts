import { type NextRequest, NextResponse } from "next/server"
import { aiMarketingSchema, type AIMarketingResponse, type AIMarketingVariant } from "@/lib/validators"

export const runtime = "edge"

const SYSTEM_PROMPT = `You are an expert B2B SaaS marketer specializing in creating compelling marketing copy. 
Return ONLY valid JSON matching the provided schema. No markdown, no prose, no explanations.

Your response must be a JSON array of variants, where each variant has:
- headline: Compelling, benefit-driven headline (max 80 chars)
- subhead: Supporting subheadline that expands on the value (max 150 chars)
- bullets: Array of 3-5 key benefits or features
- cta: Clear call-to-action text (max 40 chars)
- seo: Object with title, description, and keywords array
- imagePrompt: Detailed prompt for generating a hero image`

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validation = aiMarketingSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        {
          ok: false,
          error: {
            code: "VALIDATION",
            message: "Invalid input. Please check your form and try again.",
          },
        } satisfies AIMarketingResponse,
        { status: 400 },
      )
    }

    const { productName, persona, tone, variants, locale, features, refine } = validation.data

    // Build user prompt
    const featuresList = features.length > 0 ? `\nKey features: ${features.join(", ")}` : ""
    const refineNote = refine ? `\n\nAdditional guidance: ${refine}` : ""

    const userPrompt = `Create ${variants} marketing variant${variants > 1 ? "s" : ""} for:

Product: ${productName}
Target Persona: ${persona}
Tone: ${tone}
Locale: ${locale}${featuresList}${refineNote}

Return a JSON array with ${variants} variant${variants > 1 ? "s" : ""}.`

    // Call AI provider
    const apiKey = process.env.OPENAI_API_KEY || process.env.AI_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        {
          ok: false,
          error: {
            code: "CONFIG",
            message: "AI service is not configured. Please contact support.",
          },
        } satisfies AIMarketingResponse,
        { status: 500 },
      )
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 2000,
        response_format: { type: "json_object" },
      }),
    })

    if (!response.ok) {
      console.error("[v0] OpenAI API error:", response.status, response.statusText)
      return NextResponse.json(
        {
          ok: false,
          error: {
            code: "AI_ERROR",
            message: "Couldn't generate copy right now. Please try again.",
          },
        } satisfies AIMarketingResponse,
        { status: 500 },
      )
    }

    const result = await response.json()
    const content = result.choices[0]?.message?.content

    if (!content) {
      return NextResponse.json(
        {
          ok: false,
          error: {
            code: "EMPTY_RESPONSE",
            message: "Couldn't generate copy right now. Please try again.",
          },
        } satisfies AIMarketingResponse,
        { status: 500 },
      )
    }

    // Parse JSON response
    let data: { variants?: AIMarketingVariant[] }
    try {
      data = JSON.parse(content)
    } catch (err) {
      // Try to extract JSON from text
      const jsonMatch = content.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        data = JSON.parse(jsonMatch[0])
      } else {
        console.error("[v0] Failed to parse AI response:", content)
        return NextResponse.json(
          {
            ok: false,
            error: {
              code: "PARSE_ERROR",
              message: "Couldn't generate copy right now. Please try again.",
            },
          } satisfies AIMarketingResponse,
          { status: 500 },
        )
      }
    }

    if (!data.variants || !Array.isArray(data.variants)) {
      return NextResponse.json(
        {
          ok: false,
          error: {
            code: "INVALID_FORMAT",
            message: "Couldn't generate copy right now. Please try again.",
          },
        } satisfies AIMarketingResponse,
        { status: 500 },
      )
    }

    return NextResponse.json({
      ok: true,
      data: data.variants,
    } satisfies AIMarketingResponse)
  } catch (error) {
    console.error("[v0] AI marketing route error:", error)
    return NextResponse.json(
      {
        ok: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "Couldn't generate copy right now. Please try again.",
        },
      } satisfies AIMarketingResponse,
      { status: 500 },
    )
  }
}
