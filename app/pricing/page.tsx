"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { CheckCircle, X, Star, Zap, Crown, Rocket } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const plans = [
  {
    name: "Starter",
    icon: Zap,
    color: "from-green-500 to-blue-500",
    description: "Perfect for small teams getting started with AI",
    monthlyPrice: 49,
    yearlyPrice: 39,
    features: [
      "Up to 5 users",
      "Basic AI insights",
      "CRM & HRMS modules",
      "Standard support",
      "5GB storage",
      "Basic integrations",
      "Mobile app access",
    ],
    limitations: ["No advanced AI features", "Limited automation", "Basic reporting"],
    popular: false,
  },
  {
    name: "Professional",
    icon: Star,
    color: "from-blue-500 to-purple-500",
    description: "Advanced AI capabilities for growing businesses",
    monthlyPrice: 149,
    yearlyPrice: 119,
    features: [
      "Up to 25 users",
      "Advanced AI insights",
      "All business modules",
      "Priority support",
      "50GB storage",
      "Advanced integrations",
      "Custom workflows",
      "API access",
      "Advanced reporting",
    ],
    limitations: ["Limited blockchain features", "Standard AI processing"],
    popular: true,
  },
  {
    name: "Enterprise",
    icon: Crown,
    color: "from-purple-500 to-pink-500",
    description: "Full AI power with enterprise-grade security",
    monthlyPrice: 399,
    yearlyPrice: 319,
    features: [
      "Unlimited users",
      "Superintelligent AI",
      "Full blockchain security",
      "24/7 dedicated support",
      "Unlimited storage",
      "Custom integrations",
      "White-label options",
      "Advanced security",
      "Custom AI models",
      "SLA guarantee",
    ],
    limitations: [],
    popular: false,
  },
  {
    name: "Custom",
    icon: Rocket,
    color: "from-orange-500 to-red-500",
    description: "Tailored solutions for unique business needs",
    monthlyPrice: null,
    yearlyPrice: null,
    features: [
      "Everything in Enterprise",
      "Custom AI development",
      "Dedicated infrastructure",
      "Custom compliance",
      "On-premise deployment",
      "Custom training",
      "Dedicated success manager",
    ],
    limitations: [],
    popular: false,
  },
]

const faqs = [
  {
    question: "What makes Nino360's AI different?",
    answer:
      "Our platform combines General AI, Superintelligent AI, and blockchain technology to provide unprecedented business intelligence and automation capabilities.",
  },
  {
    question: "Can I upgrade or downgrade my plan?",
    answer:
      "Yes, you can change your plan at any time. Upgrades take effect immediately, while downgrades take effect at the next billing cycle.",
  },
  {
    question: "Is there a free trial?",
    answer: "Yes, we offer a 14-day free trial for all plans. No credit card required to get started.",
  },
  {
    question: "What kind of support do you provide?",
    answer:
      "We provide email support for Starter plans, priority support for Professional plans, and 24/7 dedicated support for Enterprise plans.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Absolutely. We use enterprise-grade security with blockchain-based audit trails, end-to-end encryption, and comply with all major data protection regulations.",
  },
]

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-3">
              <Image src="/images/nino360-logo.png" alt="Nino360 Logo" width={40} height={40} className="rounded-lg" />
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Nino360
              </span>
            </Link>

            <div className="flex items-center space-x-6">
              <Link href="/features" className="text-white/80 hover:text-white transition-colors">
                Features
              </Link>
              <Link href="/docs" className="text-white/80 hover:text-white transition-colors">
                Documentation
              </Link>
              <Link href="/contact" className="text-white/80 hover:text-white transition-colors">
                Contact
              </Link>
              <Link href="/dashboard">
                <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <Badge className="mb-6 bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 border-blue-500/30">
            Simple, Transparent Pricing
          </Badge>

          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Choose Your
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent block">
              AI-Powered Plan
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-white/70 mb-12 max-w-4xl mx-auto leading-relaxed">
            Start with our free trial and scale as you grow. All plans include our core AI capabilities.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-4 mb-12">
            <span className={`text-lg ${!isYearly ? "text-white" : "text-white/60"}`}>Monthly</span>
            <Switch checked={isYearly} onCheckedChange={setIsYearly} className="data-[state=checked]:bg-purple-600" />
            <span className={`text-lg ${isYearly ? "text-white" : "text-white/60"}`}>
              Yearly
              <Badge className="ml-2 bg-green-500/20 text-green-300 border-green-500/30">Save 20%</Badge>
            </span>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {plans.map((plan, index) => (
              <Card
                key={index}
                className={`relative bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 ${
                  plan.popular ? "ring-2 ring-purple-500 scale-105" : ""
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
                      Most Popular
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center">
                  <div
                    className={`w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-r ${plan.color} flex items-center justify-center`}
                  >
                    <plan.icon className="text-white" size={32} />
                  </div>
                  <CardTitle className="text-white text-2xl">{plan.name}</CardTitle>
                  <CardDescription className="text-white/70">{plan.description}</CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Pricing */}
                  <div className="text-center">
                    {plan.monthlyPrice ? (
                      <>
                        <div className="text-4xl font-bold text-white">
                          ${isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                        </div>
                        <div className="text-white/60">per user/month</div>
                        {isYearly && (
                          <div className="text-sm text-green-400">
                            Save ${(plan.monthlyPrice - plan.yearlyPrice) * 12}/year
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="text-4xl font-bold text-white">Custom</div>
                    )}
                  </div>

                  {/* Features */}
                  <div className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center space-x-3">
                        <CheckCircle className="text-green-400 flex-shrink-0" size={16} />
                        <span className="text-white/80 text-sm">{feature}</span>
                      </div>
                    ))}
                    {plan.limitations.map((limitation, limitationIndex) => (
                      <div key={limitationIndex} className="flex items-center space-x-3">
                        <X className="text-red-400 flex-shrink-0" size={16} />
                        <span className="text-white/60 text-sm">{limitation}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <Link href={plan.monthlyPrice ? "/dashboard" : "/contact"}>
                    <Button
                      className={`w-full ${
                        plan.popular
                          ? "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                          : "bg-white/10 hover:bg-white/20 border border-white/20"
                      }`}
                    >
                      {plan.monthlyPrice ? "Start Free Trial" : "Contact Sales"}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-black/20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Frequently Asked Questions</h2>
            <p className="text-xl text-white/70">Everything you need to know about our pricing and plans.</p>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <Card key={index} className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white text-lg">{faq.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white/70">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-white/70 mb-8">
            Join thousands of companies already transforming their business with AI.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/dashboard">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-lg px-8 py-4"
              >
                Start Free Trial
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 text-lg px-8 py-4 bg-transparent"
              >
                Contact Sales
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <Link href="/" className="flex items-center space-x-3 mb-4 md:mb-0">
              <Image src="/images/nino360-logo.png" alt="Nino360 Logo" width={32} height={32} className="rounded-lg" />
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Nino360
              </span>
            </Link>

            <div className="flex items-center space-x-6 text-white/60">
              <Link href="/privacy" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link href="/support" className="hover:text-white transition-colors">
                Support
              </Link>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-white/10 text-center text-white/60">
            <p>&copy; 2024 Nino360.com. All rights reserved. Powered by Superintelligent AI.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
