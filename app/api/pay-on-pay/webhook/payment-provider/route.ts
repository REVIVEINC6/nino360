import { NextRequest, NextResponse } from "next/server"

export const runtime = "edge"

export async function POST(req: NextRequest) {
  const sig = req.headers.get("x-provider-signature")
  if (!sig) return NextResponse.json({ error: "missing signature" }, { status: 401 })
  // TODO: verify signature using provider secret
  const body = await req.json().catch(() => ({}))
  // TODO: enqueue job to reconcile payment and create settlement candidates
  return NextResponse.json({ received: true })
}
