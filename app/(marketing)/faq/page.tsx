import type { Metadata } from "next"
import Link from "next/link"
import { Search, MessageCircle, Book, CreditCard, Shield, Users, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export const metadata: Metadata = {
  title: "FAQ - Frequently Asked Questions | Nino360",
  description: "Find answers to common questions about Nino360 HRMS platform, pricing, features, security, and more.",
}

const categories = [
  { id: "general", name: "General", icon: Book },
  { id: "pricing", name: "Pricing & Billing", icon: CreditCard },
  { id: "security", name: "Security & Privacy", icon: Shield },
  { id: "features", name: "Features", icon: Zap },
  { id: "account", name: "Account & Users", icon: Users },
]

const faqs = [
  {
    category: "general",
    question: "What is Nino360?",
    answer:
      "Nino360 is a comprehensive HRMS platform that combines talent acquisition, employee management, CRM, and automation tools in one unified solution. It helps organizations streamline their HR operations, improve efficiency, and make data-driven decisions.",
  },
  {
    category: "general",
    question: "How long does it take to get started?",
    answer:
      "You can get started with Nino360 in minutes. Our guided onboarding process helps you set up your account, import data, and configure settings. Most organizations are fully operational within 1-2 weeks.",
  },
  {
    category: "general",
    question: "Do you offer training and support?",
    answer:
      "Yes! We provide comprehensive training resources including video tutorials, documentation, and live webinars. Our support team is available 24/7 via chat, email, and phone to assist you.",
  },
  {
    category: "pricing",
    question: "What pricing plans do you offer?",
    answer:
      "We offer three main plans: Starter ($29/user/month), Professional ($79/user/month), and Enterprise (custom pricing). Each plan includes different features and support levels. Visit our pricing page for detailed comparisons.",
  },
  {
    category: "pricing",
    question: "Is there a free trial?",
    answer:
      "Yes! We offer a 14-day free trial with full access to all features. No credit card required to start your trial.",
  },
  {
    category: "pricing",
    question: "Can I change my plan later?",
    answer:
      "You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we prorate any billing adjustments.",
  },
  {
    category: "pricing",
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards (Visa, Mastercard, American Express), ACH transfers, and wire transfers for annual plans. Enterprise customers can also arrange invoicing.",
  },
  {
    category: "security",
    question: "How secure is my data?",
    answer:
      "We take security seriously. All data is encrypted in transit (TLS 1.3) and at rest (AES-256). We are SOC 2 Type II certified, ISO 27001 compliant, and GDPR compliant. Regular security audits and penetration testing ensure your data stays protected.",
  },
  {
    category: "security",
    question: "Where is my data stored?",
    answer:
      "Your data is stored in secure, redundant data centers with 99.9% uptime SLA. We offer data residency options in multiple regions including US, EU, and Asia-Pacific to comply with local regulations.",
  },
  {
    category: "security",
    question: "Do you have disaster recovery?",
    answer:
      "Yes, we maintain automated daily backups with point-in-time recovery capabilities. Our disaster recovery plan ensures business continuity with RPO of 1 hour and RTO of 4 hours.",
  },
  {
    category: "features",
    question: "What integrations are available?",
    answer:
      "Nino360 integrates with 200+ popular tools including Slack, Microsoft Teams, Google Workspace, Salesforce, QuickBooks, and more. We also provide a REST API and webhooks for custom integrations.",
  },
  {
    category: "features",
    question: "Can I customize the platform?",
    answer:
      "Yes! Nino360 offers extensive customization options including custom fields, workflows, reports, and dashboards. Enterprise plans include white-labeling and advanced customization capabilities.",
  },
  {
    category: "features",
    question: "Does it work on mobile devices?",
    answer:
      "Yes, Nino360 is fully responsive and works seamlessly on all devices. We also offer native iOS and Android apps for on-the-go access.",
  },
  {
    category: "account",
    question: "How many users can I add?",
    answer:
      "There is no limit to the number of users you can add. Pricing is based on active users per month, and you can add or remove users at any time.",
  },
  {
    category: "account",
    question: "What user roles are available?",
    answer:
      "Nino360 offers flexible role-based access control with predefined roles (Admin, Manager, Employee, Recruiter) and the ability to create custom roles with granular permissions.",
  },
  {
    category: "account",
    question: "Can I import existing data?",
    answer:
      "Yes! We provide data import tools and templates for CSV, Excel, and other formats. Our team can also assist with bulk data migration from your existing systems.",
  },
]

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Find answers to common questions about Nino360. Can't find what you're looking for? Contact our support
            team.
          </p>

          {/* Search */}
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="search"
              placeholder="Search for answers..."
              className="pl-12 h-14 text-lg backdrop-blur-sm bg-white/80 border-white/20"
            />
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {categories.map((category) => {
              const Icon = category.icon
              return (
                <button
                  key={category.id}
                  className="p-6 rounded-2xl backdrop-blur-sm bg-white/80 border border-white/20 hover:bg-white/90 transition-all duration-300 hover:scale-105 group"
                >
                  <Icon className="h-8 w-8 mx-auto mb-3 text-purple-600 group-hover:text-purple-700" />
                  <p className="text-sm font-medium text-gray-900">{category.name}</p>
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* FAQ Sections */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-12">
          {categories.map((category) => {
            const categoryFaqs = faqs.filter((faq) => faq.category === category.id)
            const Icon = category.icon

            return (
              <div key={category.id} id={category.id}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">{category.name}</h2>
                </div>

                <div className="backdrop-blur-sm bg-white/80 border border-white/20 rounded-2xl p-6">
                  <Accordion type="single" collapsible className="space-y-4">
                    {categoryFaqs.map((faq, index) => (
                      <AccordionItem
                        key={index}
                        value={`${category.id}-${index}`}
                        className="border-b border-gray-200 last:border-0"
                      >
                        <AccordionTrigger className="text-left hover:no-underline py-4">
                          <span className="text-lg font-medium text-gray-900 pr-4">{faq.question}</span>
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-600 pb-4">{faq.answer}</AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Still Have Questions CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl backdrop-blur-sm bg-white/80 border border-white/20 p-12 text-center">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10" />
            <div className="relative">
              <MessageCircle className="h-16 w-16 mx-auto mb-6 text-purple-600" />
              <h2 className="text-3xl font-bold mb-4 text-gray-900">Still Have Questions?</h2>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Our support team is here to help. Get in touch and we'll respond within 24 hours.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  asChild
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <Link href="/contact">Contact Support</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/docs">View Documentation</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
