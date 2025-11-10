import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { generateAllocationSuggestion } from "@/app/(dashboard)/finance/pay-on-pay/actions"

export const runtime = "nodejs"

const bodySchema = z.object({ clientInvoiceId: z.string() })

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const json = await req.json()
    const { clientInvoiceId } = bodySchema.parse(json)
    const result = await generateAllocationSuggestion(params.id, clientInvoiceId)
    if (!result.success) return NextResponse.json({ error: result.error }, { status: 400 })
    return NextResponse.json(result.data)
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? "Bad Request" }, { status: 400 })
  }
}
