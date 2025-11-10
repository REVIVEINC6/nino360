import { NextResponse } from "next/server"
import { healthCheckService } from "@/lib/auth/monitoring/health-check"

export const runtime = "nodejs"

export async function GET() {
  try {
    const health = await healthCheckService.checkHealth()

    const statusCode = health.status === "healthy" ? 200 : health.status === "degraded" ? 503 : 500

    return NextResponse.json(health, { status: statusCode })
  } catch (error) {
    return NextResponse.json(
      {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        error: "Health check failed",
      },
      { status: 500 },
    )
  }
}
