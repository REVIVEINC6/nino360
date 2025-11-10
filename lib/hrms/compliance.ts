"use server"

import { createServerClient } from "@/lib/supabase/server"

export async function getComplianceOverview(filters: {
  from?: string
  to?: string
  orgId?: string
}) {
  const supabase = await createServerClient()

  // Policy acknowledgment %
  const { data: policyData } = await supabase
    .from("policy_assignments")
    .select("status")
    .gte("due_at", filters.from || new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString())
    .lte("due_at", filters.to || new Date().toISOString())

  const policyAckPct =
    policyData && policyData.length > 0
      ? (policyData.filter((p) => p.status === "ACKNOWLEDGED").length / policyData.length) * 100
      : 0

  // I-9 on-time %
  const { data: i9Data } = await supabase
    .from("i9_records")
    .select("hire_date, section1_completed_at, section2_examined_at")
    .gte("hire_date", filters.from || new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString())
    .lte("hire_date", filters.to || new Date().toISOString())

  const i9OnTimePct =
    i9Data && i9Data.length > 0
      ? (i9Data.filter(
          (i9) =>
            i9.section1_completed_at &&
            i9.section2_examined_at &&
            new Date(i9.section1_completed_at) <= new Date(i9.hire_date) &&
            new Date(i9.section2_examined_at) <= new Date(new Date(i9.hire_date).getTime() + 3 * 24 * 60 * 60 * 1000),
        ).length /
          i9Data.length) *
        100
      : 0

  // Immigration expiries ≤30d
  const { count: immigrationExpiries } = await supabase
    .from("work_authorizations")
    .select("*", { count: "exact", head: true })
    .gte("end_date", new Date().toISOString().split("T")[0])
    .lte("end_date", new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0])

  // Training completion %
  const { data: trainingData } = await supabase
    .from("enrollments")
    .select("status")
    .gte("due_at", filters.from || new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString())
    .lte("due_at", filters.to || new Date().toISOString())

  const trainingCompletionPct =
    trainingData && trainingData.length > 0
      ? (trainingData.filter((t) => t.status === "COMPLETED").length / trainingData.length) * 100
      : 0

  // Background checks pending
  const { count: backgroundPending } = await supabase
    .from("checks")
    .select("*", { count: "exact", head: true })
    .eq("status", "PENDING")
    .gte("ordered_at", new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString())

  // Exceptions open
  const { data: exceptionsData } = await supabase.from("exceptions").select("risk").eq("status", "OPEN")

  const exceptionsOpen = exceptionsData?.length || 0
  const exceptionsRisk =
    exceptionsData && exceptionsData.length > 0
      ? exceptionsData.some((e) => e.risk === "CRITICAL")
        ? "CRITICAL"
        : exceptionsData.some((e) => e.risk === "HIGH")
          ? "HIGH"
          : exceptionsData.some((e) => e.risk === "MEDIUM")
            ? "MEDIUM"
            : "LOW"
      : "LOW"

  return {
    policyAckPct: Math.round(policyAckPct),
    i9OnTimePct: Math.round(i9OnTimePct),
    immigrationExpiries: immigrationExpiries || 0,
    trainingCompletionPct: Math.round(trainingCompletionPct),
    backgroundPending: backgroundPending || 0,
    exceptionsOpen,
    exceptionsRisk,
  }
}

export async function listObligations(input: {
  kind: string
  orgId?: string
  dueBucket?: string
  status?: string
  q?: string
  page: number
  pageSize: number
}) {
  const supabase = await createServerClient()

  let query = supabase.from("tasks").select("*", { count: "exact" }).eq("kind", input.kind)

  if (input.status) {
    query = query.eq("state", input.status)
  }

  if (input.dueBucket) {
    const now = new Date()
    if (input.dueBucket === "TODAY") {
      query = query
        .gte("due_at", now.toISOString().split("T")[0])
        .lt("due_at", new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString().split("T")[0])
    } else if (input.dueBucket === "7D") {
      query = query
        .gte("due_at", now.toISOString())
        .lte("due_at", new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString())
    } else if (input.dueBucket === "14D") {
      query = query
        .gte("due_at", now.toISOString())
        .lte("due_at", new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString())
    } else if (input.dueBucket === "30D") {
      query = query
        .gte("due_at", now.toISOString())
        .lte("due_at", new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString())
    } else if (input.dueBucket === "PAST_DUE") {
      query = query.lt("due_at", now.toISOString())
    }
  }

  query = query
    .range((input.page - 1) * input.pageSize, input.page * input.pageSize - 1)
    .order("due_at", { ascending: true })

  const { data, error, count } = await query

  if (error) throw error

  return {
    rows: data || [],
    total: count || 0,
  }
}

export async function listTasks(filters: {
  kind?: string
  state?: string
  assigneeId?: string
  page: number
  pageSize: number
}) {
  const supabase = await createServerClient()

  let query = supabase.from("tasks").select("*", { count: "exact" })

  if (filters.kind) {
    query = query.eq("kind", filters.kind)
  }

  if (filters.state) {
    query = query.eq("state", filters.state)
  }

  if (filters.assigneeId) {
    query = query.eq("assignee_id", filters.assigneeId)
  }

  query = query
    .range((filters.page - 1) * filters.pageSize, filters.page * filters.pageSize - 1)
    .order("due_at", { ascending: true })

  const { data, error, count } = await query

  if (error) throw error

  return {
    rows: data || [],
    total: count || 0,
  }
}

export async function listEvidence(controlId: string) {
  const supabase = await createServerClient()

  const { data, error } = await supabase
    .from("evidence")
    .select("*")
    .eq("control_id", controlId)
    .order("gathered_at", { ascending: false })

  if (error) throw error

  return data || []
}

export async function listControls(frameworkId?: string) {
  const supabase = await createServerClient()

  let query = supabase.from("controls").select("*, framework:frameworks(*)")

  if (frameworkId) {
    query = query.eq("framework_id", frameworkId)
  }

  const { data, error } = await query.order("key", { ascending: true })

  if (error) throw error

  return data || []
}

export async function listExceptions(filters: { status?: string; risk?: string }) {
  const supabase = await createServerClient()

  let query = supabase.from("exceptions").select("*, control:controls(*)")

  if (filters.status) {
    query = query.eq("status", filters.status)
  }

  if (filters.risk) {
    query = query.eq("risk", filters.risk)
  }

  const { data, error } = await query.order("opened_at", { ascending: false })

  if (error) throw error

  return data || []
}
