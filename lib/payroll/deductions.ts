"use server"

import { createServerClient } from "@/lib/supabase/server"

export type DeductionMapping = {
  planType: string
  providerKey: string
  code: string
  type: "PRETAX" | "POSTTAX"
}

/**
 * Default deduction mappings by provider
 */
const DEDUCTION_MAPPINGS: Record<string, DeductionMapping[]> = {
  adp: [
    { planType: "MEDICAL", providerKey: "adp", code: "MED", type: "PRETAX" },
    { planType: "DENTAL", providerKey: "adp", code: "DEN", type: "PRETAX" },
    { planType: "VISION", providerKey: "adp", code: "VIS", type: "PRETAX" },
    { planType: "LIFE", providerKey: "adp", code: "LIFE", type: "POSTTAX" },
    { planType: "DISABILITY", providerKey: "adp", code: "DIS", type: "POSTTAX" },
    { planType: "FSA", providerKey: "adp", code: "FSA", type: "PRETAX" },
    { planType: "HSA", providerKey: "adp", code: "HSA", type: "PRETAX" },
    { planType: "COMMUTER", providerKey: "adp", code: "COM", type: "PRETAX" },
  ],
  gusto: [
    { planType: "MEDICAL", providerKey: "gusto", code: "HEALTH", type: "PRETAX" },
    { planType: "DENTAL", providerKey: "gusto", code: "DENTAL", type: "PRETAX" },
    { planType: "VISION", providerKey: "gusto", code: "VISION", type: "PRETAX" },
    { planType: "LIFE", providerKey: "gusto", code: "LIFE_INS", type: "POSTTAX" },
    { planType: "DISABILITY", providerKey: "gusto", code: "DISABILITY", type: "POSTTAX" },
    { planType: "FSA", providerKey: "gusto", code: "FSA", type: "PRETAX" },
    { planType: "HSA", providerKey: "gusto", code: "HSA", type: "PRETAX" },
    { planType: "COMMUTER", providerKey: "gusto", code: "COMMUTER", type: "PRETAX" },
  ],
}

/**
 * Get deduction code for a plan type and provider
 */
export async function getDeductionCode(planType: string, providerKey: string): Promise<DeductionMapping | null> {
  const mappings = DEDUCTION_MAPPINGS[providerKey]
  if (!mappings) return null

  return mappings.find((m) => m.planType === planType) || null
}

/**
 * Sync enrollment to payroll deductions
 */
export async function syncEnrollmentToPayroll(enrollmentId: string) {
  const supabase = await createServerClient()

  // Get enrollment with plan details
  const { data: enrollment, error: enrollError } = await supabase
    .from("enrollments")
    .select(`
      *,
      plan:plans(*),
      employee:employees(*)
    `)
    .eq("id", enrollmentId)
    .single()

  if (enrollError || !enrollment) {
    console.error("[v0] syncEnrollmentToPayroll error:", enrollError)
    throw new Error("Failed to fetch enrollment")
  }

  // Only sync APPROVED enrollments
  if (enrollment.status !== "APPROVED") {
    return { success: false, message: "Enrollment not approved" }
  }

  // Get active payroll provider
  const { data: provider, error: providerError } = await supabase
    .from("providers")
    .select("*")
    .eq("active", true)
    .single()

  if (providerError || !provider) {
    console.error("[v0] syncEnrollmentToPayroll provider error:", providerError)
    throw new Error("No active payroll provider found")
  }

  // Get deduction mapping
  const mapping = await getDeductionCode(enrollment.plan.type, provider.key)
  if (!mapping) {
    return { success: false, message: `No deduction mapping for ${enrollment.plan.type}` }
  }

  // Check if deduction already exists
  const { data: existing } = await supabase
    .from("deductions")
    .select("*")
    .eq("enrollment_id", enrollmentId)
    .maybeSingle()

  if (existing) {
    // Update existing deduction
    const { error: updateError } = await supabase
      .from("deductions")
      .update({
        amount: enrollment.employee_cost,
        start_date: enrollment.coverage_start,
        end_date: enrollment.coverage_end,
        updated_at: new Date().toISOString(),
      })
      .eq("id", existing.id)

    if (updateError) {
      console.error("[v0] syncEnrollmentToPayroll update error:", updateError)
      throw new Error("Failed to update deduction")
    }

    return { success: true, deductionId: existing.id, action: "updated" }
  } else {
    // Create new deduction
    const { data: newDeduction, error: insertError } = await supabase
      .from("deductions")
      .insert({
        tenant_id: enrollment.tenant_id,
        employee_id: enrollment.employee_id,
        provider_key: provider.key,
        code: mapping.code,
        amount: enrollment.employee_cost,
        type: mapping.type,
        start_date: enrollment.coverage_start,
        end_date: enrollment.coverage_end,
        source: "BENEFITS",
        enrollment_id: enrollmentId,
      })
      .select()
      .single()

    if (insertError) {
      console.error("[v0] syncEnrollmentToPayroll insert error:", insertError)
      throw new Error("Failed to create deduction")
    }

    return { success: true, deductionId: newDeduction.id, action: "created" }
  }
}

/**
 * Terminate deduction when enrollment ends
 */
export async function terminateDeduction(enrollmentId: string, endDate: string) {
  const supabase = await createServerClient()

  const { error } = await supabase
    .from("deductions")
    .update({
      end_date: endDate,
      updated_at: new Date().toISOString(),
    })
    .eq("enrollment_id", enrollmentId)

  if (error) {
    console.error("[v0] terminateDeduction error:", error)
    throw new Error("Failed to terminate deduction")
  }

  return { success: true }
}
