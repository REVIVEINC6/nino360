"use server"

import { createServerClient } from "@/lib/supabase/server"

export async function getAILogs(filters?: {
  tenant_id?: string
  user_id?: string
  module?: string
  days?: number
}) {
  const supabase = await createServerClient()
  const since = new Date()
  since.setDate(since.getDate() - (filters?.days || 7))

  let query = supabase
    .from("audit.ai_logs")
    .select("*, tenant:core.tenants(name), user:core.users(email)")
    .gte("created_at", since.toISOString())
    .order("created_at", { ascending: false })
    .limit(1000)

  if (filters?.tenant_id) query = query.eq("tenant_id", filters.tenant_id)
  if (filters?.user_id) query = query.eq("user_id", filters.user_id)
  if (filters?.module) query = query.eq("module", filters.module)

  const { data, error } = await query
  if (error) throw error
  return data || []
}

export async function getAICostSummary(days = 30) {
  const supabase = await createServerClient()
  const since = new Date()
  since.setDate(since.getDate() - days)

  const { data, error } = await supabase
    .from("audit.ai_logs")
    .select("module, model, cost, tokens_prompt, tokens_output")
    .gte("created_at", since.toISOString())

  if (error) throw error

  // Aggregate by module and model
  const summary: Record<string, any> = {}
  data?.forEach((log) => {
    const key = `${log.module}:${log.model}`
    if (!summary[key]) {
      summary[key] = {
        module: log.module,
        model: log.model,
        total_cost: 0,
        total_tokens: 0,
        request_count: 0,
      }
    }
    summary[key].total_cost += Number(log.cost || 0)
    summary[key].total_tokens += (log.tokens_prompt || 0) + (log.tokens_output || 0)
    summary[key].request_count += 1
  })

  return Object.values(summary)
}

export async function logAIUsage(input: {
  tenant_id?: string
  user_id?: string
  module: string
  use_case: string
  model: string
  policy?: string
  prompt: string
  output: string
  tokens_prompt?: number
  tokens_output?: number
  cost?: number
  duration_ms?: number
}) {
  const supabase = await createServerClient()

  const { data, error } = await supabase.from("audit.ai_logs").insert(input).select().single()

  if (error) throw error
  return data
}
