import { NextResponse } from "next/server"
export const dynamic = "force-dynamic"
import { getUser } from "@/lib/supabase/server"
import { exportOpportunitiesCsv } from "@/app/(dashboard)/crm/analytics/actions"

export async function GET() {
  try {
    const user = await getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { csv } = await exportOpportunitiesCsv()

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="opportunities.csv"`,
      },
    })
  } catch (err) {
    console.error("Analytics export route error:", err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
