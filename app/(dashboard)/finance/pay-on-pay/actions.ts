"use server"

import { createClient } from "@/lib/supabase/server"
import { logAudit } from "@/lib/audit/server"
import { z } from "zod"
import { revalidatePath } from "next/cache"

// =====================================================================================
// VALIDATION SCHEMAS
// =====================================================================================

const settlementRunSchema = z.object({
  runDate: z.string(),
  linkagePolicy: z.object({
    type: z.enum(["auto", "manual", "hybrid"]),
    rules: z.array(z.any()),
  }),
  notes: z.string().optional(),
})

const linkageRuleSchema = z.object({
  ruleName: z.string().min(1),
  ruleType: z.enum(["direct", "split", "net", "reroute"]),
  priority: z.number().int().min(0),
  clientId: z.string().uuid().optional(),
  vendorId: z.string().uuid().optional(),
  projectId: z.string().uuid().optional(),
  invoicePattern: z.string().optional(),
  allocationMethod: z.enum(["percentage", "fixed_amount", "formula"]),
  allocationConfig: z.record(z.any()),
  conditions: z.record(z.any()).optional(),
})

const settlementItemSchema = z.object({
  runId: z.string().uuid(),
  clientInvoiceId: z.string().uuid().optional(),
  clientReceiptId: z.string().uuid().optional(),
  clientAmount: z.number().positive(),
  clientCurrency: z.string().default("USD"),
  vendorId: z.string().uuid(),
  vendorBillId: z.string().uuid().optional(),
  vendorAmount: z.number().positive(),
  vendorCurrency: z.string().default("USD"),
  linkageRuleId: z.string().uuid().optional(),
  linkageType: z.enum(["direct", "split", "net", "reroute"]),
  allocationPercentage: z.number().min(0).max(100).optional(),
  feeAmount: z.number().min(0).default(0),
  taxAmount: z.number().min(0).default(0),
})

const payoutInstructionSchema = z.object({
  runId: z.string().uuid(),
  vendorId: z.string().uuid(),
  vendorName: z.string().min(1),
  paymentMethod: z.enum(["bank_transfer", "ach", "wire", "check", "crypto"]),
  paymentDetails: z.record(z.any()),
  amount: z.number().positive(),
  currency: z.string().default("USD"),
  custodyPolicyId: z.string().uuid().optional(),
})

// =====================================================================================
// CONTEXT & UTILITIES
// =====================================================================================

export async function getPayOnPayContext() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  // Get tenant context
  const { data: tenantMember } = await supabase
    .from("tenant_members")
    .select("tenant_id")
    .eq("user_id", user.id)
    .single()

  if (!tenantMember) throw new Error("No tenant found")

  // Set tenant context for RLS
  await supabase.rpc("set_tenant_context", { tenant_id: tenantMember.tenant_id })

  return {
    userId: user.id,
    tenantId: tenantMember.tenant_id,
    supabase,
  }
}

// =====================================================================================
// SETTLEMENT RUNS
// =====================================================================================

export async function listSettlementRuns(filters?: {
  status?: string
  dateFrom?: string
  dateTo?: string
}) {
  try {
    const { supabase, tenantId } = await getPayOnPayContext()

    let query = supabase
      .from("settlement_runs")
      .select(`
        *,
        created_by_user:created_by(email, full_name),
        approved_by_user:approved_by(email, full_name)
      `)
      .eq("tenant_id", tenantId)
      .order("run_date", { ascending: false })

    if (filters?.status) {
      query = query.eq("status", filters.status)
    }
    if (filters?.dateFrom) {
      query = query.gte("run_date", filters.dateFrom)
    }
    if (filters?.dateTo) {
      query = query.lte("run_date", filters.dateTo)
    }

    const { data, error } = await query

    if (error) throw error

    return { success: true, data }
  } catch (error: any) {
    console.error("[v0] Error listing settlement runs:", error)
    return { success: false, error: error.message }
  }
}

