import { type NextRequest, NextResponse } from "next/server"
import { verifyRazorpayWebhook } from "@/lib/payments"
import { createServerClient } from "@/lib/supabase/server"
import { appendAudit } from "@/lib/hash"

export const dynamic = "force-dynamic"

export async function POST(req: NextRequest) {
  try {
    const raw = await req.text()
    const sig = req.headers.get("x-razorpay-signature") || ""
    const verified = await verifyRazorpayWebhook(raw, sig)

    if (!verified.ok) {
      return new NextResponse(verified.error, { status: verified.status ?? 400 })
    }

    const supabase = await createServerClient()
    const tenantId = verified.data?.notes?.tenant_id || verified.data?.entity?.notes?.tenant_id || null

    if (verified.kind === "subscription") {
      const sub = verified.data
      await supabase.from("subscriptions").upsert({
        tenant_id: tenantId,
        plan_code: sub.notes?.plan_code || "pro",
        interval: sub.notes?.interval || "month",
        status: sub.status === "active" ? "active" : "past_due",
        provider: "razorpay",
        provider_sub_id: sub.id,
        current_period_start: new Date(sub.start_at * 1000).toISOString(),
        current_period_end: new Date(sub.end_at * 1000).toISOString(),
      })
    }

    if (verified.kind === "invoice") {
      const payment = verified.data
      if (payment.status === "captured") {
        await supabase.from("invoices").insert({
          tenant_id: tenantId,
          invoice_number: payment.id,
          amount: payment.amount / 100,
          currency: payment.currency.toUpperCase(),
          status: "paid",
          provider: "razorpay",
          provider_invoice_id: payment.id,
          paid_at: new Date(payment.created_at * 1000).toISOString(),
        })
      }
    }

    await appendAudit({
      tenantId,
      actorUserId: null,
      action: `webhook:razorpay:${verified.data?.entity || "event"}`,
      entity: "billing",
      entityId: verified.data?.id ?? null,
      diff: verified.data,
    })

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error("[v0] Razorpay webhook error:", error)
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
