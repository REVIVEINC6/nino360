"use server"

import { z } from "zod"
import { createServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

const projectSchema = z.object({
  id: z.string().uuid().optional(),
  code: z.string().min(2, "Code must be at least 2 characters"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  client_id: z.string().uuid().optional().nullable(),
  owner_id: z.string().uuid().optional().nullable(),
  description: z.string().optional().nullable(),
  start_date: z.string().optional().nullable(),
  end_date: z.string().optional().nullable(),
  model: z.enum(["T&M", "Fixed", "Retainer", "Internal"]).default("T&M"),
  color: z.string().optional().nullable(),
})

export async function listProjects() {
  const supabase = await createServerClient()

  const { data, error } = await supabase
    .from("proj.projects")
    .select("*, finance.clients(name), core.users(full_name)")
    .order("created_at", { ascending: false })

  if (error) throw new Error(error.message)
  return data
}

export async function getProject(id: string) {
  const supabase = await createServerClient()

  const { data, error } = await supabase
    .from("proj.projects")
    .select("*, finance.clients(name), core.users(full_name)")
    .eq("id", id)
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function upsertProject(input: unknown) {
  const body = projectSchema.parse(input)
  const supabase = await createServerClient()

  const { data, error } = await supabase.from("proj.projects").upsert(body).select().single()

  if (error) throw new Error(error.message)

  // Log audit
  await supabase.rpc("proj.audit", {
    _action: body.id ? "update" : "create",
    _resource: "project",
    _payload: data,
  })

  revalidatePath("/projects")
  return data
}

export async function setProjectStatus(
  id: string,
  status: "planned" | "active" | "on_hold" | "completed" | "canceled",
) {
  const supabase = await createServerClient()

  const { data, error } = await supabase.from("proj.projects").update({ status }).eq("id", id).select().single()

  if (error) throw new Error(error.message)

  revalidatePath("/projects")
  return data
}

export async function deleteProject(id: string) {
  const supabase = await createServerClient()

  const { error } = await supabase.from("proj.projects").delete().eq("id", id)

  if (error) throw new Error(error.message)

  revalidatePath("/projects")
  return { success: true }
}

// Budget actions
const budgetSchema = z.object({
  project_id: z.string().uuid(),
  currency: z.string().default("USD"),
  labor_budget: z.number().min(0).default(0),
  expense_budget: z.number().min(0).default(0),
  fee_budget: z.number().min(0).default(0),
})

export async function upsertBudget(input: unknown) {
  const body = budgetSchema.parse(input)
  const supabase = await createServerClient()

  const { data, error } = await supabase.from("proj.budgets").upsert(body).select().single()

  if (error) throw new Error(error.message)

  revalidatePath("/projects")
  return data
}
