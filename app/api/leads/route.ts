import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { generateText } from "ai"

async function scoreLeadWithAI(leadData: {
  name: string
  work_email: string
  company: string
  size?: string
  industry?: string
  phone?: string
}) {
  try {
    const { text } = await generateText({
      model: "openai/gpt-4o-mini",
      prompt: `Analyze this lead and provide a score from 0-100 based on their potential value:
      
Company: ${leadData.company}
Company Size: ${leadData.size || "Unknown"}
Industry: ${leadData.industry || "Unknown"}
Email Domain: ${leadData.work_email.split("@")[1]}

Consider:
- Company size (larger = higher score)
- Industry fit (tech, consulting, staffing = higher)
- Email domain (corporate domains = higher than free email)
- Completeness of information

Respond with ONLY a number between 0-100.`,
    })

    const score = Number.parseInt(text.trim())
    return isNaN(score) ? 50 : Math.min(100, Math.max(0, score))
  } catch (error) {
    console.error("[v0] AI lead scoring error:", error)
    return 50 // Default score if AI fails
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, work_email, company, size, industry, phone, utm } = body

    // Validate required fields
    if (!name || !work_email || !company) {
      return NextResponse.json({ success: false, message: "Name, email, and company are required" }, { status: 400 })
    }

    const aiScore = await scoreLeadWithAI({ name, work_email, company, size, industry, phone })

    const supabase = await createServerClient()

    // Insert lead into database
    const { data, error } = await supabase
      .from("leads")
      .insert({
        name,
        work_email,
        company,
        size,
        industry,
        phone,
        utm: utm || {},
        status: "new",
        score: aiScore,
        metadata: {
          ai_scored: true,
          scored_at: new Date().toISOString(),
        },
      })
      .select()
      .single()

    if (error) {
      console.error("[v0] Lead insertion error:", error)
      return NextResponse.json({ success: false, message: "Failed to save lead" }, { status: 500 })
    }

    console.log("[v0] New lead created:", data.id, "with AI score:", aiScore)

    return NextResponse.json(
      {
        success: true,
        message: "Thank you! We'll be in touch soon.",
        lead_id: data.id,
        score: aiScore,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("[v0] Lead submission error:", error)
    return NextResponse.json({ success: false, message: "Something went wrong. Please try again." }, { status: 500 })
  }
}
