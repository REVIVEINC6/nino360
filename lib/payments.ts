type Provider = "stripe" | "mock"
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

export type CheckoutResult = { provider: "stripe"; url: string } | { provider: "mock"; url: string }

export type WebhookResult =
  | { ok: true; kind: "subscription" | "invoice"; data: any }
  | { ok: false; error: string; status?: number }

const ENV = {
  PROVIDER: (process.env.PAYMENT_PROVIDER || "mock") as Provider,
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || "",
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET || "",
  PRICE_PRO_MONTH: process.env.STRIPE_PRICE_PRO_MONTH || "",
  PRICE_PRO_YEAR: process.env.STRIPE_PRICE_PRO_YEAR || "",
  PRICE_ENT_MONTH: process.env.STRIPE_PRICE_ENT_MONTH || "",
  PRICE_ENT_YEAR: process.env.STRIPE_PRICE_ENT_YEAR || "",
}

const isStripeReady = ENV.STRIPE_SECRET_KEY && ENV.STRIPE_WEBHOOK_SECRET && ENV.PRICE_PRO_MONTH

export function getProvider(): Provider {
  if (ENV.PROVIDER === "stripe" && isStripeReady) return "stripe"
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
