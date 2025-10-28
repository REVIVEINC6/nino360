import Link from "next/link"
import { Building2, Users, Briefcase, DollarSign, Shield, BookOpen, Headphones } from "lucide-react"

export default function SitemapPage() {
  const sections = [
    {
      title: "Product",
      icon: Building2,
      links: [
        { name: "Features", href: "/features" },
        { name: "Pricing", href: "/pricing" },
        { name: "Integrations", href: "/integrations" },
        { name: "Security", href: "/security" },
        { name: "Platform Overview", href: "/platform" },
        { name: "What's New", href: "/whats-new" },
        { name: "Roadmap", href: "/roadmap" },
        { name: "Changelog", href: "/changelog" },
      ],
    },
    {
      title: "Solutions",
      icon: Briefcase,
      links: [
        { name: "Industries", href: "/industries" },
        { name: "Use Cases", href: "/use-cases" },
        { name: "Migration Services", href: "/migration" },
        { name: "Compare", href: "/compare" },
      ],
    },
    {
      title: "Resources",
      icon: BookOpen,
      links: [
        { name: "Documentation", href: "/docs" },
        { name: "Blog", href: "/blog" },
        { name: "Resources", href: "/resources" },
        { name: "Academy", href: "/academy" },
        { name: "Events & Webinars", href: "/events" },
        { name: "Community", href: "/community" },
        { name: "Developers", href: "/developers" },
        { name: "FAQ", href: "/faq" },
      ],
    },
    {
      title: "Company",
      icon: Users,
      links: [
        { name: "About Us", href: "/about" },
        { name: "Company", href: "/company" },
        { name: "Careers", href: "/careers" },
        { name: "Press & Media", href: "/press" },
        { name: "Partners", href: "/partners" },
        { name: "Customer Stories", href: "/customers" },
        { name: "Testimonials", href: "/testimonials" },
      ],
    },
    {
      title: "Support",
      icon: Headphones,
      links: [
        { name: "Help Center", href: "/support" },
        { name: "Contact Us", href: "/contact" },
        { name: "System Status", href: "/status" },
        { name: "Trust Center", href: "/trust" },
        { name: "Getting Started", href: "/getting-started" },
      ],
    },
    {
      title: "Legal",
      icon: Shield,
      links: [
        { name: "Terms of Service", href: "/terms" },
        { name: "Privacy Policy", href: "/privacy" },
        { name: "Cookie Policy", href: "/cookies" },
        { name: "SLA", href: "/sla" },
        { name: "Compliance", href: "/compliance" },
      ],
    },
    {
      title: "Programs",
      icon: DollarSign,
      links: [
        { name: "Referral Program", href: "/referral" },
        { name: "Affiliate Program", href: "/affiliate" },
        { name: "Newsletter", href: "/newsletter" },
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="border-b border-white/20 bg-white/40 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-4xl font-bold text-balance bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Sitemap
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl text-pretty">
            Navigate through all pages and resources available on Nino360 platform
          </p>
        </div>
      </div>

      {/* Sitemap Grid */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sections.map((section) => {
            const Icon = section.icon
            return (
              <div
                key={section.title}
                className="bg-white/60 backdrop-blur-xl rounded-2xl border border-white/20 p-6 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">{section.title}</h2>
                </div>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-gray-600 hover:text-purple-600 transition-colors duration-200 flex items-center gap-2 group"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-300 group-hover:bg-purple-600 transition-colors duration-200" />
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>

        {/* CTA Section */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Can't Find What You're Looking For?</h2>
          <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
            Our support team is here to help you navigate the platform
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/contact"
              className="px-8 py-3 bg-white text-purple-600 rounded-xl font-semibold hover:shadow-xl transition-all duration-300"
            >
              Contact Support
            </Link>
            <Link
              href="/faq"
              className="px-8 py-3 bg-white/10 backdrop-blur-xl text-white border border-white/20 rounded-xl font-semibold hover:bg-white/20 transition-all duration-300"
            >
              View FAQ
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