export async function createSettlementRun(input: z.infer<typeof settlementRunSchema>) {
  try {
    const validated = settlementRunSchema.parse(input)
    const { supabase, tenantId, userId } = await getPayOnPayContext()

    // Generate run number
    const { data: runNumber } = await supabase.rpc("generate_settlement_run_number", { p_tenant_id: tenantId })

    const { data, error } = await supabase
      .from("settlement_runs")
      .insert({
        tenant_id: tenantId,
        run_number: runNumber,
        run_date: validated.runDate,
        linkage_policy: validated.linkagePolicy,
        notes: validated.notes,
        created_by: userId,
        status: "draft",
      })
      .select()
      .single()

    if (error) throw error

    // Audit log
    await logAudit({
      tenantId,
      userId,
      action: "create",
      entity: "settlement_run",
      entityId: data.id,
      metadata: { run_number: data.run_number },
    })

    revalidatePath("/finance/pay-on-pay")
    return { success: true, data }
  } catch (error: any) {
    console.error("[v0] Error creating settlement run:", error)
    return { success: false, error: error.message }
  }
}

export async function getSettlementRun(runId: string) {
  try {
    const { supabase, tenantId } = await getPayOnPayContext()

    const { data, error } = await supabase
      .from("settlement_runs")
      .select(`
        *,
        created_by_user:created_by(email, full_name),
        approved_by_user:approved_by(email, full_name),
        items:settlement_items(count),
        payouts:payout_instructions(count)
      `)
      .eq("id", runId)
      .eq("tenant_id", tenantId)
      .single()

    if (error) throw error

    return { success: true, data }
  } catch (error: any) {
    console.error("[v0] Error getting settlement run:", error)
    return { success: false, error: error.message }
  }
}

export async function updateSettlementRunStatus(runId: string, status: string) {
  try {
    const { supabase, tenantId, userId } = await getPayOnPayContext()

    const { data, error } = await supabase
      .from("settlement_runs")
      .update({
        status,
        ...(status === "approved" && { approved_by: userId, approved_at: new Date().toISOString() }),
        ...(status === "completed" && { completed_at: new Date().toISOString() }),
      })
      .eq("id", runId)
      .eq("tenant_id", tenantId)
      .select()
      .single()

    if (error) throw error

    // Audit log
    await logAudit({
      tenantId,
      userId,
      action: "update_status",
      entity: "settlement_run",
      entityId: runId,
      metadata: { status },
    })

    revalidatePath("/finance/pay-on-pay")
    return { success: true, data }
  } catch (error: any) {
    console.error("[v0] Error updating settlement run status:", error)
    return { success: false, error: error.message }
  }
}

export async function deleteSettlementRun(runId: string) {
  try {
    const { supabase, tenantId, userId } = await getPayOnPayContext()

    // Check if run can be deleted (only draft status)
    const { data: run } = await supabase
      .from("settlement_runs")
      .select("status")
      .eq("id", runId)
      .eq("tenant_id", tenantId)
      .single()

    if (run?.status !== "draft") {
      throw new Error("Only draft runs can be deleted")
    }

    const { error } = await supabase.from("settlement_runs").delete().eq("id", runId).eq("tenant_id", tenantId)

    if (error) throw error

    // Audit log
    await logAudit({
      tenantId,
      userId,
      action: "delete",
      entity: "settlement_run",
      entityId: runId,
    })

    revalidatePath("/finance/pay-on-pay")
    return { success: true }
  } catch (error: any) {
    console.error("[v0] Error deleting settlement run:", error)
    return { success: false, error: error.message }
  }
}

// =====================================================================================
// LINKAGE RULES
// =====================================================================================

export async function listLinkageRules(filters?: { isActive?: boolean }) {
  try {
    const { supabase, tenantId } = await getPayOnPayContext()

    let query = supabase
      .from("linkage_rules")
      .select("*")
      .eq("tenant_id", tenantId)
      .order("priority", { ascending: false })

    if (filters?.isActive !== undefined) {
      query = query.eq("is_active", filters.isActive)
    }

    const { data, error } = await query

    if (error) throw error

    return { success: true, data }
  } catch (error: any) {
    console.error("[v0] Error listing linkage rules:", error)
    return { success: false, error: error.message }
  }
}

