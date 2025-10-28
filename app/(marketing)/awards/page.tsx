import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Award, Trophy, Star, Medal, ArrowRight, Calendar } from "lucide-react"

export default function AwardsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-sm border border-white/20 mb-6">
            <Trophy className="h-4 w-4 text-purple-600" />
            <span className="text-sm font-medium bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Industry Recognition
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Awards & Recognition
          </h1>

          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Honored by industry leaders and recognized for innovation, excellence, and customer success
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { icon: Award, label: "Total Awards", value: "25+" },
              { icon: Trophy, label: "Industry Recognition", value: "15+" },
              { icon: Star, label: "Customer Choice", value: "10+" },
              { icon: Medal, label: "Innovation Awards", value: "8+" },
            ].map((stat, index) => (
              <div
                key={index}
                className="bg-white/60 backdrop-blur-sm border border-white/20 rounded-2xl p-6 text-center hover:shadow-lg transition-all"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 mb-4">
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Awards by Year */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Recent Awards
          </h2>

          <div className="space-y-8">
            {/* 2024 Awards */}
            <div className="bg-white/60 backdrop-blur-sm border border-white/20 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <Calendar className="h-6 w-6 text-purple-600" />
                <h3 className="text-2xl font-bold text-gray-900">2024</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    title: "Best HR Technology Platform",
                    organization: "HR Tech Awards",
                    description: "Recognized for innovation in HR technology and exceptional user experience",
                    category: "Technology",
                  },
                  {
                    title: "Top 50 SaaS Companies",
                    organization: "SaaS Magazine",
                    description: "Featured among the fastest-growing and most innovative SaaS companies",
                    category: "Business",
                  },
                  {
                    title: "Customer Choice Award",
                    organization: "G2 Crowd",
                    description: "Highest customer satisfaction ratings in the HRMS category",
                    category: "Customer Success",
                  },
                  {
                    title: "Innovation Excellence Award",
                    organization: "Tech Innovation Summit",
                    description: "Outstanding achievement in AI-powered recruitment technology",
                    category: "Innovation",
                  },
                ].map((award, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-br from-white/80 to-white/40 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:shadow-lg transition-all"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center">
                          <Trophy className="h-6 w-6 text-white" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="inline-block px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-medium mb-2">
                          {award.category}
                        </div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-1">{award.title}</h4>
                        <p className="text-sm text-gray-600 mb-2">{award.organization}</p>
                        <p className="text-sm text-gray-500">{award.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 2023 Awards */}
            <div className="bg-white/60 backdrop-blur-sm border border-white/20 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <Calendar className="h-6 w-6 text-purple-600" />
                <h3 className="text-2xl font-bold text-gray-900">2023</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    title: "Best Talent Management Solution",
                    organization: "Talent Tech Awards",
                    description: "Excellence in applicant tracking and talent acquisition technology",
                    category: "Talent",
                  },
                  {
                    title: "Fastest Growing Company",
                    organization: "Inc. 5000",
                    description: "Ranked among the fastest-growing private companies in America",
                    category: "Growth",
                  },
                  {
                    title: "Best User Experience",
                    organization: "UX Design Awards",
                    description: "Outstanding user interface and experience design",
                    category: "Design",
                  },
                  {
                    title: "Security Excellence Award",
                    organization: "Cybersecurity Excellence",
                    description: "Recognition for robust security practices and data protection",
                    category: "Security",
                  },
                ].map((award, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-br from-white/80 to-white/40 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:shadow-lg transition-all"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center">
                          <Award className="h-6 w-6 text-white" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium mb-2">
                          {award.category}
                        </div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-1">{award.title}</h4>
                        <p className="text-sm text-gray-600 mb-2">{award.organization}</p>
                        <p className="text-sm text-gray-500">{award.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-12 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Join Our Award-Winning Platform</h2>
            <p className="text-xl text-white/90 mb-8">
              Experience the platform trusted by industry leaders and recognized for excellence
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/demo">
                  Request Demo
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                asChild
              >
                <Link href="/contact">Contact Sales</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
