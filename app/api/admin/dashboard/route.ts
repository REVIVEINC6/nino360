import { type NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase/client"
import { hasPermission } from "@/lib/auth/rbac"
import { rateLimit } from "@/lib/middleware/rate-limit"
import { validateJWT } from "@/lib/auth/jwt"

export async function GET(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimitResult = await rateLimit(request)
    if (!rateLimitResult.success) {
      return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 })
    }

    // JWT validation
    const authResult = await validateJWT(request)
    if (!authResult.success) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { user } = authResult
    const { searchParams } = new URL(request.url)
    const tenantId = searchParams.get("tenantId") || user.tenant_id

    // Permission check
    if (!hasPermission(user.role, "VIEW_ANALYTICS")) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
    }

    // Fetch comprehensive dashboard data
    const [tenantMetrics, systemMetrics, aiInsights, recentActivity, userAnalytics, securityMetrics] =
      await Promise.all([
        // Tenant metrics
        supabaseAdmin.rpc("get_tenant_metrics", {
          tenant_id: tenantId,
          time_range: "30d",
        }),

        // System metrics
        supabaseAdmin
          .from("system_metrics")
          .select("*")
          .eq("tenant_id", tenantId)
          .gte("recorded_at", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
          .order("recorded_at", { ascending: false })
          .limit(100),

        // AI insights
        supabaseAdmin
          .from("ai_insights")
          .select("*")
          .eq("tenant_id", tenantId)
          .eq("status", "active")
          .order("created_at", { ascending: false })
          .limit(10),

        // Recent activity
        supabaseAdmin
          .from("audit_logs")
          .select(`
          *,
          users!inner(name, email)
        `)
          .eq("tenant_id", tenantId)
          .order("created_at", { ascending: false })
          .limit(20),

        // User analytics
        supabaseAdmin
          .from("users")
          .select("role, is_active, last_login")
          .eq("tenant_id", tenantId),

        // Security metrics
        supabaseAdmin
          .from("security_events")
          .select("*")
          .eq("tenant_id", tenantId)
          .gte("created_at", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()),
      ])

    // Process and aggregate data
    const dashboardData = {
      overview: {
        totalUsers: userAnalytics.data?.length || 0,
        activeUsers: userAnalytics.data?.filter((u) => u.is_active).length || 0,
        systemHealth: calculateSystemHealth(systemMetrics.data || []),
        securityScore: calculateSecurityScore(securityMetrics.data || []),
        revenue: tenantMetrics.data?.revenue || 0,
        growthRate: tenantMetrics.data?.growth_rate || 0,
      },

      systemMetrics: processSystemMetrics(systemMetrics.data || []),

      aiInsights:
        aiInsights.data?.map((insight) => ({
          id: insight.id,
          type: insight.type,
          title: insight.title,
          description: insight.description,
          confidence: insight.confidence,
          impact: insight.impact,
          recommendations: insight.metadata?.recommendations || [],
          estimatedValue: insight.metadata?.estimatedValue,
          category: insight.metadata?.category,
          createdAt: insight.created_at,
        })) || [],

      recentActivity:
        recentActivity.data?.map((activity) => ({
          id: activity.id,
          action: activity.action,
          resource: activity.resource_type,
          user: activity.users?.name || "Unknown",
          timestamp: activity.created_at,
          details: activity.new_values,
        })) || [],

      userAnalytics: {
        byRole: aggregateUsersByRole(userAnalytics.data || []),
        activeVsInactive: {
          active: userAnalytics.data?.filter((u) => u.is_active).length || 0,
          inactive: userAnalytics.data?.filter((u) => !u.is_active).length || 0,
        },
        recentLogins:
          userAnalytics.data?.filter(
            (u) => u.last_login && new Date(u.last_login) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          ).length || 0,
      },

      securityOverview: {
        threatLevel: calculateThreatLevel(securityMetrics.data || []),
        recentEvents: securityMetrics.data?.length || 0,
        vulnerabilities: securityMetrics.data?.filter((e) => e.severity === "high").length || 0,
      },
    }

    return NextResponse.json({
      success: true,
      data: dashboardData,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Dashboard API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Helper functions
function calculateSystemHealth(metrics: any[]): number {
  if (!metrics.length) return 100

  const latestMetrics = metrics.slice(0, 10)
  const avgCpu = latestMetrics.reduce((sum, m) => sum + (m.metadata?.cpu || 0), 0) / latestMetrics.length
  const avgMemory = latestMetrics.reduce((sum, m) => sum + (m.metadata?.memory || 0), 0) / latestMetrics.length

  return Math.max(0, 100 - (avgCpu + avgMemory) / 2)
}

function calculateSecurityScore(events: any[]): number {
  const criticalEvents = events.filter((e) => e.severity === "critical").length
  const highEvents = events.filter((e) => e.severity === "high").length

  return Math.max(0, 100 - (criticalEvents * 10 + highEvents * 5))
}

function processSystemMetrics(metrics: any[]) {
  const latest = metrics[0]?.metadata || {}

  return {
    cpu: latest.cpu || 0,
    memory: latest.memory || 0,
    storage: latest.storage || 0,
    network: latest.network || 0,
    uptime: latest.uptime || "99.9%",
    responseTime: latest.responseTime || 150,
  }
}

function aggregateUsersByRole(users: any[]) {
  return users.reduce((acc, user) => {
    acc[user.role] = (acc[user.role] || 0) + 1
    return acc
  }, {})
}

function calculateThreatLevel(events: any[]): "low" | "medium" | "high" | "critical" {
  const criticalCount = events.filter((e) => e.severity === "critical").length
  const highCount = events.filter((e) => e.severity === "high").length

  if (criticalCount > 0) return "critical"
  if (highCount > 3) return "high"
  if (highCount > 0) return "medium"
  return "low"
}
