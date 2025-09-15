import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    const { searchParams } = new URL(request.url)

    const status = searchParams.get("status")
    const fiscalYear = searchParams.get("fiscal_year")

    let query = supabase
      .from("budgets")
      .select(`
        *,
        budget_line_items (
          id,
          category,
          budgeted_amount,
          actual_amount,
          variance,
          chart_of_accounts (
            id,
            account_name,
            account_code
          )
        )
      `)
      .order("created_at", { ascending: false })

    if (status && status !== "all") {
      query = query.eq("status", status)
    }

    if (fiscalYear) {
      query = query.eq("fiscal_year", Number.parseInt(fiscalYear))
    }

    const { data: budgets, error } = await query

    if (error) {
      console.error("Error fetching budgets:", error)
      return NextResponse.json({ error: "Failed to fetch budgets" }, { status: 500 })
    }

    return NextResponse.json({ budgets })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const body = await request.json()

    const { name, fiscal_year, start_date, end_date, total_budget, status = "draft", line_items = [] } = body

    // Validate required fields
    if (!name || !fiscal_year || !start_date || !end_date || !total_budget) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const { data: budget, error } = await supabase
      .from("budgets")
      .insert({
        name,
        fiscal_year,
        start_date,
        end_date,
        total_budget,
        status,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating budget:", error)
      return NextResponse.json({ error: "Failed to create budget" }, { status: 500 })
    }

    // Create budget line items if provided
    if (line_items.length > 0) {
      const lineItemsWithBudgetId = line_items.map((item: any) => ({
        ...item,
        budget_id: budget.id,
      }))

      const { error: lineItemsError } = await supabase.from("budget_line_items").insert(lineItemsWithBudgetId)

      if (lineItemsError) {
        console.error("Error creating budget line items:", lineItemsError)
        // Don't fail the entire request, just log the error
      }
    }

    return NextResponse.json({ budget }, { status: 201 })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