export async function createLinkageRule(input: z.infer<typeof linkageRuleSchema>) {
  try {
    const validated = linkageRuleSchema.parse(input)
    const { supabase, tenantId, userId } = await getPayOnPayContext()

    const { data, error } = await supabase
      .from("linkage_rules")
      .insert({
        tenant_id: tenantId,
        rule_name: validated.ruleName,
        rule_type: validated.ruleType,
        priority: validated.priority,
        client_id: validated.clientId,
        vendor_id: validated.vendorId,
        project_id: validated.projectId,
        invoice_pattern: validated.invoicePattern,
        allocation_method: validated.allocationMethod,
        allocation_config: validated.allocationConfig,
        conditions: validated.conditions || {},
        created_by: userId,
      })
      .select()
      .single()

    if (error) throw error

    // Audit log
    await logAudit({
      tenantId,
      userId,
      action: "create",
      entity: "linkage_rule",
      entityId: data.id,
      metadata: { rule_name: data.rule_name },
    })

    revalidatePath("/finance/pay-on-pay")
    return { success: true, data }
  } catch (error: any) {
    console.error("[v0] Error creating linkage rule:", error)
    return { success: false, error: error.message }
  }
}

export async function updateLinkageRule(ruleId: string, input: Partial<z.infer<typeof linkageRuleSchema>>) {
  try {
    const { supabase, tenantId, userId } = await getPayOnPayContext()

    const updateData: any = {}
    if (input.ruleName) updateData.rule_name = input.ruleName
    if (input.ruleType) updateData.rule_type = input.ruleType
    if (input.priority !== undefined) updateData.priority = input.priority
    if (input.allocationMethod) updateData.allocation_method = input.allocationMethod
    if (input.allocationConfig) updateData.allocation_config = input.allocationConfig
    if (input.conditions) updateData.conditions = input.conditions

    const { data, error } = await supabase
      .from("linkage_rules")
      .update(updateData)
      .eq("id", ruleId)
      .eq("tenant_id", tenantId)
      .select()
      .single()

    if (error) throw error

    // Audit log
    await logAudit({
      tenantId,
      userId,
      action: "update",
      entity: "linkage_rule",
      entityId: ruleId,
      metadata: updateData,
    })

    revalidatePath("/finance/pay-on-pay")
    return { success: true, data }
  } catch (error: any) {
    console.error("[v0] Error updating linkage rule:", error)
    return { success: false, error: error.message }
  }
}

export async function toggleLinkageRule(ruleId: string, isActive: boolean) {
  try {
    const { supabase, tenantId, userId } = await getPayOnPayContext()

    const { data, error } = await supabase
      .from("linkage_rules")
      .update({ is_active: isActive })
      .eq("id", ruleId)
      .eq("tenant_id", tenantId)
      .select()
      .single()

    if (error) throw error

    // Audit log
    await logAudit({
      tenantId,
      userId,
      action: isActive ? "activate" : "deactivate",
      entity: "linkage_rule",
      entityId: ruleId,
    })

    revalidatePath("/finance/pay-on-pay")
    return { success: true, data }
  } catch (error: any) {
    console.error("[v0] Error toggling linkage rule:", error)
    return { success: false, error: error.message }
  }
}

export async function deleteLinkageRule(ruleId: string) {
  try {
    const { supabase, tenantId, userId } = await getPayOnPayContext()

    const { error } = await supabase.from("linkage_rules").delete().eq("id", ruleId).eq("tenant_id", tenantId)

    if (error) throw error

    // Audit log
    await logAudit({
      tenantId,
      userId,
      action: "delete",
      entity: "linkage_rule",
      entityId: ruleId,
    })

    revalidatePath("/finance/pay-on-pay")
    return { success: true }
  } catch (error: any) {
    console.error("[v0] Error deleting linkage rule:", error)
    return { success: false, error: error.message }
  }
}

// =====================================================================================
// SETTLEMENT ITEMS
// =====================================================================================

