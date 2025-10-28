import type { Metadata } from "next"
import Link from "next/link"
import { Shield, Lock, Eye, FileCheck, Server, Users, CheckCircle2, Download, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Trust Center - Nino360",
  description: "Security, compliance, and privacy information for Nino360 platform",
}

export default function TrustCenterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-sm border border-white/20 mb-6">
            <Shield className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-gray-700">Trust & Security</span>
          </div>
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Trust Center
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your data security and privacy are our top priorities. Learn about our commitment to keeping your
            information safe.
          </p>
        </div>

        {/* Trust Metrics */}
        <div className="grid md:grid-cols-4 gap-6 mb-16">
          {[
            { icon: Shield, label: "SOC 2 Type II", value: "Certified" },
            { icon: Lock, label: "Data Encryption", value: "AES-256" },
            { icon: Server, label: "Uptime SLA", value: "99.9%" },
            { icon: Users, label: "Trusted By", value: "500+ Companies" },
          ].map((metric, index) => (
            <Card
              key={index}
              className="p-6 bg-white/60 backdrop-blur-sm border-white/20 hover:shadow-lg transition-all"
            >
              <metric.icon className="h-8 w-8 text-blue-600 mb-4" />
              <div className="text-sm text-gray-600 mb-1">{metric.label}</div>
              <div className="text-2xl font-bold text-gray-900">{metric.value}</div>
            </Card>
          ))}
        </div>

        {/* Security Practices */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Security Practices</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                icon: Lock,
                title: "Data Encryption",
                description: "All data is encrypted at rest using AES-256 encryption and in transit using TLS 1.3.",
                features: [
                  "End-to-end encryption",
                  "Encrypted backups",
                  "Secure key management",
                  "Perfect forward secrecy",
                ],
              },
              {
                icon: Shield,
                title: "Infrastructure Security",
                description: "Enterprise-grade infrastructure with multiple layers of security controls.",
                features: [
                  "DDoS protection",
                  "Web application firewall",
                  "Intrusion detection",
                  "Regular security audits",
                ],
              },
              {
                icon: Eye,
                title: "Access Controls",
                description: "Granular access controls and authentication mechanisms to protect your data.",
                features: [
                  "Multi-factor authentication",
                  "Role-based access control",
                  "Single sign-on (SSO)",
                  "Session management",
                ],
              },
              {
                icon: FileCheck,
                title: "Compliance & Auditing",
                description: "Regular audits and compliance with industry standards and regulations.",
                features: ["SOC 2 Type II certified", "GDPR compliant", "HIPAA compliant", "ISO 27001 certified"],
              },
            ].map((practice, index) => (
              <Card
                key={index}
                className="p-8 bg-white/60 backdrop-blur-sm border-white/20 hover:shadow-lg transition-all"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
                    <practice.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{practice.title}</h3>
                    <p className="text-gray-600">{practice.description}</p>
                  </div>
                </div>
                <ul className="space-y-2 mt-4">
                  {practice.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-gray-700">
                      <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>

        {/* Certifications */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Certifications & Compliance</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { name: "SOC 2 Type II", status: "Certified", year: "2024" },
              { name: "ISO 27001", status: "Certified", year: "2024" },
              { name: "GDPR", status: "Compliant", year: "2024" },
              { name: "HIPAA", status: "Compliant", year: "2024" },
            ].map((cert, index) => (
              <Card
                key={index}
                className="p-6 bg-white/60 backdrop-blur-sm border-white/20 text-center hover:shadow-lg transition-all"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{cert.name}</h3>
                <div className="text-sm text-green-600 font-medium mb-1">{cert.status}</div>
                <div className="text-xs text-gray-500">{cert.year}</div>
              </Card>
            ))}
          </div>
        </div>

        {/* Documentation */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Documentation & Reports</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Security Whitepaper",
                description: "Detailed overview of our security architecture",
                size: "2.4 MB",
              },
              { title: "SOC 2 Report", description: "Latest SOC 2 Type II audit report", size: "1.8 MB" },
              { title: "Privacy Policy", description: "How we collect and protect your data", size: "156 KB" },
              { title: "Data Processing Agreement", description: "DPA for GDPR compliance", size: "324 KB" },
              { title: "Penetration Test Results", description: "Latest security assessment findings", size: "892 KB" },
              { title: "Compliance Matrix", description: "Detailed compliance framework mapping", size: "445 KB" },
            ].map((doc, index) => (
              <Card
                key={index}
                className="p-6 bg-white/60 backdrop-blur-sm border-white/20 hover:shadow-lg transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <FileCheck className="h-8 w-8 text-blue-600" />
                  <span className="text-xs text-gray-500">{doc.size}</span>
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{doc.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{doc.description}</p>
                <Button variant="outline" size="sm" className="w-full bg-transparent">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </Card>
            ))}
          </div>
        </div>

        {/* Status & Monitoring */}
        <Card className="p-8 bg-white/60 backdrop-blur-sm border-white/20 mb-16">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">System Status</h2>
              <p className="text-gray-600">Real-time platform health and uptime monitoring</p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-100">
              <div className="w-2 h-2 rounded-full bg-green-600 animate-pulse" />
              <span className="text-sm font-medium text-green-700">All Systems Operational</span>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <div className="text-sm text-gray-600 mb-1">Current Uptime</div>
              <div className="text-2xl font-bold text-gray-900">99.98%</div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">Response Time</div>
              <div className="text-2xl font-bold text-gray-900">142ms</div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">Last Incident</div>
              <div className="text-2xl font-bold text-gray-900">45 days ago</div>
            </div>
          </div>
          <Button className="mt-6 bg-transparent" variant="outline">
            <ExternalLink className="h-4 w-4 mr-2" />
            View Status Page
          </Button>
        </Card>

        {/* Contact Section */}
        <Card className="p-8 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Have Security Questions?</h2>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Our security team is here to answer any questions about our security practices, compliance, or data
            protection measures.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/contact">Contact Security Team</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              asChild
            >
              <Link href="/security">View Security Page</Link>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
