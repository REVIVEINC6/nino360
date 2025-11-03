import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { createCheckoutSession } from "@/lib/payments"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { plan_code, interval, email } = body

    if (!plan_code || !interval) {
      return NextResponse.json({ error: "Plan code and interval are required" }, { status: 400 })
    }

    const supabase = await createServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const { data: membership } = await supabase
      .from("tenant_members")
      .select("tenant_id")
      .eq("user_id", user.id)
      .single()

    if (!membership) {
      return NextResponse.json({ error: "No tenant found" }, { status: 404 })
    }

    const successUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/billing/portal?tenant=${membership.tenant_id}`
    const cancelUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/billing/checkout?plan=${plan_code}&interval=${interval}`

    const result = await createCheckoutSession({
      tenantId: membership.tenant_id,
      planCode: plan_code,
      interval,
      successUrl,
      cancelUrl,
      email: email || user.email,
    })

    return NextResponse.json(result)
  } catch (error: any) {
    console.error("[v0] Checkout error:", error)
    return NextResponse.json({ error: error.message || "Failed to create checkout" }, { status: 500 })
  }
}
