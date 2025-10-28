import type { Metadata } from "next"
import Link from "next/link"
import { FileText, Scale, Shield, AlertCircle } from "lucide-react"

export const metadata: Metadata = {
  title: "Terms of Service | Nino360",
  description: "Terms of Service and legal agreements for using the Nino360 platform.",
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-width mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-sm border border-white/20 mb-6">
            <Scale className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium text-gray-700">Legal Agreement</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Terms of Service
          </h1>

          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-4">Last updated: January 15, 2025</p>

          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Please read these terms carefully before using the Nino360 platform.
          </p>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-12 px-4">
        <div className="max-width mx-auto">
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Link
              href="#acceptance"
              className="group p-6 rounded-2xl bg-white/60 backdrop-blur-sm border border-white/20 hover:bg-white/80 transition-all"
            >
              <FileText className="w-8 h-8 text-blue-600 mb-3" />
              <h3 className="text-lg font-semibold mb-2 group-hover:text-blue-600 transition-colors">
                Acceptance of Terms
              </h3>
              <p className="text-sm text-gray-600">Agreement to use our services</p>
            </Link>

            <Link
              href="#usage"
              className="group p-6 rounded-2xl bg-white/60 backdrop-blur-sm border border-white/20 hover:bg-white/80 transition-all"
            >
              <Shield className="w-8 h-8 text-purple-600 mb-3" />
              <h3 className="text-lg font-semibold mb-2 group-hover:text-purple-600 transition-colors">
                Usage Guidelines
              </h3>
              <p className="text-sm text-gray-600">How to use the platform</p>
            </Link>

            <Link
              href="#liability"
              className="group p-6 rounded-2xl bg-white/60 backdrop-blur-sm border border-white/20 hover:bg-white/80 transition-all"
            >
              <AlertCircle className="w-8 h-8 text-pink-600 mb-3" />
              <h3 className="text-lg font-semibold mb-2 group-hover:text-pink-600 transition-colors">
                Liability & Warranties
              </h3>
              <p className="text-sm text-gray-600">Legal limitations and protections</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Terms Content */}
      <section className="py-12 px-4">
        <div className="max-width mx-auto">
          <div className="max-w-4xl mx-auto p-8 rounded-2xl bg-white/60 backdrop-blur-sm border border-white/20">
            <div className="prose prose-lg max-w-none">
              {/* 1. Acceptance of Terms */}
              <div id="acceptance" className="mb-12">
                <h2 className="text-3xl font-bold mb-4 text-gray-900">1. Acceptance of Terms</h2>
                <p className="text-gray-700 mb-4">
                  By accessing or using the Nino360 platform ("Service"), you agree to be bound by these Terms of
                  Service ("Terms"). If you disagree with any part of the terms, you may not access the Service.
                </p>
                <p className="text-gray-700">
                  These Terms apply to all visitors, users, and others who access or use the Service, including but not
                  limited to administrators, employees, contractors, and end users of organizations that subscribe to
                  our Service.
                </p>
              </div>

              {/* 2. Description of Service */}
              <div className="mb-12">
                <h2 className="text-3xl font-bold mb-4 text-gray-900">2. Description of Service</h2>
                <p className="text-gray-700 mb-4">
                  Nino360 provides a comprehensive Human Resource Management System (HRMS) and Applicant Tracking System
                  (ATS) platform that includes:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Employee management and HR operations</li>
                  <li>Recruitment and applicant tracking</li>
                  <li>Customer relationship management (CRM)</li>
                  <li>Vendor management system (VMS)</li>
                  <li>Financial management and reporting</li>
                  <li>Project and resource management</li>
                  <li>AI-powered automation and analytics</li>
                </ul>
              </div>

              {/* 3. User Accounts */}
              <div className="mb-12">
                <h2 className="text-3xl font-bold mb-4 text-gray-900">3. User Accounts</h2>
                <p className="text-gray-700 mb-4">
                  When you create an account with us, you must provide accurate, complete, and current information.
                  Failure to do so constitutes a breach of the Terms.
                </p>
                <p className="text-gray-700 mb-4">
                  You are responsible for safeguarding the password and for all activities that occur under your
                  account. You agree to:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Use a strong, unique password</li>
                  <li>Not share your account credentials with others</li>
                  <li>Notify us immediately of any unauthorized access</li>
                  <li>Accept responsibility for all activities under your account</li>
                </ul>
              </div>

              {/* 4. Acceptable Use */}
              <div id="usage" className="mb-12">
                <h2 className="text-3xl font-bold mb-4 text-gray-900">4. Acceptable Use Policy</h2>
                <p className="text-gray-700 mb-4">You agree not to use the Service to:</p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Violate any applicable laws or regulations</li>
                  <li>Infringe upon the rights of others</li>
                  <li>Transmit malicious code, viruses, or harmful software</li>
                  <li>Attempt to gain unauthorized access to our systems</li>
                  <li>Interfere with or disrupt the Service or servers</li>
                  <li>Use the Service for any illegal or unauthorized purpose</li>
                  <li>Harass, abuse, or harm other users</li>
                  <li>Collect or store personal data about other users without consent</li>
                </ul>
              </div>

              {/* 5. Intellectual Property */}
              <div className="mb-12">
                <h2 className="text-3xl font-bold mb-4 text-gray-900">5. Intellectual Property Rights</h2>
                <p className="text-gray-700 mb-4">
                  The Service and its original content, features, and functionality are owned by Nino360 and are
                  protected by international copyright, trademark, patent, trade secret, and other intellectual property
                  laws.
                </p>
                <p className="text-gray-700">
                  You retain all rights to the data you upload to the Service. By uploading content, you grant us a
                  license to use, store, and process that content solely for the purpose of providing the Service to
                  you.
                </p>
              </div>

              {/* 6. Payment Terms */}
              <div className="mb-12">
                <h2 className="text-3xl font-bold mb-4 text-gray-900">6. Payment and Billing</h2>
                <p className="text-gray-700 mb-4">
                  Certain aspects of the Service are provided on a subscription basis. You will be billed in advance on
                  a recurring and periodic basis ("Billing Cycle").
                </p>
                <p className="text-gray-700 mb-4">Payment terms include:</p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Automatic renewal unless cancelled before the renewal date</li>
                  <li>No refunds for partial months or unused services</li>
                  <li>Price changes with 30 days advance notice</li>
                  <li>Suspension of service for non-payment</li>
                </ul>
              </div>

              {/* 7. Data Privacy */}
              <div className="mb-12">
                <h2 className="text-3xl font-bold mb-4 text-gray-900">7. Data Privacy and Security</h2>
                <p className="text-gray-700 mb-4">
                  We take data privacy seriously. Our collection and use of personal information is described in our
                  <Link href="/privacy" className="text-blue-600 hover:underline">
                    {" "}
                    Privacy Policy
                  </Link>
                  .
                </p>
                <p className="text-gray-700">
                  We implement industry-standard security measures to protect your data, including encryption, access
                  controls, and regular security audits. However, no method of transmission over the Internet is 100%
                  secure.
                </p>
              </div>

              {/* 8. Termination */}
              <div className="mb-12">
                <h2 className="text-3xl font-bold mb-4 text-gray-900">8. Termination</h2>
                <p className="text-gray-700 mb-4">
                  We may terminate or suspend your account immediately, without prior notice or liability, for any
                  reason, including breach of these Terms.
                </p>
                <p className="text-gray-700">
                  Upon termination, your right to use the Service will immediately cease. You may request a copy of your
                  data within 30 days of termination, after which we may delete your data from our systems.
                </p>
              </div>

              {/* 9. Limitation of Liability */}
              <div id="liability" className="mb-12">
                <h2 className="text-3xl font-bold mb-4 text-gray-900">9. Limitation of Liability</h2>
                <p className="text-gray-700 mb-4">
                  In no event shall Nino360, its directors, employees, partners, agents, suppliers, or affiliates be
                  liable for any indirect, incidental, special, consequential, or punitive damages, including loss of
                  profits, data, use, or other intangible losses.
                </p>
                <p className="text-gray-700">
                  Our total liability shall not exceed the amount paid by you to Nino360 in the twelve (12) months
                  preceding the claim.
                </p>
              </div>

              {/* 10. Warranties */}
              <div className="mb-12">
                <h2 className="text-3xl font-bold mb-4 text-gray-900">10. Disclaimer of Warranties</h2>
                <p className="text-gray-700 mb-4">
                  The Service is provided on an "AS IS" and "AS AVAILABLE" basis. We make no warranties, expressed or
                  implied, regarding:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Uninterrupted or error-free operation</li>
                  <li>Accuracy or reliability of information</li>
                  <li>Fitness for a particular purpose</li>
                  <li>Non-infringement of third-party rights</li>
                </ul>
              </div>

              {/* 11. Indemnification */}
              <div className="mb-12">
                <h2 className="text-3xl font-bold mb-4 text-gray-900">11. Indemnification</h2>
                <p className="text-gray-700">
                  You agree to defend, indemnify, and hold harmless Nino360 from any claims, damages, obligations,
                  losses, liabilities, costs, or expenses arising from your use of the Service or violation of these
                  Terms.
                </p>
              </div>

              {/* 12. Governing Law */}
              <div className="mb-12">
                <h2 className="text-3xl font-bold mb-4 text-gray-900">12. Governing Law</h2>
                <p className="text-gray-700">
                  These Terms shall be governed by and construed in accordance with the laws of the United States,
                  without regard to its conflict of law provisions. Any disputes shall be resolved in the courts located
                  in [Jurisdiction].
                </p>
              </div>

              {/* 13. Changes to Terms */}
              <div className="mb-12">
                <h2 className="text-3xl font-bold mb-4 text-gray-900">13. Changes to Terms</h2>
                <p className="text-gray-700 mb-4">
                  We reserve the right to modify or replace these Terms at any time. We will provide notice of material
                  changes at least 30 days before the new terms take effect.
                </p>
                <p className="text-gray-700">
                  Your continued use of the Service after changes become effective constitutes acceptance of the new
                  Terms.
                </p>
              </div>

              {/* 14. Contact Information */}
              <div>
                <h2 className="text-3xl font-bold mb-4 text-gray-900">14. Contact Us</h2>
                <p className="text-gray-700 mb-4">If you have any questions about these Terms, please contact us:</p>
                <div className="p-6 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100">
                  <p className="text-gray-700 mb-2">
                    <strong>Email:</strong> legal@nino360.com
                  </p>
                  <p className="text-gray-700 mb-2">
                    <strong>Phone:</strong> +1 (555) 123-4567
                  </p>
                  <p className="text-gray-700">
                    <strong>Address:</strong> 123 Business Ave, Suite 100, San Francisco, CA 94105
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Links */}
      <section className="py-12 px-4">
        <div className="max-width mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Related Legal Documents</h2>
            <p className="text-gray-600">Review our other legal policies and agreements</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Link
              href="/privacy"
              className="group p-6 rounded-2xl bg-white/60 backdrop-blur-sm border border-white/20 hover:bg-white/80 transition-all text-center"
            >
              <Shield className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-600 transition-colors">Privacy Policy</h3>
              <p className="text-gray-600 text-sm">How we collect and use your data</p>
            </Link>

            <Link
              href="/security"
              className="group p-6 rounded-2xl bg-white/60 backdrop-blur-sm border border-white/20 hover:bg-white/80 transition-all text-center"
            >
              <Shield className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2 group-hover:text-purple-600 transition-colors">Security</h3>
              <p className="text-gray-600 text-sm">Our security practices and compliance</p>
            </Link>

            <Link
              href="/contact"
              className="group p-6 rounded-2xl bg-white/60 backdrop-blur-sm border border-white/20 hover:bg-white/80 transition-all text-center"
            >
              <FileText className="w-12 h-12 text-pink-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2 group-hover:text-pink-600 transition-colors">Contact Us</h3>
              <p className="text-gray-600 text-sm">Get in touch with our legal team</p>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
