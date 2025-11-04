import { Shield, FileText, Lock, Globe, Users, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function DPAPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-sm border border-white/20 mb-6">
            <Shield className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              GDPR Compliant
            </span>
          </div>
          <h1 className="text-5xl font-bold mb-6 bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Data Processing Agreement
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Our commitment to protecting your data and ensuring GDPR compliance
          </p>
          <div className="flex gap-4 justify-center">
            <Button
              size="lg"
              className="bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <FileText className="w-4 h-4 mr-2" />
              Download DPA
            </Button>
            <Button size="lg" variant="outline">
              Contact Legal Team
            </Button>
          </div>
        </div>
      </section>

      {/* Key Points */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {[
              { icon: Shield, label: "GDPR Compliant", value: "Full compliance with EU data protection regulations" },
              { icon: Lock, label: "Data Security", value: "Enterprise-grade encryption and security measures" },
              { icon: Globe, label: "Global Coverage", value: "Compliant with international data protection laws" },
            ].map((stat, index) => (
              <div key={index} className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <stat.icon className="w-8 h-8 mb-4 bg-linear-to-r from-blue-600 to-purple-600 text-white p-1.5 rounded-lg" />
                <div className="text-sm font-medium text-gray-600 mb-1">{stat.label}</div>
                <div className="text-sm text-gray-700">{stat.value}</div>
              </div>
            ))}
          </div>

          {/* DPA Content */}
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-white/20 space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-4 bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                1. Definitions
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                This Data Processing Agreement ("DPA") forms part of the Terms of Service between Nino360 ("Processor")
                and the Customer ("Controller") for the provision of services.
              </p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                  <span>
                    <strong>Personal Data:</strong> Any information relating to an identified or identifiable natural
                    person
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                  <span>
                    <strong>Processing:</strong> Any operation performed on Personal Data
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                  <span>
                    <strong>Data Subject:</strong> The individual to whom Personal Data relates
                  </span>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4 bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                2. Scope and Purpose of Processing
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                The Processor shall process Personal Data only on documented instructions from the Controller, including
                with regard to transfers of Personal Data to a third country or an international organization.
              </p>
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                <h3 className="font-semibold text-gray-900 mb-2">Processing Activities Include:</h3>
                <ul className="space-y-1 text-gray-700 text-sm">
                  <li>• Storage and hosting of Personal Data</li>
                  <li>• Processing for HR and recruitment purposes</li>
                  <li>• Analytics and reporting</li>
                  <li>• Customer support and communication</li>
                </ul>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4 bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                3. Data Subject Rights
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                The Processor shall assist the Controller in responding to requests from Data Subjects exercising their
                rights under applicable data protection laws.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  "Right to access",
                  "Right to rectification",
                  "Right to erasure",
                  "Right to restrict processing",
                  "Right to data portability",
                  "Right to object",
                ].map((right, index) => (
                  <div key={index} className="flex items-center gap-2 text-gray-700">
                    <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                    <span>{right}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4 bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                4. Security Measures
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                The Processor shall implement appropriate technical and organizational measures to ensure a level of
                security appropriate to the risk.
              </p>
              <div className="space-y-3">
                {[
                  { title: "Encryption", desc: "AES-256 encryption for data at rest and in transit" },
                  { title: "Access Controls", desc: "Role-based access control and multi-factor authentication" },
                  { title: "Monitoring", desc: "24/7 security monitoring and incident response" },
                  { title: "Audits", desc: "Regular security audits and penetration testing" },
                ].map((measure, index) => (
                  <div key={index} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                    <Lock className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-gray-900">{measure.title}</div>
                      <div className="text-sm text-gray-600">{measure.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4 bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                5. Sub-processors
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                The Controller provides general authorization for the Processor to engage sub-processors. The Processor
                shall inform the Controller of any intended changes concerning the addition or replacement of
                sub-processors.
              </p>
              <Link href="/subprocessors" className="text-blue-600 hover:text-blue-700 font-medium">
                View Current Sub-processors →
              </Link>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4 bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                6. Data Breach Notification
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                The Processor shall notify the Controller without undue delay after becoming aware of a personal data
                breach. The notification shall include:
              </p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                  <span>Description of the nature of the breach</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                  <span>Categories and approximate number of Data Subjects affected</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                  <span>Measures taken or proposed to address the breach</span>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4 bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                7. Data Deletion
              </h2>
              <p className="text-gray-700 leading-relaxed">
                At the end of the provision of services, the Processor shall, at the choice of the Controller, delete or
                return all Personal Data to the Controller and delete existing copies unless applicable law requires
                storage of the Personal Data.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4 bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                8. Audit Rights
              </h2>
              <p className="text-gray-700 leading-relaxed">
                The Processor shall make available to the Controller all information necessary to demonstrate compliance
                with this DPA and allow for and contribute to audits, including inspections, conducted by the Controller
                or another auditor mandated by the Controller.
              </p>
            </div>

            <div className="pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                <strong>Last Updated:</strong> January 15, 2025
              </p>
              <p className="text-sm text-gray-600 mt-2">
                For questions about this DPA, please contact our legal team at{" "}
                <a href="mailto:legal@nino360.com" className="text-blue-600 hover:text-blue-700">
                  legal@nino360.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Related Documents */}
      <section className="py-16 px-4 bg-white/40 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Related Documents
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: "Privacy Policy", href: "/privacy", icon: Shield },
              { title: "Security Overview", href: "/security", icon: Lock },
              { title: "Sub-processors", href: "/subprocessors", icon: Users },
            ].map((doc, index) => (
              <Link
                key={index}
                href={doc.href}
                className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:border-purple-200 transition-all group"
              >
                <doc.icon className="w-8 h-8 mb-4 text-blue-600 group-hover:text-purple-600 transition-colors" />
                <h3 className="font-semibold text-gray-900 mb-2">{doc.title}</h3>
                <span className="text-sm text-blue-600 group-hover:text-purple-600">Learn more →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-linear-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white">
            <h2 className="text-3xl font-bold mb-4">Need a Signed DPA?</h2>
            <p className="text-lg mb-8 text-white/90">
              Contact our legal team to execute a Data Processing Agreement for your organization
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" variant="secondary">
                Contact Legal Team
              </Button>
              <Button size="lg" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                <FileText className="w-4 h-4 mr-2" />
                Download Template
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
