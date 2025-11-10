"use server"

import { z } from "zod"
import { createServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

const entrySchema = z.object({
  work_date: z.string(),
  hours: z.number().min(0).max(24),
  project: z.string().optional(),
  task: z.string().optional(),
  notes: z.string().optional(),
  bill_rate: z.number().optional(),
  pay_rate: z.number().optional(),
})

const timesheetSchema = z.object({
  id: z.string().uuid().optional(),
  person_id: z.string().uuid(),
  person_name: z.string(),
  placement_id: z.string().uuid().optional(),
  week_start: z.string(),
  notes: z.string().optional(),
  entries: z.array(entrySchema).min(1),
})

export async function upsertTimesheet(input: unknown) {
  try {
    const body = timesheetSchema.parse(input)
    const supabase = await createServerClient()

    // Calculate week_end (6 days after week_start)
    const weekStart = new Date(body.week_start)
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekStart.getDate() + 6)

    // Upsert timesheet header
    const timesheet = {
      id: body.id,
      person_id: body.person_id,
      person_name: body.person_name,
      placement_id: body.placement_id,
      week_start: body.week_start,
      week_end: weekEnd.toISOString().slice(0, 10),
      notes: body.notes,
    }

    const { data: header, error: headerError } = await supabase
      .from("finance.timesheets")
      .upsert(timesheet)
      .select()
      .single()

    if (headerError) throw headerError

    // Delete existing entries
    await supabase.from("finance.timesheet_entries").delete().eq("timesheet_id", header.id)

    // Insert new entries
    const entries = body.entries.map((entry) => ({
      ...entry,
      timesheet_id: header.id,
    }))

    const { error: entriesError } = await supabase.from("finance.timesheet_entries").insert(entries)

    if (entriesError) throw entriesError

    // Audit log
    await supabase.rpc("finance.audit", {
      _action: body.id ? "update" : "create",
      _resource: "timesheet",
      _payload: { header, entries },
    })

    revalidatePath("/finance/timesheets")
    return { success: true, data: header }
  } catch (error) {
    console.error("[v0] Error upserting timesheet:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to save timesheet" }
  }
}

export async function submitTimesheet(id: string) {
  try {
    const supabase = await createServerClient()

    const { data, error } = await supabase
      .from("finance.timesheets")
      .update({ status: "submitted" })
      .eq("id", id)
      .select()
      .single()

    if (error) throw error

    await supabase.rpc("finance.audit", {
      _action: "submit",
      _resource: "timesheet",
      _payload: { id },
    })

    revalidatePath("/finance/timesheets")
    revalidatePath("/finance/approvals")
    return { success: true, data }
  } catch (error) {
    console.error("[v0] Error submitting timesheet:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to submit timesheet" }
  }
}

export async function approveTimesheet(id: string, approver_id: string) {
  try {
    const supabase = await createServerClient()

    const { data, error } = await supabase
      .from("finance.timesheets")
      .update({
        status: "approved",
        approver_id,
        approved_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()

    if (error) throw error

    await supabase.rpc("finance.audit", {
      _action: "approve",
      _resource: "timesheet",
      _payload: { id, approver_id },
    })

    revalidatePath("/finance/timesheets")
    revalidatePath("/finance/approvals")
    return { success: true, data }
  } catch (error) {
    console.error("[v0] Error approving timesheet:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to approve timesheet" }
  }
}

export async function rejectTimesheet(id: string, approver_id: string, reason?: string) {
  try {
    const supabase = await createServerClient()

    const { data, error } = await supabase
      .from("finance.timesheets")
      .update({
        status: "rejected",
        approver_id,
        notes: reason,
      })
      .eq("id", id)
      .select()
      .single()

    if (error) throw error

    await supabase.rpc("finance.audit", {
      _action: "reject",
      _resource: "timesheet",
      _payload: { id, approver_id, reason },
    })

    revalidatePath("/finance/timesheets")
    revalidatePath("/finance/approvals")
    return { success: true, data }
  } catch (error) {
    console.error("[v0] Error rejecting timesheet:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to reject timesheet" }
  }
}
