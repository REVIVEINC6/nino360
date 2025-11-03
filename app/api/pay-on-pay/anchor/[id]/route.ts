import { NextResponse } from "next/server"
import { anchorSettlementRun } from "@/app/(dashboard)/finance/pay-on-pay/actions"

export const runtime = "nodejs"

export async function POST(_req: Request, { params }: { params: { id: string } }) {
  const result = await anchorSettlementRun(params.id)
  if (!result.success) return NextResponse.json({ error: result.error }, { status: 400 })
  return NextResponse.json(result.data)
}
