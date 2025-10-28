lib/payments.ts
// lib/payments.ts
import crypto from "crypto";

type Provider = "stripe" | "razorpay" | "mock";
type Interval = "month" | "year";
type PlanCode = "free" | "pro" | "enterprise";

export type CheckoutInput = {
  tenantId: string;
  planCode: PlanCode;
  interval: Interval;
  successUrl: string;
  cancelUrl: string;
  currency?: string; // default from your plan or 'USD'
  email?: string;    // optional, to prefill
};

export type CheckoutResult =
  | { provider: "stripe"; url: string }
  | {
      provider: "razorpay";
      order_id: string;
      key_id: string;
      amount: number;
      currency: string;
    }
  | { provider: "mock"; url: string };

export type WebhookResult =
  | { ok: true; kind: "subscription" | "invoice"; data: any }
  | { ok: false; error: string; status?: number };

const ENV = {
  PROVIDER: (process.env.PAYMENT_PROVIDER || "mock") as Provider,
  // Stripe
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || "",
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET || "",
  // Razorpay
  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID || "",
  RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET || "",
  RAZORPAY_WEBHOOK_SECRET: process.env.RAZORPAY_WEBHOOK_SECRET || "",
  // Catalog → price ids (Stripe) or amounts (Razorpay)
  PRICE_PRO_MONTH: process.env.STRIPE_PRICE_PRO_MONTH || "",
  PRICE_PRO_YEAR: process.env.STRIPE_PRICE_PRO_YEAR || "",
  PRICE_ENT_MONTH: process.env.STRIPE_PRICE_ENT_MONTH || "",
  PRICE_ENT_YEAR: process.env.STRIPE_PRICE_ENT_YEAR || "",
};

const isStripeReady =
  ENV.STRIPE_SECRET_KEY && ENV.STRIPE_WEBHOOK_SECRET && ENV.PRICE_PRO_MONTH;
const isRazorReady =
  ENV.RAZORPAY_KEY_ID && ENV.RAZORPAY_KEY_SECRET && ENV.RAZORPAY_WEBHOOK_SECRET;

export function getProvider(): Provider {
  if (ENV.PROVIDER === "stripe" && isStripeReady) return "stripe";
  if (ENV.PROVIDER === "razorpay" && isRazorReady) return "razorpay";
  return "mock";
}

// ---------- Catalog helpers ----------
export function priceIdFor(plan: PlanCode, interval: Interval): string | null {
  if (getProvider() !== "stripe") return null;
  if (plan === "pro" && interval === "month") return ENV.PRICE_PRO_MONTH;
  if (plan === "pro" && interval === "year") return ENV.PRICE_PRO_YEAR;
  if (plan === "enterprise" && interval === "month") return ENV.PRICE_ENT_MONTH;
  if (plan === "enterprise" && interval === "year") return ENV.PRICE_ENT_YEAR;
  // free handled in app (no checkout)
  return null;
}

export function amountFor(plan: PlanCode, interval: Interval): {
  amount: number; currency: string;
} {
  // Use your DB bill.plans or env defaults. Example defaults:
  if (plan === "pro" && interval === "month") return { amount: 4900, currency: "USD" };     // $49.00
  if (plan === "pro" && interval === "year")  return { amount: 49000, currency: "USD" };    // $490.00
  // Enterprise via quote; set placeholder:
  if (plan === "enterprise" && interval === "month") return { amount: 0, currency: "USD" };
  if (plan === "enterprise" && interval === "year")  return { amount: 0, currency: "USD" };
  return { amount: 0, currency: "USD" };
}

// ---------- Checkout ----------
export async function createCheckoutSession(input: CheckoutInput): Promise<CheckoutResult> {
  const provider = getProvider();

  if (provider === "stripe") {
    // Lazy import to keep cold starts fast in Edge
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const Stripe = require("stripe").Stripe as typeof import("stripe").Stripe;
    const stripe = new Stripe(ENV.STRIPE_SECRET_KEY, { apiVersion: "2024-06-20" });

    const priceId = priceIdFor(input.planCode, input.interval);
    if (!priceId) throw new Error("Stripe price id not configured for plan/interval.");

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      success_url: input.successUrl,
      cancel_url: input.cancelUrl,
      customer_email: input.email,
      line_items: [{ price: priceId, quantity: 1 }],
      metadata: { tenant_id: input.tenantId, plan_code: input.planCode, interval: input.interval },
    });

    if (!session.url) throw new Error("Stripe session missing URL");
    return { provider: "stripe", url: session.url };
  }

  if (provider === "razorpay") {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const Razorpay = require("razorpay");
    const { amount, currency } = amountFor(input.planCode, input.interval);

    const instance = new Razorpay({
      key_id: ENV.RAZORPAY_KEY_ID,
      key_secret: ENV.RAZORPAY_KEY_SECRET,
    });

    const order = await instance.orders.create({
      amount, currency, receipt: `ten-${input.tenantId}-${Date.now()}`,
      notes: { tenant_id: input.tenantId, plan_code: input.planCode, interval: input.interval },
    });

    return {
      provider: "razorpay",
      order_id: order.id,
      key_id: ENV.RAZORPAY_KEY_ID,
      amount,
      currency,
    };
  }

  // Mock fallback
  const mockUrl = `${input.successUrl}?mock=1&tenant=${encodeURIComponent(input.tenantId)}&plan=${input.planCode}`;
  return { provider: "mock", url: mockUrl };
}

