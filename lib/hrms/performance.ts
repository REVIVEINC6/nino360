"use server"

import { createServerClient } from "@/lib/supabase/server"

export async function getCycles(filters?: { status?: string }) {
  const supabase = await createServerClient()

  let query = supabase.from("perf_cycles").select("*").order("period_from", { ascending: false })

  if (filters?.status) {
    query = query.eq("status", filters.status)
  }

  const { data, error } = await query

  if (error) {
    console.error("[v0] getCycles error:", error)
    throw new Error("Failed to fetch cycles")
  }

  return data
}

export async function getCycle(id: string) {
  const supabase = await createServerClient()

  const { data, error } = await supabase.from("perf_cycles").select("*").eq("id", id).single()

  if (error) {
    console.error("[v0] getCycle error:", error)
    throw new Error("Failed to fetch cycle")
  }

  return data
}

export async function getReviews(filters?: {
  cycleId?: string
  employeeId?: string
  managerId?: string
  status?: string
}) {
  const supabase = await createServerClient()

  let query = supabase
    .from("perf_reviews")
    .select(
      `
      *,
      employee:hrms_employees!employee_id(id, employee_no, first_name, last_name),
      manager:hrms_employees!manager_id(id, employee_no, first_name, last_name)
    `,
    )
    .order("created_at", { ascending: false })

  if (filters?.cycleId) {
    query = query.eq("cycle_id", filters.cycleId)
  }
  if (filters?.employeeId) {
    query = query.eq("employee_id", filters.employeeId)
  }
  if (filters?.managerId) {
    query = query.eq("manager_id", filters.managerId)
  }
  if (filters?.status) {
    query = query.eq("status", filters.status)
  }

  const { data, error } = await query

  if (error) {
    console.error("[v0] getReviews error:", error)
    throw new Error("Failed to fetch reviews")
  }

  return data
}

export async function getReview(id: string) {
  const supabase = await createServerClient()

  const { data, error } = await supabase
    .from("perf_reviews")
    .select(
      `
      *,
      employee:hrms_employees!employee_id(id, employee_no, first_name, last_name, email),
      manager:hrms_employees!manager_id(id, employee_no, first_name, last_name, email),
      cycle:perf_cycles(id, key, name, rating_scale, competencies, weights)
    `,
    )
    .eq("id", id)
    .single()

  if (error) {
    console.error("[v0] getReview error:", error)
    throw new Error("Failed to fetch review")
  }

  return data
}

export async function getGoals(filters?: { employeeId?: string; cycleId?: string; status?: string }) {
  const supabase = await createServerClient()

  let query = supabase
    .from("perf_goals")
    .select(
      `
      *,
      employee:hrms_employees(id, employee_no, first_name, last_name),
      parent:perf_goals!alignment_id(id, title)
    `,
    )
    .order("created_at", { ascending: false })

  if (filters?.employeeId) {
    query = query.eq("employee_id", filters.employeeId)
  }
  if (filters?.cycleId) {
    query = query.eq("cycle_id", filters.cycleId)
  }
  if (filters?.status) {
    query = query.eq("status", filters.status)
  }

  const { data, error } = await query

  if (error) {
    console.error("[v0] getGoals error:", error)
    throw new Error("Failed to fetch goals")
  }

  return data
}

export async function getFeedback(filters?: { subjectEmployeeId?: string; reviewId?: string; status?: string }) {
  const supabase = await createServerClient()

  let query = supabase
    .from("perf_feedback")
    .select(
      `
      *,
      requester:hrms_employees!requester_id(id, employee_no, first_name, last_name),
      subject:hrms_employees!subject_employee_id(id, employee_no, first_name, last_name),
      respondent:hrms_employees!respondent_id(id, employee_no, first_name, last_name)
    `,
    )
    .order("requested_at", { ascending: false })

  if (filters?.subjectEmployeeId) {
    query = query.eq("subject_employee_id", filters.subjectEmployeeId)
  }
  if (filters?.reviewId) {
    query = query.eq("review_id", filters.reviewId)
  }
  if (filters?.status) {
    query = query.eq("status", filters.status)
  }

  const { data, error } = await query

  if (error) {
    console.error("[v0] getFeedback error:", error)
    throw new Error("Failed to fetch feedback")
  }

  return data
}

export async function getCalibrationPools(filters?: { cycleId?: string; status?: string }) {
  const supabase = await createServerClient()

  let query = supabase
    .from("perf_calibration_pools")
    .select(
      `
      *,
      owner:hrms_employees(id, employee_no, first_name, last_name),
      items:perf_calibration_items(
        id,
        performance,
        potential,
        coordinates,
        employee:hrms_employees(id, employee_no, first_name, last_name)
      )
    `,
    )
    .order("created_at", { ascending: false })

  if (filters?.cycleId) {
    query = query.eq("cycle_id", filters.cycleId)
  }
  if (filters?.status) {
    query = query.eq("status", filters.status)
  }

  const { data, error } = await query

  if (error) {
    console.error("[v0] getCalibrationPools error:", error)
    throw new Error("Failed to fetch calibration pools")
  }

  return data
}
