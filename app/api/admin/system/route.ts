import { type NextRequest, NextResponse } from "next/server"
import { rateLimit } from "@/lib/rate-limit"

export async function GET(request: NextRequest) {
  try {
    await rateLimit(request, "admin-read")

    // Simulate system metrics (in production, these would come from monitoring services)
    const systemMetrics = {
      cpu: {
        usage: Math.floor(Math.random() * 30) + 20, // 20-50%
        cores: 8,
        temperature: Math.floor(Math.random() * 20) + 45, // 45-65°C
      },
      memory: {
        usage: Math.floor(Math.random() * 40) + 40, // 40-80%
        total: 32, // GB
        available: Math.floor(Math.random() * 15) + 5, // 5-20 GB
      },
      disk: {
        usage: Math.floor(Math.random() * 30) + 30, // 30-60%
        total: 1000, // GB
        available: Math.floor(Math.random() * 400) + 400, // 400-800 GB
      },
      network: {
        inbound: Math.floor(Math.random() * 100) + 50, // Mbps
        outbound: Math.floor(Math.random() * 80) + 30, // Mbps
        connections: Math.floor(Math.random() * 500) + 1000,
      },
      services: [
        {
          name: "Web Server",
          status: "running",
          uptime: "15d 7h 23m",
          cpu: Math.floor(Math.random() * 20) + 5,
          memory: Math.floor(Math.random() * 500) + 200,
        },
        {
          name: "Database",
          status: "running",
          uptime: "15d 7h 23m",
          cpu: Math.floor(Math.random() * 30) + 10,
          memory: Math.floor(Math.random() * 1000) + 500,
        },
        {
          name: "Cache Server",
          status: "running",
          uptime: "15d 7h 23m",
          cpu: Math.floor(Math.random() * 10) + 2,
          memory: Math.floor(Math.random() * 200) + 100,
        },
        {
          name: "Queue Worker",
          status: "running",
          uptime: "15d 7h 23m",
          cpu: Math.floor(Math.random() * 15) + 3,
          memory: Math.floor(Math.random() * 150) + 50,
        },
      ],
      uptime: "15d 7h 23m",
      lastRestart: "2024-01-01T00:00:00Z",
    }

    return NextResponse.json(systemMetrics)
  } catch (error) {
    console.error("Error fetching system metrics:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await rateLimit(request, "admin-write")

    const body = await request.json()
    const { action } = body

    switch (action) {
      case "restart":
        // Simulate system restart
        return NextResponse.json({ message: "System restart initiated" })

      case "backup":
        // Simulate backup creation
        return NextResponse.json({ message: "Backup created successfully" })

      case "cleanup":
        // Simulate system cleanup
        return NextResponse.json({ message: "System cleanup completed" })

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }
  } catch (error) {
    console.error("Error performing system action:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