// ---------- Webhook verification ----------
export async function verifyStripeWebhook(rawBody: Buffer, signature: string): Promise<WebhookResult> {
  try {
    if (getProvider() !== "stripe") return { ok: false, error: "Wrong provider", status: 400 };
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const Stripe = require("stripe").Stripe as typeof import("stripe").Stripe;
    const stripe = new Stripe(ENV.STRIPE_SECRET_KEY, { apiVersion: "2024-06-20" });
    const event = stripe.webhooks.constructEvent(rawBody, signature, ENV.STRIPE_WEBHOOK_SECRET);

    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted":
        return { ok: true, kind: "subscription", data: event.data.object };
      case "invoice.paid":
      case "invoice.payment_failed":
        return { ok: true, kind: "invoice", data: event.data.object };
      default:
        return { ok: true, kind: "invoice", data: event }; // passthrough
    }
  } catch (e: any) {
    return { ok: false, error: e?.message || "Stripe verification failed", status: 400 };
  }
}

export async function verifyRazorpayWebhook(rawBody: string, signature: string): Promise<WebhookResult> {
  try {
    if (getProvider() !== "razorpay") return { ok: false, error: "Wrong provider", status: 400 };
    const expected = crypto
      .createHmac("sha256", ENV.RAZORPAY_WEBHOOK_SECRET)
      .update(rawBody)
      .digest("hex");

    if (expected !== signature) return { ok: false, error: "Invalid signature", status: 400 };

    const parsed = JSON.parse(rawBody);
    const event = parsed?.event as string | undefined;

    if (!event) return { ok: false, error: "No event", status: 400 };

    if (event.startsWith("subscription.")) {
      return { ok: true, kind: "subscription", data: parsed.payload.subscription?.entity || parsed.payload };
    }
    if (event.startsWith("invoice.")) {
      return { ok: true, kind: "invoice", data: parsed.payload.payment?.entity || parsed.payload.invoice?.entity || parsed.payload };
    }
    return { ok: true, kind: "invoice", data: parsed.payload };
  } catch (e: any) {
    return { ok: false, error: e?.message || "Razorpay verification failed", status: 400 };
  }
}

lib/hash.ts
// lib/hash.ts
import crypto from "crypto";
import { createServerClient } from "@supabase/ssr";
import type { Database } from "@/types/supabase"; // your generated types

export function sha256Hex(input: string): string {
  return crypto.createHash("sha256").update(input).digest("hex");
}

/**
 * Chain hash = sha256(prev_hash || action || entity || entity_id || diff || timestamp)
 * Keep inputs compact and stable (stringify diff deterministically).
 */
export function chainHash(prevHash: string | null, payload: {
  action: string;
  entity?: string | null;
  entityId?: string | null;
  diff?: unknown;
  createdAtISO?: string; // optional override for reproducibility
}): string {
  const parts = [
    prevHash ?? "",
    payload.action || "",
    payload.entity || "",
    payload.entityId || "",
    payload.diff ? stableStringify(payload.diff) : "",
    payload.createdAtISO ?? new Date().toISOString(),
  ];
  return sha256Hex(parts.join("|"));
}

// Deterministic JSON stringifier (sorted keys)
export function stableStringify(obj: unknown): string {
  return JSON.stringify(obj, Object.keys(obj as any).sort());
}

/**
 * Append an audit row with chained hash.
 * - Looks up last hash for tenant
 * - Computes curr hash
 * - Inserts app.audit_log row
 */
