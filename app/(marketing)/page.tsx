import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle2, Sparkles, Shield, Zap, Users, TrendingUp, Globe } from "lucide-react"
import Link from "next/link"

export const dynamic = 'force-dynamic'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-linear-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 px-4 py-2 backdrop-blur-sm">
              <Sparkles className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                AI-Powered HRMS Platform
              </span>
            </div>

            <h1 className="text-balance text-5xl font-bold tracking-tight sm:text-7xl bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Transform Your Workforce Management
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-gray-600 sm:text-xl">
              Nino360 combines AI, blockchain, and automation to deliver the most advanced HRMS platform for modern
              enterprises. Streamline hiring, manage talent, and scale with confidence.
            </p>

            <div className="mt-10 flex items-center justify-center gap-4">
              <Link href="/demo">
                <Button
                  size="lg"
                  className="bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 hover:opacity-90"
                >
                  Book a Demo
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/pricing">
                <Button size="lg" variant="outline">
                  View Pricing
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Everything You Need to Manage Your Workforce
            </h2>
            <p className="mt-4 text-lg text-gray-600">Powerful features designed for modern HR teams</p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.name}
                className="group relative rounded-2xl bg-white/50 p-8 backdrop-blur-sm border border-gray-200/50 hover:border-purple-300/50 transition-all hover:shadow-lg"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10">
                  <feature.icon className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.name}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="px-6 py-24 sm:py-32 lg:px-8 bg-white/30 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
                Why Choose Nino360?
              </h2>
              <div className="space-y-4">
                {benefits.map((benefit) => (
                  <div key={benefit} className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-green-600 shrink-0 mt-0.5" />
                    <p className="text-lg text-gray-700">{benefit}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl bg-white/50 p-6 backdrop-blur-sm border border-gray-200/50"
                >
                  <div className="text-3xl font-bold bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="mt-2 text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
            Ready to Transform Your HR Operations?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Join thousands of companies using Nino360 to streamline their workforce management
          </p>
          <Link href="/demo">
            <Button size="lg" className="bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 hover:opacity-90">
              Get Started Today
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}

const features = [
  {
    name: "AI-Powered Recruitment",
    description:
      "Intelligent candidate matching, resume parsing, and predictive analytics to find the best talent faster.",
    icon: Sparkles,
  },
  {
    name: "Blockchain Verification",
    description: "Immutable audit trails and credential verification for complete transparency and compliance.",
    icon: Shield,
  },
  {
    name: "RPA Automation",
    description: "Automate repetitive tasks and workflows to save time and reduce manual errors.",
    icon: Zap,
  },
  {
    name: "Talent Management",
    description: "Complete employee lifecycle management from onboarding to offboarding.",
    icon: Users,
  },
  {
    name: "Advanced Analytics",
    description: "Real-time insights and predictive analytics to make data-driven decisions.",
    icon: TrendingUp,
  },
  {
    name: "Global Compliance",
    description: "Stay compliant with international labor laws and regulations across all regions.",
    icon: Globe,
  },
]

const benefits = [
  "Reduce time-to-hire by 50% with AI-powered recruitment",
  "Automate 80% of repetitive HR tasks with RPA",
  "Ensure 100% compliance with blockchain audit trails",
  "Improve employee satisfaction with streamlined processes",
  "Scale effortlessly with enterprise-grade infrastructure",
  "Get actionable insights with ML-powered analytics",
]

const stats = [
  { value: "10K+", label: "Active Users" },
  { value: "50%", label: "Time Saved" },
  { value: "99.9%", label: "Uptime SLA" },
  { value: "24/7", label: "Support" },
]
