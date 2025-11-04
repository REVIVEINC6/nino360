"use server"

import { createServerClient } from "@/lib/supabase/server"

export type Plan = {
  id: string
  tenant_id: string
  key: string
  name: string
  type: string
  carrier_id: string | null
  region: string | null
  currency: string
  waiting_period_days: number
  calc_rule: any
  effective_from: string
  effective_to: string | null
  active: boolean
  created_at: string
  updated_at: string
}

export type PlanOption = {
  id: string
  tenant_id: string
  plan_id: string
  coverage_tier: string
  network: string | null
  hsa_eligible: boolean
  class_key: string | null
  created_at: string
  updated_at: string
}

export type RateCard = {
  id: string
  tenant_id: string
  plan_id: string
  option_id: string
  effective_from: string
  effective_to: string | null
  rule: any
  created_at: string
  updated_at: string
}

export type Dependent = {
  id: string
  tenant_id: string
  employee_id: string
  first_name: string
  last_name: string
  relationship: string
  dob: string
  gender: string | null
  ssn_last4: string | null
  tobacco_user: boolean
  disabled: boolean
  created_at: string
  updated_at: string
}

export type Enrollment = {
  id: string
  tenant_id: string
  employee_id: string
  plan_id: string
  option_id: string
  event_id: string | null
  coverage_start: string
  coverage_end: string | null
  status: string
  employee_cost: number
  employer_cost: number
  currency: string
  confirmation_doc_id: string | null
  created_at: string
  updated_at: string
}

export type BenefitsEvent = {
  id: string
  tenant_id: string
  employee_id: string
  kind: string
  qle_type: string | null
  event_date: string
  window_ends: string
  status: string
  created_at: string
  updated_at: string
}

export type EdiRun = {
  id: string
  tenant_id: string
  carrier_id: string
  file_url: string | null
  control_no: string | null
  period_from: string
  period_to: string
  status: string
  ack_notes: string | null
  sha256: string | null
  created_at: string
  updated_at: string
}

/**
 * Get all active plans with options and rates
 */
export async function getActivePlans(filters?: {
  type?: string
  region?: string
  effectiveDate?: string
}) {
  const supabase = await createServerClient()

  let query = supabase
    .from("plans")
    .select(`
      *,
      carrier:carriers(*),
      options:plan_options(*),
      rates:rate_cards(*)
    `)
    .eq("active", true)

  if (filters?.type) {
    query = query.eq("type", filters.type)
  }

  if (filters?.region) {
    query = query.eq("region", filters.region)
  }

  if (filters?.effectiveDate) {
    query = query
      .lte("effective_from", filters.effectiveDate)
      .or(`effective_to.is.null,effective_to.gte.${filters.effectiveDate}`)
  }

  const { data, error } = await query

  if (error) {
    console.error("[v0] getActivePlans error:", error)
    throw new Error("Failed to fetch plans")
  }

  return data
}

/**
 * Get employee enrollments
 */
export async function getEmployeeEnrollments(employeeId: string) {
  const supabase = await createServerClient()

  const { data, error } = await supabase
    .from("enrollments")
    .select(`
      *,
      plan:plans(*),
      option:plan_options(*),
      event:events(*),
      lines:enrollment_lines(*, dependent:dependents(*))
    `)
    .eq("employee_id", employeeId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("[v0] getEmployeeEnrollments error:", error)
    throw new Error("Failed to fetch enrollments")
  }

  return data
}

/**
 * Get employee dependents
 */
export async function getEmployeeDependents(employeeId: string) {
  const supabase = await createServerClient()

  const { data, error } = await supabase
    .from("dependents")
    .select("*")
    .eq("employee_id", employeeId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("[v0] getEmployeeDependents error:", error)
    throw new Error("Failed to fetch dependents")
  }

  return data
}

/**
 * Get open enrollment events
 */
export async function getOpenEvents(employeeId?: string) {
  const supabase = await createServerClient()

  let query = supabase
    .from("events")
    .select(`
      *,
      employee:employees(*),
      evidence:evidence(*, document:documents(*))
    `)
    .eq("status", "OPEN")
    .gte("window_ends", new Date().toISOString().split("T")[0])

  if (employeeId) {
    query = query.eq("employee_id", employeeId)
  }

  const { data, error } = await query.order("window_ends", { ascending: true })

  if (error) {
    console.error("[v0] getOpenEvents error:", error)
    throw new Error("Failed to fetch events")
  }

  return data
}

/**
 * Get EDI runs
 */
export async function getEdiRuns(carrierId?: string) {
  const supabase = await createServerClient()

  let query = supabase.from("edi_runs").select(`
      *,
      carrier:carriers(*)
    `)

  if (carrierId) {
    query = query.eq("carrier_id", carrierId)
  }

  const { data, error } = await query.order("created_at", { ascending: false })

  if (error) {
    console.error("[v0] getEdiRuns error:", error)
    throw new Error("Failed to fetch EDI runs")
  }

  return data
}

/**
 * Get payroll deductions
 */
export async function getPayrollDeductions(employeeId?: string) {
  const supabase = await createServerClient()

  let query = supabase.from("deductions").select(`
      *,
      employee:employees(*),
      enrollment:enrollments(*, plan:plans(*))
    `)

  if (employeeId) {
    query = query.eq("employee_id", employeeId)
  }

  const { data, error } = await query.order("created_at", { ascending: false })

  if (error) {
    console.error("[v0] getPayrollDeductions error:", error)
    throw new Error("Failed to fetch deductions")
  }

  return data
}
