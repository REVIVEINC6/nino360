import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Users,
  TrendingUp,
  Target,
  Briefcase,
  UserPlus,
  BarChart3,
  Clock,
  Shield,
  Zap,
  CheckCircle2,
  ArrowRight,
} from "lucide-react"

export const metadata: Metadata = {
  title: "Use Cases | Nino360",
  description:
    "Discover how Nino360 solves real business challenges across talent acquisition, workforce management, and business operations.",
}

const useCases = [
  {
    icon: UserPlus,
    title: "Streamline Recruitment",
    description: "Accelerate your hiring process with AI-powered candidate matching and automated workflows.",
    challenge: "Manual screening of hundreds of resumes takes weeks",
    solution: "AI-powered ATS screens and ranks candidates in minutes",
    results: [
      "70% reduction in time-to-hire",
      "3x increase in quality candidates",
      "50% lower cost-per-hire",
      "90% recruiter satisfaction",
    ],
    category: "Talent Acquisition",
  },
  {
    icon: Users,
    title: "Manage Remote Teams",
    description: "Keep distributed teams connected, productive, and engaged with centralized workforce management.",
    challenge: "Tracking remote employee performance and engagement",
    solution: "Real-time dashboards with productivity metrics and engagement tools",
    results: [
      "85% employee engagement score",
      "40% improvement in collaboration",
      "60% faster onboarding",
      "95% retention rate",
    ],
    category: "Workforce Management",
  },
  {
    icon: TrendingUp,
    title: "Scale Your Business",
    description: "Grow your organization efficiently with scalable processes and automation.",
    challenge: "Manual processes breaking down as company grows",
    solution: "Automated workflows and scalable infrastructure",
    results: ["10x headcount growth supported", "80% process automation", "99.9% system uptime", "5x faster scaling"],
    category: "Business Growth",
  },
  {
    icon: Target,
    title: "Improve Candidate Experience",
    description: "Deliver exceptional candidate experiences that strengthen your employer brand.",
    challenge: "Candidates dropping out due to poor communication",
    solution: "Automated updates and personalized candidate portals",
    results: [
      "95% candidate satisfaction",
      "50% increase in offer acceptance",
      "4.8/5 Glassdoor rating",
      "3x referral rate",
    ],
    category: "Candidate Experience",
  },
  {
    icon: Briefcase,
    title: "Optimize Bench Management",
    description: "Maximize consultant utilization and reduce bench time with intelligent allocation.",
    challenge: "Consultants sitting on bench costing money",
    solution: "AI-powered matching with real-time opportunity alerts",
    results: ["60% reduction in bench time", "90% utilization rate", "$2M annual savings", "40% faster placements"],
    category: "Vendor Management",
  },
  {
    icon: BarChart3,
    title: "Data-Driven Decisions",
    description: "Make informed decisions with real-time analytics and predictive insights.",
    challenge: "Lack of visibility into key business metrics",
    solution: "Comprehensive dashboards with AI-powered insights",
    results: ["100% data visibility", "5x faster reporting", "30% better forecasting", "25% cost reduction"],
    category: "Analytics",
  },
  {
    icon: Clock,
    title: "Automate Compliance",
    description: "Stay compliant with automated tracking, reporting, and audit trails.",
    challenge: "Manual compliance tracking prone to errors",
    solution: "Automated compliance monitoring with blockchain verification",
    results: [
      "100% audit success rate",
      "90% time saved on reporting",
      "Zero compliance violations",
      "80% reduced risk",
    ],
    category: "Compliance",
  },
  {
    icon: Shield,
    title: "Secure Sensitive Data",
    description: "Protect employee and candidate data with enterprise-grade security.",
    challenge: "Data breaches and security vulnerabilities",
    solution: "End-to-end encryption with SOC 2 compliance",
    results: ["Zero security incidents", "SOC 2 Type II certified", "GDPR & HIPAA compliant", "99.99% data integrity"],
    category: "Security",
  },
  {
    icon: Zap,
    title: "Accelerate Onboarding",
    description: "Get new hires productive faster with automated onboarding workflows.",
    challenge: "New hires taking months to become productive",
    solution: "Structured onboarding with automated task management",
    results: [
      "75% faster time-to-productivity",
      "95% completion rate",
      "90% new hire satisfaction",
      "50% reduced turnover",
    ],
    category: "Employee Experience",
  },
]

export default function UseCasesPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Real Solutions for Real Challenges
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Discover how Nino360 helps organizations solve their most pressing talent and workforce management
            challenges
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button
              size="lg"
              className="bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              Schedule Demo
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline">
              View All Features
            </Button>
          </div>
        </div>
      </section>

      {/* Use Cases Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {useCases.map((useCase, index) => (
              <div
                key={index}
                className="group relative bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200/50"
              >
                {/* Category Badge */}
                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1 text-xs font-medium rounded-full bg-linear-to-r from-blue-100 to-purple-100 text-purple-700">
                    {useCase.category}
                  </span>
                </div>

                {/* Icon */}
                <div className="w-14 h-14 rounded-xl bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <useCase.icon className="h-7 w-7 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold mb-3 text-gray-900">{useCase.title}</h3>
                <p className="text-gray-600 mb-6">{useCase.description}</p>

                {/* Challenge & Solution */}
                <div className="space-y-4 mb-6">
                  <div>
                    <h4 className="text-sm font-semibold text-red-600 mb-1">Challenge</h4>
                    <p className="text-sm text-gray-600">{useCase.challenge}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-green-600 mb-1">Solution</h4>
                    <p className="text-sm text-gray-600">{useCase.solution}</p>
                  </div>
                </div>

                {/* Results */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Results</h4>
                  <ul className="space-y-2">
                    {useCase.results.map((result, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                        <span>{result}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Learn More Link */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <Link
                    href="/contact"
                    className="text-sm font-medium text-purple-600 hover:text-purple-700 flex items-center gap-1 group-hover:gap-2 transition-all"
                  >
                    Learn More
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="relative bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-12 text-center overflow-hidden">
            <div className="absolute inset-0 bg-grid-white/10" />
            <div className="relative">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Ready to Transform Your Business?</h2>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Join 500+ companies using Nino360 to solve their talent and workforce challenges
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button size="lg" variant="secondary" className="bg-white text-purple-600 hover:bg-gray-100">
                  Start Free Trial
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10 bg-transparent"
                >
                  Contact Sales
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
