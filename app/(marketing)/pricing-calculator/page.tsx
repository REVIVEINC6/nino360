import type { Metadata } from "next"
import Link from "next/link"
import { Calculator, Users, Building2, Zap, Check, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"

export const metadata: Metadata = {
  title: "Pricing Calculator | Nino360",
  description: "Calculate your custom pricing based on your team size and needs",
}

export default function PricingCalculatorPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-sm border border-white/20 mb-6">
            <Calculator className="h-4 w-4 text-purple-600" />
            <span className="text-sm font-medium text-gray-700">Custom Pricing</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Calculate Your Price
          </h1>

          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get an instant estimate based on your team size and module selection
          </p>
        </div>
      </section>

      {/* Calculator Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Configuration Panel */}
            <Card className="p-8 bg-white/60 backdrop-blur-sm border-white/20">
              <h2 className="text-2xl font-bold mb-6 bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Configure Your Plan
              </h2>

              {/* Team Size */}
              <div className="mb-8">
                <Label className="text-base font-semibold mb-4 block">Team Size</Label>
                <div className="space-y-4">
                  <Slider defaultValue={[50]} max={500} step={10} className="w-full" />
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>1 user</span>
                    <span className="font-semibold text-lg text-purple-600">50 users</span>
                    <span>500+ users</span>
                  </div>
                </div>
              </div>

              {/* Modules Selection */}
              <div className="mb-8">
                <Label className="text-base font-semibold mb-4 block">Select Modules</Label>
                <div className="space-y-3">
                  {[
                    { name: "HRMS", price: 15, icon: Users },
                    { name: "ATS/Talent", price: 20, icon: Building2 },
                    { name: "CRM", price: 18, icon: Zap },
                    { name: "VMS", price: 12, icon: Users },
                    { name: "Projects", price: 10, icon: Building2 },
                    { name: "Finance", price: 15, icon: Zap },
                  ].map((module) => (
                    <label
                      key={module.name}
                      className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50/50 cursor-pointer transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <input type="checkbox" className="w-4 h-4 text-purple-600 rounded" defaultChecked />
                        <module.icon className="h-5 w-5 text-purple-600" />
                        <span className="font-medium">{module.name}</span>
                      </div>
                      <span className="text-sm text-gray-600">${module.price}/user/mo</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Billing Cycle */}
              <div>
                <Label className="text-base font-semibold mb-4 block">Billing Cycle</Label>
                <div className="grid grid-cols-2 gap-4">
                  <button className="p-4 rounded-lg border-2 border-purple-600 bg-purple-50 font-medium text-purple-600">
                    Monthly
                  </button>
                  <button className="p-4 rounded-lg border border-gray-200 hover:border-purple-300 font-medium text-gray-700">
                    Annual <span className="text-green-600 text-sm">(Save 20%)</span>
                  </button>
                </div>
              </div>
            </Card>

            {/* Price Summary */}
            <div className="space-y-6">
              <Card className="p-8 bg-linear-to-br from-purple-600 to-pink-600 text-white">
                <h2 className="text-2xl font-bold mb-6">Your Estimate</h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center pb-4 border-b border-white/20">
                    <span>Base Price (50 users)</span>
                    <span className="font-semibold">$4,500/mo</span>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b border-white/20">
                    <span>6 Modules Selected</span>
                    <span className="font-semibold">Included</span>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b border-white/20">
                    <span>AI Features</span>
                    <span className="font-semibold">Included</span>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b border-white/20">
                    <span>24/7 Support</span>
                    <span className="font-semibold">Included</span>
                  </div>
                </div>

                <div className="flex justify-between items-center text-2xl font-bold mb-6">
                  <span>Total</span>
                  <span>$4,500/mo</span>
                </div>

                <div className="text-sm opacity-90 mb-6">Annual billing: $43,200/year (Save $10,800)</div>

                <Button className="w-full bg-white text-purple-600 hover:bg-gray-50" size="lg">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Card>

              {/* What's Included */}
              <Card className="p-8 bg-white/60 backdrop-blur-sm border-white/20">
                <h3 className="text-xl font-bold mb-4 bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  What's Included
                </h3>
                <ul className="space-y-3">
                  {[
                    "Unlimited data storage",
                    "Advanced AI features",
                    "Custom integrations",
                    "Dedicated account manager",
                    "Priority support",
                    "Custom training sessions",
                    "API access",
                    "White-label options",
                  ].map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-green-600 shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <Card className="max-w-4xl mx-auto p-12 text-center bg-linear-to-br from-blue-600 via-purple-600 to-pink-600 text-white">
          <h2 className="text-3xl font-bold mb-4">Need a Custom Quote?</h2>
          <p className="text-xl mb-8 opacity-90">Talk to our sales team for enterprise pricing and custom solutions</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-purple-600 hover:bg-gray-50">
              <Link href="/contact">Contact Sales</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/10 bg-transparent"
            >
              <Link href="/request-demo">Schedule Demo</Link>
            </Button>
          </div>
        </Card>
      </section>
    </div>
  )
}
