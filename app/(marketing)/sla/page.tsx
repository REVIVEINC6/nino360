import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Clock, Shield, Zap, HeadphonesIcon, TrendingUp } from "lucide-react"

export const metadata: Metadata = {
  title: "Service Level Agreement (SLA) | Nino360",
  description: "Our commitment to uptime, performance, and support response times.",
}

export default function SLAPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Service Level Agreement
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Our commitment to delivering reliable, high-performance service with guaranteed uptime and support response
            times.
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <Clock className="h-4 w-4" />
            <span>Last Updated: January 15, 2025</span>
          </div>
        </div>
      </section>

      {/* Key Metrics */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-gray-200 hover:shadow-xl transition-all">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-2">99.9%</div>
              <div className="text-gray-600">Uptime Guarantee</div>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-gray-200 hover:shadow-xl transition-all">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-2">&lt;200ms</div>
              <div className="text-gray-600">Average Response Time</div>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-gray-200 hover:shadow-xl transition-all">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mb-4">
                <HeadphonesIcon className="h-6 w-6 text-white" />
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-2">24/7</div>
              <div className="text-gray-600">Support Availability</div>
            </div>
          </div>

          {/* Uptime Commitment */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-gray-200 mb-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Uptime Commitment</h2>
                <p className="text-gray-600">
                  We guarantee 99.9% uptime for our platform, measured monthly. This translates to a maximum of 43.2
                  minutes of downtime per month.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-gray-900">Scheduled Maintenance</div>
                  <div className="text-gray-600">
                    Announced at least 7 days in advance, performed during off-peak hours
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-gray-900">Emergency Maintenance</div>
                  <div className="text-gray-600">Performed only when necessary for security or critical issues</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-gray-900">Status Updates</div>
                  <div className="text-gray-600">Real-time status available at status.nino360.com</div>
                </div>
              </div>
            </div>
          </div>

          {/* Support Response Times */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-gray-200 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Support Response Times</h2>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Priority Level</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Description</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Response Time</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Resolution Time</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                        Critical
                      </span>
                    </td>
                    <td className="py-4 px-4 text-gray-600">System down or major functionality unavailable</td>
                    <td className="py-4 px-4 font-semibold text-gray-900">15 minutes</td>
                    <td className="py-4 px-4 font-semibold text-gray-900">4 hours</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
                        High
                      </span>
                    </td>
                    <td className="py-4 px-4 text-gray-600">Significant feature impaired or degraded performance</td>
                    <td className="py-4 px-4 font-semibold text-gray-900">1 hour</td>
                    <td className="py-4 px-4 font-semibold text-gray-900">8 hours</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                        Medium
                      </span>
                    </td>
                    <td className="py-4 px-4 text-gray-600">Minor feature issue with workaround available</td>
                    <td className="py-4 px-4 font-semibold text-gray-900">4 hours</td>
                    <td className="py-4 px-4 font-semibold text-gray-900">2 business days</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        Low
                      </span>
                    </td>
                    <td className="py-4 px-4 text-gray-600">General questions or feature requests</td>
                    <td className="py-4 px-4 font-semibold text-gray-900">8 hours</td>
                    <td className="py-4 px-4 font-semibold text-gray-900">5 business days</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Performance Standards */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-gray-200 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Performance Standards</h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Response Time Targets</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">API endpoints: &lt;200ms average</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">Page load time: &lt;2 seconds</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">Database queries: &lt;100ms average</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Scalability Guarantees</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">Auto-scaling for traffic spikes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">99.99% data durability</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">Multi-region redundancy</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Service Credits */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-gray-200 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Service Credits</h2>

            <p className="text-gray-600 mb-6">
              If we fail to meet our uptime commitment, you may be eligible for service credits:
            </p>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Monthly Uptime Percentage</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Service Credit</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="py-4 px-4 text-gray-600">99.0% - 99.9%</td>
                    <td className="py-4 px-4 font-semibold text-gray-900">10% of monthly fee</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-4 px-4 text-gray-600">95.0% - 98.9%</td>
                    <td className="py-4 px-4 font-semibold text-gray-900">25% of monthly fee</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4 text-gray-600">&lt; 95.0%</td>
                    <td className="py-4 px-4 font-semibold text-gray-900">50% of monthly fee</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-sm text-gray-500 mt-4">
              Service credits must be requested within 30 days of the incident and will be applied to your next billing
              cycle.
            </p>
          </div>

          {/* Exclusions */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-gray-200 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">SLA Exclusions</h2>

            <p className="text-gray-600 mb-4">This SLA does not apply to service unavailability caused by:</p>

            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-gray-400 flex-shrink-0 mt-2" />
                <span className="text-gray-600">Scheduled maintenance windows</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-gray-400 flex-shrink-0 mt-2" />
                <span className="text-gray-600">Factors outside our reasonable control (force majeure)</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-gray-400 flex-shrink-0 mt-2" />
                <span className="text-gray-600">Issues caused by customer's equipment, software, or network</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-gray-400 flex-shrink-0 mt-2" />
                <span className="text-gray-600">Misuse or unauthorized modifications of the service</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-gray-400 flex-shrink-0 mt-2" />
                <span className="text-gray-600">Third-party service failures beyond our control</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl p-12 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Questions About Our SLA?</h2>
            <p className="text-lg mb-8 text-white/90">
              Our team is here to help you understand our commitments and how they apply to your organization.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/contact">Contact Sales</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                asChild
              >
                <Link href="/support">Get Support</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Related Links */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 border-t border-gray-200">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Related Documents</h3>
          <div className="flex flex-wrap gap-4">
            <Link href="/terms" className="text-blue-600 hover:text-blue-700 hover:underline">
              Terms of Service
            </Link>
            <Link href="/privacy" className="text-blue-600 hover:text-blue-700 hover:underline">
              Privacy Policy
            </Link>
            <Link href="/security" className="text-blue-600 hover:text-blue-700 hover:underline">
              Security Overview
            </Link>
            <Link href="/support" className="text-blue-600 hover:text-blue-700 hover:underline">
              Support Center
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
