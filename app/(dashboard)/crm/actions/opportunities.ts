"use server"

import { z } from "zod"
import { createServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { generateText } from "ai"
import { createAuditLog } from "@/lib/audit/hash-chain"

const opportunitySchema = z.object({
  id: z.string().uuid().optional(),
  account_id: z.string().uuid().optional(),
  contact_id: z.string().uuid().optional(),
  title: z.string().min(2, "Title must be at least 2 characters"),
  amount: z.number().min(0).default(0),
  currency: z.string().default("USD"),
  stage_id: z.string().uuid().optional(),
  close_date: z.string().optional(),
  owner_id: z.string().uuid().optional(),
  status: z.enum(["open", "won", "lost", "withdrawn"]).default("open"),
  probability: z.number().min(0).max(100).default(0),
})

export async function upsertOpportunity(input: unknown) {
  const supabase = await createServerClient()
  const body = opportunitySchema.parse(input)

  const { data, error } = await supabase.from("crm.opportunities").upsert(body).select().single()

  if (error) throw new Error(error.message)

  revalidatePath("/crm/opportunities")
  revalidatePath("/crm/pipeline")
  return data
}

export async function moveOpportunity({ id, stage_id }: { id: string; stage_id: string }) {
  const supabase = await createServerClient()

  const { data, error } = await supabase
    .from("crm.opportunities")
    .update({ stage_id, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single()

  if (error) throw new Error(error.message)

  revalidatePath("/crm/pipeline")
  return data
}

export async function deleteOpportunity(id: string) {
  const supabase = await createServerClient()

  const { error } = await supabase.from("crm.opportunities").delete().eq("id", id)

  if (error) throw new Error(error.message)

  revalidatePath("/crm/opportunities")
  revalidatePath("/crm/pipeline")
  return { success: true }
}

export async function getOpportunities(filters?: { status?: string; stage_id?: string; search?: string }) {
  const supabase = await createServerClient()

  let query = supabase
    .from("crm.opportunities")
    .select(`
      *,
      account:crm.accounts(id, name),
      contact:crm.contacts(id, first_name, last_name, email),
      stage:crm.opportunity_stages(id, name, win_prob),
  owner:users!owner_id(id, email, full_name)
    `)
    .order("created_at", { ascending: false })

  if (filters?.status) {
    query = query.eq("status", filters.status)
  }

  if (filters?.stage_id) {
    query = query.eq("stage_id", filters.stage_id)
  }

  if (filters?.search) {
    query = query.ilike("title", `%${filters.search}%`)
  }

  const { data, error } = await query

  if (error) throw new Error(error.message)

  return data
}

export async function enrichOpportunityWithAI(opportunityId: string) {
  try {
    const supabase = await createServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error("Unauthorized")

    // Get opportunity with related data
    const { data: opp, error } = await supabase
      .from("crm.opportunities")
      .select(`
        *,
        account:crm.accounts(id, name, industry, size),
        contact:crm.contacts(id, first_name, last_name, email, title),
        stage:crm.opportunity_stages(id, name, win_prob),
        activities:crm.opportunity_activities(count)
      `)
      .eq("id", opportunityId)
      .single()

    if (error) throw error

    // Generate AI insights
    const { text } = await generateText({
      model: "openai/gpt-4o",
      prompt: `Analyze this sales opportunity and provide insights:
Title: ${opp.title}
Amount: $${opp.amount}
Stage: ${opp.stage?.name}
Account: ${opp.account?.name} (${opp.account?.industry}, ${opp.account?.size})
Contact: ${opp.contact?.first_name} ${opp.contact?.last_name} (${opp.contact?.title})
Activities: ${opp.activities?.[0]?.count || 0}

Provide JSON with:
- win_probability: 0-100 (ML prediction)
- predicted_amount: adjusted amount based on similar deals
- predicted_close_date: ISO date string
- confidence_score: 0-100
- risk_score: 0-100 (higher = more risk)
- insights: array of key insights
- recommendations: array of next steps`,
      maxTokens: 800,
    })

    let aiData
    try {
      aiData = JSON.parse(text)
    } catch {
      aiData = {
        win_probability: opp.stage?.win_prob || 50,
        predicted_amount: opp.amount,
        confidence_score: 60,
        risk_score: 30,
        insights: ["AI analysis in progress"],
        recommendations: ["Continue engagement"],
      }
    }

    // Update opportunity with AI enrichment
    const { data: updated, error: updateError } = await supabase
      .from("crm.opportunities")
      .update({
        ml_win_probability: aiData.win_probability,
        ml_predicted_amount: aiData.predicted_amount,
        ml_predicted_close_date: aiData.predicted_close_date,
        ml_confidence_score: aiData.confidence_score,
        risk_score: aiData.risk_score,
        ai_enrichment: {
          insights: aiData.insights,
          recommendations: aiData.recommendations,
          analyzed_at: new Date().toISOString(),
        },
        ai_insights: aiData.insights?.join(". "),
        last_ai_analysis_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", opportunityId)
      .select()
      .single()

    if (updateError) throw updateError

    revalidatePath("/crm/opportunities")
    return { success: true, data: updated }
  } catch (error) {
    console.error("[v0] AI enrichment error:", error)
    return { success: false, error: error instanceof Error ? error.message : "AI enrichment failed" }
  }
}

export async function createOpportunityWithAI(input: {
  title: string
  account_id?: string
  contact_id?: string
  amount?: number
  close_date?: string
  description?: string
}) {
  try {
    const supabase = await createServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error("Unauthorized")

    // Get tenant_id
    const { data: profile } = await supabase.from("users").select("tenant_id").eq("id", user.id).single()

    if (!profile?.tenant_id) throw new Error("No tenant found")

    // Get account and contact data for AI context
  let accountData: any = null
  let contactData: any = null

    if (input.account_id) {
      const { data } = await supabase.from("crm.accounts").select("*").eq("id", input.account_id).single()
      accountData = data
    }

    if (input.contact_id) {
      const { data } = await supabase.from("crm.contacts").select("*").eq("id", input.contact_id).single()
      contactData = data
    }

    // Use AI to predict amount and close date if not provided
    let predictedAmount = input.amount
    let predictedCloseDate = input.close_date

    if (!predictedAmount || !predictedCloseDate) {
      const { text } = await generateText({
        model: "openai/gpt-4o",
        prompt: `Predict sales opportunity details:
Title: ${input.title}
${accountData ? `Account: ${accountData.name} (${accountData.industry}, ${accountData.size})` : ""}
${contactData ? `Contact: ${contactData.first_name} ${contactData.last_name} (${contactData.title})` : ""}
${input.description ? `Description: ${input.description}` : ""}

Provide JSON with:
- predicted_amount: realistic deal size in USD
- predicted_close_date: ISO date string (30-90 days from now)
- win_probability: 0-100
- reasoning: brief explanation`,
        maxTokens: 300,
      })

      try {
        const prediction = JSON.parse(text)
        predictedAmount = predictedAmount || prediction.predicted_amount
        predictedCloseDate = predictedCloseDate || prediction.predicted_close_date
      } catch {
        // Fallback to defaults
        predictedAmount = predictedAmount || 50000
        predictedCloseDate = predictedCloseDate || new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString()
      }
    }

    // Get default stage (Prospect)
    const { data: defaultStage } = await supabase.from("crm.opportunity_stages").select("id").eq("position", 1).single()

    // Create opportunity
    const { data: opportunity, error } = await supabase
      .from("crm.opportunities")
      .insert({
        tenant_id: profile.tenant_id,
        title: input.title,
        account_id: input.account_id,
        contact_id: input.contact_id,
        amount: predictedAmount,
        close_date: predictedCloseDate,
        stage_id: defaultStage?.id,
        owner_id: user.id,
        status: "open",
        source: "manual",
        created_by: user.id,
      })
      .select()
      .single()

    if (error) throw error

    // Create blockchain audit log
    await createAuditLog({
      tenantId: profile.tenant_id,
      userId: user.id,
      action: "opportunity.created",
      entity: "opportunity",
      entityId: opportunity.id,
      metadata: {
        title: opportunity.title,
        amount: opportunity.amount,
        account_id: opportunity.account_id,
      },
    })

    // Trigger AI enrichment in background
    enrichOpportunityWithAI(opportunity.id).catch(console.error)

    // Create initial activity
    await supabase.from("crm.opportunity_activities").insert({
      tenant_id: profile.tenant_id,
      opportunity_id: opportunity.id,
      user_id: user.id,
      activity_type: "note",
      subject: "Opportunity created",
      description: `Opportunity "${input.title}" created with AI-predicted amount $${predictedAmount}`,
      occurred_at: new Date().toISOString(),
    })

    revalidatePath("/crm/opportunities")
    revalidatePath("/crm/pipeline")
    return { success: true, data: opportunity }
  } catch (error) {
    console.error("[v0] Create opportunity error:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to create opportunity" }
  }
}

export async function addOpportunityActivity(input: {
  opportunity_id: string
  activity_type: string
  subject: string
  description?: string
  occurred_at?: string
}) {
  try {
    const supabase = await createServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error("Unauthorized")

    const { data: profile } = await supabase.from("users").select("tenant_id").eq("id", user.id).single()

    const { data, error } = await supabase
      .from("crm.opportunity_activities")
      .insert({
        tenant_id: profile?.tenant_id,
        opportunity_id: input.opportunity_id,
        user_id: user.id,
        activity_type: input.activity_type,
        subject: input.subject,
        description: input.description,
        occurred_at: input.occurred_at || new Date().toISOString(),
      })
      .select()
      .single()

    if (error) throw error

    revalidatePath("/crm/opportunities")
    return { success: true, data }
  } catch (error) {
    console.error("[v0] Add activity error:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to add activity" }
  }
}

export async function createOpportunityTask(input: {
  opportunity_id: string
  title: string
  description?: string
  due_date?: string
  priority?: string
  assigned_to?: string
}) {
  try {
    const supabase = await createServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error("Unauthorized")

    const { data: profile } = await supabase.from("users").select("tenant_id").eq("id", user.id).single()

    const { data, error } = await supabase
      .from("crm.opportunity_tasks")
      .insert({
        tenant_id: profile?.tenant_id,
        opportunity_id: input.opportunity_id,
        title: input.title,
        description: input.description,
        due_date: input.due_date,
        priority: input.priority || "medium",
        assigned_to: input.assigned_to || user.id,
        created_by: user.id,
        status: "pending",
      })
      .select()
      .single()

    if (error) throw error

    revalidatePath("/crm/opportunities")
    return { success: true, data }
  } catch (error) {
    console.error("[v0] Create task error:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to create task" }
  }
}

export async function getOpportunityDetails(id: string) {
  try {
    const supabase = await createServerClient()

    const { data, error } = await supabase
      .from("crm.opportunities")
      .select(`
        *,
        account:crm.accounts(id, name, industry, size, domain),
        contact:crm.contacts(id, first_name, last_name, email, phone, title),
        stage:crm.opportunity_stages(id, name, win_prob, position),
        owner:core.users!owner_id(id, email, full_name),
        activities:crm.opportunity_activities(*, user:core.users(full_name)),
        tasks:crm.opportunity_tasks(*, assigned_user:core.users!assigned_to(full_name)),
        competitors:crm.opportunity_competitors(*),
        products:crm.opportunity_products(*)
      `)
      .eq("id", id)
      .single()

    if (error) throw error

    return { success: true, data }
  } catch (error) {
    console.error("[v0] Get opportunity details error:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to get opportunity" }
  }
}

export async function getOpportunityRecommendations(opportunityId: string) {
  try {
    const supabase = await createServerClient()

    const { data: opp } = await supabase
      .from("crm.opportunities")
      .select(`
        *,
        account:crm.accounts(*),
        activities:crm.opportunity_activities(count),
        tasks:crm.opportunity_tasks(*)
      `)
      .eq("id", opportunityId)
      .single()

    if (!opp) throw new Error("Opportunity not found")

    const { text } = await generateText({
      model: "openai/gpt-4o",
      prompt: `Provide actionable recommendations for this opportunity:
Title: ${opp.title}
Amount: $${opp.amount}
Days to close: ${opp.close_date ? Math.ceil((new Date(opp.close_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : "Unknown"}
Activities: ${opp.activities?.[0]?.count || 0}
Open tasks: ${opp.tasks?.filter((t: any) => t.status !== "completed").length || 0}
Risk score: ${opp.risk_score || "Unknown"}

Provide JSON array of recommendations with:
- action: specific action to take
- priority: high/medium/low
- reasoning: why this matters
- impact: expected outcome`,
      maxTokens: 500,
    })

    try {
      const recommendations = JSON.parse(text)
      return { success: true, data: recommendations }
    } catch {
      return {
        success: true,
        data: [
          {
            action: "Schedule follow-up call",
            priority: "high",
            reasoning: "Maintain engagement momentum",
            impact: "Increase win probability by 15%",
          },
        ],
      }
    }
  } catch (error) {
    console.error("[v0] Get recommendations error:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to get recommendations" }
  }
}
