import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Clock, Lightbulb, Rocket, Target, Zap } from "lucide-react"
import Link from "next/link"

export const metadata = {
  title: "Product Roadmap | Nino360",
  description: "See what we are building next for the Nino360 platform",
}

const roadmapItems = [
  {
    quarter: "Q1 2025",
    status: "completed",
    items: [
      { title: "Advanced AI Candidate Matching", description: "ML-powered candidate recommendations", icon: Zap },
      { title: "Mobile App Launch", description: "iOS and Android native applications", icon: Rocket },
      { title: "Enhanced Analytics Dashboard", description: "Real-time insights and custom reports", icon: Target },
    ],
  },
  {
    quarter: "Q2 2025",
    status: "in-progress",
    items: [
      { title: "Blockchain Verification", description: "Immutable credential verification system", icon: CheckCircle2 },
      { title: "Video Interview Platform", description: "Built-in video interviewing with AI analysis", icon: Rocket },
      { title: "Advanced Automation Workflows", description: "No-code workflow builder with 100+ triggers", icon: Zap },
    ],
  },
  {
    quarter: "Q3 2025",
    status: "planned",
    items: [
      { title: "Global Payroll Integration", description: "Multi-currency payroll processing", icon: Target },
      { title: "Skills Assessment Platform", description: "Technical and soft skills testing", icon: CheckCircle2 },
      { title: "Marketplace Expansion", description: "50+ new integration partners", icon: Rocket },
    ],
  },
  {
    quarter: "Q4 2025",
    status: "planned",
    items: [
      { title: "AI Copilot 2.0", description: "Advanced natural language processing", icon: Zap },
      { title: "Predictive Analytics", description: "Forecast hiring needs and turnover", icon: Target },
      { title: "White Label Solution", description: "Fully customizable branded platform", icon: Rocket },
    ],
  },
]

const statusConfig = {
  completed: { label: "Completed", color: "bg-green-500/10 text-green-600 border-green-500/20" },
  "in-progress": { label: "In Progress", color: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
  planned: { label: "Planned", color: "bg-purple-500/10 text-purple-600 border-purple-500/20" },
}

export default function RoadmapPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <Badge className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
            Product Roadmap
          </Badge>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Building the Future of HR Tech
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            See what we're working on and what's coming next. We're constantly innovating to bring you the best HR
            management experience.
          </p>
        </div>
      </section>

      {/* Roadmap Timeline */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="space-y-12">
            {roadmapItems.map((quarter, idx) => (
              <div key={quarter.quarter} className="relative">
                {/* Timeline Line */}
                {idx !== roadmapItems.length - 1 && (
                  <div className="absolute left-8 top-24 bottom-0 w-0.5 bg-gradient-to-b from-blue-200 via-purple-200 to-pink-200 hidden lg:block" />
                )}

                <div className="flex flex-col lg:flex-row gap-6 items-start">
                  {/* Quarter Badge */}
                  <div className="flex-shrink-0 lg:w-48">
                    <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full px-6 py-3 shadow-sm">
                      <Clock className="w-5 h-5 text-blue-600" />
                      <span className="font-semibold text-gray-900">{quarter.quarter}</span>
                    </div>
                    <Badge className={`mt-3 ml-2 ${statusConfig[quarter.status].color}`}>
                      {statusConfig[quarter.status].label}
                    </Badge>
                  </div>

                  {/* Items Grid */}
                  <div className="flex-1 grid md:grid-cols-3 gap-6">
                    {quarter.items.map((item, itemIdx) => {
                      const Icon = item.icon
                      return (
                        <Card
                          key={itemIdx}
                          className="p-6 bg-white/80 backdrop-blur-sm border-gray-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                        >
                          <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center">
                              <Icon className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                              <p className="text-sm text-gray-600">{item.description}</p>
                            </div>
                          </div>
                        </Card>
                      )
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Requests Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Card className="p-8 bg-white/80 backdrop-blur-sm border-gray-200 text-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-6">
              <Lightbulb className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Have a Feature Request?
            </h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              We love hearing from our customers! Share your ideas and help us shape the future of Nino360.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                asChild
              >
                <Link href="/contact">Submit Feature Request</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/changelog">View Changelog</Link>
              </Button>
            </div>
          </Card>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { label: "Features Shipped", value: "150+", icon: Rocket },
              { label: "In Development", value: "25+", icon: Clock },
              { label: "Customer Requests", value: "500+", icon: Lightbulb },
              { label: "Release Frequency", value: "Weekly", icon: Zap },
            ].map((stat, idx) => {
              const Icon = stat.icon
              return (
                <div key={idx} className="text-center">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}
