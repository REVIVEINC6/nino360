import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-server"

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()

    const { data: accounts, error } = await supabase
      .from("billing_accounts")
      .select(`
        *,
        subscription_plans!billing_accounts_plan_id_fkey (
          name,
          features,
          modules
        )
      `)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching billing accounts:", error)
      return NextResponse.json({ error: "Failed to fetch billing accounts" }, { status: 500 })
    }

    return NextResponse.json({ accounts: accounts || [] })
  } catch (error) {
    console.error("Error in billing accounts API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const body = await request.json()

    const { data: account, error } = await supabase.from("billing_accounts").insert([body]).select().single()

    if (error) {
      console.error("Error creating billing account:", error)
      return NextResponse.json({ error: "Failed to create billing account" }, { status: 500 })
    }

    // Log billing event
    await supabase.from("billing_events").insert([
      {
        tenant_id: account.tenant_id,
        event_type: "account_created",
        event_data: { account_id: account.id, plan_id: account.plan_id },
      },
    ])

    return NextResponse.json({ account })
  } catch (error) {
    console.error("Error in billing accounts POST API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
