import { Building2, Globe, Shield, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function SubprocessorsPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Subprocessors
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            List of third-party subprocessors we use to provide our services
          </p>
          <p className="text-sm text-gray-500 mt-2">Last Updated: January 15, 2025</p>
        </div>

        {/* Introduction */}
        <div className="backdrop-blur-sm bg-white/70 rounded-2xl p-8 shadow-lg border border-white/20 mb-8">
          <h2 className="text-2xl font-bold mb-4 bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            About Our Subprocessors
          </h2>
          <p className="text-gray-700 mb-4">
            Nino360 uses certain third-party subprocessors to assist in providing our services. This page lists all
            subprocessors we currently use, their purpose, and data location.
          </p>
          <p className="text-gray-700">
            We carefully vet all subprocessors to ensure they meet our security and privacy standards. All subprocessors
            are bound by data processing agreements that comply with GDPR and other applicable data protection laws.
          </p>
        </div>

        {/* Notification Section */}
        <div className="backdrop-blur-sm bg-linear-to-r from-blue-500/10 to-purple-500/10 rounded-2xl p-6 shadow-lg border border-white/20 mb-8">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-linear-to-br from-blue-500 to-purple-600 rounded-xl text-white">
              <Bell className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-2">Change Notifications</h3>
              <p className="text-gray-700 mb-4">
                We will notify customers at least 30 days in advance of adding a new subprocessor or making material
                changes to existing subprocessors. Customers can object to the use of a new subprocessor within this
                notification period.
              </p>
              <Button asChild>
                <Link href="/newsletter">Subscribe to Updates</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Subprocessors List */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Current Subprocessors
          </h2>

          {/* Infrastructure & Hosting */}
          <div className="backdrop-blur-sm bg-white/70 rounded-2xl p-6 shadow-lg border border-white/20">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <div className="p-2 bg-linear-to-br from-blue-500 to-purple-600 rounded-lg text-white">
                <Building2 className="w-5 h-5" />
              </div>
              Infrastructure & Hosting
            </h3>
            <div className="space-y-4">
              <SubprocessorItem
                name="Vercel Inc."
                purpose="Application hosting and deployment"
                location="United States"
                website="vercel.com"
              />
              <SubprocessorItem
                name="Amazon Web Services (AWS)"
                purpose="Cloud infrastructure and storage"
                location="United States, EU"
                website="aws.amazon.com"
              />
              <SubprocessorItem
                name="Supabase Inc."
                purpose="Database hosting and authentication"
                location="United States"
                website="supabase.com"
              />
            </div>
          </div>

          {/* Communication Services */}
          <div className="backdrop-blur-sm bg-white/70 rounded-2xl p-6 shadow-lg border border-white/20">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <div className="p-2 bg-linear-to-br from-purple-500 to-pink-600 rounded-lg text-white">
                <Globe className="w-5 h-5" />
              </div>
              Communication Services
            </h3>
            <div className="space-y-4">
              <SubprocessorItem
                name="SendGrid (Twilio)"
                purpose="Transactional email delivery"
                location="United States"
                website="sendgrid.com"
              />
              <SubprocessorItem
                name="Twilio Inc."
                purpose="SMS and voice communications"
                location="United States"
                website="twilio.com"
              />
            </div>
          </div>

          {/* Analytics & Monitoring */}
          <div className="backdrop-blur-sm bg-white/70 rounded-2xl p-6 shadow-lg border border-white/20">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <div className="p-2 bg-linear-to-br from-pink-500 to-purple-600 rounded-lg text-white">
                <Shield className="w-5 h-5" />
              </div>
              Analytics & Monitoring
            </h3>
            <div className="space-y-4">
              <SubprocessorItem
                name="Vercel Analytics"
                purpose="Application performance monitoring"
                location="United States"
                website="vercel.com/analytics"
              />
              <SubprocessorItem
                name="Sentry"
                purpose="Error tracking and monitoring"
                location="United States"
                website="sentry.io"
              />
            </div>
          </div>

          {/* Payment Processing */}
          <div className="backdrop-blur-sm bg-white/70 rounded-2xl p-6 shadow-lg border border-white/20">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <div className="p-2 bg-linear-to-br from-blue-500 to-pink-600 rounded-lg text-white">
                <Building2 className="w-5 h-5" />
              </div>
              Payment Processing
            </h3>
            <div className="space-y-4">
              <SubprocessorItem
                name="Stripe Inc."
                purpose="Payment processing and billing"
                location="United States, EU"
                website="stripe.com"
              />
            </div>
          </div>

          {/* AI & Machine Learning */}
          <div className="backdrop-blur-sm bg-white/70 rounded-2xl p-6 shadow-lg border border-white/20">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <div className="p-2 bg-linear-to-br from-purple-500 to-blue-600 rounded-lg text-white">
                <Globe className="w-5 h-5" />
              </div>
              AI & Machine Learning
            </h3>
            <div className="space-y-4">
              <SubprocessorItem
                name="OpenAI"
                purpose="AI-powered features and automation"
                location="United States"
                website="openai.com"
              />
              <SubprocessorItem
                name="Anthropic"
                purpose="AI assistant and content generation"
                location="United States"
                website="anthropic.com"
              />
            </div>
          </div>
        </div>

        {/* Data Protection */}
        <div className="backdrop-blur-sm bg-white/70 rounded-2xl p-8 shadow-lg border border-white/20 mt-8">
          <h2 className="text-2xl font-bold mb-4 bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Data Protection Measures
          </h2>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">✓</span>
              <span>All subprocessors are bound by data processing agreements (DPAs)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">✓</span>
              <span>Standard Contractual Clauses (SCCs) are in place for international transfers</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">✓</span>
              <span>Regular security audits and compliance reviews</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">✓</span>
              <span>Data encryption in transit and at rest</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">✓</span>
              <span>Access controls and monitoring</span>
            </li>
          </ul>
        </div>

        {/* Related Documents */}
        <div className="backdrop-blur-sm bg-white/70 rounded-2xl p-8 shadow-lg border border-white/20 mt-8">
          <h2 className="text-2xl font-bold mb-4 bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Related Documents
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            <Link
              href="/privacy"
              className="p-4 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all"
            >
              <h3 className="font-semibold text-blue-600 mb-1">Privacy Policy</h3>
              <p className="text-sm text-gray-600">How we handle your data</p>
            </Link>
            <Link
              href="/dpa"
              className="p-4 rounded-xl border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all"
            >
              <h3 className="font-semibold text-purple-600 mb-1">Data Processing Agreement</h3>
              <p className="text-sm text-gray-600">Our DPA terms</p>
            </Link>
            <Link
              href="/security"
              className="p-4 rounded-xl border border-gray-200 hover:border-pink-300 hover:shadow-md transition-all"
            >
              <h3 className="font-semibold text-pink-600 mb-1">Security</h3>
              <p className="text-sm text-gray-600">Our security practices</p>
            </Link>
          </div>
        </div>

        {/* Contact */}
        <div className="text-center mt-12 p-8 backdrop-blur-sm bg-linear-to-r from-blue-500/10 to-purple-500/10 rounded-2xl border border-white/20">
          <h2 className="text-2xl font-bold mb-4">Questions About Our Subprocessors?</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            If you have questions about our subprocessors or wish to object to a new subprocessor, please contact our
            Data Protection Officer.
          </p>
          <Button asChild size="lg">
            <Link href="/contact">Contact Us</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

function SubprocessorItem({
  name,
  purpose,
  location,
  website,
}: {
  name: string
  purpose: string
  location: string
  website: string
}) {
  return (
    <div className="p-4 rounded-xl bg-linear-to-r from-gray-50 to-white border border-gray-200">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900">{name}</h4>
          <p className="text-sm text-gray-600">{purpose}</p>
        </div>
        <div className="flex flex-col md:items-end gap-1">
          <div className="flex items-center gap-2 text-sm">
            <Globe className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600">{location}</span>
          </div>
          <a
            href={`https://${website}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
          >
            {website}
          </a>
        </div>
      </div>
    </div>
  )
}
