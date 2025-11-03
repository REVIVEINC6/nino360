"use server"

import { createServerClient } from "@/lib/supabase/server"

export async function getSuccessionPlans() {
  const supabase = await createServerClient()

  const { data, error } = await supabase
    .from("succession_plans")
    .select(`
      *,
      position:positions(*),
      current_holder:employees!current_holder_id(*),
      successors:succession_candidates(
        *,
        candidate:employees(*)
      )
    `)
    .order("risk_level", { ascending: false })

  if (error) throw error
  return data
}

export async function getTalentPipeline() {
  const supabase = await createServerClient()

  const { data, error } = await supabase
    .from("employees")
    .select(`
      *,
      position:positions(*),
      performance_reviews(rating, review_date),
      skills:employee_skills(
        skill:skills(name),
        proficiency_level
      )
    `)
    .eq("high_potential", true)
    .order("performance_score", { ascending: false })

  if (error) throw error
  return data
}

export async function createSuccessionPlan(data: any) {
  const supabase = await createServerClient()

  const { data: plan, error } = await supabase.from("succession_plans").insert(data).select().single()

  if (error) throw error
  return plan
}

export async function updateSuccessionPlan(id: string, data: any) {
  const supabase = await createServerClient()

  const { data: plan, error } = await supabase.from("succession_plans").update(data).eq("id", id).select().single()

  if (error) throw error
  return plan
}

export async function addSuccessor(planId: string, candidateId: string, readiness: string) {
  const supabase = await createServerClient()

  const { data, error } = await supabase
    .from("succession_candidates")
    .insert({
      succession_plan_id: planId,
      candidate_id: candidateId,
      readiness_level: readiness,
      development_plan: {},
    })
    .select()
    .single()

  if (error) throw error
  return data
}
