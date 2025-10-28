import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Bug, Zap, Shield, Rocket } from "lucide-react"

export const metadata: Metadata = {
  title: "Changelog - Nino360",
  description: "Latest updates, features, and improvements to the Nino360 platform",
}

const releases = [
  {
    version: "2.5.0",
    date: "January 15, 2025",
    items: [
      {
        type: "feature",
        icon: Sparkles,
        title: "AI-Powered Candidate Matching",
        description: "Intelligent candidate recommendations based on job requirements and historical data",
      },
      {
        type: "feature",
        icon: Rocket,
        title: "Blockchain Verification",
        description: "Secure credential verification using blockchain technology",
      },
      {
        type: "improvement",
        icon: Zap,
        title: "Performance Optimization",
        description: "Dashboard load times improved by 40%",
      },
    ],
  },
  {
    version: "2.4.0",
    date: "December 20, 2024",
    items: [
      {
        type: "feature",
        icon: Sparkles,
        title: "Advanced Analytics Dashboard",
        description: "New KPI tracking and visualization capabilities",
      },
      {
        type: "feature",
        icon: Shield,
        title: "Enhanced Security",
        description: "Two-factor authentication and session management",
      },
      {
        type: "fix",
        icon: Bug,
        title: "Bug Fixes",
        description: "Resolved issues with timesheet approvals and invoice generation",
      },
    ],
  },
  {
    version: "2.3.0",
    date: "November 30, 2024",
    items: [
      {
        type: "feature",
        icon: Sparkles,
        title: "RPA Automation",
        description: "Automated workflows for repetitive tasks",
      },
      {
        type: "improvement",
        icon: Zap,
        title: "Mobile Responsiveness",
        description: "Improved mobile experience across all modules",
      },
      {
        type: "feature",
        icon: Rocket,
        title: "API Enhancements",
        description: "New REST API endpoints for integrations",
      },
    ],
  },
  {
    version: "2.2.0",
    date: "November 1, 2024",
    items: [
      {
        type: "feature",
        icon: Sparkles,
        title: "Multi-Currency Support",
        description: "Support for USD, EUR, GBP, and INR",
      },
      { type: "feature", icon: Shield, title: "Compliance Tools", description: "SOC 2 and GDPR compliance features" },
      {
        type: "improvement",
        icon: Zap,
        title: "Search Improvements",
        description: "Faster full-text search across all modules",
      },
    ],
  },
]

const typeConfig = {
  feature: { label: "New", color: "bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-400 border-blue-500/30" },
  improvement: {
    label: "Improved",
    color: "bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-400 border-purple-500/30",
  },
  fix: {
    label: "Fixed",
    color: "bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400 border-green-500/30",
  },
}

export default function ChangelogPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-xl bg-white/5">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent"
            >
              Nino360
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/features" className="text-slate-300 hover:text-white transition-colors">
                Features
              </Link>
              <Link href="/pricing" className="text-slate-300 hover:text-white transition-colors">
                Pricing
              </Link>
              <Link href="/docs" className="text-slate-300 hover:text-white transition-colors">
                Docs
              </Link>
              <Link href="/about" className="text-slate-300 hover:text-white transition-colors">
                About
              </Link>
              <Link href="/contact" className="text-slate-300 hover:text-white transition-colors">
                Contact
              </Link>
            </nav>
            <div className="flex items-center gap-3">
              <Button variant="ghost" asChild>
                <Link href="/auth">Sign In</Link>
              </Button>
              <Button
                asChild
                className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
              >
                <Link href="/auth">Start Free Trial</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Changelog
            </span>
          </h1>
          <p className="text-xl text-slate-300 mb-8">
            Stay up to date with the latest features, improvements, and bug fixes
          </p>
        </div>
      </section>

      {/* Releases */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="space-y-12">
            {releases.map((release) => (
              <div key={release.version} className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-1">Version {release.version}</h2>
                    <p className="text-slate-400">{release.date}</p>
                  </div>
                  <Badge
                    variant="outline"
                    className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-400 border-blue-500/30"
                  >
                    Latest
                  </Badge>
                </div>

                <div className="space-y-4">
                  {release.items.map((item, idx) => {
                    const Icon = item.icon
                    const config = typeConfig[item.type as keyof typeof typeConfig]

                    return (
                      <div
                        key={idx}
                        className="flex gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors"
                      >
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center">
                            <Icon className="w-5 h-5 text-blue-400" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className={config.color}>
                              {config.label}
                            </Badge>
                            <h3 className="font-semibold text-white">{item.title}</h3>
                          </div>
                          <p className="text-slate-400">{item.description}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="backdrop-blur-xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-white/10 rounded-2xl p-12 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to get started?</h2>
            <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
              Join thousands of companies using Nino360 to streamline their HR operations
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                asChild
                className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
              >
                <Link href="/auth">Start Free Trial</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="border-white/20 hover:bg-white/5 bg-transparent">
                <Link href="/contact">Contact Sales</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 px-4">
        <div className="container mx-auto">
          <div className="text-center text-slate-400">
            <p>&copy; 2025 Nino360. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
