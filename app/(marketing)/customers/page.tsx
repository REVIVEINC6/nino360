import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowRight, Building2, Users, TrendingUp, Award } from "lucide-react"

export const metadata: Metadata = {
  title: "Customer Stories | Nino360",
  description: "See how leading companies use Nino360 to transform their HR operations",
}

const stats = [
  { label: "Active Customers", value: "500+", icon: Building2 },
  { label: "Users Worldwide", value: "50K+", icon: Users },
  { label: "Avg. Efficiency Gain", value: "45%", icon: TrendingUp },
  { label: "Customer Satisfaction", value: "98%", icon: Award },
]

const caseStudies = [
  {
    company: "TechCorp Solutions",
    industry: "Technology",
    logo: "🚀",
    challenge: "Managing 500+ contractors across multiple projects with manual processes",
    solution: "Implemented Nino360 VMS and Projects modules with automated workflows",
    results: ["60% reduction in administrative time", "95% faster contractor onboarding", "$2M annual cost savings"],
    quote: "Nino360 transformed how we manage our contingent workforce. The automation and insights are game-changing.",
    author: "Sarah Johnson",
    role: "VP of Operations",
  },
  {
    company: "Global Staffing Inc",
    industry: "Staffing & Recruiting",
    logo: "🌐",
    challenge: "Scaling recruitment operations while maintaining quality and compliance",
    solution: "Deployed AI-powered ATS with blockchain verification and automated screening",
    results: ["3x increase in placements", "80% faster time-to-hire", "99.9% compliance rate"],
    quote:
      "The AI matching and blockchain verification give us a competitive edge. Our clients trust our placements more than ever.",
    author: "Michael Chen",
    role: "CEO",
  },
  {
    company: "Enterprise Services Ltd",
    industry: "Professional Services",
    logo: "💼",
    challenge: "Complex multi-currency billing and revenue recognition across 15 countries",
    solution: "Integrated Finance module with multi-currency support and automated revenue schedules",
    results: ["50% faster invoicing", "100% accurate revenue recognition", "40% reduction in billing errors"],
    quote: "Nino360 Finance module handles our complex global billing with ease. The automation is incredible.",
    author: "David Williams",
    role: "CFO",
  },
]

const testimonials = [
  {
    quote: "Best HRMS platform we've used. The AI features are truly innovative.",
    author: "Jennifer Martinez",
    role: "HR Director",
    company: "FinTech Innovations",
  },
  {
    quote: "Reduced our recruitment costs by 40% while improving quality of hires.",
    author: "Robert Taylor",
    role: "Talent Acquisition Lead",
    company: "Healthcare Partners",
  },
  {
    quote: "The blockchain verification gives our clients complete confidence in our placements.",
    author: "Lisa Anderson",
    role: "Operations Manager",
    company: "Consulting Group",
  },
]

export default function CustomersPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10" />
        <div className="container mx-auto max-w-6xl relative">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-6 bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Customer Success Stories
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              See how leading companies use Nino360 to transform their HR operations and drive business growth
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
            {stats.map((stat) => (
              <Card
                key={stat.label}
                className="p-6 backdrop-blur-sm bg-background/50 border-border/50 hover:border-primary/50 transition-all"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-linear-to-br from-blue-500/20 to-purple-500/20">
                    <stat.icon className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <div className="text-3xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold mb-12 text-center">Featured Case Studies</h2>
          <div className="space-y-12">
            {caseStudies.map((study, index) => (
              <Card
                key={study.company}
                className="p-8 backdrop-blur-sm bg-background/50 border-border/50 hover:border-primary/50 transition-all"
              >
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="text-4xl">{study.logo}</div>
                      <div>
                        <h3 className="text-2xl font-bold">{study.company}</h3>
                        <p className="text-sm text-muted-foreground">{study.industry}</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-sm text-muted-foreground mb-2">Challenge</h4>
                        <p className="text-foreground">{study.challenge}</p>
                      </div>

                      <div>
                        <h4 className="font-semibold text-sm text-muted-foreground mb-2">Solution</h4>
                        <p className="text-foreground">{study.solution}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="mb-6">
                      <h4 className="font-semibold text-sm text-muted-foreground mb-3">Results</h4>
                      <ul className="space-y-2">
                        {study.results.map((result, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <div className="mt-1 h-5 w-5 rounded-full bg-linear-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center shrink-0">
                              <div className="h-2 w-2 rounded-full bg-green-500" />
                            </div>
                            <span className="text-foreground">{result}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-4 rounded-lg bg-linear-to-br from-blue-500/10 to-purple-500/10 border border-border/50">
                      <p className="text-foreground italic mb-3">"{study.quote}"</p>
                      <div>
                        <p className="font-semibold text-sm">{study.author}</p>
                        <p className="text-xs text-muted-foreground">{study.role}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold mb-12 text-center">What Our Customers Say</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6 backdrop-blur-sm bg-background/50 border-border/50">
                <p className="text-foreground italic mb-4">"{testimonial.quote}"</p>
                <div>
                  <p className="font-semibold text-sm">{testimonial.author}</p>
                  <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                  <p className="text-xs text-muted-foreground">{testimonial.company}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Transform Your HR Operations?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join hundreds of companies using Nino360 to streamline their workforce management
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              Start Free Trial
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline">
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
