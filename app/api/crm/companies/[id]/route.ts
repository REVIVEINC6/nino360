import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-server"
import { advancedAI } from "@/lib/ai/advanced-ai"
import { blockchain } from "@/lib/blockchain/blockchain-service"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createClient()
    const { id } = params

    // Get company with all related data
    const { data: company, error } = await supabase
      .from("companies")
      .select(`
        *,
        company_locations(*),
        company_contacts(*),
        company_opportunities(*),
        company_engagements(*),
        company_documents(*)
      `)
      .eq("id", id)
      .single()

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Company not found" }, { status: 404 })
    }

    // Generate fresh AI insights
    try {
      const aiInsights = await advancedAI.optimizeResources(id)
      company.ai_insights = aiInsights
    } catch (aiError) {
      console.error("AI insights generation failed:", aiError)
    }

    return NextResponse.json({
      success: true,
      data: company,
    })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createClient()
    const { id } = params
    const body = await request.json()

    // Update company
    const { data: company, error } = await supabase
      .from("companies")
      .update({
        ...body,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to update company" }, { status: 500 })
    }

    // Record blockchain transaction for audit trail
    try {
      const blockchainTx = await blockchain.recordEvent("company_updated", {
        companyId: id,
        companyName: company.name,
        changes: Object.keys(body),
        timestamp: new Date().toISOString(),
      })

      // Update company with blockchain transaction ID
      await supabase
        .from("companies")
        .update({
          blockchain_tx_id: blockchainTx.txId,
          blockchain_verified: blockchainTx.status === "confirmed",
        })
        .eq("id", id)
    } catch (blockchainError) {
      console.error("Blockchain recording failed:", blockchainError)
    }

    return NextResponse.json({
      success: true,
      data: company,
      message: "Company updated successfully",
    })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createClient()
    const { id } = params

    // Get company details before deletion
    const { data: company } = await supabase.from("companies").select("name, tenant_id").eq("id", id).single()

    // Delete company (cascade will handle related records)
    const { error } = await supabase.from("companies").delete().eq("id", id)

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to delete company" }, { status: 500 })
    }

    // Record blockchain transaction for audit trail
    try {
      await blockchain.recordEvent("company_deleted", {
        companyId: id,
        companyName: company?.name,
        tenantId: company?.tenant_id,
        timestamp: new Date().toISOString(),
      })
    } catch (blockchainError) {
      console.error("Blockchain recording failed:", blockchainError)
    }

    return NextResponse.json({
      success: true,
      message: "Company deleted successfully",
    })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
