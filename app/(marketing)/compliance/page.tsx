import type { Metadata } from "next"
import Link from "next/link"
import { Shield, CheckCircle2, FileCheck, Lock, Globe, Award, Download, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Compliance & Certifications | Nino360",
  description: "Learn about our security certifications, compliance standards, and commitment to data protection.",
}

export default function CompliancePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-sm border border-white/20 mb-6">
            <Shield className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-gray-700">Enterprise-Grade Security</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Compliance & Certifications
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            We maintain the highest standards of security, privacy, and compliance to protect your data and meet
            regulatory requirements.
          </p>
        </div>
      </section>

      {/* Certifications Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Our Certifications</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                name: "SOC 2 Type II",
                icon: Shield,
                description: "Audited security controls",
                status: "Certified",
                color: "from-blue-500 to-blue-600",
              },
              {
                name: "ISO 27001",
                icon: Award,
                description: "Information security management",
                status: "Certified",
                color: "from-purple-500 to-purple-600",
              },
              {
                name: "GDPR",
                icon: Globe,
                description: "EU data protection compliance",
                status: "Compliant",
                color: "from-pink-500 to-pink-600",
              },
              {
                name: "HIPAA",
                icon: Lock,
                description: "Healthcare data protection",
                status: "Compliant",
                color: "from-indigo-500 to-indigo-600",
              },
            ].map((cert) => (
              <div
                key={cert.name}
                className="group relative bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:shadow-xl transition-all duration-300"
              >
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${cert.color} mb-4`}>
                  <cert.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{cert.name}</h3>
                <p className="text-gray-600 text-sm mb-3">{cert.description}</p>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                  <CheckCircle2 className="h-3 w-3" />
                  {cert.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Compliance Standards */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Compliance Standards</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: "GDPR Compliance",
                description: "Full compliance with EU General Data Protection Regulation",
                features: [
                  "Right to access and data portability",
                  "Right to erasure (right to be forgotten)",
                  "Data processing agreements",
                  "Privacy by design and default",
                  "Data breach notification procedures",
                  "Appointed Data Protection Officer",
                ],
              },
              {
                title: "CCPA Compliance",
                description: "California Consumer Privacy Act compliance",
                features: [
                  "Consumer rights to know and delete",
                  "Opt-out of data sales",
                  "Non-discrimination for privacy rights",
                  "Privacy policy disclosures",
                  "Verified consumer requests",
                  "Service provider agreements",
                ],
              },
              {
                title: "HIPAA Compliance",
                description: "Healthcare data protection and privacy",
                features: [
                  "Administrative safeguards",
                  "Physical safeguards",
                  "Technical safeguards",
                  "Business Associate Agreements",
                  "Breach notification procedures",
                  "Regular risk assessments",
                ],
              },
              {
                title: "SOC 2 Type II",
                description: "Security, availability, and confidentiality controls",
                features: [
                  "Annual third-party audits",
                  "Security control monitoring",
                  "Availability guarantees",
                  "Processing integrity",
                  "Confidentiality measures",
                  "Privacy protections",
                ],
              },
            ].map((standard) => (
              <div
                key={standard.title}
                className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:shadow-xl transition-all duration-300"
              >
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{standard.title}</h3>
                <p className="text-gray-600 mb-6">{standard.description}</p>
                <ul className="space-y-3">
                  {standard.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Measures */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Security Measures</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Lock,
                title: "Data Encryption",
                description: "AES-256 encryption at rest and TLS 1.3 in transit",
              },
              {
                icon: Shield,
                title: "Access Controls",
                description: "Role-based access control and multi-factor authentication",
              },
              {
                icon: FileCheck,
                title: "Regular Audits",
                description: "Quarterly security audits and penetration testing",
              },
              {
                icon: Globe,
                title: "Network Security",
                description: "Firewall protection and DDoS mitigation",
              },
              {
                icon: Award,
                title: "Incident Response",
                description: "24/7 security monitoring and incident response team",
              },
              {
                icon: CheckCircle2,
                title: "Backup & Recovery",
                description: "Daily backups with 99.9% recovery guarantee",
              },
            ].map((measure) => (
              <div
                key={measure.title}
                className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:shadow-xl transition-all duration-300"
              >
                <div className="inline-flex p-3 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 mb-4">
                  <measure.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{measure.title}</h3>
                <p className="text-gray-600">{measure.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Documentation Downloads */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">Compliance Documentation</h2>
            <div className="space-y-4">
              {[
                { name: "SOC 2 Type II Report", size: "2.4 MB", type: "PDF" },
                { name: "ISO 27001 Certificate", size: "856 KB", type: "PDF" },
                { name: "GDPR Data Processing Agreement", size: "1.2 MB", type: "PDF" },
                { name: "HIPAA Business Associate Agreement", size: "980 KB", type: "PDF" },
                { name: "Security Whitepaper", size: "3.1 MB", type: "PDF" },
              ].map((doc) => (
                <div
                  key={doc.name}
                  className="flex items-center justify-between p-4 rounded-xl bg-white/60 backdrop-blur-sm border border-white/20 hover:shadow-md transition-all duration-300"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
                      <FileCheck className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{doc.name}</h4>
                      <p className="text-sm text-gray-600">
                        {doc.size} • {doc.type}
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              ))}
            </div>
            <p className="text-center text-sm text-gray-600 mt-6">
              Need additional documentation?{" "}
              <Link href="/contact" className="text-blue-600 hover:underline">
                Contact our compliance team
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* Related Links */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-blue-500 via-purple-600 to-pink-600 rounded-2xl p-8 text-white text-center">
            <h2 className="text-3xl font-bold mb-4">Questions About Compliance?</h2>
            <p className="text-lg mb-6 text-white/90">
              Our compliance team is here to help answer your questions and provide additional documentation.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button asChild size="lg" variant="secondary">
                <Link href="/security">
                  <Shield className="h-5 w-5 mr-2" />
                  Security Overview
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <Link href="/contact">
                  <ExternalLink className="h-5 w-5 mr-2" />
                  Contact Compliance Team
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
