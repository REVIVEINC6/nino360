import type { Metadata } from "next"
import Link from "next/link"
import { Cookie, Shield, Settings, Eye, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Cookie Policy | Nino360",
  description: "Learn about how Nino360 uses cookies and similar technologies to enhance your experience.",
}

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 mb-6">
            <Cookie className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Cookie Policy
          </h1>
          <p className="text-xl text-gray-600 mb-4">Last Updated: January 15, 2025</p>
          <p className="text-lg text-gray-700">
            This Cookie Policy explains how Nino360 uses cookies and similar technologies to recognize you when you
            visit our platform.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-200 p-8 mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">What Are Cookies?</h2>
            <p className="text-gray-700 mb-4">
              Cookies are small text files that are placed on your computer or mobile device when you visit a website.
              They are widely used to make websites work more efficiently and provide information to website owners.
            </p>
            <p className="text-gray-700">
              Cookies set by the website owner (in this case, Nino360) are called "first-party cookies." Cookies set by
              parties other than the website owner are called "third-party cookies."
            </p>
          </div>

          {/* Types of Cookies */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-200 p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Types of Cookies We Use</h2>

            <div className="space-y-6">
              {/* Essential Cookies */}
              <div className="border-l-4 border-blue-500 pl-6">
                <h3 className="text-xl font-semibold mb-2 text-gray-900">Essential Cookies</h3>
                <p className="text-gray-700 mb-3">
                  These cookies are strictly necessary for the operation of our platform. They enable core functionality
                  such as security, network management, and accessibility.
                </p>
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-sm text-gray-700">
                    <strong>Examples:</strong>
                  </p>
                  <ul className="list-disc list-inside text-sm text-gray-600 mt-2 space-y-1">
                    <li>Authentication cookies to keep you logged in</li>
                    <li>Security cookies to protect against fraud</li>
                    <li>Load balancing cookies for performance</li>
                  </ul>
                  <p className="text-sm text-gray-600 mt-3">
                    <strong>Duration:</strong> Session or up to 1 year
                  </p>
                </div>
              </div>

              {/* Performance Cookies */}
              <div className="border-l-4 border-purple-500 pl-6">
                <h3 className="text-xl font-semibold mb-2 text-gray-900">Performance Cookies</h3>
                <p className="text-gray-700 mb-3">
                  These cookies collect information about how you use our platform, such as which pages you visit most
                  often. This data helps us improve how our platform works.
                </p>
                <div className="bg-purple-50 rounded-lg p-4">
                  <p className="text-sm text-gray-700">
                    <strong>Examples:</strong>
                  </p>
                  <ul className="list-disc list-inside text-sm text-gray-600 mt-2 space-y-1">
                    <li>Google Analytics cookies for usage statistics</li>
                    <li>Performance monitoring cookies</li>
                    <li>Error tracking cookies</li>
                  </ul>
                  <p className="text-sm text-gray-600 mt-3">
                    <strong>Duration:</strong> Up to 2 years
                  </p>
                </div>
              </div>

              {/* Functional Cookies */}
              <div className="border-l-4 border-pink-500 pl-6">
                <h3 className="text-xl font-semibold mb-2 text-gray-900">Functional Cookies</h3>
                <p className="text-gray-700 mb-3">
                  These cookies allow our platform to remember choices you make and provide enhanced, personalized
                  features.
                </p>
                <div className="bg-pink-50 rounded-lg p-4">
                  <p className="text-sm text-gray-700">
                    <strong>Examples:</strong>
                  </p>
                  <ul className="list-disc list-inside text-sm text-gray-600 mt-2 space-y-1">
                    <li>Language preference cookies</li>
                    <li>Theme selection cookies (light/dark mode)</li>
                    <li>Region or location cookies</li>
                  </ul>
                  <p className="text-sm text-gray-600 mt-3">
                    <strong>Duration:</strong> Up to 1 year
                  </p>
                </div>
              </div>

              {/* Targeting Cookies */}
              <div className="border-l-4 border-orange-500 pl-6">
                <h3 className="text-xl font-semibold mb-2 text-gray-900">Targeting/Advertising Cookies</h3>
                <p className="text-gray-700 mb-3">
                  These cookies are used to deliver advertisements more relevant to you and your interests. They may
                  also be used to limit the number of times you see an advertisement.
                </p>
                <div className="bg-orange-50 rounded-lg p-4">
                  <p className="text-sm text-gray-700">
                    <strong>Examples:</strong>
                  </p>
                  <ul className="list-disc list-inside text-sm text-gray-600 mt-2 space-y-1">
                    <li>Google Ads cookies</li>
                    <li>LinkedIn advertising cookies</li>
                    <li>Retargeting cookies</li>
                  </ul>
                  <p className="text-sm text-gray-600 mt-3">
                    <strong>Duration:</strong> Up to 2 years
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Managing Cookies */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-200 p-8 mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">How to Manage Cookies</h2>
            <p className="text-gray-700 mb-6">
              You have the right to decide whether to accept or reject cookies. You can exercise your cookie preferences
              through our Cookie Consent Manager or by setting your browser preferences.
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6">
                <Settings className="w-8 h-8 text-blue-600 mb-3" />
                <h3 className="text-lg font-semibold mb-2 text-gray-900">Cookie Consent Manager</h3>
                <p className="text-sm text-gray-700 mb-4">
                  Use our Cookie Consent Manager to customize your cookie preferences at any time.
                </p>
                <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  Manage Preferences
                </Button>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6">
                <Eye className="w-8 h-8 text-purple-600 mb-3" />
                <h3 className="text-lg font-semibold mb-2 text-gray-900">Browser Settings</h3>
                <p className="text-sm text-gray-700 mb-4">
                  Most web browsers allow you to control cookies through their settings preferences.
                </p>
                <div className="space-y-2">
                  <Link
                    href="https://support.google.com/chrome/answer/95647"
                    target="_blank"
                    className="block text-sm text-blue-600 hover:underline"
                  >
                    Chrome Settings →
                  </Link>
                  <Link
                    href="https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer"
                    target="_blank"
                    className="block text-sm text-blue-600 hover:underline"
                  >
                    Firefox Settings →
                  </Link>
                  <Link
                    href="https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac"
                    target="_blank"
                    className="block text-sm text-blue-600 hover:underline"
                  >
                    Safari Settings →
                  </Link>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-gray-700">
                <strong>Note:</strong> If you choose to block or delete cookies, some features of our platform may not
                function properly, and your user experience may be affected.
              </p>
            </div>
          </div>

          {/* Third-Party Cookies */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-200 p-8 mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Third-Party Cookies</h2>
            <p className="text-gray-700 mb-4">
              In addition to our own cookies, we may also use various third-party cookies to report usage statistics,
              deliver advertisements, and provide enhanced functionality.
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900">Google Analytics</p>
                  <p className="text-sm text-gray-600">For website analytics and performance monitoring</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900">Stripe</p>
                  <p className="text-sm text-gray-600">For secure payment processing</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900">Intercom</p>
                  <p className="text-sm text-gray-600">For customer support and communication</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900">LinkedIn Insights</p>
                  <p className="text-sm text-gray-600">For advertising and analytics</p>
                </div>
              </div>
            </div>
          </div>

          {/* Updates to Policy */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-200 p-8 mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Updates to This Policy</h2>
            <p className="text-gray-700 mb-4">
              We may update this Cookie Policy from time to time to reflect changes in our practices or for other
              operational, legal, or regulatory reasons.
            </p>
            <p className="text-gray-700">
              We encourage you to review this Cookie Policy periodically to stay informed about how we use cookies. The
              "Last Updated" date at the top of this page indicates when this policy was last revised.
            </p>
          </div>

          {/* Contact Section */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl border border-gray-200 p-8">
            <div className="flex items-start gap-4">
              <Shield className="w-8 h-8 text-blue-600 flex-shrink-0" />
              <div>
                <h2 className="text-2xl font-bold mb-4 text-gray-900">Questions About Cookies?</h2>
                <p className="text-gray-700 mb-6">
                  If you have any questions about our use of cookies or this Cookie Policy, please contact our Data
                  Protection Officer:
                </p>
                <div className="space-y-2 text-gray-700">
                  <p>
                    <strong>Email:</strong> privacy@nino360.com
                  </p>
                  <p>
                    <strong>Address:</strong> 123 Business Ave, Suite 100, San Francisco, CA 94105
                  </p>
                  <p>
                    <strong>Phone:</strong> +1 (555) 123-4567
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Related Documents */}
          <div className="mt-8 bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Related Documents</h3>
            <div className="flex flex-wrap gap-3">
              <Link href="/privacy">
                <Button variant="outline" className="hover:bg-blue-50 bg-transparent">
                  Privacy Policy
                </Button>
              </Link>
              <Link href="/terms">
                <Button variant="outline" className="hover:bg-blue-50 bg-transparent">
                  Terms of Service
                </Button>
              </Link>
              <Link href="/security">
                <Button variant="outline" className="hover:bg-blue-50 bg-transparent">
                  Security
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
