"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Brain, Globe, Bot, ArrowRight, CheckCircle, Layers } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const features = [
  {
    category: "AI Intelligence",
    icon: Brain,
    color: "from-purple-500 to-pink-500",
    items: [
      {
        title: "General AI (AGI)",
        description: "Advanced reasoning and problem-solving across all business domains",
        benefits: ["Cross-domain intelligence", "Autonomous decision making", "Predictive analytics"],
      },
      {
        title: "Superintelligent AI",
        description: "Beyond human-level intelligence for strategic decision making",
        benefits: ["Strategic planning", "Complex optimization", "Future forecasting"],
      },
      {
        title: "Machine Learning",
        description: "Continuous learning and adaptation from business data",
        benefits: ["Pattern recognition", "Automated insights", "Performance optimization"],
      },
    ],
  },
  {
    category: "Enterprise Platform",
    icon: Globe,
    color: "from-blue-500 to-purple-500",
    items: [
      {
        title: "Multi-Tenant Architecture",
        description: "Enterprise-grade isolation with shared infrastructure efficiency",
        benefits: ["Data isolation", "Scalable infrastructure", "Cost optimization"],
      },
      {
        title: "Blockchain Security",
        description: "Immutable audit trails and cryptographic data protection",
        benefits: ["Tamper-proof records", "Compliance ready", "Trust verification"],
      },
      {
        title: "Global Deployment",
        description: "Multi-region deployment with 99.9% uptime SLA",
        benefits: ["Global availability", "Low latency", "Disaster recovery"],
      },
    ],
  },
  {
    category: "Business Modules",
    icon: Layers,
    color: "from-green-500 to-blue-500",
    items: [
      {
        title: "Intelligent CRM",
        description: "AI-powered customer relationship management with predictive insights",
        benefits: ["Lead scoring", "Sales forecasting", "Customer analytics"],
      },
      {
        title: "Smart HRMS",
        description: "Human resource management with AI-driven talent optimization",
        benefits: ["Talent matching", "Performance prediction", "Automated workflows"],
      },
      {
        title: "Finance Suite",
        description: "Comprehensive financial management with AI-powered analytics",
        benefits: ["Revenue forecasting", "Expense optimization", "Risk assessment"],
      },
    ],
  },
  {
    category: "Automation & RPA",
    icon: Bot,
    color: "from-orange-500 to-red-500",
    items: [
      {
        title: "Intelligent Process Automation",
        description: "RPA-driven workflows that adapt and optimize themselves",
        benefits: ["Process optimization", "Error reduction", "Cost savings"],
      },
      {
        title: "Workflow Intelligence",
        description: "AI-powered workflow design and optimization",
        benefits: ["Smart routing", "Bottleneck detection", "Performance tuning"],
      },
      {
        title: "Decision Automation",
        description: "Automated decision making based on AI insights",
        benefits: ["Faster decisions", "Consistent outcomes", "Reduced bias"],
      },
    ],
  },
]

const integrations = [
  { name: "Salesforce", logo: "/salesforce-logo.png" },
  { name: "Microsoft", logo: "/microsoft-logo.png" },
  { name: "Google Cloud", logo: "/images/partners/google-cloud-logo.png" },
  { name: "AWS", logo: "/aws-logo.png" },
  { name: "Slack", logo: "/slack-logo.png" },
  { name: "Zoom", logo: "/zoom-logo.jpg" },
]

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-3">
              <Image src="/images/nino360-logo.png" alt="Nino360 Logo" width={40} height={40} className="rounded-lg" />
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Nino360
              </span>
            </Link>

            <div className="flex items-center space-x-6">
              <Link href="/pricing" className="text-white/80 hover:text-white transition-colors">
                Pricing
              </Link>
              <Link href="/docs" className="text-white/80 hover:text-white transition-colors">
                Documentation
              </Link>
              <Link href="/contact" className="text-white/80 hover:text-white transition-colors">
                Contact
              </Link>
              <Link href="/dashboard">
                <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <Badge className="mb-6 bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 border-blue-500/30">
            Platform Features
          </Badge>

          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Powered by
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent block">
              Advanced AI Technology
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-white/70 mb-12 max-w-4xl mx-auto leading-relaxed">
            Discover the comprehensive suite of AI-powered features that make Nino360 the most advanced business
            platform available today.
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {features.map((category, categoryIndex) => (
            <div key={categoryIndex} className="mb-20">
              <div className="text-center mb-12">
                <div className="flex items-center justify-center mb-4">
                  <div
                    className={`w-16 h-16 rounded-xl bg-gradient-to-r ${category.color} flex items-center justify-center`}
                  >
                    <category.icon className="text-white" size={32} />
                  </div>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{category.category}</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {category.items.map((feature, featureIndex) => (
                  <Card
                    key={featureIndex}
                    className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 group"
                  >
                    <CardHeader>
                      <CardTitle className="text-white text-xl mb-2">{feature.title}</CardTitle>
                      <CardDescription className="text-white/70 text-base">{feature.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {feature.benefits.map((benefit, benefitIndex) => (
                          <div key={benefitIndex} className="flex items-center space-x-2">
                            <CheckCircle className="text-green-400" size={16} />
                            <span className="text-white/80 text-sm">{benefit}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Integrations Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-black/20">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Seamless Integrations</h2>
          <p className="text-xl text-white/70 mb-12 max-w-3xl mx-auto">
            Connect with your existing tools and platforms for a unified business experience.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
            {integrations.map((integration, index) => (
              <div
                key={index}
                className="bg-white/10 rounded-lg p-6 hover:bg-white/20 transition-all duration-300 group"
              >
                <Image
                  src={integration.logo || "/placeholder.svg"}
                  alt={`${integration.name} logo`}
                  width={120}
                  height={40}
                  className="mx-auto opacity-70 group-hover:opacity-100 transition-opacity"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Experience the Future?</h2>
          <p className="text-xl text-white/70 mb-8">
            Join thousands of companies already using Nino360's AI-powered platform.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/dashboard">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-lg px-8 py-4"
              >
                Start Free Trial
                <ArrowRight className="ml-2" size={20} />
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 text-lg px-8 py-4 bg-transparent"
              >
                Contact Sales
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <Link href="/" className="flex items-center space-x-3 mb-4 md:mb-0">
              <Image src="/images/nino360-logo.png" alt="Nino360 Logo" width={32} height={32} className="rounded-lg" />
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Nino360
              </span>
            </Link>

            <div className="flex items-center space-x-6 text-white/60">
              <Link href="/privacy" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link href="/support" className="hover:text-white transition-colors">
                Support
              </Link>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-white/10 text-center text-white/60">
            <p>&copy; 2024 Nino360.com. All rights reserved. Powered by Superintelligent AI.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
