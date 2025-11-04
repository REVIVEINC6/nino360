"use server"

import { createServerClient } from "@/lib/supabase/server"

export type Band = {
  id: string
  tenant_id: string
  job_family: string
  grade: string
  level: string
  region: string
  currency: string
  min_amount: number
  mid_amount: number
  max_amount: number
  effective_date: string
  expires_date: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export type Cycle = {
  id: string
  tenant_id: string
  key: string
  name: string
  kind: "ANNUAL" | "MIDYEAR" | "OFFCYCLE"
  status: "DRAFT" | "PUBLISHED" | "OPEN" | "LOCKED" | "FINALIZED" | "ARCHIVED"
  period_from: string
  period_to: string
  budget_total: number | null
  budget_currency: string
  guidelines: any
  eligibility_rule: any
  exchange_rate_date: string | null
  created_at: string
  updated_at: string
}

export type Proposal = {
  id: string
  tenant_id: string
  cycle_id: string
  employee_id: string
  current_base: number | null
  current_variable: number | null
  current_currency: string
  current_band: string | null
  compa_ratio: number | null
  range_penetration: number | null
  proposed_merit_pct: number
  proposed_merit_amount: number
  market_adjustment: number
  promotion_pct: number
  promotion_new_band: string | null
  lump_sum: number
  bonus_target_pct: number | null
  bonus_amount: number | null
  stock_units: number | null
  stock_type: string | null
  vesting: any
  effective_date: string | null
  reason: string | null
  exception_reason: string | null
  status: "DRAFT" | "SUBMITTED" | "APPROVED" | "REJECTED"
  created_at: string
  updated_at: string
}

/**
 * Get all bands for tenant
 */
export async function getBands() {
  const supabase = await createServerClient()

  const { data, error } = await supabase
    .from("comp_bands")
    .select("*")
    .order("job_family", { ascending: true })
    .order("grade", { ascending: true })
    .order("level", { ascending: true })

  if (error) {
    console.error("[v0] getBands error:", error)
    throw new Error("Failed to fetch bands")
  }

  return data as Band[]
}

/**
 * Get all cycles for tenant
 */
export async function getCycles() {
  const supabase = await createServerClient()

  const { data, error } = await supabase.from("comp_cycles").select("*").order("period_from", { ascending: false })

  if (error) {
    console.error("[v0] getCycles error:", error)
    throw new Error("Failed to fetch cycles")
  }

  return data as Cycle[]
}

/**
 * Get cycle by ID
 */
export async function getCycleById(cycleId: string) {
  const supabase = await createServerClient()

  const { data, error } = await supabase.from("comp_cycles").select("*").eq("id", cycleId).single()

  if (error) {
    console.error("[v0] getCycleById error:", error)
    throw new Error("Failed to fetch cycle")
  }

  return data as Cycle
}

/**
 * Get proposals for a cycle
 */
export async function getProposals(cycleId: string) {
  const supabase = await createServerClient()

  const { data, error } = await supabase
    .from("comp_proposals")
    .select(`
      *,
      employee:hr_employees(id, employee_no, first_name, last_name, email)
    `)
    .eq("cycle_id", cycleId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("[v0] getProposals error:", error)
    throw new Error("Failed to fetch proposals")
  }

  return data as (Proposal & { employee: any })[]
}

/**
 * Calculate compa ratio
 */
export async function calculateCompaRatio(currentBase: number, bandMid: number): Promise<number> {
  if (!bandMid || bandMid === 0) return 0
  return Math.round((currentBase / bandMid) * 100 * 100) / 100
}

/**
 * Calculate range penetration
 */
export async function calculateRangePenetration(
  currentBase: number,
  bandMin: number,
  bandMax: number,
): Promise<number> {
  if (!bandMin || !bandMax || bandMax === bandMin) return 0
  return Math.round(((currentBase - bandMin) / (bandMax - bandMin)) * 100 * 100) / 100
}

/**
 * Apply merit matrix recommendation
 */
export async function applyMeritMatrix(rating: number, compaRatio: number, guidelines: any): Promise<number> {
  // Stub: return recommended merit % based on rating and compa ratio
  // In production, this would look up the matrix from guidelines
  if (rating >= 4 && compaRatio < 90) return 5.0
  if (rating >= 4 && compaRatio < 100) return 4.0
  if (rating >= 3 && compaRatio < 90) return 3.5
  if (rating >= 3 && compaRatio < 100) return 3.0
  return 2.0
}
