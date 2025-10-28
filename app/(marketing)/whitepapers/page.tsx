import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FileText, Download, Clock, TrendingUp, Users, Shield, Zap, Brain } from "lucide-react"

export const metadata: Metadata = {
  title: "Whitepapers & Research | Nino360",
  description:
    "Download in-depth whitepapers and research reports on HR technology, talent management, and workforce optimization.",
}

const whitepapers = [
  {
    title: "The Future of HR Technology in 2025",
    description:
      "Comprehensive analysis of emerging trends in HR technology, including AI, automation, and predictive analytics.",
    category: "Industry Trends",
    pages: 45,
    downloads: "12.5K",
    publishedDate: "January 2025",
    icon: TrendingUp,
  },
  {
    title: "AI-Powered Talent Acquisition: A Complete Guide",
    description:
      "Learn how artificial intelligence is transforming recruitment processes and improving candidate quality.",
    category: "Talent Acquisition",
    pages: 38,
    downloads: "10.2K",
    publishedDate: "December 2024",
    icon: Brain,
  },
  {
    title: "Building a Data-Driven HR Strategy",
    description:
      "Strategic framework for leveraging HR analytics to make informed decisions and drive business outcomes.",
    category: "HR Analytics",
    pages: 52,
    downloads: "9.8K",
    publishedDate: "November 2024",
    icon: TrendingUp,
  },
  {
    title: "Remote Workforce Management Best Practices",
    description: "Proven strategies for managing distributed teams, maintaining culture, and ensuring productivity.",
    category: "Workforce Management",
    pages: 41,
    downloads: "11.3K",
    publishedDate: "October 2024",
    icon: Users,
  },
  {
    title: "Compliance & Security in Modern HRMS",
    description: "Essential guide to maintaining compliance with GDPR, HIPAA, and other regulations in HR systems.",
    category: "Compliance",
    pages: 36,
    downloads: "8.7K",
    publishedDate: "September 2024",
    icon: Shield,
  },
  {
    title: "Automation in HR: ROI and Implementation",
    description:
      "Detailed analysis of HR automation benefits, implementation strategies, and measuring return on investment.",
    category: "Automation",
    pages: 44,
    downloads: "9.1K",
    publishedDate: "August 2024",
    icon: Zap,
  },
]

const categories = [
  "All Topics",
  "Industry Trends",
  "Talent Acquisition",
  "HR Analytics",
  "Workforce Management",
  "Compliance",
  "Automation",
]

export default function WhitepapersPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-sm border border-white/20 mb-6">
            <FileText className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-gray-700">Research & Insights</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Whitepapers & Research
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Download in-depth research reports and whitepapers on HR technology, talent management, and workforce
            optimization.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                50+
              </div>
              <div className="text-gray-600">Research Reports</div>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                100K+
              </div>
              <div className="text-gray-600">Total Downloads</div>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent mb-2">
                Monthly
              </div>
              <div className="text-gray-600">New Publications</div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <Button
                key={category}
                variant={category === "All Topics" ? "default" : "outline"}
                className={
                  category === "All Topics"
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                    : "bg-white/60 backdrop-blur-sm border-white/20 hover:bg-white/80"
                }
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Whitepapers Grid */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {whitepapers.map((paper, index) => {
              const Icon = paper.icon
              return (
                <div
                  key={index}
                  className="group bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                      {paper.category}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                    {paper.title}
                  </h3>

                  <p className="text-gray-600 mb-4 line-clamp-3">{paper.description}</p>

                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <FileText className="h-4 w-4" />
                      <span>{paper.pages} pages</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Download className="h-4 w-4" />
                      <span>{paper.downloads}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-sm text-gray-500 mb-4">
                    <Clock className="h-4 w-4" />
                    <span>{paper.publishedDate}</span>
                  </div>

                  <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:opacity-90">
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </Button>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-12 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Stay Updated with Latest Research</h2>
            <p className="text-xl mb-8 text-white/90">
              Subscribe to receive new whitepapers and research reports directly in your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/newsletter">Subscribe to Newsletter</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                asChild
              >
                <Link href="/contact">Request Custom Research</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
