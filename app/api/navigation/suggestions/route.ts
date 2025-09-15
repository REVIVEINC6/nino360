import { type NextRequest, NextResponse } from "next/server"

const suggestions = [
  { label: "Dashboard", href: "/dashboard", category: "Overview" },
  { label: "CRM Dashboard", href: "/crm", category: "CRM" },
  { label: "Leads", href: "/crm/leads", category: "CRM" },
  { label: "Contacts", href: "/crm/contacts", category: "CRM" },
  { label: "Pipeline", href: "/crm/pipeline", category: "CRM" },
  { label: "HRMS Dashboard", href: "/hrms", category: "HRMS" },
  { label: "Employees", href: "/hrms/employees", category: "HRMS" },
  { label: "Payroll", href: "/hrms/payroll", category: "HRMS" },
  { label: "Attendance", href: "/hrms/attendance", category: "HRMS" },
  { label: "Talent Dashboard", href: "/talent", category: "Talent" },
  { label: "Job Postings", href: "/talent/jobs", category: "Talent" },
  { label: "Candidates", href: "/talent/candidates", category: "Talent" },
  { label: "Interviews", href: "/talent/interviews", category: "Talent" },
  { label: "Finance Dashboard", href: "/finance", category: "Finance" },
  { label: "Settings", href: "/settings", category: "System" },
]

export async function POST(request: NextRequest) {
  try {
    const { context, currentModule, query } = await request.json()

    let filteredSuggestions = suggestions

    // Filter by current module if provided
    if (currentModule) {
      filteredSuggestions = suggestions.filter(
        (s) =>
          s.category.toLowerCase() === currentModule.toLowerCase() ||
          s.category === "Overview" ||
          s.category === "System",
      )
    }

    // Filter by query if provided
    if (query && typeof query === "string") {
      const normalizedQuery = query.toLowerCase()
      filteredSuggestions = filteredSuggestions.filter(
        (s) => s.label.toLowerCase().includes(normalizedQuery) || s.category.toLowerCase().includes(normalizedQuery),
      )
    }

    // Limit to top 10 suggestions
    const topSuggestions = filteredSuggestions.slice(0, 10)

    return NextResponse.json({ suggestions: topSuggestions })
  } catch (error) {
    console.error("Suggestions error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
