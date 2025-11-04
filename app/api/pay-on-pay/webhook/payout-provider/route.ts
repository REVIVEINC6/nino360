import { NextRequest, NextResponse } from "next/server"

export const runtime = "edge"

export async function POST(req: NextRequest) {
  const sig = req.headers.get("x-provider-signature")
  if (!sig) return NextResponse.json({ error: "missing signature" }, { status: 401 })
  const body = await req.json().catch(() => ({}))
  // TODO: verify and update payout status idempotently
  return NextResponse.json({ received: true })
}
