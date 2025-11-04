import { NextRequest, NextResponse } from "next/server"
import { verifyBlockchainAnchor } from "@/app/(dashboard)/finance/pay-on-pay/actions"

export const runtime = "nodejs"

export async function GET(req: NextRequest, { params }: { params: { root: string } }) {
  // We don't have a lookup by root in actions; accept runId via ?runId= and fallback to error
  const { searchParams } = new URL(req.url)
  const runId = searchParams.get("runId")
  if (!runId) return NextResponse.json({ error: "runId query param required for now" }, { status: 400 })
  const result = await verifyBlockchainAnchor(runId)
  if (!result.success) return NextResponse.json({ error: result.error }, { status: 400 })
  return NextResponse.json({ ...result.data, verified: result.verified })
}
