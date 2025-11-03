import type { Metadata } from "next"
import Link from "next/link"
import { Eye, Keyboard, Volume2, MousePointer, Palette, FileText } from "lucide-react"

export const metadata: Metadata = {
  title: "Accessibility Statement | Nino360",
  description: "Our commitment to making Nino360 accessible to everyone",
}

export default function AccessibilityPage() {
  const features = [
    {
      icon: Eye,
      title: "Screen Reader Support",
      description:
        "Full compatibility with JAWS, NVDA, VoiceOver, and other screen readers with proper ARIA labels and semantic HTML.",
    },
    {
      icon: Keyboard,
      title: "Keyboard Navigation",
      description:
        "Complete keyboard accessibility with logical tab order, skip links, and keyboard shortcuts for all interactive elements.",
    },
    {
      icon: Volume2,
      title: "Audio Alternatives",
      description:
        "Captions and transcripts for all video and audio content, ensuring information is accessible to all users.",
    },
    {
      icon: MousePointer,
      title: "Click Target Size",
      description: "All interactive elements meet minimum size requirements (44x44px) for easy clicking and tapping.",
    },
    {
      icon: Palette,
      title: "Color Contrast",
      description:
        "WCAG AA compliant color contrast ratios (4.5:1 for text) ensuring readability for users with visual impairments.",
    },
    {
      icon: FileText,
      title: "Clear Content",
      description:
        "Plain language, clear headings, and logical content structure for better comprehension and navigation.",
    },
  ]

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Accessibility Statement
          </h1>
          <p className="text-xl text-gray-600">
            Nino360 is committed to ensuring digital accessibility for people with disabilities. We continually improve
            the user experience for everyone and apply relevant accessibility standards.
          </p>
        </div>

        {/* Commitment */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-xl">
            <h2 className="text-3xl font-bold mb-6 bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Our Commitment
            </h2>
            <div className="prose prose-lg max-w-none text-gray-700">
              <p>
                Nino360 is committed to making our platform accessible to all users, including those with disabilities.
                We strive to meet or exceed the requirements of the Web Content Accessibility Guidelines (WCAG) 2.1
                Level AA.
              </p>
              <p>
                We believe that everyone should have equal access to information and functionality, regardless of their
                abilities or the technologies they use to access the web.
              </p>
            </div>
          </div>
        </div>

        {/* Accessibility Features */}
        <div className="max-w-6xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-center mb-12 bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Accessibility Features
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all"
              >
                <div className="w-12 h-12 rounded-lg bg-linear-to-br from-blue-500 to-purple-500 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Standards Compliance */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-xl">
            <h2 className="text-3xl font-bold mb-6 bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Standards & Compliance
            </h2>
            <div className="space-y-6 text-gray-700">
              <div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">WCAG 2.1 Level AA</h3>
                <p>
                  Our platform aims to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 at Level AA. These
                  guidelines explain how to make web content more accessible for people with disabilities.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">Section 508</h3>
                <p>
                  We strive to meet Section 508 standards, which require federal agencies to make their electronic and
                  information technology accessible to people with disabilities.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">ADA Compliance</h3>
                <p>
                  Nino360 is committed to compliance with the Americans with Disabilities Act (ADA) and ensuring our
                  digital properties are accessible to all users.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Assistive Technologies */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-xl">
            <h2 className="text-3xl font-bold mb-6 bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Supported Assistive Technologies
            </h2>
            <div className="grid md:grid-cols-2 gap-6 text-gray-700">
              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-900">Screen Readers</h3>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-linear-to-r from-blue-500 to-purple-500 rounded-full mr-3"></span>
                    JAWS (Windows)
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-linear-to-r from-blue-500 to-purple-500 rounded-full mr-3"></span>
                    NVDA (Windows)
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-linear-to-r from-blue-500 to-purple-500 rounded-full mr-3"></span>
                    VoiceOver (macOS, iOS)
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-linear-to-r from-blue-500 to-purple-500 rounded-full mr-3"></span>
                    TalkBack (Android)
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-900">Other Technologies</h3>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-linear-to-r from-blue-500 to-purple-500 rounded-full mr-3"></span>
                    Voice recognition software
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-linear-to-r from-blue-500 to-purple-500 rounded-full mr-3"></span>
                    Screen magnification software
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-linear-to-r from-blue-500 to-purple-500 rounded-full mr-3"></span>
                    Alternative input devices
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-linear-to-r from-blue-500 to-purple-500 rounded-full mr-3"></span>
                    Browser accessibility features
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Known Limitations */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-xl">
            <h2 className="text-3xl font-bold mb-6 bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Known Limitations
            </h2>
            <div className="prose prose-lg max-w-none text-gray-700">
              <p>
                Despite our best efforts, some areas of our platform may not yet be fully accessible. We are actively
                working to address these issues:
              </p>
              <ul className="space-y-2 mt-4">
                <li>Some third-party integrations may have limited accessibility features</li>
                <li>Certain complex data visualizations may require alternative text descriptions</li>
                <li>PDF documents uploaded by users may not be accessible unless created with accessibility in mind</li>
              </ul>
              <p className="mt-4">
                We are committed to resolving these issues and continuously improving accessibility across our platform.
              </p>
            </div>
          </div>
        </div>

        {/* Feedback */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="bg-linear-to-br from-blue-500 to-purple-600 rounded-2xl p-8 text-white shadow-xl">
            <h2 className="text-3xl font-bold mb-4">Accessibility Feedback</h2>
            <p className="text-lg mb-6 text-white/90">
              We welcome your feedback on the accessibility of Nino360. If you encounter any accessibility barriers or
              have suggestions for improvement, please contact us.
            </p>
            <div className="space-y-3 text-white/90">
              <p>
                <strong className="text-white">Email:</strong> accessibility@nino360.com
              </p>
              <p>
                <strong className="text-white">Phone:</strong> 1-800-NINO-360
              </p>
              <p>
                <strong className="text-white">Response Time:</strong> We aim to respond to accessibility feedback
                within 2 business days.
              </p>
            </div>
            <Link
              href="/contact"
              className="inline-block mt-6 px-6 py-3 bg-white text-purple-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>

        {/* Last Updated */}
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gray-600">This accessibility statement was last updated on January 15, 2025.</p>
        </div>
      </div>
    </div>
  )
}
