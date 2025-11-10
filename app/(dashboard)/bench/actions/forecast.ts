"use server"

import { createServerClient } from "@/lib/supabase/server"

export async function runForecast(horizon_weeks = 12) {
  const supabase = await createServerClient()

  // TODO: Call edge function bench-forecast
  // For now, return a simple calculation

  // Get bench consultants
  const { data: consultants } = await supabase.from("bench.consultants").select("*").eq("status", "bench")

  // Get active allocations
  const { data: allocations } = await supabase
    .from("bench.allocations")
    .select("*")
    .in("status", ["confirmed", "active"])

  // Get forecasts
  const { data: forecasts } = await supabase.from("bench.forecasts").select("*")

  // Get open jobs
  const { data: jobs } = await supabase.from("ats.jobs").select("*").eq("status", "open")

  // Simple calculation
  const supply = consultants?.length || 0
  const allocated = allocations?.length || 0
  const demand = (jobs?.length || 0) + (forecasts?.reduce((sum: number, f: any) => sum + (f.headcount || 0), 0) || 0)

  const available = supply - allocated
  const utilization = supply > 0 ? (allocated / supply) * 100 : 0

  return {
    horizon_weeks,
    supply,
    allocated,
    available,
    demand,
    utilization: Math.round(utilization),
    shortage: Math.max(0, demand - available),
    weeks: Array.from({ length: horizon_weeks }, (_, i) => ({
      week: i + 1,
      supply: available,
      demand: Math.round(demand / horizon_weeks),
      utilization: Math.round(utilization),
    })),
  }
}

export async function listForecasts() {
  const supabase = await createServerClient()

  const { data, error } = await supabase.from("bench.forecasts").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("[v0] Error listing forecasts:", error)
    throw new Error("Failed to list forecasts")
  }

  return data
}

export async function createForecast(input: {
  source: "sales" | "pm" | "hr" | "ai"
  title: string
  needed_skills: string[]
  headcount: number
  start_date?: string
  end_date?: string
  probability?: number
  notes?: string
}) {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { data, error } = await supabase
    .from("bench.forecasts")
    .insert({
      ...input,
      created_by: user.id,
    })
    .select()
    .single()

  if (error) {
    console.error("[v0] Error creating forecast:", error)
    throw new Error("Failed to create forecast")
  }

  return data
}
