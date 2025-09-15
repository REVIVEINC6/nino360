"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Brain,
  Cpu,
  Zap,
  Shield,
  Globe,
  Users,
  TrendingUp,
  Bot,
  Network,
  Database,
  Sparkles,
  ArrowRight,
  Play,
  Menu,
  X,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const aiTechnologies = [
  {
    icon: Brain,
    title: "General AI (AGI)",
    description: "Advanced reasoning and problem-solving across all business domains",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: Sparkles,
    title: "Superintelligent AI",
    description: "Beyond human-level intelligence for strategic decision making",
    color: "from-blue-500 to-purple-500",
  },
  {
    icon: Cpu,
    title: "Reactive Machines",
    description: "Real-time response systems for instant business operations",
    color: "from-green-500 to-blue-500",
  },
  {
    icon: Database,
    title: "Limited Memory AI",
    description: "Context-aware systems that learn from historical patterns",
    color: "from-orange-500 to-red-500",
  },
  {
    icon: Users,
    title: "Theory of Mind AI",
    description: "Understanding human emotions and intentions for better UX",
    color: "from-teal-500 to-green-500",
  },
  {
    icon: Bot,
    title: "Self-aware AI",
    description: "Autonomous systems that understand their own capabilities",
    color: "from-indigo-500 to-purple-500",
  },
  {
    icon: TrendingUp,
    title: "Machine Learning",
    description: "Continuous learning and adaptation from business data",
    color: "from-pink-500 to-rose-500",
  },
  {
    icon: Network,
    title: "Blockchain Integration",
    description: "Immutable audit trails and secure multi-tenant data",
    color: "from-yellow-500 to-orange-500",
  },
  {
    icon: Zap,
    title: "RPA Automation",
    description: "Intelligent process automation across all workflows",
    color: "from-cyan-500 to-blue-500",
  },
]

const features = [
  {
    title: "Multi-Tenant SaaS Architecture",
    description: "Enterprise-grade isolation with shared infrastructure efficiency",
    icon: Globe,
  },
  {
    title: "AI-Powered Analytics",
    description: "Predictive insights and automated decision recommendations",
    icon: Brain,
  },
  {
    title: "Blockchain Security",
    description: "Immutable audit trails and cryptographic data protection",
    icon: Shield,
  },
  {
    title: "Intelligent Automation",
    description: "RPA-driven workflows that adapt and optimize themselves",
    icon: Bot,
  },
]

const stats = [
  { value: "99.9%", label: "Uptime SLA" },
  { value: "10x", label: "Faster Processing" },
  { value: "256-bit", label: "Encryption" },
  { value: "Global", label: "Multi-Region" },
]

export function AdvancedAILanding() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleGetStarted = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsLoading(false)
    // Redirect to dashboard
    window.location.href = "/dashboard"
  }

  const handleRequestDemo = async () => {
    setIsLoading(true)
    // Simulate demo request
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsLoading(false)
    alert("Demo request submitted! We'll contact you within 24 hours.")
  }

  const handleNewsletterSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsLoading(true)
    // Simulate newsletter signup
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsLoading(false)
    setEmail("")
    alert("Successfully subscribed to our newsletter!")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Image src="/images/nino360-logo.png" alt="Nino360 Logo" width={40} height={40} className="rounded-lg" />
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Nino360
              </span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <Link href="/features" className="text-white/80 hover:text-white transition-colors">
                Features
              </Link>
              <Link href="/pricing" className="text-white/80 hover:text-white transition-colors">
                Pricing
              </Link>
              <Link href="/docs" className="text-white/80 hover:text-white transition-colors">
                Documentation
              </Link>
              <Link href="/contact" className="text-white/80 hover:text-white transition-colors">
                Contact
              </Link>
              <Button
                onClick={handleGetStarted}
                disabled={isLoading}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                {isLoading ? "Loading..." : "Get Started"}
              </Button>
            </div>

            <button className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-black/90 backdrop-blur-md">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link href="/features" className="block px-3 py-2 text-white/80 hover:text-white">
                Features
              </Link>
              <Link href="/pricing" className="block px-3 py-2 text-white/80 hover:text-white">
                Pricing
              </Link>
              <Link href="/docs" className="block px-3 py-2 text-white/80 hover:text-white">
                Documentation
              </Link>
              <Link href="/contact" className="block px-3 py-2 text-white/80 hover:text-white">
                Contact
              </Link>
              <Button
                onClick={handleGetStarted}
                disabled={isLoading}
                className="w-full mt-2 bg-gradient-to-r from-blue-500 to-purple-600"
              >
                {isLoading ? "Loading..." : "Get Started"}
              </Button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <Badge className="mb-6 bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 border-blue-500/30">
            Powered by Superintelligent AI
          </Badge>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            The Future of
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent block">
              Intelligent Business
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-white/70 mb-8 max-w-4xl mx-auto leading-relaxed">
            Nino360 combines General AI, Blockchain, and RPA in a unified SaaS platform. Experience superintelligent
            automation that thinks, learns, and evolves with your business.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button
              size="lg"
              onClick={handleGetStarted}
              disabled={isLoading}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-lg px-8 py-4"
            >
              {isLoading ? "Loading..." : "Start Free Trial"}
              <ArrowRight className="ml-2" size={20} />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={handleRequestDemo}
              disabled={isLoading}
              className="border-white/30 text-white hover:bg-white/10 text-lg px-8 py-4 bg-transparent"
            >
              <Play className="mr-2" size={20} />
              {isLoading ? "Loading..." : "Watch Demo"}
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-white/60 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Technologies Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Powered by Advanced AI Technologies</h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              Our platform integrates cutting-edge AI capabilities to deliver unprecedented intelligence and automation
              for your business operations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {aiTechnologies.map((tech, index) => (
              <Card
                key={index}
                className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 group"
              >
                <CardHeader>
                  <div
                    className={`w-12 h-12 rounded-lg bg-gradient-to-r ${tech.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                  >
                    <tech.icon className="text-white" size={24} />
                  </div>
                  <CardTitle className="text-white text-xl">{tech.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-white/70 text-base">{tech.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-black/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Enterprise-Grade Platform</h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              Built for scale, security, and performance with multi-tenant architecture and blockchain-secured data
              integrity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-gradient-to-br from-white/10 to-white/5 border-white/20 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                      <feature.icon className="text-white" size={24} />
                    </div>
                    <CardTitle className="text-white text-xl">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-white/70 text-base">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Ready to Transform Your Business?</h2>
          <p className="text-xl text-white/70 mb-8">
            Join thousands of companies already using Nino360's AI-powered platform to revolutionize their operations.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button
              size="lg"
              onClick={handleGetStarted}
              disabled={isLoading}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-lg px-8 py-4"
            >
              {isLoading ? "Loading..." : "Start Your Free Trial"}
              <ArrowRight className="ml-2" size={20} />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={handleRequestDemo}
              disabled={isLoading}
              className="border-white/30 text-white hover:bg-white/10 text-lg px-8 py-4 bg-transparent"
            >
              {isLoading ? "Loading..." : "Schedule Demo"}
            </Button>
          </div>

          {/* Newsletter Signup */}
          <form onSubmit={handleNewsletterSignup} className="max-w-md mx-auto">
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                required
              />
              <Button
                type="submit"
                disabled={isLoading || !email}
                className="bg-gradient-to-r from-blue-500 to-purple-600"
              >
                {isLoading ? "..." : "Subscribe"}
              </Button>
            </div>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <Image src="/images/nino360-logo.png" alt="Nino360 Logo" width={32} height={32} className="rounded-lg" />
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Nino360
              </span>
            </div>

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
