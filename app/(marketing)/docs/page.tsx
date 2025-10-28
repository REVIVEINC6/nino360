import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { BookOpen, Code, Zap, Shield, Users, Search, FileText, Video, MessageSquare, Download } from "lucide-react"

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="border-b border-white/20 backdrop-blur-xl bg-white/30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
            >
              Nino360
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/pricing" className="text-gray-700 hover:text-gray-900">
                Pricing
              </Link>
              <Link href="/about" className="text-gray-700 hover:text-gray-900">
                About
              </Link>
              <Link href="/contact" className="text-gray-700 hover:text-gray-900">
                Contact
              </Link>
              <Link href="/auth">
                <Button>Sign In</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Documentation
            </h1>
            <p className="text-xl text-gray-600 mb-8">Everything you need to know about Nino360 HRMS platform</p>

            {/* Search */}
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search documentation..."
                className="pl-12 h-14 text-lg backdrop-blur-xl bg-white/50 border-white/20"
              />
            </div>
          </div>

          {/* Quick Start Cards */}
          <div className="grid md:grid-cols-4 gap-6 mb-16">
            <Card className="p-6 backdrop-blur-xl bg-white/50 border-white/20 hover:shadow-xl transition-all cursor-pointer">
              <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2">Quick Start</h3>
              <p className="text-sm text-gray-600">Get up and running in minutes</p>
            </Card>

            <Card className="p-6 backdrop-blur-xl bg-white/50 border-white/20 hover:shadow-xl transition-all cursor-pointer">
              <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-4">
                <Code className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2">API Reference</h3>
              <p className="text-sm text-gray-600">Complete API documentation</p>
            </Card>

            <Card className="p-6 backdrop-blur-xl bg-white/50 border-white/20 hover:shadow-xl transition-all cursor-pointer">
              <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-pink-500 to-orange-500 flex items-center justify-center mb-4">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2">Guides</h3>
              <p className="text-sm text-gray-600">Step-by-step tutorials</p>
            </Card>

            <Card className="p-6 backdrop-blur-xl bg-white/50 border-white/20 hover:shadow-xl transition-all cursor-pointer">
              <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2">Security</h3>
              <p className="text-sm text-gray-600">Security best practices</p>
            </Card>
          </div>

          {/* Documentation Sections */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Getting Started */}
            <Card className="p-8 backdrop-blur-xl bg-white/50 border-white/20">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Zap className="h-6 w-6 text-blue-600" />
                Getting Started
              </h2>
              <ul className="space-y-3">
                <li>
                  <Link href="#" className="text-blue-600 hover:underline flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Introduction to Nino360
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-blue-600 hover:underline flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Creating Your First Tenant
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-blue-600 hover:underline flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Inviting Team Members
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-blue-600 hover:underline flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Configuring Modules
                  </Link>
                </li>
              </ul>
            </Card>

            {/* Modules */}
            <Card className="p-8 backdrop-blur-xl bg-white/50 border-white/20">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Users className="h-6 w-6 text-purple-600" />
                Modules
              </h2>
              <ul className="space-y-3">
                <li>
                  <Link href="#" className="text-blue-600 hover:underline flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    CRM Module
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-blue-600 hover:underline flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Talent/ATS Module
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-blue-600 hover:underline flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    HRMS Module
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-blue-600 hover:underline flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Finance Module
                  </Link>
                </li>
              </ul>
            </Card>

            {/* API Reference */}
            <Card className="p-8 backdrop-blur-xl bg-white/50 border-white/20">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Code className="h-6 w-6 text-pink-600" />
                API Reference
              </h2>
              <ul className="space-y-3">
                <li>
                  <Link href="#" className="text-blue-600 hover:underline flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Authentication
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-blue-600 hover:underline flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    REST API Endpoints
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-blue-600 hover:underline flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Webhooks
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-blue-600 hover:underline flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Rate Limits
                  </Link>
                </li>
              </ul>
            </Card>

            {/* Security */}
            <Card className="p-8 backdrop-blur-xl bg-white/50 border-white/20">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Shield className="h-6 w-6 text-orange-600" />
                Security
              </h2>
              <ul className="space-y-3">
                <li>
                  <Link href="#" className="text-blue-600 hover:underline flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Security Overview
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-blue-600 hover:underline flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    RBAC & FBAC
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-blue-600 hover:underline flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Blockchain Audit Trail
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-blue-600 hover:underline flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Compliance
                  </Link>
                </li>
              </ul>
            </Card>
          </div>

          {/* Resources */}
          <div className="mt-16">
            <h2 className="text-3xl font-bold mb-8 text-center">Additional Resources</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="p-6 backdrop-blur-xl bg-white/50 border-white/20 text-center">
                <Video className="h-12 w-12 mx-auto mb-4 text-blue-600" />
                <h3 className="font-semibold mb-2">Video Tutorials</h3>
                <p className="text-sm text-gray-600 mb-4">Watch step-by-step video guides</p>
                <Button variant="outline" size="sm">
                  Watch Now
                </Button>
              </Card>

              <Card className="p-6 backdrop-blur-xl bg-white/50 border-white/20 text-center">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 text-purple-600" />
                <h3 className="font-semibold mb-2">Community Forum</h3>
                <p className="text-sm text-gray-600 mb-4">Connect with other users</p>
                <Button variant="outline" size="sm">
                  Join Forum
                </Button>
              </Card>

              <Card className="p-6 backdrop-blur-xl bg-white/50 border-white/20 text-center">
                <Download className="h-12 w-12 mx-auto mb-4 text-pink-600" />
                <h3 className="font-semibold mb-2">Downloads</h3>
                <p className="text-sm text-gray-600 mb-4">SDKs, templates, and tools</p>
                <Button variant="outline" size="sm">
                  Download
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/20 backdrop-blur-xl bg-white/30 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center text-gray-600">
            <p>&copy; 2025 Nino360. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
