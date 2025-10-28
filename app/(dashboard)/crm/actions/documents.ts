"use server"

import { z } from "zod"
import { createServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { generateText } from "ai"

const documentSchema = z.object({
  id: z.string().uuid().optional(),
  account_id: z.string().uuid().optional(),
  opportunity_id: z.string().uuid().optional(),
  title: z.string().min(2, "Title must be at least 2 characters"),
  kind: z.enum(["proposal", "quote", "msa", "nda", "sow", "other"]),
  file_url: z.string().url("Must be a valid URL"),
  mime: z.string().optional(),
  status: z.enum(["draft", "shared", "viewed", "signed", "expired", "void"]).default("draft"),
  expires_at: z.string().optional(),
})

export async function upsertDocument(input: unknown) {
  const supabase = await createServerClient()
  const body = documentSchema.parse(input)

  const { data, error } = await supabase.from("crm.documents").upsert(body).select().single()

  if (error) throw new Error(error.message)

  revalidatePath("/crm/documents")
  return data
}

export async function shareWithPortal({
  opportunity_id,
  document_id,
  portal_account_id,
}: {
  opportunity_id?: string
  document_id?: string
  portal_account_id: string
}) {
  const supabase = await createServerClient()

  // Get current tenant_id
  const { data: tenantData } = await supabase.rpc("exec_sql", {
    q: "select sec.current_tenant_id()",
  })

  const { error } = await supabase.from("cportal.shares").insert({
    portal_account_id,
    tenant_id: tenantData,
    opportunity_id,
    document_id,
  })

  if (error) throw new Error(error.message)

  revalidatePath("/crm/documents")
  return { ok: true }
}

export async function getDocuments(filters?: { opportunity_id?: string; kind?: string }) {
  const supabase = await createServerClient()

  let query = supabase
    .from("crm.documents")
    .select(`
      *,
      account:crm.accounts(id, name),
      opportunity:crm.opportunities(id, title),
      created_by_user:core.users!created_by(id, email, full_name)
    `)
    .order("created_at", { ascending: false })

  if (filters?.opportunity_id) {
    query = query.eq("opportunity_id", filters.opportunity_id)
  }

  if (filters?.kind) {
    query = query.eq("kind", filters.kind)
  }

  const { data, error } = await query

  if (error) throw new Error(error.message)

  return data
}

export async function analyzeDocument(documentId: string) {
  const supabase = await createServerClient()

  // Get document details
  const { data: document, error: docError } = await supabase
    .from("crm.documents")
    .select("*")
    .eq("id", documentId)
    .single()

  if (docError) throw new Error(docError.message)

  // Use AI to analyze document (simulated - in production would extract text from file)
  const { text } = await generateText({
    model: "openai/gpt-4o",
    prompt: `Analyze this ${document.kind} document titled "${document.title}". 
    Provide:
    1. A brief summary (2-3 sentences)
    2. Key terms (5-7 important terms)
    3. Sentiment analysis (positive/negative/neutral with score)
    4. Risk score (0-100, where higher is riskier)
    5. 3 actionable insights
    
    Format as JSON with keys: summary, keyTerms, sentiment, riskScore, insights`,
  })

  const analysis = JSON.parse(text)

  // Update document with AI analysis
  const { error: updateError } = await supabase
    .from("crm.documents")
    .update({
      ai_summary: analysis.summary,
      ai_key_terms: analysis.keyTerms,
      ai_sentiment: analysis.sentiment,
      ai_risk_score: analysis.riskScore,
      ai_confidence: 0.85,
    })
    .eq("id", documentId)

  if (updateError) throw new Error(updateError.message)

  // Store AI insights
  for (const insight of analysis.insights) {
    await supabase.from("crm.document_ai_insights").insert({
      document_id: documentId,
      insight_type: insight.type,
      title: insight.title,
      description: insight.description,
      confidence: 0.85,
      priority: insight.priority,
    })
  }

  revalidatePath("/crm/documents")
  return analysis
}

export async function trackDocumentView(
  documentId: string,
  viewerData: {
    email?: string
    ip?: string
    deviceType?: string
    timeSpent?: number
  },
) {
  const supabase = await createServerClient()

  // Insert analytics record
  const { error } = await supabase.from("crm.document_analytics").insert({
    document_id: documentId,
    viewer_email: viewerData.email,
    viewer_ip: viewerData.ip,
    device_type: viewerData.deviceType,
    time_spent_seconds: viewerData.timeSpent || 0,
  })

  if (error) throw new Error(error.message)

  // Update document view count
  await supabase.rpc("exec_sql", {
    q: `UPDATE crm.documents 
        SET view_count = view_count + 1, 
            last_viewed_at = now() 
        WHERE id = '${documentId}'`,
  })

  revalidatePath("/crm/documents")
  return { ok: true }
}

export async function getDocumentAnalytics(documentId: string) {
  const supabase = await createServerClient()

  const { data, error } = await supabase
    .from("crm.document_analytics_summary")
    .select("*")
    .eq("id", documentId)
    .single()

  if (error) throw new Error(error.message)

  return data
}

export async function getDocumentInsights(documentId: string) {
  const supabase = await createServerClient()

  const { data, error } = await supabase
    .from("crm.document_ai_insights")
    .select("*")
    .eq("document_id", documentId)
    .order("created_at", { ascending: false })

  if (error) throw new Error(error.message)

  return data
}

export async function getDocumentsEnhanced(filters?: { opportunity_id?: string; kind?: string }) {
  const supabase = await createServerClient()

  let query = supabase
    .from("crm.documents")
    .select(`
      *,
      account:crm.accounts(id, name),
      opportunity:crm.opportunities(id, title),
      created_by_user:core.users!created_by(id, email, full_name)
    `)
    .order("created_at", { ascending: false })

  if (filters?.opportunity_id) {
    query = query.eq("opportunity_id", filters.opportunity_id)
  }

  if (filters?.kind) {
    query = query.eq("kind", filters.kind)
  }

  const { data, error } = await query

  if (error) throw new Error(error.message)

  return data
}