export async function appendAudit({
  supabase,
  tenantId,
  actorUserId,
  action,
  entity,
  entityId,
  diff,
}: {
  supabase: ReturnType<typeof createServerClient<Database>>;
  tenantId: string | null;
  actorUserId?: string | null;
  action: string;
  entity?: string | null;
  entityId?: string | null;
  diff?: Record<string, any>;
}) {
  const { data: last, error: errLast } = await supabase
    .from("app.audit_log")
    .select("hash")
    .eq("tenant_id", tenantId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (errLast) throw errLast;

  const prev_hash = last?.hash ?? null;
  const created_at = new Date().toISOString();
  const hash = chainHash(prev_hash, {
    action,
    entity: entity ?? "",
    entityId: entityId ?? "",
    diff,
    createdAtISO: created_at,
  });

  const { error: insErr } = await supabase.from("app.audit_log").insert({
    tenant_id: tenantId,
    actor_user_id: actorUserId ?? null,
    action,
    entity: entity ?? null,
    entity_id: entityId ?? null,
    diff: diff ?? {},
    prev_hash,
    hash,
    created_at,
  });

  if (insErr) throw insErr;

  return { prev_hash, hash };
}

API usage examples
1) Checkout API — /api/billing/checkout/route.ts
// app/api/billing/checkout/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { createCheckoutSession } from "@/lib/payments";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { tenant_id, plan_code, interval, email } = body; // validate with zod
  // Auth & membership checks here…
  const successUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/billing/portal?tenant=${tenant_id}`;
  const cancelUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/billing?tenant=${tenant_id}`;

  const result = await createCheckoutSession({
    tenantId: tenant_id,
    planCode: plan_code,
    interval,
    successUrl,
    cancelUrl,
    email,
  });

  return NextResponse.json(result);
}

2) Stripe webhook — /api/webhooks/stripe/route.ts
// app/api/webhooks/stripe/route.ts
import { NextRequest, NextResponse } from "next/server";
import { verifyStripeWebhook } from "@/lib/payments";
import { createServerClient } from "@supabase/ssr";
import { appendAudit } from "@/lib/hash";

export const config = { api: { bodyParser: false } }; // Next.js pages; for App Router:
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const raw = Buffer.from(await req.arrayBuffer());
  const sig = req.headers.get("stripe-signature") || "";
  const verified = await verifyStripeWebhook(raw, sig);

  if (!verified.ok) {
    return new NextResponse(verified.error, { status: verified.status ?? 400 });
    }

  // Map event to DB upserts (bill.subscriptions, bill.invoices) using verified.data
  // Extract tenant_id from metadata/customer/price mapping as per your setup.
  const tenantId = verified.data?.metadata?.tenant_id ?? null;

  // … upsert subscription/invoice …

  // Audit
  const supabase = createServerClient({ cookies: () => undefined } as any); // implement for your env
  await appendAudit({
    supabase,
    tenantId,
    action: `webhook:str:${(verified.data?.object as any)?.object || "event"}`,
    entity: "billing",
    entityId: (verified.data?.id as string) ?? null,
    diff: verified.data,
  });

  return NextResponse.json({ received: true });
}

3) Razorpay webhook — /api/webhooks/razorpay/route.ts
// app/api/webhooks/razorpay/route.ts
import { NextRequest, NextResponse } from "next/server";
import { verifyRazorpayWebhook } from "@/lib/payments";
import { createServerClient } from "@supabase/ssr";
import { appendAudit } from "@/lib/hash";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const raw = await req.text();
  const sig = req.headers.get("x-razorpay-signature") || "";
  const verified = await verifyRazorpayWebhook(raw, sig);

  if (!verified.ok) {
    return new NextResponse(verified.error, { status: verified.status ?? 400 });
  }

  // Map payload to subscription/invoice upsert…
  const tenantId =
    verified.data?.notes?.tenant_id ||
    verified.data?.entity?.notes?.tenant_id ||
    null;

  // … upsert …

  const supabase = createServerClient({ cookies: () => undefined } as any);
  await appendAudit({
    supabase,
    tenantId,
    action: `webhook:rzp:${verified.data?.entity || "event"}`,
    entity: "billing",
    entityId: verified.data?.id ?? null,
    diff: verified.data,
  });

  return NextResponse.json({ received: true });
}

Common patterns & guards

Free plan: skip checkout; just seed features and write an audit entry with action='plan:free_activated'.

Grace window: on past_due set a banner_dismissed=false preference and degrade features via app.feature_flags.

Idempotency: use provider event id in an idempotency table or upsert with constraints to avoid double-processing.

Security: for webhooks, always:

Read the raw body (no JSON parse before verifying).

Verify signature using the exact body bytes.

.env keys (recap)
PAYMENT_PROVIDER=stripe # or razorpay
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
STRIPE_PRICE_PRO_MONTH=price_xxx
STRIPE_PRICE_PRO_YEAR=price_xxx
STRIPE_PRICE_ENT_MONTH=price_xxx
STRIPE_PRICE_ENT_YEAR=price_xxx

RAZORPAY_KEY_ID=rzp_live_xxx
RAZORPAY_KEY_SECRET=xxx
RAZORPAY_WEBHOOK_SECRET=whsec_xxx
