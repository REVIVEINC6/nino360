import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type")
    const itemId = searchParams.get("itemId")

    // Mock AI insights for now
    const insights = [
      {
        id: "insight-1",
        type: "forecast",
        itemId: itemId || "ai-recruiter-pro",
        title: "Growth Forecast",
        description: "Expected 40% growth in Q2 based on current trends",
        recommendation: "Increase marketing budget and prepare for scale",
        confidence: 0.87,
        impact: "high",
        category: "Growth",
        data: { projectedGrowth: 0.4 },
        actionable: true,
        createdAt: new Date(),
      },
    ]

    return NextResponse.json(insights)
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { query, context } = body

    // Generate AI insights using OpenAI
    const { text } = await generateText({
      model: openai("gpt-4"),
      system: `You are an AI marketplace analyst. Analyze marketplace data and provide actionable insights about:
      - Growth forecasting
      - Pricing optimization
      - Bundle recommendations
      - Promotional strategies
      - Lifecycle management
      
      Respond with structured JSON containing insights with confidence scores.`,
      prompt: `Query: ${query}\nContext: ${JSON.stringify(context)}`,
    })

    return NextResponse.json({ insight: text })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Failed to generate AI insights" }, { status: 500 })
  }
}
