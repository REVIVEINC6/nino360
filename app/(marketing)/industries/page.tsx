import type { Metadata } from "next"
import Link from "next/link"
import { Building2, Code, Heart, GraduationCap, ShoppingBag, Factory, Briefcase, Landmark } from "lucide-react"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Industries We Serve | Nino360",
  description:
    "Tailored HR solutions for every industry. Discover how Nino360 serves technology, healthcare, education, retail, manufacturing, and more.",
}

const industries = [
  {
    icon: Code,
    name: "Technology & Software",
    description: "Streamline hiring for fast-growing tech companies with specialized ATS and talent management.",
    features: [
      "Technical skill assessments",
      "Remote hiring workflows",
      "Developer talent pools",
      "Fast-track onboarding",
    ],
    stats: { customers: "200+", growth: "150%" },
  },
  {
    icon: Heart,
    name: "Healthcare & Life Sciences",
    description: "Manage complex compliance requirements and credential verification for healthcare professionals.",
    features: ["License tracking", "Compliance management", "Credential verification", "Shift scheduling"],
    stats: { customers: "150+", growth: "120%" },
  },
  {
    icon: GraduationCap,
    name: "Education",
    description: "Simplify faculty and staff management with specialized tools for educational institutions.",
    features: ["Academic credential tracking", "Tenure management", "Grant-funded positions", "Adjunct scheduling"],
    stats: { customers: "100+", growth: "90%" },
  },
  {
    icon: ShoppingBag,
    name: "Retail & E-commerce",
    description: "Handle high-volume seasonal hiring and workforce management for retail operations.",
    features: ["Seasonal hiring", "Multi-location management", "Shift scheduling", "Performance tracking"],
    stats: { customers: "80+", growth: "110%" },
  },
  {
    icon: Factory,
    name: "Manufacturing",
    description: "Optimize workforce planning and safety compliance for manufacturing environments.",
    features: ["Safety certification tracking", "Shift management", "Skills matrix", "Union compliance"],
    stats: { customers: "60+", growth: "85%" },
  },
  {
    icon: Briefcase,
    name: "Professional Services",
    description: "Manage consultants, track billable hours, and optimize resource allocation.",
    features: ["Consultant management", "Project allocation", "Billable hours tracking", "Client assignments"],
    stats: { customers: "120+", growth: "130%" },
  },
  {
    icon: Landmark,
    name: "Financial Services",
    description: "Navigate complex regulatory requirements and manage compliance for financial institutions.",
    features: ["Regulatory compliance", "Background checks", "License management", "Audit trails"],
    stats: { customers: "70+", growth: "95%" },
  },
  {
    icon: Building2,
    name: "Enterprise & Fortune 500",
    description: "Scale HR operations across global teams with enterprise-grade security and customization.",
    features: ["Global workforce management", "Custom workflows", "Advanced analytics", "Dedicated support"],
    stats: { customers: "50+", growth: "140%" },
  },
]

export default function IndustriesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Industries We Serve
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Tailored HR solutions designed for the unique challenges of your industry. From healthcare to technology, we
            understand your specific needs.
          </p>
        </div>
      </section>

      {/* Industries Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {industries.map((industry, index) => {
              const Icon = industry.icon
              return (
                <div
                  key={index}
                  className="group relative bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-gray-200 hover:border-purple-300 hover:shadow-xl transition-all duration-300"
                >
                  {/* Icon */}
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 mb-6 group-hover:scale-110 transition-transform">
                    <Icon className="w-8 h-8 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold mb-3 text-gray-900">{industry.name}</h3>
                  <p className="text-gray-600 mb-6">{industry.description}</p>

                  {/* Features */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Key Features:</h4>
                    <ul className="space-y-2">
                      {industry.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                          <span className="text-purple-500 mt-1">✓</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-6 pt-6 border-t border-gray-200">
                    <div>
                      <div className="text-2xl font-bold text-gray-900">{industry.stats.customers}</div>
                      <div className="text-xs text-gray-500">Customers</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        {industry.stats.growth}
                      </div>
                      <div className="text-xs text-gray-500">YoY Growth</div>
                    </div>
                  </div>

                  {/* Learn More Link */}
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 mt-6 text-sm font-medium text-purple-600 hover:text-purple-700 transition-colors"
                  >
                    Learn more about {industry.name}
                    <span>→</span>
                  </Link>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="relative bg-white/70 backdrop-blur-sm rounded-3xl p-12 border border-gray-200 text-center">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">Don't See Your Industry?</h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              We work with organizations across all sectors. Contact us to learn how Nino360 can be customized for your
              specific industry needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:opacity-90">
                Contact Sales
              </Button>
              <Button size="lg" variant="outline">
                View All Features
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
