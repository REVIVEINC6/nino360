"use server"

import { createServerClient } from "@/lib/supabase/server"

export async function getBenchMetrics() {
  const supabase = await createServerClient()

  // Get total bench consultants
  const { count: totalBench } = await supabase
    .from("bench_consultants")
    .select("*", { count: "only", head: true })
    .eq("status", "available")

  // Get ready to deploy count
  const { count: readyToDeploy } = await supabase
    .from("bench_consultants")
    .select("*", { count: "only", head: true })
    .eq("status", "available")
    .eq("ready_to_deploy", true)

  // Get average bench days
  const { data: benchData } = await supabase.from("bench_consultants").select("bench_days").eq("status", "available")

  const avgBenchDays =
    benchData && benchData.length > 0
      ? Math.round(benchData.reduce((sum, item) => sum + (item.bench_days || 0), 0) / benchData.length)
      : 0

  // Get placement rate (last 30 days)
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const { count: placements } = await supabase
    .from("bench_placements")
    .select("*", { count: "only", head: true })
    .gte("placed_at", thirtyDaysAgo.toISOString())

  return {
    totalBench: totalBench || 0,
    readyToDeploy: readyToDeploy || 0,
    avgBenchDays,
    placementRate: placements || 0,
  }
}

export async function getBenchConsultants() {
  const supabase = await createServerClient()

  const { data, error } = await supabase
    .from("bench_consultants")
    .select(`
      *,
      employee:employees(id, first_name, last_name, email)
    `)
    .eq("status", "available")
    .order("bench_days", { ascending: false })
    .limit(10)

  if (error) throw error
  return data || []
}
