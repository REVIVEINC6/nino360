import { NextResponse } from "next/server"
export const dynamic = "force-dynamic"
import { getUser } from "@/lib/supabase/server"
import { refreshAnalytics } from "@/app/(dashboard)/crm/analytics/actions"

export async function GET() {
  try {
    const user = await getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const result = await refreshAnalytics()
    return NextResponse.json(result)
  } catch (err) {
    console.error("Analytics refresh route error:", err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
