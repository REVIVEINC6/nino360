import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { DollarSign, Users, TrendingUp, Award, BarChart3, Zap, CheckCircle2, ArrowRight } from "lucide-react"

export const metadata: Metadata = {
  title: "Affiliate Program | Nino360",
  description: "Join the Nino360 Affiliate Program and earn recurring commissions by promoting our platform.",
}

export default function AffiliatePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-6 py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h1 className="text-balance bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-5xl font-bold tracking-tight text-transparent sm:text-6xl">
              Affiliate Program
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-8 text-gray-600">
              Earn recurring commissions by promoting Nino360 to your audience. Join thousands of affiliates earning
              passive income.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button size="lg" className="gap-2">
                Join as Affiliate
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-6 py-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Commission Rate", value: "30%", icon: DollarSign },
              { label: "Active Affiliates", value: "2,000+", icon: Users },
              { label: "Avg. Monthly Earnings", value: "$3,500", icon: TrendingUp },
              { label: "Cookie Duration", value: "90 Days", icon: Award },
            ].map((stat) => (
              <Card key={stat.label} className="border-0 bg-white/60 p-6 backdrop-blur-sm">
                <div className="flex items-center gap-4">
                  <div className="rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 p-3">
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-6 py-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">How It Works</h2>
            <p className="mt-4 text-lg text-gray-600">Start earning in three simple steps</p>
          </div>

          <div className="mt-12 grid gap-8 lg:grid-cols-3">
            {[
              {
                step: "1",
                title: "Sign Up",
                description:
                  "Join our affiliate program for free. Get instant access to your dashboard and marketing materials.",
                icon: Users,
              },
              {
                step: "2",
                title: "Promote",
                description:
                  "Share your unique affiliate link through your blog, social media, email list, or website.",
                icon: Zap,
              },
              {
                step: "3",
                title: "Earn",
                description:
                  "Earn 30% recurring commission for every customer you refer. Get paid monthly via PayPal or bank transfer.",
                icon: DollarSign,
              },
            ].map((item) => (
              <Card key={item.step} className="border-0 bg-white/60 p-8 backdrop-blur-sm">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 text-xl font-bold text-white">
                  {item.step}
                </div>
                <div className="mb-4 inline-flex rounded-lg bg-gradient-to-br from-blue-100 to-purple-100 p-3">
                  <item.icon className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-gray-900">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Commission Structure */}
      <section className="px-6 py-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Commission Structure</h2>
            <p className="mt-4 text-lg text-gray-600">Earn more as you refer more customers</p>
          </div>

          <div className="mt-12 grid gap-8 lg:grid-cols-3">
            {[
              {
                tier: "Starter",
                referrals: "1-10 customers",
                commission: "30%",
                features: [
                  "Recurring monthly commissions",
                  "90-day cookie duration",
                  "Marketing materials",
                  "Monthly payouts",
                ],
              },
              {
                tier: "Pro",
                referrals: "11-50 customers",
                commission: "35%",
                features: [
                  "Everything in Starter",
                  "Dedicated affiliate manager",
                  "Priority support",
                  "Custom landing pages",
                ],
                featured: true,
              },
              {
                tier: "Elite",
                referrals: "51+ customers",
                commission: "40%",
                features: [
                  "Everything in Pro",
                  "Co-marketing opportunities",
                  "Early access to features",
                  "Quarterly bonuses",
                ],
              },
            ].map((tier) => (
              <Card
                key={tier.tier}
                className={`border-0 p-8 backdrop-blur-sm ${
                  tier.featured ? "bg-gradient-to-br from-blue-500 to-purple-600 text-white" : "bg-white/60"
                }`}
              >
                <h3 className={`text-2xl font-bold ${tier.featured ? "text-white" : "text-gray-900"}`}>{tier.tier}</h3>
                <p className={`mt-2 text-sm ${tier.featured ? "text-blue-100" : "text-gray-600"}`}>{tier.referrals}</p>
                <p className={`mt-4 text-4xl font-bold ${tier.featured ? "text-white" : "text-gray-900"}`}>
                  {tier.commission}
                </p>
                <p className={`text-sm ${tier.featured ? "text-blue-100" : "text-gray-600"}`}>recurring commission</p>
                <ul className="mt-6 space-y-3">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <CheckCircle2
                        className={`h-5 w-5 flex-shrink-0 ${tier.featured ? "text-white" : "text-green-600"}`}
                      />
                      <span className={`text-sm ${tier.featured ? "text-white" : "text-gray-600"}`}>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className={`mt-8 w-full ${tier.featured ? "bg-white text-purple-600 hover:bg-gray-100" : ""}`}
                  variant={tier.featured ? "default" : "outline"}
                >
                  Get Started
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="px-6 py-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Affiliate Benefits</h2>
            <p className="mt-4 text-lg text-gray-600">Everything you need to succeed as an affiliate</p>
          </div>

          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Marketing Materials",
                description: "Access banners, email templates, social media posts, and more.",
                icon: BarChart3,
              },
              {
                title: "Real-Time Tracking",
                description: "Monitor clicks, conversions, and earnings in your dashboard.",
                icon: TrendingUp,
              },
              {
                title: "Dedicated Support",
                description: "Get help from our affiliate team whenever you need it.",
                icon: Users,
              },
              {
                title: "High Conversion Rate",
                description: "Our platform converts at 12%, higher than industry average.",
                icon: Zap,
              },
              {
                title: "Recurring Commissions",
                description: "Earn every month as long as your referrals stay subscribed.",
                icon: DollarSign,
              },
              {
                title: "Performance Bonuses",
                description: "Earn extra rewards for hitting monthly referral targets.",
                icon: Award,
              },
            ].map((benefit) => (
              <Card key={benefit.title} className="border-0 bg-white/60 p-6 backdrop-blur-sm">
                <div className="mb-4 inline-flex rounded-lg bg-gradient-to-br from-blue-100 to-purple-100 p-3">
                  <benefit.icon className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Card className="border-0 bg-gradient-to-br from-blue-500 to-purple-600 p-12 text-center backdrop-blur-sm">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">Ready to Start Earning?</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-blue-100">
              Join our affiliate program today and start earning recurring commissions. No approval required - get
              started in minutes.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" className="gap-2 bg-white text-purple-600 hover:bg-gray-100">
                Join Now - It's Free
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 bg-transparent">
                View Affiliate Terms
              </Button>
            </div>
          </Card>
        </div>
      </section>
    </div>
  )
}
