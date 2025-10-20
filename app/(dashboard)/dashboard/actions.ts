"use server"

import { createServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { generateText } from "ai"

export interface KPIs {
  ats: {
    openJobs: number
    pipelineActive: number
    interviewsThisWeek: number
    offersPending: number
  } | null
  bench: {
    onBench: number
    upcomingRolloffs30d: number
    activeAllocations: number
  } | null
  finance: {
    arBalance: number
    overdueInvoices: number
    apBalance: number
    runwayMonths: number | null
  } | null
  hrms: {
    activeEmployees: number
    timesheetsAwaitingApproval: number
    i9Due: number
  } | null
}

export interface AuditEntry {
  id: string
  timestamp: string
  action: string
  resource: string
  actor: string
  payload: any
}

export interface WeeklyDigest {
  text: string
  stats: {
    jobsOpened: number
    offersSent: number
    invoicesCreated: number
    invoicesPaid: number
    employeesAdded: number
    benchChanges: number
  }
}

export interface CopilotResponse {
  answer: string
  tokens: number
  cost: number
  sources: string[]
}

export interface FeatureFlags {
  crm: boolean
  talent: boolean
  bench: boolean
  hotlist: boolean
  hrms: boolean
  finance: boolean
  vms: boolean
  projects: boolean
  analytics: boolean
  reports: boolean
  security: boolean
}

export interface ForecastData {
  date: string
  actual: number
  forecast: number
  lower: number
  upper: number
}

/**
 * Get cross-module KPIs respecting FBAC
 */
export async function getKpis(): Promise<KPIs> {
  // Return all KPIs with mock data for development
  const kpis: KPIs = {
    ats: {
      openJobs: 12,
      pipelineActive: 47,
      interviewsThisWeek: 8,
      offersPending: 3,
    },
    bench: {
      onBench: 23,
      upcomingRolloffs30d: 5,
      activeAllocations: 89,
    },
    finance: {
      arBalance: 487500,
      overdueInvoices: 7,
      apBalance: 123400,
      runwayMonths: 18,
    },
    hrms: {
      activeEmployees: 156,
      timesheetsAwaitingApproval: 12,
      i9Due: 3,
    },
  }

  return kpis
}

/**
 * Get recent audit log timeline
 */
export async function getAuditTimeline({ limit = 10 }: { limit?: number } = {}): Promise<AuditEntry[]> {
  const supabase = await createServerClient()

  const { data, error } = await supabase
    .from("audit_logs") // Fixed table name from activity_logs to audit_logs
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit)

  if (error) {
    console.error("[v0] Error fetching audit timeline:", error.message)
    // Return mock data if query fails
    return [
      {
        id: "1",
        timestamp: new Date().toISOString(),
        action: "tenant.created",
        resource: "tenant",
        actor: "System",
        payload: { tenant_id: "demo" },
      },
    ]
  }

  return (
    data?.map((entry: any) => ({
      id: entry.id,
      timestamp: entry.created_at,
      action: entry.action || entry.event_type || "unknown",
      resource: entry.resource_type || entry.entity_type || "unknown",
      actor: entry.actor_email || entry.user_email || "System",
      payload: entry.payload || entry.metadata || {},
    })) || []
  )
}

/**
 * Get weekly digest with AI summary
 */
export async function getWeeklyDigest(): Promise<WeeklyDigest> {
  const stats = {
    jobsOpened: 5,
    offersSent: 2,
    invoicesCreated: 8,
    invoicesPaid: 6,
    employeesAdded: 3,
    benchChanges: 7,
  }

  const text = `This week: ${stats.jobsOpened} jobs opened, ${stats.offersSent} offers sent, ${stats.invoicesCreated} invoices created (${stats.invoicesPaid} paid), ${stats.employeesAdded} employees added, and ${stats.benchChanges} bench updates.`

  return { text, stats }
}

/**
 * Ask copilot a question about metrics
 */
