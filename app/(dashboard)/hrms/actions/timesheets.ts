"use server"

import { z } from "zod"
import { createServerClient } from "@/lib/supabase/server"

const timesheetSchema = z.object({
  id: z.string().uuid().optional(),
  employee_id: z.string().uuid(),
  week_start: z.string(),
  status: z.enum(["open", "submitted", "approved", "rejected", "exported"]).default("open"),
  approved_by: z.string().uuid().optional(),
})

const lineSchema = z.object({
  id: z.string().uuid().optional(),
  timesheet_id: z.string().uuid(),
  project: z.string().optional(),
  task: z.string().optional(),
  day: z.string(),
  hours: z.number().min(0).max(24),
  notes: z.string().optional(),
})

export async function upsertTimesheet(input: unknown) {
  const supabase = await createServerClient()
  const body = timesheetSchema.parse(input)

  const { data, error } = await supabase.from("timesheets").upsert(body).select().single()

  if (error) throw error

  return data
}

export async function submitTimesheet(id: string) {
  const supabase = await createServerClient()

  const { data, error } = await supabase
    .from("timesheets")
    .update({ status: "submitted", submitted_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single()

  if (error) throw error

  return data
}

export async function approveTimesheet(id: string, approverId: string) {
  const supabase = await createServerClient()

  const { data, error } = await supabase
    .from("timesheets")
    .update({
      status: "approved",
      approved_by: approverId,
      approved_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single()

  if (error) throw error

  return data
}

export async function upsertTimesheetLine(input: unknown) {
  const supabase = await createServerClient()
  const body = lineSchema.parse(input)

  const { data, error } = await supabase.from("timesheet_lines").upsert(body).select().single()

  if (error) throw error
  return data
}

export async function listTimesheets(filters?: {
  employee_id?: string
  status?: string
  week_start?: string
}) {
  const supabase = await createServerClient()
  let query = supabase
    .from("timesheets")
    .select("*, employee:employees(first_name, last_name, code)")
    .order("week_start", { ascending: false })

  if (filters?.employee_id) {
    query = query.eq("employee_id", filters.employee_id)
  }

  if (filters?.status) {
    query = query.eq("status", filters.status)
  }

  if (filters?.week_start) {
    query = query.eq("week_start", filters.week_start)
  }

  const { data, error } = await query

  if (error) throw error
  return data || []
}

export async function getTimesheetLines(timesheetId: string) {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from("timesheet_lines")
    .select("*")
    .eq("timesheet_id", timesheetId)
    .order("day", { ascending: true })

  if (error) throw error
  return data || []
}