export async function listSettlementItems(runId: string) {
  try {
    const { supabase, tenantId } = await getPayOnPayContext()

    const { data, error } = await supabase
      .from("settlement_items")
      .select(`
        *,
        linkage_rule:linkage_rules(rule_name, rule_type),
        verified_by_user:verified_by(email, full_name)
      `)
      .eq("run_id", runId)
      .eq("tenant_id", tenantId)
      .order("created_at", { ascending: false })

    if (error) throw error

    return { success: true, data }
  } catch (error: any) {
    console.error("[v0] Error listing settlement items:", error)
    return { success: false, error: error.message }
  }
}

export async function createSettlementItem(input: z.infer<typeof settlementItemSchema>) {
  try {
    const validated = settlementItemSchema.parse(input)
    const { supabase, tenantId, userId } = await getPayOnPayContext()

    const { data, error } = await supabase
      .from("settlement_items")
      .insert({
        tenant_id: tenantId,
        run_id: validated.runId,
        client_invoice_id: validated.clientInvoiceId,
        client_receipt_id: validated.clientReceiptId,
        client_amount: validated.clientAmount,
        client_currency: validated.clientCurrency,
        vendor_id: validated.vendorId,
        vendor_bill_id: validated.vendorBillId,
        vendor_amount: validated.vendorAmount,
        vendor_currency: validated.vendorCurrency,
        linkage_rule_id: validated.linkageRuleId,
        linkage_type: validated.linkageType,
        allocation_percentage: validated.allocationPercentage,
        fee_amount: validated.feeAmount,
        tax_amount: validated.taxAmount,
        status: "pending",
      })
      .select()
      .single()

    if (error) throw error

    // Calculate Merkle leaf hash
    const { data: leafHash } = await supabase.rpc("calculate_merkle_leaf", { p_item_id: data.id })

    if (leafHash) {
      await supabase.from("settlement_items").update({ merkle_leaf_hash: leafHash }).eq("id", data.id)
    }

    // Update run totals
    await updateRunTotals(validated.runId)

    // Audit log
    await logAudit({
      tenantId,
      userId,
      action: "create",
      entity: "settlement_item",
      entityId: data.id,
      metadata: { run_id: validated.runId },
    })

    revalidatePath("/finance/pay-on-pay")
    return { success: true, data }
  } catch (error: any) {
    console.error("[v0] Error creating settlement item:", error)
    return { success: false, error: error.message }
  }
}

export async function verifySettlementItem(itemId: string, notes?: string) {
  try {
    const { supabase, tenantId, userId } = await getPayOnPayContext()

    const { data, error } = await supabase
      .from("settlement_items")
      .update({
        status: "approved",
        verified_by: userId,
        verified_at: new Date().toISOString(),
        verification_notes: notes,
      })
      .eq("id", itemId)
      .eq("tenant_id", tenantId)
      .select()
      .single()

    if (error) throw error

    // Audit log
    await logAudit({
      tenantId,
      userId,
      action: "verify",
      entity: "settlement_item",
      entityId: itemId,
    })

    revalidatePath("/finance/pay-on-pay")
    return { success: true, data }
  } catch (error: any) {
    console.error("[v0] Error verifying settlement item:", error)
    return { success: false, error: error.message }
  }
}

export async function deleteSettlementItem(itemId: string) {
  try {
    const { supabase, tenantId, userId } = await getPayOnPayContext()

    // Get run ID before deleting
    const { data: item } = await supabase.from("settlement_items").select("run_id").eq("id", itemId).single()

    const { error } = await supabase.from("settlement_items").delete().eq("id", itemId).eq("tenant_id", tenantId)

    if (error) throw error

    // Update run totals
    if (item?.run_id) {
      await updateRunTotals(item.run_id)
    }

    // Audit log
    await logAudit({
      tenantId,
      userId,
      action: "delete",
      entity: "settlement_item",
      entityId: itemId,
    })

    revalidatePath("/finance/pay-on-pay")
    return { success: true }
  } catch (error: any) {
    console.error("[v0] Error deleting settlement item:", error)
    return { success: false, error: error.message }
  }
}

