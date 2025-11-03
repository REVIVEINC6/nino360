"use server"

import { createServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function getProjectExpenses(projectId: string) {
  const supabase = await createServerClient()

  const { data: expenses, error } = await supabase
    .from("project_expenses")
    .select(`
      *,
      employee:employees(id, first_name, last_name),
      category:expense_categories(id, name)
    `)
    .eq("project_id", projectId)
    .order("date", { ascending: false })

  if (error) throw error

  return expenses || []
}

export async function createProjectExpense(projectId: string, data: any) {
  const supabase = await createServerClient()

  const { error } = await supabase.from("project_expenses").insert({
    project_id: projectId,
    ...data,
  })

  if (error) throw error

  revalidatePath(`/projects/${projectId}/expenses`)
  return { success: true }
}

export async function updateExpenseStatus(expenseId: string, status: string) {
  const supabase = await createServerClient()

  const { error } = await supabase.from("project_expenses").update({ status }).eq("id", expenseId)

  if (error) throw error

  revalidatePath(`/projects/[id]/expenses`)
  return { success: true }
}
