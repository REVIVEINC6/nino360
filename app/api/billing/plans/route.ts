import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-server"

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()

    const { data: plans, error } = await supabase
      .from("subscription_plans")
      .select("*")
      .eq("is_active", true)
      .order("price_monthly", { ascending: true })

    if (error) {
      console.error("Error fetching subscription plans:", error)
      return NextResponse.json({ error: "Failed to fetch subscription plans" }, { status: 500 })
    }

    return NextResponse.json({ plans: plans || [] })
  } catch (error) {
    console.error("Error in subscription plans API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const planData = await request.json()

    const { data: plan, error } = await supabase
      .from("subscription_plans")
      .insert([
        {
          ...planData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select()
      .single()

    if (error) {
      console.error("Error creating subscription plan:", error)
      return NextResponse.json({ error: "Failed to create subscription plan" }, { status: 500 })
    }

    return NextResponse.json({ plan })
  } catch (error) {
    console.error("Error in subscription plans POST API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
