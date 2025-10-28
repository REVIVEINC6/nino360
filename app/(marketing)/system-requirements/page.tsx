import type { Metadata } from "next"
import Link from "next/link"
import { Monitor, Smartphone, Globe, Shield, Zap, HardDrive } from "lucide-react"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "System Requirements | Nino360",
  description: "Technical requirements and browser compatibility for Nino360 HRMS platform",
}

export default function SystemRequirementsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            System Requirements
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Ensure optimal performance with our recommended system specifications and browser compatibility
          </p>
        </div>

        {/* Browser Requirements */}
        <div className="mb-12">
          <div className="backdrop-blur-sm bg-white/70 rounded-2xl p-8 border border-white/20 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500">
                <Globe className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-3xl font-bold">Supported Browsers</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900">Desktop Browsers</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50">
                    <span className="font-medium">Google Chrome</span>
                    <span className="text-sm text-gray-600">Version 90+</span>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50">
                    <span className="font-medium">Mozilla Firefox</span>
                    <span className="text-sm text-gray-600">Version 88+</span>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50">
                    <span className="font-medium">Microsoft Edge</span>
                    <span className="text-sm text-gray-600">Version 90+</span>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50">
                    <span className="font-medium">Safari</span>
                    <span className="text-sm text-gray-600">Version 14+</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900">Mobile Browsers</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50">
                    <span className="font-medium">Chrome Mobile</span>
                    <span className="text-sm text-gray-600">Latest version</span>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50">
                    <span className="font-medium">Safari iOS</span>
                    <span className="text-sm text-gray-600">iOS 14+</span>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50">
                    <span className="font-medium">Samsung Internet</span>
                    <span className="text-sm text-gray-600">Latest version</span>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50">
                    <span className="font-medium">Firefox Mobile</span>
                    <span className="text-sm text-gray-600">Latest version</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hardware Requirements */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="backdrop-blur-sm bg-white/70 rounded-2xl p-8 border border-white/20 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500">
                <Monitor className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold">Desktop Requirements</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 mt-2" />
                <div>
                  <p className="font-semibold">Processor</p>
                  <p className="text-gray-600">Intel Core i3 or equivalent (2.0 GHz+)</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 mt-2" />
                <div>
                  <p className="font-semibold">Memory (RAM)</p>
                  <p className="text-gray-600">4 GB minimum, 8 GB recommended</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 mt-2" />
                <div>
                  <p className="font-semibold">Screen Resolution</p>
                  <p className="text-gray-600">1366 x 768 minimum, 1920 x 1080 recommended</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 mt-2" />
                <div>
                  <p className="font-semibold">Operating System</p>
                  <p className="text-gray-600">Windows 10+, macOS 10.15+, Linux (Ubuntu 20.04+)</p>
                </div>
              </div>
            </div>
          </div>

          <div className="backdrop-blur-sm bg-white/70 rounded-2xl p-8 border border-white/20 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-xl bg-gradient-to-br from-pink-500 to-purple-500">
                <Smartphone className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold">Mobile Requirements</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 mt-2" />
                <div>
                  <p className="font-semibold">iOS Devices</p>
                  <p className="text-gray-600">iPhone 8 or newer, iOS 14+</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 mt-2" />
                <div>
                  <p className="font-semibold">Android Devices</p>
                  <p className="text-gray-600">Android 9.0 (Pie) or newer</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 mt-2" />
                <div>
                  <p className="font-semibold">Memory (RAM)</p>
                  <p className="text-gray-600">3 GB minimum, 4 GB+ recommended</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 mt-2" />
                <div>
                  <p className="font-semibold">Storage</p>
                  <p className="text-gray-600">100 MB free space for cached data</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Network & Additional Requirements */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="backdrop-blur-sm bg-white/70 rounded-2xl p-8 border border-white/20 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold">Network</h3>
            </div>
            <div className="space-y-3">
              <p className="text-gray-600">
                <span className="font-semibold">Minimum:</span> 5 Mbps
              </p>
              <p className="text-gray-600">
                <span className="font-semibold">Recommended:</span> 25 Mbps+
              </p>
              <p className="text-gray-600">
                <span className="font-semibold">Latency:</span> &lt;100ms
              </p>
            </div>
          </div>

          <div className="backdrop-blur-sm bg-white/70 rounded-2xl p-8 border border-white/20 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold">Security</h3>
            </div>
            <div className="space-y-3">
              <p className="text-gray-600">TLS 1.2+ required</p>
              <p className="text-gray-600">Cookies enabled</p>
              <p className="text-gray-600">JavaScript enabled</p>
            </div>
          </div>

          <div className="backdrop-blur-sm bg-white/70 rounded-2xl p-8 border border-white/20 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-xl bg-gradient-to-br from-pink-500 to-purple-500">
                <HardDrive className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold">Storage</h3>
            </div>
            <div className="space-y-3">
              <p className="text-gray-600">Browser cache: 500 MB</p>
              <p className="text-gray-600">Local storage enabled</p>
              <p className="text-gray-600">IndexedDB supported</p>
            </div>
          </div>
        </div>

        {/* Additional Notes */}
        <div className="backdrop-blur-sm bg-white/70 rounded-2xl p-8 border border-white/20 shadow-xl mb-12">
          <h2 className="text-2xl font-bold mb-6">Additional Notes</h2>
          <div className="space-y-4 text-gray-600">
            <p>
              <span className="font-semibold text-gray-900">Browser Extensions:</span> Some browser extensions may
              interfere with Nino360 functionality. If you experience issues, try disabling extensions or using an
              incognito/private browsing window.
            </p>
            <p>
              <span className="font-semibold text-gray-900">Pop-up Blockers:</span> Please allow pop-ups from Nino360
              domains to ensure all features work correctly.
            </p>
            <p>
              <span className="font-semibold text-gray-900">Third-Party Cookies:</span> Some features require
              third-party cookies to be enabled for proper authentication and integration functionality.
            </p>
            <p>
              <span className="font-semibold text-gray-900">Firewall Configuration:</span> Ensure your firewall allows
              connections to *.nino360.com and our CDN providers.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="backdrop-blur-sm bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl p-12 text-center text-white shadow-xl">
          <h2 className="text-3xl font-bold mb-4">Need Technical Support?</h2>
          <p className="text-xl mb-8 text-white/90">
            Our technical team is here to help with any compatibility or performance issues
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/support">Contact Support</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-white/10 hover:bg-white/20 text-white border-white/30"
              asChild
            >
              <Link href="/help">Visit Help Center</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
