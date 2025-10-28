"use client"

import { motion } from "framer-motion"
import { Check, Zap, Building2, Crown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { useState } from "react"

const PLANS = [
  {
    code: "free",
    name: "Free",
    icon: Zap,
    price: { month: 0, year: 0 },
    description: "Perfect for trying out Nino360",
    features: [
      "Up to 3 users",
      "Analytics Lite",
      "1 GB storage",
      "1,000 API calls/month",
      "Community support",
      "Basic reporting",
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    code: "pro",
    name: "Pro",
    icon: Building2,
    price: { month: 49, year: 490 },
    description: "For growing teams and businesses",
    features: [
      "Unlimited users",
      "All modules (CRM, Talent, HRMS, Finance)",
      "100 GB storage",
      "100,000 API calls/month",
      "Priority support",
      "Advanced automation",
      "Custom workflows",
      "Blockchain audit trail",
      "AI Copilot",
    ],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    code: "enterprise",
    name: "Enterprise",
    icon: Crown,
    price: { month: null, year: null },
    description: "For large organizations with custom needs",
    features: [
      "Everything in Pro",
      "Unlimited storage",
      "Unlimited API calls",
      "SSO & SAML",
      "24/7 dedicated support",
      "Custom integrations",
      "SLA guarantee",
      "On-premise deployment option",
      "Dedicated account manager",
    ],
    cta: "Contact Sales",
    popular: false,
  },
]

export default function PricingPage() {
  const [interval, setInterval] = useState<"month" | "year">("month")

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
      <header className="border-b border-white/10 glass">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
          >
            NINO360
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" className="text-white hover:bg-white/10">
                Sign in
              </Button>
            </Link>
            <Link href="/demo">
              <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
                Book Demo
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container max-w-7xl mx-auto px-4 py-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Simple, Transparent Pricing</h1>
            <p className="text-xl text-white/70 mb-8">Choose the plan that fits your needs</p>

            <div className="inline-flex items-center gap-2 p-1 rounded-lg bg-white/5 border border-white/10">
              <button
                onClick={() => setInterval("month")}
                className={`px-6 py-2 rounded-md transition-all ${
                  interval === "month" ? "bg-purple-600 text-white" : "text-white/60 hover:text-white"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setInterval("year")}
                className={`px-6 py-2 rounded-md transition-all ${
                  interval === "year" ? "bg-purple-600 text-white" : "text-white/60 hover:text-white"
                }`}
              >
                Yearly
                <span className="ml-2 text-xs text-green-400">Save 17%</span>
              </button>
            </div>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {PLANS.map((plan, index) => {
              const Icon = plan.icon
              const price = plan.price[interval]

              return (
                <motion.div
                  key={plan.code}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card
                    className={`glass-panel p-8 h-full flex flex-col ${
                      plan.popular ? "border-purple-500 border-2 relative" : "border-white/10"
                    }`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-medium">
                        Most Popular
                      </div>
                    )}

                    <div className="mb-6">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-purple-500/20 mb-4">
                        <Icon className="h-6 w-6 text-purple-400" />
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                      <p className="text-white/60 text-sm">{plan.description}</p>
                    </div>

                    <div className="mb-6">
                      {price !== null ? (
                        <div className="flex items-baseline gap-1">
                          <span className="text-4xl font-bold text-white">${price}</span>
                          <span className="text-white/60">/{interval === "month" ? "mo" : "yr"}</span>
                        </div>
                      ) : (
                        <div className="text-4xl font-bold text-white">Custom</div>
                      )}
                    </div>

                    <ul className="space-y-3 mb-8 flex-1">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-3 text-white/80">
                          <Check className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Link href={plan.code === "enterprise" ? "/demo" : "/signup"}>
                      <Button
                        className={`w-full ${
                          plan.popular
                            ? "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                            : "bg-white/10 hover:bg-white/20 text-white"
                        }`}
                      >
                        {plan.cta}
                      </Button>
                    </Link>
                  </Card>
                </motion.div>
              )
            })}
          </div>

          <div className="mt-16 text-center">
            <p className="text-white/60 mb-4">All plans include a 14-day free trial. No credit card required.</p>
            <Link href="/demo" className="text-purple-400 hover:text-purple-300 font-medium">
              Need help choosing? Book a demo →
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
