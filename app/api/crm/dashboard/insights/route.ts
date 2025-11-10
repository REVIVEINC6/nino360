import { NextResponse } from "next/server"
import { getAIInsights } from "@/app/(dashboard)/crm/dashboard/actions"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { kpis, pipeline } = body
    const result = await getAIInsights({ kpis, pipeline })
    return NextResponse.json(result)
  } catch (err: any) {
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 })
  }
}