// Helper function to update run totals
async function updateRunTotals(runId: string) {
  const { supabase, tenantId } = await getPayOnPayContext()

  const { data: items } = await supabase
    .from("settlement_items")
    .select("client_amount, vendor_amount, fee_amount, tax_amount")
    .eq("run_id", runId)
    .eq("tenant_id", tenantId)

  if (!items) return

  const totals = items.reduce(
    (acc, item) => ({
      totalClientReceipts: acc.totalClientReceipts + Number(item.client_amount),
      totalVendorPayouts: acc.totalVendorPayouts + Number(item.vendor_amount),
      totalFees: acc.totalFees + Number(item.fee_amount),
      totalTaxes: acc.totalTaxes + Number(item.tax_amount),
    }),
    { totalClientReceipts: 0, totalVendorPayouts: 0, totalFees: 0, totalTaxes: 0 },
  )

  const netAmount = totals.totalClientReceipts - totals.totalVendorPayouts - totals.totalFees - totals.totalTaxes

  await supabase
    .from("settlement_runs")
    .update({
      total_client_receipts: totals.totalClientReceipts,
      total_vendor_payouts: totals.totalVendorPayouts,
      total_fees: totals.totalFees,
      total_taxes: totals.totalTaxes,
      net_amount: netAmount,
    })
    .eq("id", runId)
    .eq("tenant_id", tenantId)
}

// =====================================================================================
// PAYOUT INSTRUCTIONS
// =====================================================================================

export async function listPayoutInstructions(runId: string) {
  try {
    const { supabase, tenantId } = await getPayOnPayContext()

    const { data, error } = await supabase
      .from("payout_instructions")
      .select("*")
      .eq("run_id", runId)
      .eq("tenant_id", tenantId)
      .order("created_at", { ascending: false })

    if (error) throw error

    return { success: true, data }
  } catch (error: any) {
    console.error("[v0] Error listing payout instructions:", error)
    return { success: false, error: error.message }
  }
}

export async function createPayoutInstruction(input: z.infer<typeof payoutInstructionSchema>) {
  try {
    const validated = payoutInstructionSchema.parse(input)
    const { supabase, tenantId, userId } = await getPayOnPayContext()

    const { data, error } = await supabase
      .from("payout_instructions")
      .insert({
        tenant_id: tenantId,
        run_id: validated.runId,
        vendor_id: validated.vendorId,
        vendor_name: validated.vendorName,
        payment_method: validated.paymentMethod,
        payment_details: validated.paymentDetails,
        amount: validated.amount,
        currency: validated.currency,
        custody_policy_id: validated.custodyPolicyId,
        status: "pending",
      })
      .select()
      .single()

    if (error) throw error

    // Audit log
    await logAudit({
      tenantId,
      userId,
      action: "create",
      entity: "payout_instruction",
      entityId: data.id,
      metadata: { vendor_id: validated.vendorId, amount: validated.amount },
    })

    revalidatePath("/finance/pay-on-pay")
    return { success: true, data }
  } catch (error: any) {
    console.error("[v0] Error creating payout instruction:", error)
    return { success: false, error: error.message }
  }
}

