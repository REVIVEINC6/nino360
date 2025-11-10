import type { Metadata } from "next"
import Link from "next/link"
import { Building2, Users, Briefcase, TrendingUp, Shield, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Solutions | Nino360",
  description: "Industry-specific HRMS solutions tailored to your business needs",
}

export default function SolutionsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b bg-linear-to-br from-background via-background to-primary/5 px-6 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-6xl">
              Solutions for Every{" "}
              <span className="bg-linear-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Industry
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-muted-foreground">
              Tailored HRMS solutions designed to meet the unique challenges of your industry
            </p>
          </div>
        </div>
      </section>

      {/* Solutions Grid */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {solutions.map((solution) => (
              <div
                key={solution.title}
                className="group relative overflow-hidden rounded-2xl border bg-card/50 p-8 backdrop-blur-sm transition-all hover:border-primary/50 hover:shadow-lg"
              >
                <div className="mb-6 inline-flex rounded-xl bg-linear-to-br from-primary/10 to-purple-500/10 p-4">
                  <solution.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="mb-3 text-2xl font-bold">{solution.title}</h3>
                <p className="mb-6 text-muted-foreground">{solution.description}</p>

                <div className="space-y-3">
                  <p className="text-sm font-semibold">Key Features:</p>
                  <ul className="space-y-2">
                    {solution.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <Button className="mt-6 w-full bg-transparent" variant="outline">
                  Learn More
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="border-y bg-muted/30 px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Why Choose Nino360?</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              Industry-leading features that adapt to your business
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="rounded-2xl border bg-card/50 p-8 backdrop-blur-sm">
                <div className="mb-4 inline-flex rounded-xl bg-linear-to-br from-primary/10 to-purple-500/10 p-3">
                  <benefit.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-3 text-xl font-bold">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Ready to Transform Your HR Operations?</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Join thousands of companies using Nino360 to streamline their workforce management
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/contact">Schedule a Demo</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/pricing">View Pricing</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

const solutions = [
  {
    title: "Staffing & Recruiting",
    icon: Users,
    description: "Streamline candidate management, placements, and vendor relationships",
    features: [
      "ATS with AI-powered matching",
      "Vendor management system",
      "Bench resource tracking",
      "Client portal access",
    ],
  },
  {
    title: "Technology Companies",
    icon: Zap,
    description: "Scale your tech workforce with modern HR tools and automation",
    features: [
      "Project-based resource allocation",
      "Skills matrix management",
      "Remote work support",
      "Performance tracking",
    ],
  },
  {
    title: "Professional Services",
    icon: Briefcase,
    description: "Manage consultants, projects, and client engagements efficiently",
    features: [
      "Time & expense tracking",
      "Project profitability analysis",
      "Resource utilization reports",
      "Client billing integration",
    ],
  },
  {
    title: "Enterprise",
    icon: Building2,
    description: "Enterprise-grade HRMS for large organizations with complex needs",
    features: ["Multi-entity support", "Advanced compliance tools", "Custom workflows", "Dedicated support"],
  },
  {
    title: "Growing Businesses",
    icon: TrendingUp,
    description: "Scalable HR solutions that grow with your business",
    features: ["Easy onboarding", "Flexible pricing", "Self-service portal", "Mobile access"],
  },
  {
    title: "Regulated Industries",
    icon: Shield,
    description: "Compliance-focused HR management for regulated sectors",
    features: ["Audit trail & reporting", "Document management", "Certification tracking", "Regulatory compliance"],
  },
]

const benefits = [
  {
    title: "Flexible & Scalable",
    icon: TrendingUp,
    description: "Adapts to your business size and industry requirements with configurable workflows",
  },
  {
    title: "Secure & Compliant",
    icon: Shield,
    description: "Enterprise-grade security with SOC 2, GDPR, and HIPAA compliance",
  },
  {
    title: "AI-Powered",
    icon: Zap,
    description: "Intelligent automation and insights to optimize your HR operations",
  },
]
