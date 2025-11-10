import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, company } = body

    // Log the lead (in production, save to database)
    console.log("[v0] New lead:", { name, email, company, timestamp: new Date().toISOString() })

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    return NextResponse.json(
      {
        success: true,
        message: "Thank you! We'll be in touch soon.",
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("[v0] Lead submission error:", error)
    return NextResponse.json({ success: false, message: "Something went wrong. Please try again." }, { status: 500 })
  }
}
