"use server"

import { createServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { generateText } from "ai"

// Get all sequences
export async function getSequences() {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { data, error } = await supabase.from("email_sequences").select("*").order("created_at", { ascending: false })

  if (error) throw error
  return data
}

// Create sequence
export async function createSequence(formData: {
  name: string
  description?: string
  steps: Array<{
    step_number: number
    delay_days: number
    subject: string
    body: string
  }>
}) {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { data, error } = await supabase
    .from("email_sequences")
    .insert({
      name: formData.name,
      description: formData.description,
      steps: formData.steps,
      created_by: user.id,
    })
    .select()
    .single()

  if (error) throw error

  revalidatePath("/crm/engagement")
  return data
}

// AI optimize sequence
export async function aiOptimizeSequence(sequenceId: string) {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  // Get sequence
  const { data: sequence, error: fetchError } = await supabase
    .from("email_sequences")
    .select("*")
    .eq("id", sequenceId)
    .single()

  if (fetchError) throw fetchError

  // Use AI to optimize
  const { text } = await generateText({
    model: "openai/gpt-4o",
    prompt: `Analyze this email sequence and provide optimization recommendations:
    
Sequence: ${sequence.name}
Steps: ${JSON.stringify(sequence.steps)}

Provide:
1. Best send times for each step
2. Subject line variants with higher open rates
3. Predicted open rate for the sequence
4. Recommendations for improvement

Return as JSON.`,
  })

  const insights = JSON.parse(text)

  // Update sequence with AI insights
  const { data, error } = await supabase
    .from("email_sequences")
    .update({
      ai_optimized: true,
      ai_insights: insights,
      ml_confidence: 0.85,
    })
    .eq("id", sequenceId)
    .select()
    .single()

  if (error) throw error

  revalidatePath("/crm/engagement")
  return data
}

// Enroll contact in sequence
export async function enrollInSequence(sequenceId: string, contactId: string) {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  // Calculate next send time (immediate for first step)
  const nextSendAt = new Date()

  const { data, error } = await supabase
    .from("sequence_enrollments")
    .insert({
      sequence_id: sequenceId,
      contact_id: contactId,
      next_send_at: nextSendAt.toISOString(),
    })
    .select()
    .single()

  if (error) throw error

  revalidatePath("/crm/engagement")
  return data
}

// Get all templates
export async function getTemplates() {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { data, error } = await supabase.from("email_templates").select("*").order("usage_count", { ascending: false })

  if (error) throw error
  return data
}

// Create template
export async function createTemplate(formData: {
  name: string
  category: string
  subject: string
  body: string
}) {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { data, error } = await supabase
    .from("email_templates")
    .insert({
      ...formData,
      created_by: user.id,
    })
    .select()
    .single()

  if (error) throw error

  revalidatePath("/crm/engagement")
  return data
}

// AI generate template variants
export async function aiGenerateTemplateVariants(templateId: string) {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  // Get template
  const { data: template, error: fetchError } = await supabase
    .from("email_templates")
    .select("*")
    .eq("id", templateId)
    .single()

  if (fetchError) throw fetchError

  // Generate variants with AI
  const { text } = await generateText({
    model: "openai/gpt-4o",
    prompt: `Generate 3 variants of this email template optimized for higher engagement:
    
Subject: ${template.subject}
Body: ${template.body}

For each variant, provide:
- subject: Alternative subject line
- body: Alternative email body
- predicted_improvement: Estimated % improvement in open/reply rate

Return as JSON array.`,
  })

  const variants = JSON.parse(text)

  // Update template with variants
  const { data, error } = await supabase
    .from("email_templates")
    .update({
      ai_generated: true,
      ai_variants: variants,
    })
    .eq("id", templateId)
    .select()
    .single()

  if (error) throw error

  revalidatePath("/crm/engagement")
  return data
}

// Get all campaigns
export async function getCampaigns() {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { data, error } = await supabase
    .from("marketing_campaigns")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) throw error
  return data
}

// Create campaign
export async function createCampaign(formData: {
  name: string
  description?: string
  template_id?: string
  segment_criteria?: any
}) {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { data, error } = await supabase
    .from("marketing_campaigns")
    .insert({
      ...formData,
      created_by: user.id,
    })
    .select()
    .single()

  if (error) throw error

  revalidatePath("/crm/engagement")
  return data
}

// AI optimize campaign send time
export async function aiOptimizeCampaignSendTime(campaignId: string) {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  // Use AI to predict best send time
  const { text } = await generateText({
    model: "openai/gpt-4o",
    prompt: `Based on email engagement patterns, predict the best send time for a marketing campaign.
    
Consider:
- Industry best practices
- Time zones
- Day of week
- Historical open rates

Provide:
- recommended_send_time: ISO timestamp
- predicted_open_rate: percentage
- predicted_click_rate: percentage
- reasoning: explanation

Return as JSON.`,
  })

  const insights = JSON.parse(text)

  // Update campaign
  const { data, error } = await supabase
    .from("marketing_campaigns")
    .update({
      ai_optimized: true,
      ai_send_time: insights.recommended_send_time,
      ai_insights: insights,
    })
    .eq("id", campaignId)
    .select()
    .single()

  if (error) throw error

  revalidatePath("/crm/engagement")
  return data
}

// Get engagement analytics
export async function getEngagementAnalytics() {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  // Get sequences stats
  const { data: sequences } = await supabase
    .from("email_sequences")
    .select("total_sent, total_opened, total_clicked, total_replied")

  // Get campaigns stats
  const { data: campaigns } = await supabase
    .from("marketing_campaigns")
    .select("sent_count, opened_count, clicked_count")

  const _sequences: any[] = sequences || []
  const _campaigns: any[] = campaigns || []

  const totalSent =
    (_sequences.reduce((sum: number, s: any) => sum + (s.total_sent || 0), 0) || 0) +
    (_campaigns.reduce((sum: number, c: any) => sum + (c.sent_count || 0), 0) || 0)

  const totalOpened =
    (_sequences.reduce((sum: number, s: any) => sum + (s.total_opened || 0), 0) || 0) +
    (_campaigns.reduce((sum: number, c: any) => sum + (c.opened_count || 0), 0) || 0)

  const totalClicked =
    (_sequences.reduce((sum: number, s: any) => sum + (s.total_clicked || 0), 0) || 0) +
    (_campaigns.reduce((sum: number, c: any) => sum + (c.clicked_count || 0), 0) || 0)

  const totalReplied = _sequences.reduce((sum: number, s: any) => sum + (s.total_replied || 0), 0) || 0

  return {
    totalSent,
    totalOpened,
    totalClicked,
    totalReplied,
    openRate: totalSent > 0 ? (totalOpened / totalSent) * 100 : 0,
    clickRate: totalSent > 0 ? (totalClicked / totalSent) * 100 : 0,
    replyRate: totalSent > 0 ? (totalReplied / totalSent) * 100 : 0,
  }
}
