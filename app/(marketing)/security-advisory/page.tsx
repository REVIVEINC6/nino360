import type { Metadata } from "next"
import Link from "next/link"
import { Shield, AlertTriangle, Lock, FileText, Mail, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Security Advisory | Nino360",
  description:
    "Security advisories, vulnerability disclosures, and responsible disclosure policy for Nino360 HRMS platform.",
}

export default function SecurityAdvisoryPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 mb-6">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Security Advisory
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Vulnerability disclosures, security updates, and responsible disclosure policy
          </p>
        </div>

        {/* Responsible Disclosure Policy */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-200 mb-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">Responsible Disclosure Policy</h2>
              <p className="text-gray-600">
                We take security seriously and appreciate the security research community's efforts to help keep our
                platform secure.
              </p>
            </div>
          </div>

          <div className="space-y-4 text-gray-700">
            <div>
              <h3 className="font-semibold text-lg mb-2">Reporting a Vulnerability</h3>
              <p className="mb-2">If you discover a security vulnerability, please report it to us by:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Emailing security@nino360.com with details of the vulnerability</li>
                <li>Including steps to reproduce the issue</li>
                <li>Providing any proof-of-concept code or screenshots</li>
                <li>Allowing us reasonable time to address the issue before public disclosure</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">What to Expect</h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Acknowledgment of your report within 24 hours</li>
                <li>Regular updates on our progress addressing the vulnerability</li>
                <li>Credit for your discovery (if desired) once the issue is resolved</li>
                <li>Potential bug bounty rewards for qualifying vulnerabilities</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Out of Scope</h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Social engineering attacks</li>
                <li>Denial of service attacks</li>
                <li>Physical attacks against Nino360 property or data centers</li>
                <li>Vulnerabilities in third-party services we use</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Recent Security Advisories */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-200 mb-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">Recent Security Advisories</h2>
              <p className="text-gray-600">Latest security updates and vulnerability disclosures</p>
            </div>
          </div>

          <div className="space-y-4">
            {[
              {
                id: "NINO-2025-001",
                title: "Authentication Token Validation Enhancement",
                severity: "Low",
                date: "2025-01-15",
                status: "Resolved",
                description: "Enhanced validation of authentication tokens to prevent edge case bypass scenarios.",
              },
              {
                id: "NINO-2024-012",
                title: "Rate Limiting Improvement",
                severity: "Medium",
                date: "2024-12-20",
                status: "Resolved",
                description: "Improved rate limiting mechanisms to better protect against brute force attacks.",
              },
              {
                id: "NINO-2024-011",
                title: "XSS Prevention in User Profiles",
                severity: "Medium",
                date: "2024-11-10",
                status: "Resolved",
                description:
                  "Fixed potential XSS vulnerability in user profile fields through enhanced input sanitization.",
              },
            ].map((advisory) => (
              <div
                key={advisory.id}
                className="p-6 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-mono text-sm font-semibold text-gray-700">{advisory.id}</span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          advisory.severity === "Low"
                            ? "bg-blue-100 text-blue-700"
                            : advisory.severity === "Medium"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                        }`}
                      >
                        {advisory.severity}
                      </span>
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                        {advisory.status}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{advisory.title}</h3>
                    <p className="text-gray-600 text-sm">{advisory.description}</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    {advisory.date}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Security Resources */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200">
            <FileText className="w-8 h-8 text-blue-600 mb-4" />
            <h3 className="text-xl font-bold mb-2">Security Documentation</h3>
            <p className="text-gray-600 mb-4">
              Comprehensive security documentation, best practices, and compliance information.
            </p>
            <Link href="/security">
              <Button variant="outline" className="w-full bg-transparent">
                View Security Docs
              </Button>
            </Link>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200">
            <Mail className="w-8 h-8 text-purple-600 mb-4" />
            <h3 className="text-xl font-bold mb-2">Contact Security Team</h3>
            <p className="text-gray-600 mb-4">
              Have questions about our security practices? Our security team is here to help.
            </p>
            <a href="mailto:security@nino360.com">
              <Button variant="outline" className="w-full bg-transparent">
                Email Security Team
              </Button>
            </a>
          </div>
        </div>

        {/* Bug Bounty Program */}
        <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Bug Bounty Program</h2>
          <p className="text-lg mb-6 text-blue-50 max-w-2xl mx-auto">
            We reward security researchers who help us identify and fix vulnerabilities. Join our bug bounty program and
            earn rewards for qualifying discoveries.
          </p>
          <Button size="lg" variant="secondary">
            Learn About Bug Bounty
          </Button>
        </div>
      </div>
    </div>
  )
}
