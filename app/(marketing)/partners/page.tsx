import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Building2,
  Users,
  Zap,
  Globe,
  Award,
  ArrowRight,
  CheckCircle2,
  Handshake,
  TrendingUp,
  Shield,
} from "lucide-react"

export const metadata: Metadata = {
  title: "Partners & Ecosystem | Nino360",
  description: "Join the Nino360 partner ecosystem and grow your business with our platform",
}

export default function PartnersPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <Badge className="mb-4 bg-linear-to-r from-blue-500 to-purple-500 text-white border-0">
            Partner Ecosystem
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Grow Together with Nino360
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Join our thriving partner ecosystem and unlock new opportunities for growth, innovation, and success
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button
              size="lg"
              className="bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              Become a Partner
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline">
              Partner Portal
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { icon: Building2, label: "Active Partners", value: "200+" },
              { icon: Users, label: "Joint Customers", value: "10K+" },
              { icon: Globe, label: "Countries", value: "50+" },
              { icon: TrendingUp, label: "Avg Revenue Growth", value: "45%" },
            ].map((stat, index) => (
              <div
                key={index}
                className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg text-center"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-linear-to-br from-blue-500 to-purple-500 text-white mb-4">
                  <stat.icon className="h-6 w-6" />
                </div>
                <div className="text-3xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partner Types */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Partner Programs
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Choose the partnership model that fits your business goals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Handshake,
                title: "Reseller Partners",
                description: "Sell Nino360 to your clients and earn competitive margins",
                benefits: ["Up to 30% margin", "Deal registration", "Sales enablement", "Co-marketing support"],
                badge: "Most Popular",
              },
              {
                icon: Zap,
                title: "Technology Partners",
                description: "Integrate your solution with Nino360 platform",
                benefits: ["API access", "Technical support", "Co-development", "Marketplace listing"],
              },
              {
                icon: Award,
                title: "Implementation Partners",
                description: "Help customers deploy and customize Nino360",
                benefits: ["Certification program", "Implementation fees", "Customer referrals", "Training resources"],
              },
            ].map((program, index) => (
              <div
                key={index}
                className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-lg hover:shadow-xl transition-all relative"
              >
                {program.badge && (
                  <Badge className="absolute top-4 right-4 bg-linear-to-r from-blue-500 to-purple-500 text-white border-0">
                    {program.badge}
                  </Badge>
                )}
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-linear-to-br from-blue-500 to-purple-500 text-white mb-6">
                  <program.icon className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold mb-3">{program.title}</h3>
                <p className="text-gray-600 mb-6">{program.description}</p>
                <ul className="space-y-3 mb-6">
                  {program.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">{benefit}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  Learn More
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partner Benefits */}
      <section className="py-16 px-4 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Partner Benefits
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Everything you need to succeed with Nino360</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: TrendingUp,
                title: "Revenue Growth",
                description: "Expand your revenue streams with competitive margins and recurring commissions",
              },
              {
                icon: Users,
                title: "Dedicated Support",
                description: "Access to partner success managers and technical support team",
              },
              {
                icon: Award,
                title: "Training & Certification",
                description: "Comprehensive training programs and partner certifications",
              },
              {
                icon: Zap,
                title: "Marketing Resources",
                description: "Co-marketing opportunities, MDF, and marketing collateral",
              },
              {
                icon: Shield,
                title: "Deal Protection",
                description: "Deal registration and partner-led opportunity protection",
              },
              {
                icon: Globe,
                title: "Global Reach",
                description: "Access to international markets and customer base",
              },
            ].map((benefit, index) => (
              <div key={index} className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-linear-to-br from-blue-500 to-purple-500 text-white mb-4">
                  <benefit.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
                <p className="text-sm text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-12 text-white">
            <h2 className="text-4xl font-bold mb-4">Ready to Partner with Us?</h2>
            <p className="text-xl mb-8 text-white/90">
              Join hundreds of partners who are growing their business with Nino360
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
                Apply Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 bg-transparent">
                Contact Partner Team
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
