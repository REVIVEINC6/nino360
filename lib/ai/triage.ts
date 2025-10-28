"use server"

import { generateObject, generateText } from "ai"
import { z } from "zod"
import { createServerClient } from "@/lib/supabase/server"

// =====================================================
// AI Triage: Category/Priority Suggestion
// =====================================================

const triageSchema = z.object({
  category: z.string().describe("Suggested category (e.g., 'Benefits', 'Payroll', 'Leave', 'IT Access')"),
  subcategory: z.string().optional().describe("Suggested subcategory if applicable"),
  priority: z.enum(["P1", "P2", "P3", "P4"]).describe("Suggested priority based on urgency"),
  reasoning: z.string().describe("Brief explanation of the categorization"),
  confidence: z.number().min(0).max(1).describe("Confidence score 0-1"),
})

export async function triageCase(subject: string, description: string) {
  try {
    const { object } = await generateObject({
      model: "openai/gpt-5-mini",
      schema: triageSchema,
      prompt: `You are an HR helpdesk triage assistant. Analyze the following case and suggest:
1. Category (Benefits, Payroll, Leave, IT Access, Immigration, Documents, Other)
2. Subcategory if applicable
3. Priority (P1=Critical/Urgent, P2=High, P3=Normal, P4=Low)
4. Brief reasoning

Subject: ${subject}
Description: ${description}

Consider:
- P1: System outages, urgent compliance issues, critical access problems
- P2: Time-sensitive requests (payroll corrections, urgent leave)
- P3: Standard requests (policy questions, document requests)
- P4: General inquiries, non-urgent updates`,
    })

    return {
      success: true,
      triage: object,
    }
  } catch (error) {
    console.error("[v0] triageCase error:", error)
    return {
      success: false,
      error: "Failed to triage case",
    }
  }
}

// =====================================================
// AI: Find Similar Cases
// =====================================================

export async function findSimilarCases(subject: string, description: string, tenantId: string) {
  try {
    const supabase = await createServerClient()

    // Get recent resolved cases for similarity matching
    const { data: cases, error } = await supabase
      .from("helpdesk_cases")
      .select("id, number, subject, description, category, resolution_text")
      .eq("tenant_id", tenantId)
      .in("status", ["RESOLVED", "CLOSED"])
      .order("resolved_at", { ascending: false })
      .limit(50)

    if (error || !cases || cases.length === 0) {
      return { success: true, similar: [] }
    }

    // Use AI to find similar cases
    const { text } = await generateText({
      model: "openai/gpt-5-mini",
      prompt: `You are an HR helpdesk assistant. Find the top 3 most similar cases to the current case.

Current Case:
Subject: ${subject}
Description: ${description}

  Past Cases:
${cases.map((c: any, i: number) => `${i + 1}. [${c.number}] ${c.subject}\n   ${c.description}\n   Resolution: ${c.resolution_text || "N/A"}`).join("\n\n")}

Return only the case numbers of the top 3 most similar cases, separated by commas. If fewer than 3 are similar, return only those. If none are similar, return "NONE".`,
    })

    if (text === "NONE") {
      return { success: true, similar: [] }
    }

    // Parse case numbers from response
    const caseNumbers = text.split(",").map((n: any) => n.trim())
    const similar = cases.filter((c: any) => caseNumbers.includes(c.number))

    return {
      success: true,
      similar: similar.map((c: any) => ({
        id: c.id,
        number: c.number,
        subject: c.subject,
        resolution: c.resolution_text,
      })),
    }
  } catch (error) {
    console.error("[v0] findSimilarCases error:", error)
    return {
      success: false,
      error: "Failed to find similar cases",
    }
  }
}

// =====================================================
// AI: Draft Reply
// =====================================================

export async function draftReply(caseSubject: string, caseDescription: string, context?: string) {
  try {
    const { text } = await generateText({
      model: "openai/gpt-5-mini",
      prompt: `You are an HR helpdesk agent. Draft a professional, empathetic reply to the following case:

Subject: ${caseSubject}
Description: ${caseDescription}

${context ? `Additional context: ${context}` : ""}

Write a clear, helpful response that:
1. Acknowledges the employee's concern
2. Provides relevant information or next steps
3. Sets appropriate expectations
4. Maintains a professional yet friendly tone

Keep the response concise (2-3 paragraphs).`,
    })

    return {
      success: true,
      draft: text,
    }
  } catch (error) {
    console.error("[v0] draftReply error:", error)
    return {
      success: false,
      error: "Failed to draft reply",
    }
  }
}

// =====================================================
// AI: Suggest KB Articles
// =====================================================

export async function suggestKbArticles(subject: string, description: string, tenantId: string) {
  try {
    const supabase = await createServerClient()

    // Get published KB articles
    const { data: articles, error } = await supabase
      .from("helpdesk_kb_articles")
      .select("id, slug, title, keywords, category")
      .eq("tenant_id", tenantId)
      .not("published_at", "is", null)
      .limit(20)

    if (error || !articles || articles.length === 0) {
      return { success: true, articles: [] }
    }

    // Use AI to find relevant articles
    const { text } = await generateText({
      model: "openai/gpt-5-mini",
      prompt: `You are an HR helpdesk assistant. Find the top 3 most relevant KB articles for the following case:

Subject: ${subject}
Description: ${description}

  Available KB Articles:
${articles.map((a: any, i: number) => `${i + 1}. [${a.slug}] ${a.title}\n   Category: ${a.category || "N/A"}\n   Keywords: ${a.keywords?.join(", ") || "N/A"}`).join("\n\n")}

Return only the slugs of the top 3 most relevant articles, separated by commas. If fewer than 3 are relevant, return only those. If none are relevant, return "NONE".`,
    })

    if (text === "NONE") {
      return { success: true, articles: [] }
    }

    // Parse slugs from response
    const slugs = text.split(",").map((s: any) => s.trim())
    const relevant = articles.filter((a: any) => slugs.includes(a.slug))

    return {
      success: true,
      articles: relevant.map((a: any) => ({
        id: a.id,
        slug: a.slug,
        title: a.title,
      })),
    }
  } catch (error) {
    console.error("[v0] suggestKbArticles error:", error)
    return {
      success: false,
      error: "Failed to suggest KB articles",
    }
  }
}
