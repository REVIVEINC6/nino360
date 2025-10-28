import { type NextRequest, NextResponse } from "next/server"
import { verifyStripeWebhook } from "@/lib/payments"
import { createServerClient } from "@/lib/supabase/server"
import { appendAudit } from "@/lib/hash"

export const dynamic = "force-dynamic"

export async function POST(req: NextRequest) {
  try {
    const raw = Buffer.from(await req.arrayBuffer())
    const sig = req.headers.get("stripe-signature") || ""
    const verified = await verifyStripeWebhook(raw, sig)

    if (!verified.ok) {
      return new NextResponse(verified.error, { status: verified.status ?? 400 })
    }

    const supabase = await createServerClient()
    const tenantId = verified.data?.metadata?.tenant_id ?? null

    if (verified.kind === "subscription") {
      const sub = verified.data
      await supabase.from("subscriptions").upsert({
        tenant_id: tenantId,
        plan_code: sub.metadata?.plan_code || "pro",
        interval: sub.metadata?.interval || "month",
        status: sub.status,
        provider: "stripe",
        provider_sub_id: sub.id,
        provider_customer_id: sub.customer,
        current_period_start: new Date(sub.current_period_start * 1000).toISOString(),
        current_period_end: new Date(sub.current_period_end * 1000).toISOString(),
      })
    }

    if (verified.kind === "invoice" && verified.data?.status === "paid") {
      const inv = verified.data
      await supabase.from("invoices").insert({
        tenant_id: tenantId,
        invoice_number: inv.number,
        amount: inv.amount_paid / 100,
        currency: inv.currency.toUpperCase(),
        status: "paid",
        provider: "stripe",
        provider_invoice_id: inv.id,
        hosted_url: inv.hosted_invoice_url,
        paid_at: new Date(inv.status_transitions.paid_at * 1000).toISOString(),
      })
    }

    await appendAudit({
      tenantId,
      actorUserId: null,
      action: `webhook:stripe:${verified.data?.object || "event"}`,
      entity: "billing",
      entityId: verified.data?.id ?? null,
      diff: verified.data,
    })

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error("[v0] Stripe webhook error:", error)
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