export async function submitPayoutForSigning(payoutId: string) {
  try {
    const { supabase, tenantId, userId } = await getPayOnPayContext()

    // In production, this would initiate MPC/TSS signing
    // For now, we'll simulate the process
    const tssRequestId = `tss_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    const { data, error } = await supabase
      .from("payout_instructions")
      .update({
        status: "signing",
        tss_request_id: tssRequestId,
      })
      .eq("id", payoutId)
      .eq("tenant_id", tenantId)
      .select()
      .single()

    if (error) throw error

    // Audit log
    await logAudit({
      tenantId,
      userId,
      action: "submit_for_signing",
      entity: "payout_instruction",
      entityId: payoutId,
      metadata: { tss_request_id: tssRequestId },
    })

    revalidatePath("/finance/pay-on-pay")
    return { success: true, data }
  } catch (error: any) {
    console.error("[v0] Error submitting payout for signing:", error)
    return { success: false, error: error.message }
  }
}

export async function updatePayoutStatus(payoutId: string, status: string, metadata?: any) {
  try {
    const { supabase, tenantId, userId } = await getPayOnPayContext()

    const updateData: any = { status }

    if (status === "signed") {
      updateData.signed_at = new Date().toISOString()
    } else if (status === "submitted") {
      updateData.submitted_at = new Date().toISOString()
    } else if (status === "completed") {
      updateData.completed_at = new Date().toISOString()
    } else if (status === "failed") {
      updateData.failed_at = new Date().toISOString()
      if (metadata?.reason) updateData.failure_reason = metadata.reason
    }

    if (metadata) {
      updateData.provider_response = metadata
    }

    const { data, error } = await supabase
      .from("payout_instructions")
      .update(updateData)
      .eq("id", payoutId)
      .eq("tenant_id", tenantId)
      .select()
      .single()

    if (error) throw error

    // Audit log
    await logAudit({
      tenantId,
      userId,
      action: "update_status",
      entity: "payout_instruction",
      entityId: payoutId,
      metadata: { status },
    })

    revalidatePath("/finance/pay-on-pay")
    return { success: true, data }
  } catch (error: any) {
    console.error("[v0] Error updating payout status:", error)
    return { success: false, error: error.message }
  }
}

// =====================================================================================
// BLOCKCHAIN ANCHORING
// =====================================================================================

export async function anchorSettlementRun(runId: string) {
  try {
    const { supabase, tenantId, userId } = await getPayOnPayContext()

    // Get all settlement items for this run
    const { data: items } = await supabase
      .from("settlement_items")
      .select("merkle_leaf_hash")
      .eq("run_id", runId)
      .eq("tenant_id", tenantId)

    if (!items || items.length === 0) {
      throw new Error("No items to anchor")
    }

    // Build Merkle tree (simplified - in production use proper Merkle tree library)
    const leaves = items.map((item) => item.merkle_leaf_hash).filter(Boolean)
    const merkleRoot = leaves.join("") // Simplified - should be proper Merkle root calculation

    // In production, this would:
    // 1. Build proper Merkle tree
    // 2. Generate ZK-proof if enabled
    // 3. Store encrypted batch to IPFS/S3
    // 4. Submit transaction to blockchain
    // 5. Wait for confirmation

    // Simulate blockchain transaction
    const txHash = `0x${Math.random().toString(16).substr(2, 64)}`
    const artifactCid = `Qm${Math.random().toString(36).substr(2, 44)}`

    // Create blockchain anchor record
    const { data: anchor, error: anchorError } = await supabase
      .from("blockchain_anchors")
      .insert({
        tenant_id: tenantId,
        run_id: runId,
        merkle_root: merkleRoot,
        leaf_count: leaves.length,
        chain_id: "polygon",
        contract_address: "0x1234567890123456789012345678901234567890",
        transaction_hash: txHash,
        artifact_cid: artifactCid,
        status: "confirmed",
        confirmations: 12,
      })
      .select()
      .single()

    if (anchorError) throw anchorError

    // Update settlement run with anchor info
    const { error: runError } = await supabase
      .from("settlement_runs")
      .update({
        anchor_root: merkleRoot,
        anchor_tx: txHash,
        artifact_cid: artifactCid,
        anchor_status: "anchored",
        anchored_at: new Date().toISOString(),
      })
      .eq("id", runId)
      .eq("tenant_id", tenantId)

    if (runError) throw runError

    // Audit log
    await logAudit({
      tenantId,
      userId,
      action: "anchor",
      entity: "settlement_run",
      entityId: runId,
      metadata: { tx_hash: txHash, merkle_root: merkleRoot },
    })

    revalidatePath("/finance/pay-on-pay")
    return { success: true, data: anchor }
  } catch (error: any) {
    console.error("[v0] Error anchoring settlement run:", error)
    return { success: false, error: error.message }
  }
}

export async function verifyBlockchainAnchor(runId: string) {
  try {
    const { supabase, tenantId } = await getPayOnPayContext()

    const { data: anchor, error } = await supabase
      .from("blockchain_anchors")
      .select("*")
      .eq("run_id", runId)
      .eq("tenant_id", tenantId)
      .single()

    if (error) throw error

    // In production, this would verify the transaction on-chain
    // For now, return the anchor data
    return { success: true, data: anchor, verified: true }
  } catch (error: any) {
    console.error("[v0] Error verifying blockchain anchor:", error)
    return { success: false, error: error.message }
  }
}

// =====================================================================================
// AI SUGGESTIONS
// =====================================================================================

export async function generateAllocationSuggestion(runId: string, clientInvoiceId: string) {
  try {
    const { supabase, tenantId, userId } = await getPayOnPayContext()

    // In production, this would:
    // 1. Retrieve historical allocation patterns
    // 2. Use RAG to find similar invoices
    // 3. Call LLM to generate suggestion
    // 4. Return suggestion with provenance

    // Simulate AI suggestion
    const suggestion = {
      allocations: [
        { vendor_id: "vendor_1", percentage: 60, reasoning: "Primary contractor" },
        { vendor_id: "vendor_2", percentage: 40, reasoning: "Subcontractor" },
      ],
      confidence: 0.85,
      reasoning: "Based on historical patterns for similar projects",
    }

    const { data, error } = await supabase
      .from("ai_suggestions")
      .insert({
        tenant_id: tenantId,
        run_id: runId,
        suggestion_type: "allocation",
        input_data: { client_invoice_id: clientInvoiceId },
        suggestion,
        confidence: 0.85,
        reasoning: suggestion.reasoning,
        model_name: "gpt-4",
        model_version: "2024-01",
        status: "pending",
      })
      .select()
      .single()

    if (error) throw error

    // Audit log
    await logAudit({
      tenantId,
      userId,
      action: "generate_suggestion",
      entity: "ai_suggestion",
      entityId: data.id,
      metadata: { type: "allocation" },
    })

    return { success: true, data }
  } catch (error: any) {
    console.error("[v0] Error generating allocation suggestion:", error)
    return { success: false, error: error.message }
  }
}

export async function detectAnomalies(runId: string) {
  try {
    const { supabase, tenantId, userId } = await getPayOnPayContext()

    // In production, this would:
    // 1. Analyze settlement items for anomalies
    // 2. Check for duplicate linkages
    // 3. Verify sum correctness
    // 4. Flag suspicious patterns

    // Simulate anomaly detection
    const anomalies = [
      {
        type: "amount_mismatch",
        severity: "high",
        description: "Client amount significantly higher than vendor payout",
        item_id: "item_123",
      },
    ]

    const { data, error } = await supabase
      .from("ai_suggestions")
      .insert({
        tenant_id: tenantId,
        run_id: runId,
        suggestion_type: "anomaly",
        input_data: { run_id: runId },
        suggestion: { anomalies },
        confidence: 0.92,
        reasoning: "Statistical analysis of settlement patterns",
        model_name: "anomaly-detector-v1",
        status: "pending",
      })
      .select()
      .single()

    if (error) throw error

    // Audit log
    await logAudit({
      tenantId,
      userId,
      action: "detect_anomalies",
      entity: "ai_suggestion",
      entityId: data.id,
      metadata: { anomaly_count: anomalies.length },
    })

    return { success: true, data }
  } catch (error: any) {
    console.error("[v0] Error detecting anomalies:", error)
    return { success: false, error: error.message }
  }
}

// =====================================================================================
// DISPUTES
// =====================================================================================

export async function createDispute(input: {
  runId: string
  itemId?: string
  disputeType: string
  description: string
  expectedAmount?: number
  actualAmount?: number
}) {
  try {
    const { supabase, tenantId, userId } = await getPayOnPayContext()

    const { data, error } = await supabase
      .from("settlement_disputes")
      .insert({
        tenant_id: tenantId,
        run_id: input.runId,
        item_id: input.itemId,
        dispute_type: input.disputeType,
        description: input.description,
        expected_amount: input.expectedAmount,
        actual_amount: input.actualAmount,
        raised_by: userId,
        status: "open",
      })
      .select()
      .single()

    if (error) throw error

    // Audit log
    await logAudit({
      tenantId,
      userId,
      action: "create",
      entity: "settlement_dispute",
      entityId: data.id,
      metadata: { dispute_type: input.disputeType },
    })

    revalidatePath("/finance/pay-on-pay")
    return { success: true, data }
  } catch (error: any) {
    console.error("[v0] Error creating dispute:", error)
    return { success: false, error: error.message }
  }
}

export async function resolveDispute(disputeId: string, resolution: string) {
  try {
    const { supabase, tenantId, userId } = await getPayOnPayContext()

    const { data, error } = await supabase
      .from("settlement_disputes")
      .update({
        status: "resolved",
        resolution,
        resolved_by: userId,
        resolved_at: new Date().toISOString(),
      })
      .eq("id", disputeId)
      .eq("tenant_id", tenantId)
      .select()
      .single()

    if (error) throw error

    // Audit log
    await logAudit({
      tenantId,
      userId,
      action: "resolve",
      entity: "settlement_dispute",
      entityId: disputeId,
    })

    revalidatePath("/finance/pay-on-pay")
    return { success: true, data }
  } catch (error: any) {
    console.error("[v0] Error resolving dispute:", error)
    return { success: false, error: error.message }
  }
}

// =====================================================================================
// ANALYTICS
// =====================================================================================

export async function getPayOnPayAnalytics(dateFrom?: string, dateTo?: string) {
  try {
    const { supabase, tenantId } = await getPayOnPayContext()

    // Get settlement runs in date range
    let query = supabase.from("settlement_runs").select("*").eq("tenant_id", tenantId)

    if (dateFrom) query = query.gte("run_date", dateFrom)
    if (dateTo) query = query.lte("run_date", dateTo)

    const { data: runs, error } = await query

    if (error) throw error

    // Calculate analytics
    const analytics = {
      totalRuns: runs.length,
      completedRuns: runs.filter((r) => r.status === "completed").length,
      totalClientReceipts: runs.reduce((sum, r) => sum + Number(r.total_client_receipts || 0), 0),
      totalVendorPayouts: runs.reduce((sum, r) => sum + Number(r.total_vendor_payouts || 0), 0),
      totalFees: runs.reduce((sum, r) => sum + Number(r.total_fees || 0), 0),
      totalTaxes: runs.reduce((sum, r) => sum + Number(r.total_taxes || 0), 0),
      netAmount: runs.reduce((sum, r) => sum + Number(r.net_amount || 0), 0),
      anchoredRuns: runs.filter((r) => r.anchor_status === "anchored").length,
      avgProcessingTime: 0, // Calculate from timestamps
    }

    return { success: true, data: analytics }
  } catch (error: any) {
    console.error("[v0] Error getting analytics:", error)
    return { success: false, error: error.message }
  }
}

// Export for use in components
export async function getSettlementRunDetail(runId: string) {
  try {
    const { supabase, tenantId } = await getPayOnPayContext()

    const { data: run, error: runError } = await supabase
      .from("settlement_runs")
      .select(`
        *,
        created_by_user:created_by(email, full_name),
        approved_by_user:approved_by(email, full_name)
      `)
      .eq("id", runId)
      .eq("tenant_id", tenantId)
      .single()

    if (runError) throw runError

    const { data: items } = await supabase
      .from("settlement_items")
      .select("*")
      .eq("run_id", runId)
      .eq("tenant_id", tenantId)

    const { data: payouts } = await supabase
      .from("payout_instructions")
      .select("*")
      .eq("run_id", runId)
      .eq("tenant_id", tenantId)

    const { data: anchor } = await supabase
      .from("blockchain_anchors")
      .select("*")
      .eq("run_id", runId)
      .eq("tenant_id", tenantId)
      .single()

    const { data: disputes } = await supabase
      .from("settlement_disputes")
      .select("*")
      .eq("run_id", runId)
      .eq("tenant_id", tenantId)

    return {
      success: true,
      data: {
        run,
        items: items || [],
        payouts: payouts || [],
        anchor,
        disputes: disputes || [],
      },
    }
  } catch (error: any) {
    console.error("[v0] Error getting settlement run detail:", error)
    return { success: false, error: error.message }
  }
}
