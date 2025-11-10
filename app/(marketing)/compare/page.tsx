import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Check, X, ArrowRight, Zap, Shield, Users, TrendingUp } from "lucide-react"

export const metadata: Metadata = {
  title: "Compare Nino360 | See How We Stack Up",
  description:
    "Compare Nino360 with other HRMS and talent management solutions. See why leading companies choose our platform.",
}

const competitors = [
  { name: "Competitor A", logo: "/competitor-a-logo.jpg" },
  { name: "Competitor B", logo: "/competitor-b-logo.jpg" },
  { name: "Competitor C", logo: "/competitor-c-logo.jpg" },
]

const features = [
  {
    category: "Core Features",
    items: [
      { name: "Unified HRMS & ATS Platform", nino360: true, competitorA: false, competitorB: true, competitorC: false },
      { name: "AI-Powered Automation", nino360: true, competitorA: true, competitorB: false, competitorC: true },
      { name: "Real-time Analytics", nino360: true, competitorA: true, competitorB: true, competitorC: false },
      { name: "Multi-tenant Architecture", nino360: true, competitorA: false, competitorB: false, competitorC: true },
      { name: "Blockchain Verification", nino360: true, competitorA: false, competitorB: false, competitorC: false },
    ],
  },
  {
    category: "Integration & API",
    items: [
      { name: "RESTful API", nino360: true, competitorA: true, competitorB: true, competitorC: true },
      { name: "Webhooks", nino360: true, competitorA: true, competitorB: false, competitorC: true },
      { name: "Pre-built Integrations", nino360: true, competitorA: true, competitorB: true, competitorC: false },
      { name: "Custom Integration Support", nino360: true, competitorA: false, competitorB: true, competitorC: false },
    ],
  },
  {
    category: "Security & Compliance",
    items: [
      { name: "SOC 2 Type II Certified", nino360: true, competitorA: true, competitorB: false, competitorC: true },
      { name: "GDPR Compliant", nino360: true, competitorA: true, competitorB: true, competitorC: true },
      { name: "HIPAA Compliant", nino360: true, competitorA: false, competitorB: false, competitorC: true },
      { name: "End-to-end Encryption", nino360: true, competitorA: true, competitorB: false, competitorC: true },
    ],
  },
  {
    category: "Support & Training",
    items: [
      { name: "24/7 Customer Support", nino360: true, competitorA: false, competitorB: true, competitorC: false },
      { name: "Dedicated Account Manager", nino360: true, competitorA: true, competitorB: false, competitorC: true },
      { name: "Free Onboarding", nino360: true, competitorA: false, competitorB: false, competitorC: false },
      { name: "Training Resources", nino360: true, competitorA: true, competitorB: true, competitorC: true },
    ],
  },
]

const advantages = [
  {
    icon: Zap,
    title: "Faster Implementation",
    description: "Get up and running in days, not months, with our streamlined onboarding process.",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Bank-level security with blockchain verification and comprehensive compliance.",
  },
  {
    icon: Users,
    title: "Better User Experience",
    description: "Intuitive interface designed for HR professionals and candidates alike.",
  },
  {
    icon: TrendingUp,
    title: "Higher ROI",
    description: "Reduce costs by 40% while improving efficiency and candidate quality.",
  },
]

export default function ComparePage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            See How Nino360 Compares
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            We believe in transparency. Compare our features, pricing, and support with other leading HRMS platforms.
          </p>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="backdrop-blur-sm bg-white/70 rounded-2xl border border-white/20 shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Features</th>
                    <th className="px-6 py-4 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <div className="text-lg font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                          Nino360
                        </div>
                        <span className="text-xs text-gray-500">Our Platform</span>
                      </div>
                    </th>
                    {competitors.map((competitor) => (
                      <th key={competitor.name} className="px-6 py-4 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <div className="text-sm font-medium text-gray-700">{competitor.name}</div>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {features.map((category, categoryIndex) => (
                    <>
                      <tr key={category.category} className="bg-gray-50/50">
                        <td colSpan={5} className="px-6 py-3 text-sm font-semibold text-gray-900">
                          {category.category}
                        </td>
                      </tr>
                      {category.items.map((item, itemIndex) => (
                        <tr
                          key={`${categoryIndex}-${itemIndex}`}
                          className="border-b border-gray-100 hover:bg-gray-50/30 transition-colors"
                        >
                          <td className="px-6 py-4 text-sm text-gray-700">{item.name}</td>
                          <td className="px-6 py-4 text-center">
                            {item.nino360 ? (
                              <Check className="w-5 h-5 text-green-600 mx-auto" />
                            ) : (
                              <X className="w-5 h-5 text-gray-300 mx-auto" />
                            )}
                          </td>
                          <td className="px-6 py-4 text-center">
                            {item.competitorA ? (
                              <Check className="w-5 h-5 text-green-600 mx-auto" />
                            ) : (
                              <X className="w-5 h-5 text-gray-300 mx-auto" />
                            )}
                          </td>
                          <td className="px-6 py-4 text-center">
                            {item.competitorB ? (
                              <Check className="w-5 h-5 text-green-600 mx-auto" />
                            ) : (
                              <X className="w-5 h-5 text-gray-300 mx-auto" />
                            )}
                          </td>
                          <td className="px-6 py-4 text-center">
                            {item.competitorC ? (
                              <Check className="w-5 h-5 text-green-600 mx-auto" />
                            ) : (
                              <X className="w-5 h-5 text-gray-300 mx-auto" />
                            )}
                          </td>
                        </tr>
                      ))}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Advantages Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Why Companies Choose Nino360
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {advantages.map((advantage) => (
              <div
                key={advantage.title}
                className="backdrop-blur-sm bg-white/70 rounded-xl border border-white/20 shadow-lg p-6 hover:shadow-xl transition-all"
              >
                <div className="w-12 h-12 rounded-lg bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-4">
                  <advantage.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{advantage.title}</h3>
                <p className="text-sm text-gray-600">{advantage.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="backdrop-blur-sm bg-white/70 rounded-2xl border border-white/20 shadow-xl p-8 sm:p-12 text-center">
            <h2 className="text-3xl font-bold mb-4 bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Ready to Experience the Difference?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Join 500+ companies that have already made the switch to Nino360.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                asChild
              >
                <Link href="/demo">
                  Schedule a Demo
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/pricing">View Pricing</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
