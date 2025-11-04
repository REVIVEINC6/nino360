import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Mail, Phone, MapPin, Send } from "lucide-react"

export const metadata: Metadata = {
  title: "Contact Us | Nino360",
  description:
    "Get in touch with our team. We're here to help with your HR, recruitment, and workforce management needs.",
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="border-b border-white/20 backdrop-blur-xl bg-white/30">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="text-2xl font-bold bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
          >
            Nino360
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/pricing" className="text-gray-700 hover:text-gray-900 transition-colors">
              Pricing
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-gray-900 transition-colors">
              About
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-gray-900 transition-colors">
              Contact
            </Link>
            <Link href="/login">
              <Button variant="outline" size="sm">
                Sign In
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm" className="bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 text-white">
                Get Started
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Get in Touch
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Form */}
            <div className="backdrop-blur-xl bg-white/40 rounded-2xl p-8 border border-white/20 shadow-xl">
              <h2 className="text-2xl font-bold mb-6 bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Send us a Message
              </h2>
              <form className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" placeholder="John Doe" className="bg-white/50 border-white/20" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@company.com"
                    className="bg-white/50 border-white/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input id="company" placeholder="Your Company" className="bg-white/50 border-white/20" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Tell us how we can help..."
                    rows={5}
                    className="bg-white/50 border-white/20"
                  />
                </div>
                <Button className="w-full bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 text-white">
                  <Send className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              <div className="backdrop-blur-xl bg-white/40 rounded-2xl p-8 border border-white/20 shadow-xl">
                <h2 className="text-2xl font-bold mb-6 bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Contact Information
                </h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-linear-to-br from-blue-500/20 to-purple-500/20">
                      <Mail className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Email</h3>
                      <p className="text-gray-600">support@nino360.com</p>
                      <p className="text-gray-600">sales@nino360.com</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-linear-to-br from-purple-500/20 to-pink-500/20">
                      <Phone className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Phone</h3>
                      <p className="text-gray-600">+1 (555) 123-4567</p>
                      <p className="text-sm text-gray-500">Mon-Fri 9am-6pm EST</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-linear-to-br from-pink-500/20 to-blue-500/20">
                      <MapPin className="w-6 h-6 text-pink-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Office</h3>
                      <p className="text-gray-600">123 Business Ave</p>
                      <p className="text-gray-600">San Francisco, CA 94105</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="backdrop-blur-xl bg-white/40 rounded-2xl p-8 border border-white/20 shadow-xl">
                <h3 className="text-xl font-bold mb-4 bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Quick Links
                </h3>
                <div className="space-y-3">
                  <Link href="/demo" className="block text-gray-700 hover:text-gray-900 transition-colors">
                    Schedule a Demo →
                  </Link>
                  <Link href="/pricing" className="block text-gray-700 hover:text-gray-900 transition-colors">
                    View Pricing →
                  </Link>
                  <Link href="/about" className="block text-gray-700 hover:text-gray-900 transition-colors">
                    About Us →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/20 backdrop-blur-xl bg-white/30 py-12">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>&copy; 2025 Nino360. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