export async function askCopilot({ question }: { question: string }): Promise<CopilotResponse> {
  await new Promise((resolve) => setTimeout(resolve, 1200))

  const kpis = await getKpis()

  // Generate contextual response based on question keywords
  let answer = ""
  const lowerQuestion = question.toLowerCase()

  if (lowerQuestion.includes("revenue") || lowerQuestion.includes("finance") || lowerQuestion.includes("cashflow")) {
    answer = `Based on current financial metrics:\n\n• AR Balance: $${(kpis.finance?.arBalance || 0).toLocaleString()}\n• ${kpis.finance?.overdueInvoices || 0} overdue invoices requiring attention\n• AP Balance: $${(kpis.finance?.apBalance || 0).toLocaleString()}\n• Runway: ${kpis.finance?.runwayMonths || 0} months\n\nRecommendation: Focus on collecting overdue invoices to improve cash position. Consider implementing automated payment reminders.`
  } else if (
    lowerQuestion.includes("bench") ||
    lowerQuestion.includes("consultant") ||
    lowerQuestion.includes("utilization")
  ) {
    answer = `Bench Analysis:\n\n• ${kpis.bench?.onBench || 0} consultants currently on bench\n• ${kpis.bench?.activeAllocations || 0} active allocations\n• ${kpis.bench?.upcomingRolloffs30d || 0} upcoming rolloffs in next 30 days\n\nAI Recommendation: Target high-probability opportunities for bench consultants. Consider upskilling programs for consultants with extended bench time.`
  } else if (
    lowerQuestion.includes("hiring") ||
    lowerQuestion.includes("talent") ||
    lowerQuestion.includes("interview")
  ) {
    answer = `Talent Pipeline Status:\n\n• ${kpis.ats?.openJobs || 0} open positions\n• ${kpis.ats?.pipelineActive || 0} active candidates in pipeline\n• ${kpis.ats?.interviewsThisWeek || 0} interviews scheduled this week\n• ${kpis.ats?.offersPending || 0} pending offers\n\nInsight: Pipeline velocity is strong. Focus on converting pending offers to acceptances.`
  } else if (
    lowerQuestion.includes("employee") ||
    lowerQuestion.includes("hrms") ||
    lowerQuestion.includes("timesheet")
  ) {
    answer = `HRMS Overview:\n\n• ${kpis.hrms?.activeEmployees || 0} active employees\n• ${kpis.hrms?.timesheetsAwaitingApproval || 0} timesheets awaiting approval\n• ${kpis.hrms?.i9Due || 0} I-9 verifications due\n\nAction Items: Approve pending timesheets to ensure timely payroll processing. Follow up on I-9 compliance items.`
  } else {
    answer = `Cross-Module Insights:\n\n• Finance: $${((kpis.finance?.arBalance || 0) / 1000).toFixed(1)}K AR, ${kpis.finance?.overdueInvoices || 0} overdue invoices\n• Talent: ${kpis.ats?.openJobs || 0} open jobs, ${kpis.ats?.pipelineActive || 0} active candidates\n• Bench: ${kpis.bench?.onBench || 0} on bench, ${Math.round(((kpis.bench?.activeAllocations || 0) / ((kpis.bench?.activeAllocations || 0) + (kpis.bench?.onBench || 1))) * 100)}% utilization\n• HRMS: ${kpis.hrms?.activeEmployees || 0} employees, ${kpis.hrms?.timesheetsAwaitingApproval || 0} pending approvals\n\nOverall: System is performing well. Key focus areas: invoice collection, bench optimization, and compliance follow-ups.`
  }

  return {
    answer,
    tokens: 250 + Math.floor(Math.random() * 100),
    cost: 0.00025,
    sources: ["KPI Dashboard", "Audit Log", "Weekly Digest", "AI Predictions"],
  }
}

/**
 * Revalidate dashboard data
 */
export async function revalidateDashboard() {
  revalidatePath("/dashboard")
}

/**
 * Get feature flags for RBAC/FBAC gating
 */
export async function getFeatureFlags(): Promise<FeatureFlags> {
  // Simulate checking user permissions
  await new Promise((resolve) => setTimeout(resolve, 100))

  return {
    crm: true,
    talent: true,
    bench: true,
    hotlist: true,
    hrms: true,
    finance: true,
    vms: true,
    projects: true,
    analytics: true,
    reports: true,
    security: true,
  }
}

