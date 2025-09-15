"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Book,
  Code,
  Zap,
  Shield,
  Globe,
  Users,
  Search,
  ArrowRight,
  ExternalLink,
  FileText,
  Video,
  Download,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const docCategories = [
  {
    title: "Getting Started",
    icon: Zap,
    color: "from-green-500 to-blue-500",
    description: "Quick start guides and basic setup",
    docs: [
      { title: "Platform Overview", type: "guide", time: "5 min read" },
      { title: "Account Setup", type: "tutorial", time: "10 min read" },
      { title: "First Steps", type: "guide", time: "8 min read" },
      { title: "Basic Configuration", type: "tutorial", time: "15 min read" },
    ],
  },
  {
    title: "AI Features",
    icon: Book,
    color: "from-purple-500 to-pink-500",
    description: "Understanding and using AI capabilities",
    docs: [
      { title: "AI Insights Overview", type: "guide", time: "12 min read" },
      { title: "Setting up AI Automation", type: "tutorial", time: "20 min read" },
      { title: "Custom AI Models", type: "advanced", time: "25 min read" },
      { title: "AI Best Practices", type: "guide", time: "15 min read" },
    ],
  },
  {
    title: "API Reference",
    icon: Code,
    color: "from-blue-500 to-purple-500",
    description: "Complete API documentation and examples",
    docs: [
      { title: "Authentication", type: "api", time: "10 min read" },
      { title: "CRM Endpoints", type: "api", time: "15 min read" },
      { title: "HRMS Endpoints", type: "api", time: "15 min read" },
      { title: "Webhooks", type: "api", time: "12 min read" },
    ],
  },
  {
    title: "Integrations",
    icon: Globe,
    color: "from-orange-500 to-red-500",
    description: "Connect with third-party services",
    docs: [
      { title: "Salesforce Integration", type: "integration", time: "18 min read" },
      { title: "Microsoft 365", type: "integration", time: "15 min read" },
      { title: "Slack Integration", type: "integration", time: "10 min read" },
      { title: "Custom Integrations", type: "advanced", time: "30 min read" },
    ],
  },
  {
    title: "Security",
    icon: Shield,
    color: "from-red-500 to-pink-500",
    description: "Security features and compliance",
    docs: [
      { title: "Security Overview", type: "guide", time: "8 min read" },
      { title: "Blockchain Audit Trails", type: "guide", time: "12 min read" },
      { title: "Data Encryption", type: "technical", time: "15 min read" },
      { title: "Compliance Standards", type: "guide", time: "10 min read" },
    ],
  },
  {
    title: "Administration",
    icon: Users,
    color: "from-teal-500 to-green-500",
    description: "User management and system administration",
    docs: [
      { title: "User Management", type: "guide", time: "12 min read" },
      { title: "Role-Based Access", type: "guide", time: "15 min read" },
      { title: "Tenant Configuration", type: "admin", time: "20 min read" },
      { title: "System Monitoring", type: "admin", time: "18 min read" },
    ],
  },
]

const quickLinks = [
  { title: "API Quickstart", icon: Code, href: "/docs/api/quickstart" },
  { title: "Video Tutorials", icon: Video, href: "/docs/videos" },
  { title: "SDK Downloads", icon: Download, href: "/docs/sdks" },
  { title: "Community Forum", icon: Users, href: "/community" },
]

const getTypeColor = (type: string) => {
  switch (type) {
    case "guide":
      return "bg-blue-500/20 text-blue-300 border-blue-500/30"
    case "tutorial":
      return "bg-green-500/20 text-green-300 border-green-500/30"
    case "api":
      return "bg-purple-500/20 text-purple-300 border-purple-500/30"
    case "integration":
      return "bg-orange-500/20 text-orange-300 border-orange-500/30"
    case "advanced":
      return "bg-red-500/20 text-red-300 border-red-500/30"
    case "technical":
      return "bg-pink-500/20 text-pink-300 border-pink-500/30"
    case "admin":
      return "bg-teal-500/20 text-teal-300 border-teal-500/30"
    default:
      return "bg-gray-500/20 text-gray-300 border-gray-500/30"
  }
}

export default function DocsPage() {
  const [searchQuery, setSearchQuery] = useState("")

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
              <Link href="/features" className="text-white/80 hover:text-white transition-colors">
                Features
              </Link>
              <Link href="/pricing" className="text-white/80 hover:text-white transition-colors">
                Pricing
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
            Documentation
          </Badge>

          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Everything You Need to
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent block">
              Build with Nino360
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-white/70 mb-12 max-w-4xl mx-auto leading-relaxed">
            Comprehensive guides, API references, and tutorials to help you get the most out of our AI-powered platform.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/40" size={20} />
              <Input
                type="text"
                placeholder="Search documentation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-4 text-lg bg-white/10 border-white/20 text-white placeholder:text-white/50 rounded-xl"
              />
            </div>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {quickLinks.map((link, index) => (
              <Link key={index} href={link.href}>
                <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 group cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <link.icon
                      className="mx-auto mb-3 text-white group-hover:text-blue-400 transition-colors"
                      size={24}
                    />
                    <p className="text-white/80 text-sm font-medium">{link.title}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Documentation Categories */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {docCategories.map((category, categoryIndex) => (
              <Card
                key={categoryIndex}
                className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 group"
              >
                <CardHeader>
                  <div
                    className={`w-12 h-12 rounded-lg bg-gradient-to-r ${category.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                  >
                    <category.icon className="text-white" size={24} />
                  </div>
                  <CardTitle className="text-white text-xl">{category.title}</CardTitle>
                  <CardDescription className="text-white/70">{category.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {category.docs.map((doc, docIndex) => (
                      <div
                        key={docIndex}
                        className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer group/doc"
                      >
                        <div className="flex items-center space-x-3">
                          <FileText className="text-white/60" size={16} />
                          <div>
                            <p className="text-white text-sm font-medium group-hover/doc:text-blue-400 transition-colors">
                              {doc.title}
                            </p>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge className={`text-xs ${getTypeColor(doc.type)}`}>{doc.type}</Badge>
                              <span className="text-white/50 text-xs">{doc.time}</span>
                            </div>
                          </div>
                        </div>
                        <ArrowRight className="text-white/40 group-hover/doc:text-white transition-colors" size={16} />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Support Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-black/20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Need More Help?</h2>
          <p className="text-xl text-white/70 mb-8">
            Can't find what you're looking for? Our support team is here to help.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <Users className="mx-auto mb-4 text-blue-400" size={32} />
                <h3 className="text-white text-lg font-semibold mb-2">Community Forum</h3>
                <p className="text-white/70 text-sm mb-4">Connect with other developers and get answers</p>
                <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 bg-transparent">
                  Visit Forum
                  <ExternalLink className="ml-2" size={16} />
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <Video className="mx-auto mb-4 text-purple-400" size={32} />
                <h3 className="text-white text-lg font-semibold mb-2">Video Tutorials</h3>
                <p className="text-white/70 text-sm mb-4">Step-by-step video guides and walkthroughs</p>
                <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 bg-transparent">
                  Watch Videos
                  <ExternalLink className="ml-2" size={16} />
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <Shield className="mx-auto mb-4 text-green-400" size={32} />
                <h3 className="text-white text-lg font-semibold mb-2">Direct Support</h3>
                <p className="text-white/70 text-sm mb-4">Get help directly from our support team</p>
                <Link href="/contact">
                  <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                    Contact Support
                  </Button>
                </Link>
              </CardContent>
            </Card>
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
