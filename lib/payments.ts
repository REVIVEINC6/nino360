import crypto from "crypto"

type Provider = "stripe" | "razorpay" | "mock"
type Interval = "month" | "year"
type PlanCode = "free" | "pro" | "enterprise"

export type CheckoutInput = {
  tenantId: string
  planCode: PlanCode
  interval: Interval
  successUrl: string
  cancelUrl: string
  currency?: string
  email?: string
}

export type CheckoutResult =
  | { provider: "stripe"; url: string }
  | {
      provider: "razorpay"
      order_id: string
      key_id: string
      amount: number
      currency: string
    }
  | { provider: "mock"; url: string }

export type WebhookResult =
  | { ok: true; kind: "subscription" | "invoice"; data: any }
  | { ok: false; error: string; status?: number }

const ENV = {
  PROVIDER: (process.env.PAYMENT_PROVIDER || "mock") as Provider,
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || "",
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET || "",
  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID || "",
  RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET || "",
  RAZORPAY_WEBHOOK_SECRET: process.env.RAZORPAY_WEBHOOK_SECRET || "",
  PRICE_PRO_MONTH: process.env.STRIPE_PRICE_PRO_MONTH || "",
  PRICE_PRO_YEAR: process.env.STRIPE_PRICE_PRO_YEAR || "",
  PRICE_ENT_MONTH: process.env.STRIPE_PRICE_ENT_MONTH || "",
  PRICE_ENT_YEAR: process.env.STRIPE_PRICE_ENT_YEAR || "",
}

const isStripeReady = ENV.STRIPE_SECRET_KEY && ENV.STRIPE_WEBHOOK_SECRET && ENV.PRICE_PRO_MONTH
const isRazorReady = ENV.RAZORPAY_KEY_ID && ENV.RAZORPAY_KEY_SECRET && ENV.RAZORPAY_WEBHOOK_SECRET

export function getProvider(): Provider {
  if (ENV.PROVIDER === "stripe" && isStripeReady) return "stripe"
  if (ENV.PROVIDER === "razorpay" && isRazorReady) return "razorpay"
  return "mock"
}

export function priceIdFor(plan: PlanCode, interval: Interval): string | null {
  if (getProvider() !== "stripe") return null
  if (plan === "pro" && interval === "month") return ENV.PRICE_PRO_MONTH
  if (plan === "pro" && interval === "year") return ENV.PRICE_PRO_YEAR
  if (plan === "enterprise" && interval === "month") return ENV.PRICE_ENT_MONTH
  if (plan === "enterprise" && interval === "year") return ENV.PRICE_ENT_YEAR
  return null
}

export function amountFor(
  plan: PlanCode,
  interval: Interval,
): {
  amount: number
  currency: string
} {
  if (plan === "pro" && interval === "month") return { amount: 4900, currency: "USD" }
  if (plan === "pro" && interval === "year") return { amount: 49000, currency: "USD" }
  if (plan === "enterprise" && interval === "month") return { amount: 0, currency: "USD" }
  if (plan === "enterprise" && interval === "year") return { amount: 0, currency: "USD" }
  return { amount: 0, currency: "USD" }
}

function loadStripe() {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const Stripe = require("stripe").Stripe as typeof import("stripe").Stripe
    return new Stripe(ENV.STRIPE_SECRET_KEY, { apiVersion: "2024-06-20" })
  } catch {
    return null
  }
}

function loadRazorpay() {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const Razorpay = require("razorpay")
    return new Razorpay({
      key_id: ENV.RAZORPAY_KEY_ID,
      key_secret: ENV.RAZORPAY_KEY_SECRET,
    })
  } catch {
    return null
  }
}

export async function createCheckoutSession(input: CheckoutInput): Promise<CheckoutResult> {
  const provider = getProvider()

  if (provider === "stripe") {
    const stripe = loadStripe()
    if (!stripe) {
      console.warn("[v0] Stripe package not installed, falling back to mock")
      const mockUrl = `${input.successUrl}?mock=1&tenant=${encodeURIComponent(input.tenantId)}&plan=${input.planCode}`
      return { provider: "mock", url: mockUrl }
    }

    const priceId = priceIdFor(input.planCode, input.interval)
    if (!priceId) throw new Error("Stripe price id not configured for plan/interval.")

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      success_url: input.successUrl,
      cancel_url: input.cancelUrl,
      customer_email: input.email,
      line_items: [{ price: priceId, quantity: 1 }],
      metadata: { tenant_id: input.tenantId, plan_code: input.planCode, interval: input.interval },
    })

    if (!session.url) throw new Error("Stripe session missing URL")
    return { provider: "stripe", url: session.url }
  }

  if (provider === "razorpay") {
    const razorpay = loadRazorpay()
    if (!razorpay) {
      console.warn("[v0] Razorpay package not installed, falling back to mock")
      const mockUrl = `${input.successUrl}?mock=1&tenant=${encodeURIComponent(input.tenantId)}&plan=${input.planCode}`
      return { provider: "mock", url: mockUrl }
    }

    const { amount, currency } = amountFor(input.planCode, input.interval)

    const order = await razorpay.orders.create({
      amount,
      currency,
      receipt: `ten-${input.tenantId}-${Date.now()}`,
      notes: { tenant_id: input.tenantId, plan_code: input.planCode, interval: input.interval },
    })

    return {
      provider: "razorpay",
      order_id: order.id,
      key_id: ENV.RAZORPAY_KEY_ID,
      amount,
      currency,
    }
  }

  const mockUrl = `${input.successUrl}?mock=1&tenant=${encodeURIComponent(input.tenantId)}&plan=${input.planCode}`
  return { provider: "mock", url: mockUrl }
}

export async function verifyStripeWebhook(rawBody: Buffer, signature: string): Promise<WebhookResult> {
  try {
    if (getProvider() !== "stripe") return { ok: false, error: "Wrong provider", status: 400 }

    const stripe = loadStripe()
    if (!stripe) return { ok: false, error: "Stripe not available", status: 500 }

    const event = stripe.webhooks.constructEvent(rawBody, signature, ENV.STRIPE_WEBHOOK_SECRET)

    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted":
        return { ok: true, kind: "subscription", data: event.data.object }
      case "invoice.paid":
      case "invoice.payment_failed":
        return { ok: true, kind: "invoice", data: event.data.object }
      default:
        return { ok: true, kind: "invoice", data: event }
    }
  } catch (e: any) {
    return { ok: false, error: e?.message || "Stripe verification failed", status: 400 }
  }
}

export async function verifyRazorpayWebhook(rawBody: string, signature: string): Promise<WebhookResult> {
  try {
    if (getProvider() !== "razorpay") return { ok: false, error: "Wrong provider", status: 400 }
    const expected = crypto.createHmac("sha256", ENV.RAZORPAY_WEBHOOK_SECRET).update(rawBody).digest("hex")

    if (expected !== signature) return { ok: false, error: "Invalid signature", status: 400 }

    const parsed = JSON.parse(rawBody)
    const event = parsed?.event as string | undefined

    if (!event) return { ok: false, error: "No event", status: 400 }

    if (event.startsWith("subscription.")) {
      return { ok: true, kind: "subscription", data: parsed.payload.subscription?.entity || parsed.payload }
    }
    if (event.startsWith("invoice.")) {
      return {
        ok: true,
        kind: "invoice",
        data: parsed.payload.payment?.entity || parsed.payload.invoice?.entity || parsed.payload,
      }
    }
    return { ok: true, kind: "invoice", data: parsed.payload }
  } catch (e: any) {
    return { ok: false, error: e?.message || "Razorpay verification failed", status: 400 }
  }
}
