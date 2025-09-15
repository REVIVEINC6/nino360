import { type NextRequest, NextResponse } from "next/server"

const navigationMap: Record<string, string> = {
  // Dashboard
  dashboard: "/dashboard",
  home: "/dashboard",
  overview: "/dashboard",

  // CRM
  crm: "/crm",
  customer: "/crm",
  leads: "/crm/leads",
  contacts: "/crm/contacts",
  pipeline: "/crm/pipeline",
  sales: "/crm",

  // HRMS
  hrms: "/hrms",
  hr: "/hrms",
  "human resources": "/hrms",
  employees: "/hrms/employees",
  payroll: "/hrms/payroll",
  attendance: "/hrms/attendance",

  // Talent
  talent: "/talent",
  recruitment: "/talent",
  hiring: "/talent",
  jobs: "/talent/jobs",
  candidates: "/talent/candidates",
  interviews: "/talent/interviews",

  // Finance
  finance: "/finance",
  financial: "/finance",
  accounting: "/finance",
  invoices: "/finance/invoices",
  expenses: "/finance/expenses",

  // Settings
  settings: "/settings",
  configuration: "/settings",
  preferences: "/settings",
}

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json()

    if (!query || typeof query !== "string") {
      return NextResponse.json({ error: "Invalid query" }, { status: 400 })
    }

    const normalizedQuery = query.toLowerCase().trim()

    // Direct matches
    for (const [key, path] of Object.entries(navigationMap)) {
      if (normalizedQuery.includes(key)) {
        return NextResponse.json({ destination: path })
      }
    }

    // Fuzzy matching for common phrases
    if (
      normalizedQuery.includes("take me to") ||
      normalizedQuery.includes("go to") ||
      normalizedQuery.includes("show me")
    ) {
      for (const [key, path] of Object.entries(navigationMap)) {
        if (normalizedQuery.includes(key)) {
          return NextResponse.json({ destination: path })
        }
      }
    }

    // Default fallback
    return NextResponse.json({
      destination: "/dashboard",
      message: "I couldn't find a specific match, taking you to the dashboard instead.",
    })
  } catch (error) {
    console.error("AI navigation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
