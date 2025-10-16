import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
      <header className="border-b border-white/10 glass">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
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
          <h1 className="text-4xl font-bold text-white mb-8">Privacy Policy</h1>
          <div className="prose prose-invert max-w-none">
            <p className="text-white/70 mb-6">Last updated: January 1, 2025</p>

            <h2 className="text-2xl font-bold text-white mt-8 mb-4">1. Information We Collect</h2>
            <p className="text-white/70 mb-4">
              We collect information that you provide directly to us, including name, email address, company
              information, and any other information you choose to provide.
            </p>

            <h2 className="text-2xl font-bold text-white mt-8 mb-4">2. How We Use Your Information</h2>
            <p className="text-white/70 mb-4">
              We use the information we collect to provide, maintain, and improve our services, to communicate with you,
              and to comply with legal obligations.
            </p>

            <h2 className="text-2xl font-bold text-white mt-8 mb-4">3. Information Sharing</h2>
            <p className="text-white/70 mb-4">
              We do not share your personal information with third parties except as described in this policy or with
              your consent.
            </p>

            <h2 className="text-2xl font-bold text-white mt-8 mb-4">4. Data Security</h2>
            <p className="text-white/70 mb-4">
              We implement appropriate technical and organizational measures to protect your personal information
              against unauthorized access, alteration, disclosure, or destruction.
            </p>

            <h2 className="text-2xl font-bold text-white mt-8 mb-4">5. Data Retention</h2>
            <p className="text-white/70 mb-4">
              We retain your personal information for as long as necessary to fulfill the purposes outlined in this
              policy, unless a longer retention period is required by law.
            </p>

            <h2 className="text-2xl font-bold text-white mt-8 mb-4">6. Your Rights</h2>
            <p className="text-white/70 mb-4">
              You have the right to access, correct, or delete your personal information. You may also object to or
              restrict certain processing of your data.
            </p>

            <h2 className="text-2xl font-bold text-white mt-8 mb-4">7. Cookies</h2>
            <p className="text-white/70 mb-4">
              We use cookies and similar tracking technologies to track activity on our Service and hold certain
              information.
            </p>

            <h2 className="text-2xl font-bold text-white mt-8 mb-4">8. Changes to This Policy</h2>
            <p className="text-white/70 mb-4">
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new
              Privacy Policy on this page.
            </p>

            <h2 className="text-2xl font-bold text-white mt-8 mb-4">9. Contact Us</h2>
            <p className="text-white/70 mb-4">
              If you have any questions about this Privacy Policy, please contact us at privacy@nino360.com
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
