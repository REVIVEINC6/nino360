import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, slot } = body

    if (!email || !slot?.date || !slot?.time) {
      return NextResponse.json({ success: false, message: "Email and slot are required" }, { status: 400 })
    }

    const supabase = await createServerClient()

    // Find lead by email
    const { data: lead, error: leadError } = await supabase.from("leads").select("id").eq("work_email", email).single()

    if (leadError || !lead) {
      return NextResponse.json({ success: false, message: "Lead not found" }, { status: 404 })
    }

    // Parse slot time
    const startTime = new Date(`${slot.date} ${slot.time}`)
    const endTime = new Date(startTime.getTime() + 60 * 60 * 1000) // 1 hour later

    // Create demo booking
    const { data, error } = await supabase
      .from("demo_bookings")
      .insert({
        lead_id: lead.id,
        starts_at: startTime.toISOString(),
        ends_at: endTime.toISOString(),
        status: "scheduled",
      })
      .select()
      .single()

    if (error) {
      console.error("[v0] Demo booking error:", error)
      return NextResponse.json({ success: false, message: "Failed to book demo" }, { status: 500 })
    }

    // Update lead status
    await supabase.from("leads").update({ status: "demo_scheduled" }).eq("id", lead.id)

    console.log("[v0] Demo booked:", data.id)

    return NextResponse.json(
      {
        success: true,
        message: "Demo scheduled successfully",
        booking_id: data.id,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("[v0] Demo booking error:", error)
    return NextResponse.json({ success: false, message: "Something went wrong. Please try again." }, { status: 500 })
  }
}
