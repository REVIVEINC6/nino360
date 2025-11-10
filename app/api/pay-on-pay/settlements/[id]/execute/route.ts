import { NextRequest, NextResponse } from "next/server"
import { listPayoutInstructions, submitPayoutForSigning, updatePayoutStatus } from "@/app/(dashboard)/finance/pay-on-pay/actions"

export const runtime = "nodejs"

export async function POST(_req: NextRequest, { params }: { params: { id: string } }) {
  // Simulate: mark all pending payouts as signing -> signed -> submitted
  const { success, data, error } = await listPayoutInstructions(params.id)
  if (!success) return NextResponse.json({ error }, { status: 400 })
  for (const p of data || []) {
    if (p.status === "pending") await submitPayoutForSigning(p.id)
    if (p.status === "signing" || p.status === "pending") await updatePayoutStatus(p.id, "signed")
    await updatePayoutStatus(p.id, "submitted", { provider: "mock" })
  }
  return NextResponse.json({ ok: true })
}
