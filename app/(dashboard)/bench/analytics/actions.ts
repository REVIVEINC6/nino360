"use server"

import { createServerClient } from "@/lib/supabase/server"

export async function getBenchAnalytics() {
  const supabase = await createServerClient()

  // Get bench size over time (last 6 months)
  const sixMonthsAgo = new Date()
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

  const { data: benchHistory } = await supabase
    .from("bench_consultants")
    .select("created_at, status")
    .gte("created_at", sixMonthsAgo.toISOString())
    .order("created_at", { ascending: true })

  // Get average time-to-place
  const { data: placements } = await supabase
    .from("bench_placements")
    .select("consultant_id, start_date, created_at")
    .not("start_date", "is", null)

  // Get skills distribution
  const { data: consultants } = await supabase.from("bench_consultants").select("skills, work_authorization, status")

  return {
    benchHistory: benchHistory || [],
    placements: placements || [],
    consultants: consultants || [],
  }
}
