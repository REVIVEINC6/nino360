import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { createSettlementRun } from "@/app/(dashboard)/finance/pay-on-pay/actions"

export const runtime = "nodejs"

const bodySchema = z.object({
  runDate: z.string().optional().default(new Date().toISOString().slice(0, 10)),
  linkagePolicy: z.object({ type: z.enum(["auto", "manual", "hybrid"]), rules: z.array(z.any()) }).default({ type: "auto", rules: [] }),
  notes: z.string().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const json = await req.json()
    const input = bodySchema.parse(json)
    const result = await createSettlementRun(input as any)
    if (!result.success) return NextResponse.json({ error: result.error }, { status: 400 })
    return NextResponse.json(result.data)
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? "Bad Request" }, { status: 400 })
  }
}