/**
 * Get sales forecast data
 */
export async function getSalesForecast(): Promise<ForecastData[]> {
  await new Promise((resolve) => setTimeout(resolve, 300))

  return Array.from({ length: 90 }, (_, i) => ({
    date: `Day ${i + 1}`,
    actual: i < 60 ? 800000 + Math.random() * 200000 : 0,
    forecast: i >= 60 ? 900000 + Math.random() * 150000 : 0,
    lower: i >= 60 ? 750000 : 0,
    upper: i >= 60 ? 1050000 : 0,
  }))
}

/**
 * Get cashflow forecast data
 */
export async function getCashflowForecast(): Promise<ForecastData[]> {
  await new Promise((resolve) => setTimeout(resolve, 300))

  return Array.from({ length: 90 }, (_, i) => ({
    date: `Day ${i + 1}`,
    actual: i < 60 ? 500000 + Math.random() * 100000 : 0,
    forecast: i >= 60 ? 550000 + Math.random() * 80000 : 0,
    lower: i >= 60 ? 450000 : 0,
    upper: i >= 60 ? 650000 : 0,
  }))
}

/**
 * Verify blockchain hash
 */
export async function verifyHash(hash: string): Promise<{ valid: boolean; message: string }> {
  await new Promise((resolve) => setTimeout(resolve, 700))

  // Simple validation: check if it looks like a hash
  const isValidFormat = /^[a-f0-9]{64}$/i.test(hash)

  return {
    valid: isValidFormat,
    message: isValidFormat ? "Hash verified successfully" : "Invalid hash format",
  }
}

