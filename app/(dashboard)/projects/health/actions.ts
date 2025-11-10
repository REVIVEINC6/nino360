"use server"

import { createServerClient } from "@/lib/supabase/server"

export async function getProjectHealthMetrics() {
  const supabase = await createServerClient()

  // Get all projects with their metrics
  const { data: projects, error } = await supabase
    .from("projects")
    .select(`
      id,
      name,
      status,
      budget,
      start_date,
      end_date,
      progress,
      tasks:project_tasks(count),
      time_entries:project_time_entries(hours),
      expenses:project_expenses(amount)
    `)
    .eq("status", "active")

  if (error) throw error

  // Calculate health metrics for each project
  const healthMetrics =
    projects?.map((project) => {
      const daysRemaining = project.end_date
        ? Math.ceil((new Date(project.end_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
        : 0

      const totalHours = project.time_entries?.reduce((sum: number, entry: any) => sum + (entry.hours || 0), 0) || 0
      const totalExpenses = project.expenses?.reduce((sum: number, expense: any) => sum + (expense.amount || 0), 0) || 0
      const budgetUsed = (totalExpenses / (project.budget || 1)) * 100

      // Calculate health score (0-100)
      let healthScore = 100
      if (project.progress < 50 && daysRemaining < 30) healthScore -= 20
      if (budgetUsed > 90) healthScore -= 30
      if (project.progress < 30 && daysRemaining < 14) healthScore -= 30
      if (budgetUsed > 100) healthScore -= 20

      const health = healthScore >= 70 ? "healthy" : healthScore >= 40 ? "at_risk" : "critical"

      return {
        id: project.id,
        name: project.name,
        status: project.status,
        progress: project.progress || 0,
        budget: project.budget || 0,
        budgetUsed: totalExpenses,
        budgetPercentage: budgetUsed,
        daysRemaining,
        totalTasks: project.tasks?.[0]?.count || 0,
        totalHours,
        health,
        healthScore,
      }
    }) || []

  return healthMetrics
}
