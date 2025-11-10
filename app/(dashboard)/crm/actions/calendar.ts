"use server"

import { createServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { generateText } from "ai"

// Get events with filters
export async function getEvents(filters?: {
  startDate?: string
  endDate?: string
  type?: string
  status?: string
}) {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  // During SSR there may be no user — return safe defaults so the calendar page can render
  if (!user) {
    return {
      totalEvents: 0,
      completedEvents: 0,
      upcomingEvents: 0,
      totalTasks: 0,
      completedTasks: 0,
      overdueTasks: 0,
      highPriorityTasks: 0,
    }
  }

  let query = supabase
    .from("crm.events")
    .select(`
      *,
      contact:crm.contacts(id, first_name, last_name, email),
      account:crm.accounts(id, name),
      opportunity:crm.opportunities(id, title),
      owner:users(id, full_name, email)
    `)
    .order("start_time", { ascending: true })

  if (filters?.startDate) {
    query = query.gte("start_time", filters.startDate)
  }
  if (filters?.endDate) {
    query = query.lte("start_time", filters.endDate)
  }
  if (filters?.type) {
    query = query.eq("event_type", filters.type)
  }
  if (filters?.status) {
    query = query.eq("status", filters.status)
  }

  const { data, error } = await query

  if (error) throw error
  return data || []
}

// Get tasks with filters
export async function getTasks(filters?: {
  status?: string
  priority?: string
  dueDate?: string
}) {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  let query = supabase
    .from("crm.tasks")
    .select(`
      *,
      contact:crm.contacts(id, first_name, last_name),
      account:crm.accounts(id, name),
      opportunity:crm.opportunities(id, title),
      owner:users(id, full_name, email)
    `)
    .order("due_date", { ascending: true, nullsFirst: false })

  if (filters?.status) {
    query = query.eq("status", filters.status)
  }
  if (filters?.priority) {
    query = query.eq("priority", filters.priority)
  }
  if (filters?.dueDate) {
    query = query.lte("due_date", filters.dueDate)
  }

  const { data, error } = await query

  if (error) throw error
  return data || []
}

// AI-powered scheduling suggestions
export async function getSchedulingSuggestions(contactId?: string) {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  try {
    // Get user's past meeting patterns
    const { data: pastEvents } = await supabase
      .from("crm.events")
      .select("start_time, end_time, event_type")
      .eq("owner_id", user.id)
      .gte("start_time", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
      .order("start_time", { ascending: false })
      .limit(50)

    // Use AI to suggest optimal meeting times
    const { text } = await generateText({
      model: "openai/gpt-4o",
      prompt: `Based on this user's meeting history: ${JSON.stringify(pastEvents)}, 
      suggest 3 optimal meeting times for the next week. Consider:
      - Avoiding back-to-back meetings
      - Preferred meeting times based on history
      - Work hours (9 AM - 5 PM)
      
      Return as JSON array with: { time: ISO timestamp, confidence: 0-1, reasoning: string }`,
    })
    const suggestions: any[] = JSON.parse(text ?? "[]")

    // Store suggestions in database
    for (const suggestion of suggestions as any[]) {
      await supabase.from("crm.scheduling_suggestions").insert({
        user_id: user.id,
        suggested_time: suggestion.time,
        duration_minutes: 60,
        confidence: suggestion.confidence,
        reasoning: suggestion.reasoning,
        contact_id: contactId,
        model_version: "gpt-4o",
        factors: { pastEvents: pastEvents?.length || 0 },
      })
    }

    return suggestions
  } catch (error) {
    console.error("AI scheduling error:", error)
    return []
  }
}

// Create event with AI optimization
export async function createEvent(data: {
  title: string
  description?: string
  eventType: string
  startTime: string
  endTime: string
  location?: string
  meetingUrl?: string
  contactId?: string
  accountId?: string
  opportunityId?: string
  attendees?: any[]
}) {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { data: event, error } = await supabase
    .from("crm.events")
    .insert({
      ...data,
      owner_id: user.id,
      created_by: user.id,
    })
    .select()
    .single()

  if (error) throw error

  revalidatePath("/crm/calendar")
  return event
}

// Create task with AI prioritization
export async function createTask(data: {
  title: string
  description?: string
  taskType: string
  dueDate?: string
  priority: string
  contactId?: string
  accountId?: string
  opportunityId?: string
}) {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  // Use AI to suggest priority if not provided
  let aiPriorityScore = 0.5
  let aiReasoning = ""

  if (data.contactId || data.opportunityId) {
    try {
  const context: string[] = []

      if (data.contactId) {
        const { data: contact } = await supabase
          .from("crm.contacts")
          .select("first_name, last_name, health_score")
          .eq("id", data.contactId)
          .single()
        context.push(`Contact: ${contact?.first_name} ${contact?.last_name}, Health Score: ${contact?.health_score}`)
      }

      if (data.opportunityId) {
        const { data: opp } = await supabase
          .from("crm.opportunities")
          .select("title, amount, close_date, ai_win_probability")
          .eq("id", data.opportunityId)
          .single()
        context.push(`Opportunity: ${opp?.title}, Amount: $${opp?.amount}, Win Probability: ${opp?.ai_win_probability}`)
      }

      const { text } = await generateText({
        model: "openai/gpt-4o",
        prompt: `Task: "${data.title}". Context: ${context.join(", ")}. 
        Rate priority 0-1 and explain. Return JSON: { score: number, reasoning: string }`,
      })

      const result = JSON.parse(text)
      aiPriorityScore = result.score
      aiReasoning = result.reasoning
    } catch (error) {
      console.error("AI prioritization error:", error)
    }
  }

  const { data: task, error } = await supabase
    .from("crm.tasks")
    .insert({
      ...data,
      owner_id: user.id,
      ai_priority_score: aiPriorityScore,
      ai_reasoning: aiReasoning,
      created_by: user.id,
    })
    .select()
    .single()

  if (error) throw error

  revalidatePath("/crm/calendar")
  return task
}

// Update task status
export async function updateTaskStatus(taskId: string, status: string) {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const updates: any = { status, updated_by: user.id }
  if (status === "completed") {
    updates.completed_at = new Date().toISOString()
  }

  const { error } = await supabase.from("crm.tasks").update(updates).eq("id", taskId)

  if (error) throw error

  revalidatePath("/crm/calendar")
}

// Update event status
export async function updateEventStatus(eventId: string, status: string) {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { error } = await supabase.from("crm.events").update({ status, updated_by: user.id }).eq("id", eventId)

  if (error) throw error

  revalidatePath("/crm/calendar")
}

// Get calendar analytics
export async function getCalendarAnalytics() {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const now = new Date()
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

  const [eventsResult, tasksResult] = await Promise.all([
    supabase.from("crm.events").select("*").eq("owner_id", user.id).gte("start_time", weekAgo.toISOString()),
    supabase.from("crm.tasks").select("*").eq("owner_id", user.id),
  ])

  const events: any[] = eventsResult.data || []
  const tasks: any[] = tasksResult.data || []

  return {
    totalEvents: events.length,
  completedEvents: events.filter((e: any) => e.status === "completed").length,
  upcomingEvents: events.filter((e: any) => new Date(e.start_time) > now).length,
    totalTasks: tasks.length,
  completedTasks: tasks.filter((t: any) => t.status === "completed").length,
  overdueTasks: tasks.filter((t: any) => t.due_date && new Date(t.due_date) < now && t.status !== "completed").length,
  highPriorityTasks: tasks.filter((t: any) => t.priority === "high" || t.priority === "urgent").length,
  }
}
