import { NextResponse } from "next/server"
import { runAiDigest } from "@/app/(dashboard)/crm/analytics/actions"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { from, to } = body
    const result = await runAiDigest({ from, to })
    return NextResponse.json(result)
  } catch (e) {
    return NextResponse.json({ error: (e as any)?.message || String(e) }, { status: 500 })
  }
}
