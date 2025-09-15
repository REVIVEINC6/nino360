import { type NextRequest, NextResponse } from "next/server"
import { rateLimit } from "@/lib/rate-limit"
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    await rateLimit(request, "admin-read")

    // Simulate security metrics
    const securityMetrics = {
      overview: {
        securityScore: 98,
        activeThreats: 0,
        blockedAttacks: Math.floor(Math.random() * 100) + 50,
        lastScan: new Date(Date.now() - Math.random() * 3600000).toISOString(),
      },
      threats: [
        {
          id: "1",
          type: "Brute Force",
          severity: "medium",
          source: "192.168.1.100",
          blocked: true,
          timestamp: new Date(Date.now() - Math.random() * 86400000).toISOString(),
        },
        {
          id: "2",
          type: "SQL Injection",
          severity: "high",
          source: "10.0.0.50",
          blocked: true,
          timestamp: new Date(Date.now() - Math.random() * 86400000).toISOString(),
        },
      ],
      compliance: [
        { name: "GDPR", status: "compliant", lastCheck: "2024-01-15" },
        { name: "SOC 2", status: "compliant", lastCheck: "2024-01-10" },
        { name: "ISO 27001", status: "compliant", lastCheck: "2024-01-12" },
        { name: "HIPAA", status: "review", lastCheck: "2024-01-14" },
      ],
      certificates: {
        total: 12,
        expiring: 2,
        expired: 0,
        valid: 10,
      },
      auditLogs: [
        {
          id: "1",
          action: "User Login",
          user: "admin@example.com",
          ip: "192.168.1.1",
          timestamp: new Date(Date.now() - Math.random() * 3600000).toISOString(),
          status: "success",
        },
        {
          id: "2",
          action: "Password Change",
          user: "user@example.com",
          ip: "192.168.1.2",
          timestamp: new Date(Date.now() - Math.random() * 3600000).toISOString(),
          status: "success",
        },
      ],
    }

    return NextResponse.json(securityMetrics)
  } catch (error) {
    console.error("Error fetching security metrics:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
