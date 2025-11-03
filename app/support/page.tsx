import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { BookOpen, MessageCircle, Mail, Phone, Search, HelpCircle, FileText, Video } from "lucide-react"

export const metadata: Metadata = {
  title: "Support - Nino360",
  description: "Get help with Nino360. Access documentation, contact support, and find answers to common questions.",
}

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <header className="border-b bg-white/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="text-2xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
          >
            Nino360
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/contact">
              <Button>Contact Sales</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4 bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            How can we help you?
          </h1>
          <p className="text-xl text-gray-600 mb-8">Search our knowledge base or get in touch with our support team</p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="search"
              placeholder="Search for help articles, guides, and FAQs..."
              className="pl-12 h-14 text-lg"
            />
          </div>
        </div>

        {/* Quick Help Options */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-blue-500">
            <div className="h-12 w-12 rounded-lg bg-linear-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-4">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Documentation</h3>
            <p className="text-sm text-gray-600">Comprehensive guides and API references</p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-purple-500">
            <div className="h-12 w-12 rounded-lg bg-linear-to-br from-purple-500 to-purple-600 flex items-center justify-center mb-4">
              <Video className="h-6 w-6 text-white" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Video Tutorials</h3>
            <p className="text-sm text-gray-600">Step-by-step video guides and walkthroughs</p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-green-500">
            <div className="h-12 w-12 rounded-lg bg-linear-to-br from-green-500 to-green-600 flex items-center justify-center mb-4">
              <MessageCircle className="h-6 w-6 text-white" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Live Chat</h3>
            <p className="text-sm text-gray-600">Chat with our support team in real-time</p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-orange-500">
            <div className="h-12 w-12 rounded-lg bg-linear-to-br from-orange-500 to-orange-600 flex items-center justify-center mb-4">
              <HelpCircle className="h-6 w-6 text-white" />
            </div>
            <h3 className="font-semibold text-lg mb-2">FAQs</h3>
            <p className="text-sm text-gray-600">Answers to frequently asked questions</p>
          </Card>
        </div>

        {/* Popular Topics */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Popular Topics</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "Getting Started", icon: FileText, articles: 12 },
              { title: "Account Management", icon: FileText, articles: 8 },
              { title: "Billing & Payments", icon: FileText, articles: 6 },
              { title: "Integrations", icon: FileText, articles: 15 },
              { title: "Security & Privacy", icon: FileText, articles: 10 },
              { title: "API Documentation", icon: FileText, articles: 20 },
            ].map((topic) => (
              <Card key={topic.title} className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-lg bg-linear-to-br from-gray-100 to-gray-200 flex items-center justify-center shrink-0">
                    <topic.icon className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{topic.title}</h3>
                    <p className="text-sm text-gray-600">{topic.articles} articles</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Contact Support Form */}
        <div className="max-w-3xl mx-auto">
          <Card className="p-8 bg-white/50 backdrop-blur-sm border-2">
            <h2 className="text-3xl font-bold mb-2 text-center">Still need help?</h2>
            <p className="text-gray-600 text-center mb-8">
              Submit a support ticket and our team will get back to you within 24 hours
            </p>

            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Name</label>
                  <Input placeholder="Your name" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <Input type="email" placeholder="your@email.com" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Subject</label>
                <Input placeholder="Brief description of your issue" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Message</label>
                <Textarea placeholder="Describe your issue in detail..." rows={6} />
              </div>

              <Button className="w-full h-12 text-lg bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                Submit Ticket
              </Button>
            </form>
          </Card>

          {/* Contact Info */}
          <div className="grid md:grid-cols-2 gap-6 mt-8">
            <Card className="p-6 text-center">
              <Mail className="h-8 w-8 mx-auto mb-3 text-blue-600" />
              <h3 className="font-semibold mb-1">Email Support</h3>
              <p className="text-sm text-gray-600 mb-2">support@nino360.com</p>
              <p className="text-xs text-gray-500">Response within 24 hours</p>
            </Card>

            <Card className="p-6 text-center">
              <Phone className="h-8 w-8 mx-auto mb-3 text-purple-600" />
              <h3 className="font-semibold mb-1">Phone Support</h3>
              <p className="text-sm text-gray-600 mb-2">1-800-NINO-360</p>
              <p className="text-xs text-gray-500">Mon-Fri, 9am-6pm EST</p>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white/50 backdrop-blur-sm mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-sm text-gray-600">
            <p>© 2025 Nino360. All rights reserved.</p>
            <div className="flex items-center justify-center gap-4 mt-4">
              <Link href="/legal/privacy" className="hover:text-blue-600">
                Privacy Policy
              </Link>
              <Link href="/legal/terms" className="hover:text-blue-600">
                Terms of Service
              </Link>
              <Link href="/contact" className="hover:text-blue-600">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
