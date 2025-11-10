import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-purple-900 via-purple-800 to-indigo-900">
      <header className="border-b border-white/10 glass">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="text-2xl font-bold bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
          >
            NINO360
          </Link>
          <Link href="/">
            <Button variant="ghost" className="text-white hover:bg-white/10">
              Back to Home
            </Button>
          </Link>
        </div>
      </header>

      <div className="container max-w-4xl mx-auto px-4 py-16">
        <div className="glass-panel border-white/10 p-8 rounded-lg">
          <h1 className="text-4xl font-bold text-white mb-8">Terms of Service</h1>
          <div className="prose prose-invert max-w-none">
            <p className="text-white/70 mb-6">Last updated: January 1, 2025</p>

            <h2 className="text-2xl font-bold text-white mt-8 mb-4">1. Acceptance of Terms</h2>
            <p className="text-white/70 mb-4">
              By accessing and using Nino360 ("Service"), you accept and agree to be bound by the terms and provision of
              this agreement.
            </p>

            <h2 className="text-2xl font-bold text-white mt-8 mb-4">2. Use License</h2>
            <p className="text-white/70 mb-4">
              Permission is granted to temporarily access the Service for personal, non-commercial transitory viewing
              only. This is the grant of a license, not a transfer of title.
            </p>

            <h2 className="text-2xl font-bold text-white mt-8 mb-4">3. User Accounts</h2>
            <p className="text-white/70 mb-4">
              You are responsible for maintaining the confidentiality of your account and password. You agree to accept
              responsibility for all activities that occur under your account.
            </p>

            <h2 className="text-2xl font-bold text-white mt-8 mb-4">4. Data Privacy</h2>
            <p className="text-white/70 mb-4">
              Your use of the Service is also governed by our Privacy Policy. Please review our Privacy Policy, which
              also governs the Service and informs users of our data collection practices.
            </p>

            <h2 className="text-2xl font-bold text-white mt-8 mb-4">5. Intellectual Property</h2>
            <p className="text-white/70 mb-4">
              The Service and its original content, features, and functionality are owned by Nino360 and are protected
              by international copyright, trademark, patent, trade secret, and other intellectual property laws.
            </p>

            <h2 className="text-2xl font-bold text-white mt-8 mb-4">6. Termination</h2>
            <p className="text-white/70 mb-4">
              We may terminate or suspend your account and bar access to the Service immediately, without prior notice
              or liability, under our sole discretion, for any reason whatsoever.
            </p>

            <h2 className="text-2xl font-bold text-white mt-8 mb-4">7. Limitation of Liability</h2>
            <p className="text-white/70 mb-4">
              In no event shall Nino360, nor its directors, employees, partners, agents, suppliers, or affiliates, be
              liable for any indirect, incidental, special, consequential or punitive damages.
            </p>

            <h2 className="text-2xl font-bold text-white mt-8 mb-4">8. Contact Us</h2>
            <p className="text-white/70 mb-4">
              If you have any questions about these Terms, please contact us at legal@nino360.com
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
