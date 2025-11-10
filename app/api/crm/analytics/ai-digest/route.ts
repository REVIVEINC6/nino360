import { NextResponse } from "next/server"
export const dynamic = "force-dynamic"
import { getUser } from "@/lib/supabase/server"
import { runAiDigest } from "@/app/(dashboard)/crm/analytics/actions"

export async function POST(request: Request) {
  try {
    const user = await getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await request.json()
    const { from, to } = body

    const result = await runAiDigest({ from, to })
    return NextResponse.json(result)
  } catch (err) {
    console.error("AI Digest route error:", err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
