"use server"

import { createServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export interface Ticket {
  id: string
  ticket_number: string
  subject: string
  description: string
  customer_name: string
  customer_email: string
  tenant_id: string
  priority: "low" | "medium" | "high" | "urgent"
  status: "open" | "in_progress" | "waiting" | "resolved" | "closed"
  category: string
  assigned_to?: string
  created_at: string
  updated_at: string
  resolved_at?: string
  first_response_at?: string
  tags?: string[]
  ai_sentiment?: string
  ai_category?: string
  ai_priority_score?: number
}

export async function getTickets() {
  const supabase = await createServerClient()

  const { data, error } = await supabase
    .from("admin_support_tickets")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) throw error
  return data as Ticket[]
}

export async function getTicketStats() {
  const supabase = await createServerClient()

  const [totalResult, openResult, resolvedResult, avgResponseResult] = await Promise.all([
    supabase.from("admin_support_tickets").select("id", { count: "exact", head: true }),
    supabase.from("admin_support_tickets").select("id", { count: "exact", head: true }).eq("status", "open"),
    supabase.from("admin_support_tickets").select("id", { count: "exact", head: true }).eq("status", "resolved"),
    supabase.from("admin_support_tickets").select("created_at, first_response_at").not("first_response_at", "is", null),
  ])

  let avgResponseTime = 0
  if (avgResponseResult.data && avgResponseResult.data.length > 0) {
    const times = avgResponseResult.data.map((t: any) => {
      const created = new Date(t.created_at).getTime()
      const responded = new Date(t.first_response_at!).getTime()
      return (responded - created) / (1000 * 60 * 60) // hours
    })
    avgResponseTime = times.reduce((a: number, b: number) => a + b, 0) / times.length
  }

  return {
    total: totalResult.count || 0,
    open: openResult.count || 0,
    resolved: resolvedResult.count || 0,
    avgResponseTime: Math.round(avgResponseTime * 10) / 10,
  }
}

export async function createTicket(data: {
  subject: string
  description: string
  customer_name: string
  customer_email: string
  priority: string
  category: string
}) {
  const supabase = await createServerClient()

  // Generate ticket number
  const { count } = await supabase.from("admin_support_tickets").select("*", { count: "exact", head: true })

  const ticketNumber = `TKT-${String((count || 0) + 1).padStart(4, "0")}`

  const { data: ticket, error } = await supabase
    .from("admin_support_tickets")
    .insert({
      ticket_number: ticketNumber,
      ...data,
      status: "open",
    })
    .select()
    .single()

  if (error) throw error

  revalidatePath("/admin/tickets")
  return ticket
}

export async function updateTicket(id: string, updates: Partial<Ticket>) {
  const supabase = await createServerClient()

  const { data, error } = await supabase.from("admin_support_tickets").update(updates).eq("id", id).select().single()

  if (error) throw error

  revalidatePath("/admin/tickets")
  return data
}

export async function assignTicket(id: string, userId: string) {
  return updateTicket(id, { assigned_to: userId })
}

export async function resolveTicket(id: string) {
  return updateTicket(id, {
    status: "resolved",
    resolved_at: new Date().toISOString(),
  })
}

export async function getAITicketInsights() {
  const supabase = await createServerClient()

  const { data } = await supabase.from("admin_support_tickets").select("ai_sentiment, ai_category, priority, status")

  if (!data) return null

  const sentimentCounts = data.reduce(
    (acc: Record<string, number>, t: any) => {
      if (t.ai_sentiment) {
        acc[t.ai_sentiment] = (acc[t.ai_sentiment] || 0) + 1
      }
      return acc
    },
    {} as Record<string, number>,
  )

  const categoryCounts = data.reduce(
    (acc: Record<string, number>, t: any) => {
      if (t.ai_category) {
        acc[t.ai_category] = (acc[t.ai_category] || 0) + 1
      }
      return acc
    },
    {} as Record<string, number>,
  )

  return {
    sentimentDistribution: sentimentCounts,
    categoryDistribution: categoryCounts,
    urgentCount: data.filter((t: any) => t.priority === "urgent" && t.status === "open").length,
  }
}
