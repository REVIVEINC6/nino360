import { NextResponse } from "next/server"
import { listTenants } from "@/app/(dashboard)/tenant/directory/actions"

export async function GET() {
  try {
    const tenants = await listTenants()
    return NextResponse.json({ tenants })
  } catch (e: any) {
    console.error("/api/tenants/list error", e)
    return NextResponse.json({ error: "failed" }, { status: 500 })
  }
}
