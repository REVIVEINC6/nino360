import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Users, Target, Award, Zap, Shield } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              About Nino360
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Transforming workforce management with AI-powered intelligence, blockchain security, and intelligent
              automation.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="backdrop-blur-xl bg-white/70 rounded-3xl p-12 border border-white/20 shadow-xl">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold mb-6 bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Our Mission
                </h2>
                <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                  We're on a mission to revolutionize how organizations manage their workforce by combining cutting-edge
                  AI, blockchain technology, and intelligent automation into a unified platform.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed">
                  Nino360 empowers HR teams, recruiters, and business leaders to make data-driven decisions, automate
                  repetitive tasks, and focus on what matters most: building exceptional teams.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="backdrop-blur-xl bg-linear-to-br from-blue-500/10 to-purple-500/10 rounded-2xl p-6 border border-white/20">
                  <Target className="w-12 h-12 text-blue-600 mb-4" />
                  <h3 className="text-2xl font-bold mb-2">10K+</h3>
                  <p className="text-gray-600">Active Users</p>
                </div>
                <div className="backdrop-blur-xl bg-linear-to-br from-purple-500/10 to-pink-500/10 rounded-2xl p-6 border border-white/20">
                  <Users className="w-12 h-12 text-purple-600 mb-4" />
                  <h3 className="text-2xl font-bold mb-2">500+</h3>
                  <p className="text-gray-600">Companies</p>
                </div>
                <div className="backdrop-blur-xl bg-linear-to-br from-pink-500/10 to-blue-500/10 rounded-2xl p-6 border border-white/20">
                  <Award className="w-12 h-12 text-pink-600 mb-4" />
                  <h3 className="text-2xl font-bold mb-2">98%</h3>
                  <p className="text-gray-600">Satisfaction</p>
                </div>
                <div className="backdrop-blur-xl bg-linear-to-br from-blue-500/10 to-pink-500/10 rounded-2xl p-6 border border-white/20">
                  <Zap className="w-12 h-12 text-blue-600 mb-4" />
                  <h3 className="text-2xl font-bold mb-2">50%</h3>
                  <p className="text-gray-600">Time Saved</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Our Values
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "Security First",
                description:
                  "Blockchain-verified audit trails and enterprise-grade security protect your sensitive data.",
                gradient: "from-blue-500 to-purple-500",
              },
              {
                icon: Zap,
                title: "Innovation Driven",
                description: "Cutting-edge AI and ML technologies that continuously learn and improve your workflows.",
                gradient: "from-purple-500 to-pink-500",
              },
              {
                icon: Users,
                title: "People Focused",
                description:
                  "Designed by HR professionals for HR professionals, with intuitive interfaces and powerful features.",
                gradient: "from-pink-500 to-blue-500",
              },
            ].map((value, index) => (
              <div
                key={index}
                className="backdrop-blur-xl bg-white/70 rounded-2xl p-8 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div
                  className={`w-16 h-16 rounded-2xl bg-linear-to-br ${value.gradient} flex items-center justify-center mb-6`}
                >
                  <value.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="backdrop-blur-xl bg-white/70 rounded-3xl p-12 border border-white/20 shadow-xl">
            <h2 className="text-4xl font-bold text-center mb-12 bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Powered by Advanced Technology
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {[
                {
                  title: "Artificial Intelligence",
                  description:
                    "GPT-4 powered insights, predictive analytics, and intelligent automation across all modules.",
                },
                {
                  title: "Blockchain Security",
                  description: "Immutable audit trails and verification for compliance, security, and transparency.",
                },
                {
                  title: "Machine Learning",
                  description:
                    "Continuous learning algorithms that improve candidate matching, forecasting, and decision-making.",
                },
                {
                  title: "Robotic Process Automation",
                  description: "Automated workflows that eliminate repetitive tasks and accelerate business processes.",
                },
              ].map((tech, index) => (
                <div key={index} className="flex gap-4">
                  <CheckCircle2 className="w-6 h-6 text-green-600 shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-bold mb-2">{tech.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{tech.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="backdrop-blur-xl bg-linear-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-3xl p-12 border border-white/20 shadow-xl">
            <h2 className="text-4xl font-bold mb-6 bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Ready to Transform Your Workforce?
            </h2>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Join hundreds of companies already using Nino360 to streamline their HR operations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8"
              >
                Start Free Trial
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/demo">Schedule Demo</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
