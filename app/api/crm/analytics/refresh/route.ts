import { NextResponse } from "next/server"
import { refreshAnalytics } from "@/app/(dashboard)/crm/analytics/actions"

export async function GET() {
  const result = await refreshAnalytics()
  return NextResponse.json(result)
}
