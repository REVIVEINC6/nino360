import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createClient()

    const { data: account, error } = await supabase
      .from("billing_accounts")
      .select(`
        *,
        subscription_plans!billing_accounts_plan_id_fkey (
          name,
          features,
          modules,
          price_monthly,
          price_quarterly,
          price_annual
        )
      `)
      .eq("id", params.id)
      .single()

    if (error) {
      console.error("Error fetching billing account:", error)
      return NextResponse.json({ error: "Failed to fetch billing account" }, { status: 500 })
    }

    return NextResponse.json({ account })
  } catch (error) {
    console.error("Error in billing account GET API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createClient()
    const updates = await request.json()

    // Update the account
    const { data: account, error } = await supabase
      .from("billing_accounts")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", params.id)
      .select()
      .single()

    if (error) {
      console.error("Error updating billing account:", error)
      return NextResponse.json({ error: "Failed to update billing account" }, { status: 500 })
    }

    // Log billing event
    await supabase.from("billing_events").insert([
      {
        tenant_id: account.tenant_id,
        event_type: "account_updated",
        event_data: { account_id: account.id, updates },
      },
    ])

    return NextResponse.json({ account })
  } catch (error) {
    console.error("Error in billing account PATCH API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createClient()

    // Get account details before deletion
    const { data: account } = await supabase.from("billing_accounts").select("tenant_id").eq("id", params.id).single()

    const { error } = await supabase.from("billing_accounts").delete().eq("id", params.id)

    if (error) {
      console.error("Error deleting billing account:", error)
      return NextResponse.json({ error: "Failed to delete billing account" }, { status: 500 })
    }

    // Log billing event
    if (account) {
      await supabase.from("billing_events").insert([
        {
          tenant_id: account.tenant_id,
          event_type: "account_deleted",
          event_data: { account_id: params.id },
        },
      ])
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in billing account DELETE API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
