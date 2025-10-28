import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Check, Zap, Shield, Users, Clock } from "lucide-react"

export const metadata: Metadata = {
  title: "Start Your Free Trial | Nino360",
  description: "Try Nino360 free for 14 days. No credit card required. Full access to all features.",
}

export default function FreeTrialPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Start Your Free 14-Day Trial
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the full power of Nino360 with no credit card required. Get instant access to all features.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Trial Form */}
            <Card className="p-8 backdrop-blur-sm bg-white/80 border-white/20 shadow-xl">
              <h2 className="text-2xl font-bold mb-6">Create Your Free Account</h2>
              <form className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" placeholder="John" required />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" placeholder="Doe" required />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Work Email</Label>
                  <Input id="email" type="email" placeholder="john@company.com" required />
                </div>

                <div>
                  <Label htmlFor="company">Company Name</Label>
                  <Input id="company" placeholder="Acme Inc." required />
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" type="tel" placeholder="+1 (555) 000-0000" />
                </div>

                <div>
                  <Label htmlFor="employees">Company Size</Label>
                  <select
                    id="employees"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select company size</option>
                    <option value="1-10">1-10 employees</option>
                    <option value="11-50">11-50 employees</option>
                    <option value="51-200">51-200 employees</option>
                    <option value="201-500">201-500 employees</option>
                    <option value="501+">501+ employees</option>
                  </select>
                </div>

                <div className="flex items-start gap-2">
                  <input type="checkbox" id="terms" className="mt-1" required />
                  <Label htmlFor="terms" className="text-sm text-gray-600">
                    I agree to the{" "}
                    <Link href="/terms" className="text-blue-600 hover:underline">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="text-blue-600 hover:underline">
                      Privacy Policy
                    </Link>
                  </Label>
                </div>

                <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-6 text-lg">
                  Start Free Trial
                </Button>

                <p className="text-center text-sm text-gray-500">
                  No credit card required • Cancel anytime • 14-day free trial
                </p>
              </form>
            </Card>

            {/* Benefits */}
            <div className="space-y-6">
              <Card className="p-6 backdrop-blur-sm bg-white/80 border-white/20 shadow-xl">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">14 Days Free</h3>
                    <p className="text-gray-600">
                      Full access to all features for 14 days. No credit card required to start.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 backdrop-blur-sm bg-white/80 border-white/20 shadow-xl">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Instant Setup</h3>
                    <p className="text-gray-600">Get started in minutes. No complex setup or installation required.</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 backdrop-blur-sm bg-white/80 border-white/20 shadow-xl">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-gradient-to-br from-pink-500 to-blue-500">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Dedicated Support</h3>
                    <p className="text-gray-600">
                      Get help from our team during your trial. We're here to ensure your success.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 backdrop-blur-sm bg-white/80 border-white/20 shadow-xl">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500 to-pink-500">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">No Risk</h3>
                    <p className="text-gray-600">Cancel anytime during your trial. No questions asked, no charges.</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 backdrop-blur-sm bg-white/80 border-white/20 shadow-xl">
                <h3 className="text-lg font-semibold mb-4">What's Included:</h3>
                <ul className="space-y-3">
                  {[
                    "Full access to all modules",
                    "Unlimited users during trial",
                    "AI-powered features",
                    "Advanced analytics & reporting",
                    "Integration with 50+ tools",
                    "Priority email support",
                    "Onboarding assistance",
                    "Data migration help",
                  ].map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Trusted by 500+ Companies</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: "Active Users", value: "50K+" },
              { label: "Customer Satisfaction", value: "98%" },
              { label: "Uptime", value: "99.9%" },
              { label: "Support Response", value: "<1hr" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
