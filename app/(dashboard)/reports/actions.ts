"use server"

import { createServerClient } from "@/lib/supabase/server"

export async function getReportsOverview() {
  const supabase = await createServerClient()

  // Stub: Return mock data
  return {
    totalReports: 156,
    scheduledReports: 23,
    sharedReports: 45,
    recentReports: [
      {
        id: "1",
        name: "Monthly Revenue Report",
        type: "Financial",
        lastRun: "2024-01-15T10:30:00Z",
        status: "completed",
        size: "2.4 MB",
      },
      {
        id: "2",
        name: "Employee Headcount",
        type: "HR",
        lastRun: "2024-01-14T15:45:00Z",
        status: "completed",
        size: "1.1 MB",
      },
      {
        id: "3",
        name: "Sales Pipeline Analysis",
        type: "CRM",
        lastRun: "2024-01-14T09:20:00Z",
        status: "completed",
        size: "3.2 MB",
      },
    ],
    popularReports: [
      { name: "Revenue by Department", runs: 245 },
      { name: "Hiring Funnel", runs: 189 },
      { name: "Customer Acquisition", runs: 167 },
      { name: "Employee Turnover", runs: 143 },
    ],
  }
}