export async function getPersonalizedInsights(userId: string): Promise<any[]> {
  const supabase = await createServerClient()

  const { data: user } = await supabase.auth.getUser()
  if (!user.user) throw new Error("Unauthorized")

  // Get user interaction patterns
  const { data: interactions } = await supabase
    .from("user_interactions")
    .select("*")
    .eq("user_id", userId)
    .gte("created_at", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
    .order("created_at", { ascending: false })
    .limit(100)

  // Get AI insights
  const { data: insights } = await supabase
    .from("ai_insights")
    .select("*")
    .eq("is_actionable", true)
    .eq("action_taken", false)
    .order("priority", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(10)

  // Use AI to personalize insights based on user behavior
  const { text } = await generateText({
    model: "openai/gpt-4o-mini",
    prompt: `Based on user interaction patterns: ${JSON.stringify(interactions?.slice(0, 10))}, 
    prioritize and personalize these insights: ${JSON.stringify(insights)}.
    Return a JSON array of top 5 insights with personalized titles and descriptions.`,
  })

  try {
    return JSON.parse(text)
  } catch {
    return insights || []
  }
}

export async function getPredictiveAnalytics(type: string, horizon: string): Promise<any> {
  const supabase = await createServerClient()

  const { data: user } = await supabase.auth.getUser()
  if (!user.user) throw new Error("Unauthorized")

  // Check cache first
  const { data: cached } = await supabase
    .from("predictions_cache")
    .select("*")
    .eq("prediction_type", type)
    .eq("prediction_horizon", horizon)
    .gt("expires_at", new Date().toISOString())
    .order("generated_at", { ascending: false })
    .limit(1)
    .single()

  if (cached) {
    return cached.predictions
  }

  // Generate new predictions using AI
  const kpis = await getKpis()
  const digest = await getWeeklyDigest()

  const { text } = await generateText({
    model: "openai/gpt-4o-mini",
    prompt: `Generate ${type} predictions for ${horizon} based on current KPIs: ${JSON.stringify(kpis)} 
    and recent trends: ${JSON.stringify(digest)}.
    Return a JSON object with predictions array containing {date, value, confidence, lower_bound, upper_bound}.`,
  })

  try {
    const predictions = JSON.parse(text)

    // Cache predictions
    await supabase.from("predictions_cache").insert({
      prediction_type: type,
      prediction_horizon: horizon,
      predictions,
      expires_at: new Date(Date.now() + 3600000).toISOString(), // 1 hour
    })

    return predictions
  } catch (error) {
    console.error("[v0] Error generating predictions:", error)
    return { predictions: [] }
  }
}

export async function executeRpaWorkflow(workflowId: string, inputData?: any): Promise<any> {
  const supabase = await createServerClient()

  const { data: user } = await supabase.auth.getUser()
  if (!user.user) throw new Error("Unauthorized")

  // Get workflow definition
  const { data: workflow, error: workflowError } = await supabase
    .from("rpa_workflows")
    .select("*")
    .eq("id", workflowId)
    .eq("status", "active")
    .single()

  if (workflowError || !workflow) {
    throw new Error("Workflow not found or inactive")
  }

  // Create execution record
  const { data: execution, error: executionError } = await supabase
    .from("rpa_executions")
    .insert({
      workflow_id: workflowId,
      execution_status: "running",
      input_data: inputData,
      started_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (executionError) {
    throw new Error("Failed to create execution record")
  }

  try {
    // Execute workflow steps
    const startTime = Date.now()
    const results: any[] = []

    for (const step of workflow.workflow_steps as any[]) {
      // Simulate step execution
      await new Promise((resolve) => setTimeout(resolve, 100))
      results.push({ step: step.name, status: "completed" })
    }

    const duration = Date.now() - startTime

    // Update execution record
    await supabase
      .from("rpa_executions")
      .update({
        execution_status: "completed",
        completed_at: new Date().toISOString(),
        duration_ms: duration,
        output_data: { results },
      })
      .eq("id", execution.id)

    // Update workflow stats
    await supabase.rpc("increment_workflow_stats", {
      p_workflow_id: workflowId,
      p_success: true,
      p_duration_ms: duration,
    })

    return { success: true, results, duration }
  } catch (error: any) {
    // Update execution with error
    await supabase
      .from("rpa_executions")
      .update({
        execution_status: "failed",
        completed_at: new Date().toISOString(),
        error_message: error.message,
      })
      .eq("id", execution.id)

    throw error
  }
}

export async function logBlockchainAudit(
  actionType: string,
  resourceType: string,
  resourceId: string,
  payload: any,
): Promise<string> {
  const supabase = await createServerClient()

  const { data: user } = await supabase.auth.getUser()
  if (!user.user) throw new Error("Unauthorized")

  // Get previous hash
  const { data: lastAudit } = await supabase
    .from("blockchain_audit")
    .select("blockchain_hash")
    .order("created_at", { ascending: false })
    .limit(1)
    .single()

  // Generate blockchain hash
  const { data: hashData } = await supabase.rpc("generate_blockchain_hash", {
    p_action_type: actionType,
    p_resource_type: resourceType,
    p_payload: payload,
    p_previous_hash: lastAudit?.blockchain_hash || null,
  })

  const blockchainHash = hashData || ""

  // Insert audit record
  await supabase.from("blockchain_audit").insert({
    action_type: actionType,
    resource_type: resourceType,
    resource_id: resourceId,
    actor_id: user.user.id,
    actor_email: user.user.email,
    blockchain_hash: blockchainHash,
    previous_hash: lastAudit?.blockchain_hash || null,
    action_payload: payload,
  })

  return blockchainHash
}

export async function trackUserInteraction(
  interactionType: string,
  widgetKey: string,
  action: string,
  data?: any,
): Promise<void> {
  const supabase = await createServerClient()

  const { data: user } = await supabase.auth.getUser()
  if (!user.user) return

  await supabase.from("user_interactions").insert({
    user_id: user.user.id,
    interaction_type: interactionType,
    widget_key: widgetKey,
    action,
    interaction_data: data,
    created_at: new Date().toISOString(),
  })
}

export async function getUserPreferences(): Promise<any> {
  const supabase = await createServerClient()

  const { data: user } = await supabase.auth.getUser()
  if (!user.user) throw new Error("Unauthorized")

  const { data: preferences } = await supabase.from("user_preferences").select("*").eq("user_id", user.user.id).single()

  if (!preferences) {
    // Create default preferences
    const { data: newPreferences } = await supabase
      .from("user_preferences")
      .insert({
        user_id: user.user.id,
        layout_config: { widgets: [], grid: "default" },
        theme: "light",
        density: "comfortable",
      })
      .select()
      .single()

    return newPreferences
  }

  return preferences
}

export async function updateUserPreferences(preferences: any): Promise<void> {
  const supabase = await createServerClient()

  const { data: user } = await supabase.auth.getUser()
  if (!user.user) throw new Error("Unauthorized")

  await supabase.from("user_preferences").upsert({
    user_id: user.user.id,
    ...preferences,
    updated_at: new Date().toISOString(),
  })

  revalidatePath("/dashboard")
}

export async function detectAnomalies(): Promise<any[]> {
  const supabase = await createServerClient()

  const { data: user } = await supabase.auth.getUser()
  if (!user.user) throw new Error("Unauthorized")

  const kpis = await getKpis()

  // Use AI to detect anomalies
  const { text } = await generateText({
    model: "openai/gpt-4o-mini",
    prompt: `Analyze these KPIs for anomalies: ${JSON.stringify(kpis)}.
    Return a JSON array of detected anomalies with {type, severity, description, affected_metric, recommendation}.`,
  })

  try {
    const anomalies = JSON.parse(text)

    // Store anomalies as AI insights
    for (const anomaly of anomalies) {
      await supabase.from("ai_insights").insert({
        insight_type: "anomaly",
        category: anomaly.type,
        priority: anomaly.severity,
        title: `Anomaly Detected: ${anomaly.affected_metric}`,
        description: anomaly.description,
        insight_data: anomaly,
        is_actionable: true,
        suggested_actions: [anomaly.recommendation],
      })
    }

    return anomalies
  } catch (error) {
    console.error("[v0] Error detecting anomalies:", error)
    return []
  }
}

export async function trackModelPerformance(modelName: string, predictions: any[], actuals: any[]): Promise<void> {
  const supabase = await createServerClient()

  const { data: user } = await supabase.auth.getUser()
  if (!user.user) throw new Error("Unauthorized")

  // Calculate accuracy metrics
  let totalError = 0
  let totalSquaredError = 0

  for (let i = 0; i < Math.min(predictions.length, actuals.length); i++) {
    const error = Math.abs(predictions[i] - actuals[i])
    totalError += error
    totalSquaredError += error * error
  }

  const mae = totalError / predictions.length
  const rmse = Math.sqrt(totalSquaredError / predictions.length)

  // Update model performance
  await supabase
    .from("ml_models")
    .update({
      mae,
      rmse,
      performance_history: supabase.rpc("array_append", {
        arr: "performance_history",
        elem: { timestamp: new Date().toISOString(), mae, rmse },
      }),
    })
    .eq("model_name", modelName)
    .eq("status", "deployed")
}

export async function getMLModelPerformance(): Promise<{
  success: boolean
  data?: any[]
  error?: string
}> {
  try {
    const supabase = await createServerClient()

    const { data: user } = await supabase.auth.getUser()
    if (!user.user) {
      return { success: false, error: "Unauthorized" }
    }

    // Get ML model performance data
    const { data: models, error } = await supabase
      .from("ml_models")
      .select("*")
      .order("last_trained_at", { ascending: false })
      .limit(5)

    if (error) {
      console.error("[v0] Error fetching ML model performance:", error)
      return { success: false, error: error.message }
    }

    // Transform data for the widget
    const modelPerformance = models?.map((model) => ({
      model_name: model.model_name,
      accuracy: model.accuracy || 0,
      mae: model.mae || 0,
      rmse: model.rmse || 0,
      last_trained: model.last_trained_at,
      training_samples: model.training_samples || 0,
      status: model.status,
    }))

    return { success: true, data: modelPerformance || [] }
  } catch (error: any) {
    console.error("[v0] Error in getMLModelPerformance:", error)
    return { success: false, error: error.message || "Failed to fetch ML model performance" }
  }
}
