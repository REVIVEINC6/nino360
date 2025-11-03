import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Shield, Clock, CheckCircle2, AlertCircle } from "lucide-react"

export const metadata: Metadata = {
  title: "Service Credits | Nino360",
  description: "Learn about our service credit policy and uptime guarantees for the Nino360 platform.",
}

export default function ServiceCreditsPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <section className="border-b bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-linear-to-r from-blue-500/10 to-purple-500/10 px-4 py-2">
              <Shield className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-600">Service Level Agreement</span>
            </div>
            <h1 className="mb-4 text-4xl font-bold text-balance">Service Credits Policy</h1>
            <p className="text-lg text-muted-foreground text-pretty">
              Our commitment to reliability includes service credits when we don't meet our uptime guarantees.
            </p>
          </div>
        </div>
      </section>

      {/* Uptime Guarantee */}
      <section className="container mx-auto px-4 py-16">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold">Uptime Guarantee</h2>
          <p className="text-muted-foreground">We guarantee 99.9% uptime for all paid plans</p>
        </div>

        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
          <div className="rounded-xl border bg-white/50 p-6 backdrop-blur-sm">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-linear-to-br from-green-500 to-emerald-600">
              <CheckCircle2 className="h-6 w-6 text-white" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">99.9% Uptime</h3>
            <p className="text-sm text-muted-foreground">Maximum 43 minutes of downtime per month</p>
          </div>

          <div className="rounded-xl border bg-white/50 p-6 backdrop-blur-sm">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-linear-to-br from-blue-500 to-purple-600">
              <Clock className="h-6 w-6 text-white" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">24/7 Monitoring</h3>
            <p className="text-sm text-muted-foreground">Continuous monitoring and instant alerts</p>
          </div>

          <div className="rounded-xl border bg-white/50 p-6 backdrop-blur-sm">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-linear-to-br from-purple-500 to-pink-600">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">Automatic Credits</h3>
            <p className="text-sm text-muted-foreground">Credits applied automatically when SLA is missed</p>
          </div>
        </div>
      </section>

      {/* Credit Tiers */}
      <section className="container mx-auto px-4 py-16">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold">Service Credit Tiers</h2>
          <p className="text-muted-foreground">Credit percentage based on monthly uptime</p>
        </div>

        <div className="mx-auto max-w-3xl space-y-4">
          <div className="rounded-xl border bg-white/50 p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="mb-1 text-lg font-semibold">99.0% - 99.9% Uptime</h3>
                <p className="text-sm text-muted-foreground">43 - 432 minutes downtime</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">10%</div>
                <div className="text-sm text-muted-foreground">Service Credit</div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border bg-white/50 p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="mb-1 text-lg font-semibold">95.0% - 99.0% Uptime</h3>
                <p className="text-sm text-muted-foreground">432 - 2,160 minutes downtime</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-purple-600">25%</div>
                <div className="text-sm text-muted-foreground">Service Credit</div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border bg-white/50 p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="mb-1 text-lg font-semibold">Below 95.0% Uptime</h3>
                <p className="text-sm text-muted-foreground">More than 2,160 minutes downtime</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-pink-600">50%</div>
                <div className="text-sm text-muted-foreground">Service Credit</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How to Claim */}
      <section className="container mx-auto px-4 py-16">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold">How to Claim Credits</h2>
          <p className="text-muted-foreground">Simple process to request your service credits</p>
        </div>

        <div className="mx-auto max-w-3xl space-y-6">
          <div className="flex gap-4 rounded-xl border bg-white/50 p-6 backdrop-blur-sm">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-purple-600 text-lg font-bold text-white">
              1
            </div>
            <div>
              <h3 className="mb-2 text-lg font-semibold">Submit a Request</h3>
              <p className="text-sm text-muted-foreground">
                Contact our support team within 30 days of the incident with details of the downtime experienced.
              </p>
            </div>
          </div>

          <div className="flex gap-4 rounded-xl border bg-white/50 p-6 backdrop-blur-sm">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-purple-500 to-pink-600 text-lg font-bold text-white">
              2
            </div>
            <div>
              <h3 className="mb-2 text-lg font-semibold">Verification Process</h3>
              <p className="text-sm text-muted-foreground">
                Our team will verify the downtime against our monitoring data and calculate the applicable credit.
              </p>
            </div>
          </div>

          <div className="flex gap-4 rounded-xl border bg-white/50 p-6 backdrop-blur-sm">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-pink-500 to-red-600 text-lg font-bold text-white">
              3
            </div>
            <div>
              <h3 className="mb-2 text-lg font-semibold">Credit Applied</h3>
              <p className="text-sm text-muted-foreground">
                Approved credits will be applied to your next billing cycle within 5 business days.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Important Notes */}
      <section className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-3xl rounded-xl border bg-linear-to-br from-amber-50 to-orange-50 p-8">
          <div className="mb-4 flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-amber-600" />
            <h3 className="text-lg font-semibold">Important Notes</h3>
          </div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex gap-2">
              <span className="text-amber-600">•</span>
              <span>Service credits are calculated as a percentage of your monthly subscription fee</span>
            </li>
            <li className="flex gap-2">
              <span className="text-amber-600">•</span>
              <span>Credits must be claimed within 30 days of the incident</span>
            </li>
            <li className="flex gap-2">
              <span className="text-amber-600">•</span>
              <span>Credits cannot be redeemed for cash and are non-transferable</span>
            </li>
            <li className="flex gap-2">
              <span className="text-amber-600">•</span>
              <span>Scheduled maintenance windows are excluded from uptime calculations</span>
            </li>
            <li className="flex gap-2">
              <span className="text-amber-600">•</span>
              <span>Maximum credit per month is 50% of monthly subscription fee</span>
            </li>
            <li className="flex gap-2">
              <span className="text-amber-600">•</span>
              <span>Free tier accounts are not eligible for service credits</span>
            </li>
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-3xl rounded-2xl border bg-linear-to-br from-blue-500 to-purple-600 p-12 text-center text-white">
          <h2 className="mb-4 text-3xl font-bold">Questions About Service Credits?</h2>
          <p className="mb-8 text-blue-100">
            Our support team is here to help with any questions about our SLA or service credit policy.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/support">
                Contact Support
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white bg-white/10 text-white hover:bg-white/20"
              asChild
            >
              <Link href="/sla">View Full SLA</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Related Links */}
      <section className="border-t bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-12">
          <div className="mx-auto max-w-3xl">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Related Resources
            </h3>
            <div className="flex flex-wrap gap-4">
              <Link href="/status" className="text-sm text-blue-600 hover:underline">
                System Status
              </Link>
              <Link href="/sla" className="text-sm text-blue-600 hover:underline">
                Service Level Agreement
              </Link>
              <Link href="/incident-reports" className="text-sm text-blue-600 hover:underline">
                Incident Reports
              </Link>
              <Link href="/api-status" className="text-sm text-blue-600 hover:underline">
                API Status
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
