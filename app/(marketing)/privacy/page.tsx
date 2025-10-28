import type { Metadata } from "next"
import Link from "next/link"
import { Shield, Lock, Eye, Database, Globe, FileText } from "lucide-react"

export const metadata: Metadata = {
  title: "Privacy Policy | Nino360",
  description: "Learn how Nino360 collects, uses, and protects your personal information.",
}

const sections = [
  { id: "information-collection", title: "Information We Collect" },
  { id: "how-we-use", title: "How We Use Your Information" },
  { id: "data-sharing", title: "Data Sharing and Disclosure" },
  { id: "data-security", title: "Data Security" },
  { id: "data-retention", title: "Data Retention" },
  { id: "your-rights", title: "Your Rights" },
  { id: "cookies", title: "Cookies and Tracking" },
  { id: "international", title: "International Data Transfers" },
  { id: "children", title: "Children's Privacy" },
  { id: "changes", title: "Changes to This Policy" },
  { id: "contact", title: "Contact Us" },
]

const features = [
  {
    icon: Shield,
    title: "GDPR Compliant",
    description: "Full compliance with EU data protection regulations",
  },
  {
    icon: Lock,
    title: "Data Encryption",
    description: "End-to-end encryption for all sensitive data",
  },
  {
    icon: Eye,
    title: "Transparency",
    description: "Clear information about data collection and use",
  },
  {
    icon: Database,
    title: "Data Control",
    description: "You control your data with export and deletion options",
  },
]

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-sm border border-purple-200 mb-6">
            <Shield className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-900">Last Updated: January 15, 2025</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your privacy is important to us. This policy explains how we collect, use, and protect your personal
            information.
          </p>
        </div>
      </section>

      {/* Privacy Features */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="p-6 rounded-2xl bg-white/60 backdrop-blur-sm border border-purple-200 hover:border-purple-300 transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-4 gap-8">
          {/* Table of Contents */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 p-6 rounded-2xl bg-white/60 backdrop-blur-sm border border-purple-200">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Table of Contents</h3>
              <nav className="space-y-2">
                {sections.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="block text-sm text-gray-600 hover:text-purple-600 transition-colors"
                  >
                    {section.title}
                  </a>
                ))}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Introduction */}
            <div className="p-8 rounded-2xl bg-white/60 backdrop-blur-sm border border-purple-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Introduction</h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-600 leading-relaxed">
                  Nino360 Inc. ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy
                  explains how we collect, use, disclose, and safeguard your information when you use our platform and
                  services.
                </p>
                <p className="text-gray-600 leading-relaxed mt-4">
                  By accessing or using our services, you agree to this Privacy Policy. If you do not agree with the
                  terms of this Privacy Policy, please do not access or use our services.
                </p>
              </div>
            </div>

            {/* Information We Collect */}
            <div
              id="information-collection"
              className="p-8 rounded-2xl bg-white/60 backdrop-blur-sm border border-purple-200"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Information We Collect</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Personal Information</h3>
                  <p className="text-gray-600 leading-relaxed">
                    We collect information that you provide directly to us, including:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 mt-2 space-y-1 ml-4">
                    <li>Name, email address, and contact information</li>
                    <li>Account credentials and authentication data</li>
                    <li>Profile information and preferences</li>
                    <li>Payment and billing information</li>
                    <li>Communications with our support team</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Usage Information</h3>
                  <p className="text-gray-600 leading-relaxed">
                    We automatically collect information about your use of our services:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 mt-2 space-y-1 ml-4">
                    <li>Device information (IP address, browser type, operating system)</li>
                    <li>Usage patterns and feature interactions</li>
                    <li>Log data and analytics information</li>
                    <li>Cookies and similar tracking technologies</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* How We Use Your Information */}
            <div id="how-we-use" className="p-8 rounded-2xl bg-white/60 backdrop-blur-sm border border-purple-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. How We Use Your Information</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                We use the information we collect for the following purposes:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li>Provide, maintain, and improve our services</li>
                <li>Process transactions and send related information</li>
                <li>Send administrative information and updates</li>
                <li>Respond to your comments and questions</li>
                <li>Detect, prevent, and address technical issues and security threats</li>
                <li>Analyze usage patterns to improve user experience</li>
                <li>Comply with legal obligations and enforce our terms</li>
                <li>Send marketing communications (with your consent)</li>
              </ul>
            </div>

            {/* Data Sharing */}
            <div id="data-sharing" className="p-8 rounded-2xl bg-white/60 backdrop-blur-sm border border-purple-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Data Sharing and Disclosure</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                We may share your information in the following circumstances:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li>
                  <strong>Service Providers:</strong> Third-party vendors who perform services on our behalf
                </li>
                <li>
                  <strong>Business Transfers:</strong> In connection with mergers, acquisitions, or asset sales
                </li>
                <li>
                  <strong>Legal Requirements:</strong> When required by law or to protect our rights
                </li>
                <li>
                  <strong>With Your Consent:</strong> When you explicitly authorize us to share information
                </li>
              </ul>
              <p className="text-gray-600 leading-relaxed mt-4">
                We do not sell your personal information to third parties.
              </p>
            </div>

            {/* Data Security */}
            <div id="data-security" className="p-8 rounded-2xl bg-white/60 backdrop-blur-sm border border-purple-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Data Security</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                We implement appropriate technical and organizational measures to protect your personal information:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li>End-to-end encryption for data in transit and at rest</li>
                <li>Regular security audits and penetration testing</li>
                <li>Access controls and authentication mechanisms</li>
                <li>Employee training on data protection practices</li>
                <li>Incident response and breach notification procedures</li>
              </ul>
            </div>

            {/* Data Retention */}
            <div id="data-retention" className="p-8 rounded-2xl bg-white/60 backdrop-blur-sm border border-purple-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Data Retention</h2>
              <p className="text-gray-600 leading-relaxed">
                We retain your personal information for as long as necessary to fulfill the purposes outlined in this
                Privacy Policy, unless a longer retention period is required or permitted by law. When we no longer need
                your information, we will securely delete or anonymize it.
              </p>
            </div>

            {/* Your Rights */}
            <div id="your-rights" className="p-8 rounded-2xl bg-white/60 backdrop-blur-sm border border-purple-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Your Rights</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Depending on your location, you may have the following rights:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li>
                  <strong>Access:</strong> Request access to your personal information
                </li>
                <li>
                  <strong>Correction:</strong> Request correction of inaccurate information
                </li>
                <li>
                  <strong>Deletion:</strong> Request deletion of your personal information
                </li>
                <li>
                  <strong>Portability:</strong> Request a copy of your data in a portable format
                </li>
                <li>
                  <strong>Objection:</strong> Object to processing of your personal information
                </li>
                <li>
                  <strong>Restriction:</strong> Request restriction of processing
                </li>
                <li>
                  <strong>Withdraw Consent:</strong> Withdraw consent for data processing
                </li>
              </ul>
              <p className="text-gray-600 leading-relaxed mt-4">
                To exercise these rights, please contact us at privacy@nino360.com.
              </p>
            </div>

            {/* Cookies */}
            <div id="cookies" className="p-8 rounded-2xl bg-white/60 backdrop-blur-sm border border-purple-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Cookies and Tracking Technologies</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                We use cookies and similar tracking technologies to collect and track information about your use of our
                services. You can control cookies through your browser settings.
              </p>
              <p className="text-gray-600 leading-relaxed">Types of cookies we use:</p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4 mt-2">
                <li>
                  <strong>Essential Cookies:</strong> Required for the platform to function
                </li>
                <li>
                  <strong>Analytics Cookies:</strong> Help us understand how you use our services
                </li>
                <li>
                  <strong>Preference Cookies:</strong> Remember your settings and preferences
                </li>
                <li>
                  <strong>Marketing Cookies:</strong> Used to deliver relevant advertisements
                </li>
              </ul>
            </div>

            {/* International Transfers */}
            <div id="international" className="p-8 rounded-2xl bg-white/60 backdrop-blur-sm border border-purple-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. International Data Transfers</h2>
              <p className="text-gray-600 leading-relaxed">
                Your information may be transferred to and processed in countries other than your country of residence.
                We ensure that appropriate safeguards are in place to protect your information in accordance with this
                Privacy Policy and applicable data protection laws.
              </p>
            </div>

            {/* Children's Privacy */}
            <div id="children" className="p-8 rounded-2xl bg-white/60 backdrop-blur-sm border border-purple-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Children's Privacy</h2>
              <p className="text-gray-600 leading-relaxed">
                Our services are not intended for individuals under the age of 18. We do not knowingly collect personal
                information from children. If you believe we have collected information from a child, please contact us
                immediately.
              </p>
            </div>

            {/* Changes to Policy */}
            <div id="changes" className="p-8 rounded-2xl bg-white/60 backdrop-blur-sm border border-purple-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Changes to This Privacy Policy</h2>
              <p className="text-gray-600 leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the
                new Privacy Policy on this page and updating the "Last Updated" date. You are advised to review this
                Privacy Policy periodically for any changes.
              </p>
            </div>

            {/* Contact */}
            <div id="contact" className="p-8 rounded-2xl bg-white/60 backdrop-blur-sm border border-purple-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Contact Us</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                If you have any questions about this Privacy Policy, please contact us:
              </p>
              <div className="space-y-2 text-gray-600">
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
      </section>

      {/* Related Documents */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="p-8 rounded-2xl bg-white/60 backdrop-blur-sm border border-purple-200">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Related Documents</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              <Link
                href="/terms"
                className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 transition-all group"
              >
                <FileText className="w-5 h-5 text-purple-600" />
                <span className="text-sm font-medium text-gray-900 group-hover:text-purple-600 transition-colors">
                  Terms of Service
                </span>
              </Link>
              <Link
                href="/security"
                className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 transition-all group"
              >
                <Shield className="w-5 h-5 text-purple-600" />
                <span className="text-sm font-medium text-gray-900 group-hover:text-purple-600 transition-colors">
                  Security
                </span>
              </Link>
              <Link
                href="/contact"
                className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 transition-all group"
              >
                <Globe className="w-5 h-5 text-purple-600" />
                <span className="text-sm font-medium text-gray-900 group-hover:text-purple-600 transition-colors">
                  Contact Us
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
