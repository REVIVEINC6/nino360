import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-server"

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const body = await request.json()

    const { context, tenant_id, existing_roles } = body

    // Mock AI suggestions for demo mode
    const mockSuggestions = {
      suggested_roles: [
        {
          name: "Data Analyst",
          description: "Access to analytics and reporting features",
          scope: "tenant",
          permissions: {
            analytics: ["read", "export"],
            reports: ["read", "create"],
          },
          field_permissions: {
            analytics: {
              reports: {
                sensitive_data: "restricted",
              },
            },
          },
          reasoning: "Based on usage patterns, a dedicated analytics role would improve data governance",
          risk_level: "low",
          compliance_notes: "Ensures proper data access controls for GDPR compliance",
        },
      ],
      optimization_recommendations: [
        {
          type: "consolidation",
          target_role: "Admin",
          recommendation: "Consider splitting admin role into separate system and tenant admin roles",
          impact: "Improved security through principle of least privilege",
          priority: "high",
        },
      ],
      security_insights: [
        {
          category: "over_privileged",
          description: "Some users have broader access than needed for their daily tasks",
          severity: "medium",
          recommendation: "Review and restrict permissions to essential functions only",
        },
      ],
    }

    // In demo mode, return mock data
    return NextResponse.json({
      data: mockSuggestions,
      metadata: {
        generated_at: new Date().toISOString(),
        context_analyzed: {
          existing_roles_count: existing_roles?.length || 0,
          field_definitions_count: 0,
          templates_available: 0,
        },
      },
    })
  } catch (error) {
    console.error("Error in POST /api/admin/roles/suggest:", error)
    return NextResponse.json({ error: "Failed to generate role suggestions" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    const { searchParams } = new URL(request.url)

    const tenantId = searchParams.get("tenant_id")
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    // Mock insights for demo mode
    const mockInsights = {
      insights: [
        {
          id: "1",
          insight_type: "over_privileged",
          title: "OVER PRIVILEGED Alert",
          description: "Multiple users have admin access but only use basic features",
          recommendation: "Consider creating role-specific permissions",
          confidence_score: 0.8,
          risk_score: 65,
          created_at: new Date().toISOString(),
          is_active: true,
        },
      ],
      templates: [
        {
          id: "1",
          name: "Standard Employee",
          description: "Basic employee access template",
          permissions: ["read_profile", "update_profile"],
          usage_count: 45,
          is_active: true,
        },
      ],
    }

    return NextResponse.json({
      data: mockInsights,
    })
  } catch (error) {
    console.error("Error in GET /api/admin/roles/suggest:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
