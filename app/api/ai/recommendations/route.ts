import { NextResponse } from "next/server"

export async function GET() {
  try {
    const recommendations = [
      {
        id: "rec-1",
        type: "performance",
        title: "Optimize Database Queries",
        description: "Several slow queries detected in the CRM module affecting user experience.",
        priority: "high",
        impact: "performance",
        estimatedSavings: "$1,200/month",
        confidence: 0.89,
        actions: [
          "Add database indexes for frequently queried fields",
          "Implement query result caching",
          "Optimize JOIN operations",
        ],
        createdAt: new Date().toISOString(),
      },
      {
        id: "rec-2",
        type: "cost",
        title: "Right-size Cloud Resources",
        description: "Current infrastructure is over-provisioned for actual usage patterns.",
        priority: "medium",
        impact: "cost",
        estimatedSavings: "$800/month",
        confidence: 0.92,
        actions: [
          "Downsize EC2 instances during off-peak hours",
          "Implement auto-scaling policies",
          "Archive old data to cheaper storage tiers",
        ],
        createdAt: new Date().toISOString(),
      },
      {
        id: "rec-3",
        type: "security",
        title: "Update Access Controls",
        description: "Some users have excessive permissions that violate principle of least privilege.",
        priority: "high",
        impact: "security",
        estimatedSavings: "Risk reduction",
        confidence: 0.76,
        actions: [
          "Audit current user permissions",
          "Implement role-based access control",
          "Enable multi-factor authentication",
        ],
        createdAt: new Date().toISOString(),
      },
    ]

    return NextResponse.json({
      success: true,
      data: recommendations,
      message: "AI recommendations retrieved successfully",
    })
  } catch (error) {
    console.error("Error fetching AI recommendations:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch AI recommendations",
      },
      { status: 500 },
    )
  }
}
