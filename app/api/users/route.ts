import { type NextRequest, NextResponse } from "next/server"
import { getUserWithTenant } from "@/lib/auth-server"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    const userContext = await getUserWithTenant()
    if (!userContext) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        { status: 401 },
      )
    }

    const { userData } = userContext

    // Check if user has admin permissions
    if (userData?.role !== "admin" && userData?.role !== "super_admin") {
      return NextResponse.json(
        {
          success: false,
          error: "Insufficient permissions",
        },
        { status: 403 },
      )
    }

    // Mock data for now
    const users = [
      {
        id: "1",
        email: "admin@example.com",
        first_name: "Admin",
        last_name: "User",
        role: "admin",
        status: "active",
        created_at: new Date().toISOString(),
        last_login: new Date().toISOString(),
      },
    ]

    return NextResponse.json({
      success: true,
      data: {
        users,
        pagination: {
          page: 1,
          limit: 20,
          total: 1,
          totalPages: 1,
        },
      },
    })
  } catch (error) {
    console.error("Get users error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 },
    )
  }
}
