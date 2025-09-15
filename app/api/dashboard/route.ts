import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Mock dashboard data - in production this would come from your database
    const dashboardData = {
      metrics: {
        totalUsers: 12847,
        activeTenants: 156,
        revenue: 2847000,
        growthRate: 15.3,
        systemHealth: 99,
      },
      systemStatus: {
        cpu: 45,
        memory: 67,
        storage: 23,
        network: 89,
        uptime: "99.9%",
        lastBackup: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        activeConnections: 1247,
      },
      moduleStats: [
        {
          id: "crm",
          name: "CRM",
          version: "2.1.0",
          usage: 85,
          performance: 92,
          users: 456,
          status: "active",
        },
        {
          id: "hrms",
          name: "HRMS",
          version: "1.8.2",
          usage: 78,
          performance: 88,
          users: 234,
          status: "active",
        },
        {
          id: "talent",
          name: "Talent",
          version: "3.0.1",
          usage: 92,
          performance: 95,
          users: 189,
          status: "active",
        },
        {
          id: "finance",
          name: "Finance",
          version: "2.5.0",
          usage: 67,
          performance: 89,
          users: 123,
          status: "maintenance",
        },
      ],
      aiInsights: [
        {
          id: "insight-1",
          type: "optimization",
          title: "Optimize CRM Performance",
          description: "CRM module showing high usage. Consider scaling resources or optimizing queries.",
          priority: "high",
          impact: "performance",
          recommendation: "Increase database connection pool size and add caching layer",
          estimatedSavings: "$2,400/month",
          confidence: 0.87,
          createdAt: new Date().toISOString(),
        },
        {
          id: "insight-2",
          type: "cost",
          title: "Reduce Storage Costs",
          description: "Storage usage is below optimal threshold. Consider downsizing storage tier.",
          priority: "medium",
          impact: "cost",
          recommendation: "Migrate to lower-tier storage for archived data",
          estimatedSavings: "$800/month",
          confidence: 0.92,
          createdAt: new Date().toISOString(),
        },
        {
          id: "insight-3",
          type: "security",
          title: "Update Security Policies",
          description: "Some users have elevated permissions that may not be necessary.",
          priority: "high",
          impact: "security",
          recommendation: "Review and update user role assignments",
          estimatedSavings: "Risk reduction",
          confidence: 0.78,
          createdAt: new Date().toISOString(),
        },
      ],
      recentActivity: [
        {
          id: "activity-1",
          title: "New user registration",
          description: "John Doe registered for CRM module",
          user: "System",
          module: "CRM",
          timestamp: "2 minutes ago",
        },
        {
          id: "activity-2",
          title: "Performance alert resolved",
          description: "High CPU usage alert in HRMS module resolved",
          user: "Admin",
          module: "HRMS",
          timestamp: "15 minutes ago",
        },
        {
          id: "activity-3",
          title: "Backup completed",
          description: "Scheduled backup completed successfully",
          user: "System",
          module: "System",
          timestamp: "1 hour ago",
        },
        {
          id: "activity-4",
          title: "Module update deployed",
          description: "Talent module updated to version 3.0.1",
          user: "DevOps",
          module: "Talent",
          timestamp: "3 hours ago",
        },
        {
          id: "activity-5",
          title: "Security scan completed",
          description: "Weekly security scan completed with no issues",
          user: "Security Bot",
          module: "Security",
          timestamp: "6 hours ago",
        },
      ],
    }

    return NextResponse.json({
      success: true,
      data: dashboardData,
      message: "Dashboard data retrieved successfully",
    })
  } catch (error) {
    console.error("Error fetching dashboard data:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch dashboard data",
      },
      { status: 500 },
    )
  }
}
