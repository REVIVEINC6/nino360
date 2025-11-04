import { NextResponse, type NextRequest } from "next/server"
import { performanceMonitor } from "@/lib/auth/monitoring/performance"
import { requireAuth } from "@/lib/auth/authorization/middleware"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"
export const revalidate = 0
export const fetchCache = "force-no-store"

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuth(request)
    if (auth instanceof NextResponse) return auth

    const url = new URL(request.url)
    const operation = url.searchParams.get("operation") || undefined
    const hours = Number.parseInt(url.searchParams.get("hours") || "24")

    const metrics = await performanceMonitor.getMetrics(operation, hours)

    const avgResponseTime = operation ? await performanceMonitor.getAverageResponseTime(operation) : 0

    const successRate = operation ? await performanceMonitor.getSuccessRate(operation) : 0

    return NextResponse.json({
      metrics,
      summary: {
        averageResponseTime: avgResponseTime,
        successRate,
        totalRequests: metrics.length,
      },
    })
  } catch (error) {
    console.error("[v0] Error fetching metrics:", error)
    return NextResponse.json({ error: "Failed to fetch metrics" }, { status: 500 })
  }
}
