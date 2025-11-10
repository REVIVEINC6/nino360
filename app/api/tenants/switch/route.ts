import { NextResponse } from "next/server"
import { switchTenant } from "@/app/(dashboard)/tenant/directory/actions"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const tenantId = body?.tenantId as string
    if (!tenantId) return NextResponse.json({ error: "tenantId required" }, { status: 400 })
    const res = await switchTenant(tenantId)
    if (!res.ok) return NextResponse.json(res, { status: 403 })
    return NextResponse.json(res)
  } catch (e: any) {
    console.error("/api/tenants/switch error", e)
    return NextResponse.json({ error: "failed" }, { status: 500 })
  }
}
