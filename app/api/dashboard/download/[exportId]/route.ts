import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { exportId: string } }) {
  try {
    const { exportId } = params
    const url = new URL(request.url)
    const format = url.searchParams.get("format") || "csv"

    // Mock dashboard data for export
    const dashboardData = {
      generatedAt: new Date().toISOString(),
      metrics: {
        totalUsers: 12847,
        activeTenants: 156,
        revenue: 2847000,
        systemHealth: 99,
      },
      activities: [
        { id: 1, action: "User Login", user: "john.doe@example.com", timestamp: new Date().toISOString() },
        { id: 2, action: "Module Access", user: "jane.smith@example.com", timestamp: new Date().toISOString() },
      ],
    }

    let responseData: string
    let contentType: string
    let filename: string

    switch (format) {
      case "csv":
        const csvHeaders = "ID,Action,User,Timestamp\n"
        const csvRows = dashboardData.activities
          .map((activity) => `${activity.id},"${activity.action}","${activity.user}","${activity.timestamp}"`)
          .join("\n")
        responseData = csvHeaders + csvRows
        contentType = "text/csv"
        filename = `dashboard-export-${exportId}.csv`
        break

      case "json":
        responseData = JSON.stringify(dashboardData, null, 2)
        contentType = "application/json"
        filename = `dashboard-export-${exportId}.json`
        break

      case "pdf":
        // For PDF, we'll return a simple text representation
        responseData = `Dashboard Export Report
Generated: ${dashboardData.generatedAt}
Total Users: ${dashboardData.metrics.totalUsers}
Active Tenants: ${dashboardData.metrics.activeTenants}
Revenue: $${dashboardData.metrics.revenue.toLocaleString()}
System Health: ${dashboardData.metrics.systemHealth}%

Recent Activities:
${dashboardData.activities.map((a) => `- ${a.action} by ${a.user} at ${a.timestamp}`).join("\n")}
`
        contentType = "text/plain"
        filename = `dashboard-export-${exportId}.txt`
        break

      default:
        throw new Error("Unsupported export format")
    }

    return new NextResponse(responseData, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    })
  } catch (error) {
    console.error("Error downloading dashboard export:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to download dashboard export",
      },
      { status: 500 },
    )
  }
}
