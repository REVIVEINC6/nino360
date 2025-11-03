import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Mail, TrendingUp, Lightbulb, Calendar, Users, CheckCircle2 } from "lucide-react"

export const metadata: Metadata = {
  title: "Newsletter | Nino360",
  description: "Subscribe to the Nino360 newsletter for the latest updates, insights, and best practices.",
}

export default function NewsletterPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-linear-to-br from-blue-500 to-purple-600 mb-6">
            <Mail className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-6 bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Stay Informed with Nino360
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Get the latest product updates, industry insights, and best practices delivered to your inbox every week.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { icon: Users, label: "Subscribers", value: "50K+" },
              { icon: Mail, label: "Newsletters Sent", value: "200+" },
              { icon: TrendingUp, label: "Open Rate", value: "45%" },
              { icon: Calendar, label: "Weekly Issues", value: "52/year" },
            ].map((stat, index) => (
              <Card key={index} className="p-6 backdrop-blur-sm bg-white/70 border-white/20">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Subscription Form */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <Card className="p-8 backdrop-blur-sm bg-white/70 border-white/20">
            <h2 className="text-2xl font-bold mb-6 text-center">Subscribe to Our Newsletter</h2>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                  <Input placeholder="John" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                  <Input placeholder="Doe" required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                <Input type="email" placeholder="john@company.com" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Company (Optional)</label>
                <Input placeholder="Your Company" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Newsletter Preferences</label>
                <div className="space-y-3">
                  {[
                    { id: "product", label: "Product Updates & New Features" },
                    { id: "insights", label: "Industry Insights & Trends" },
                    { id: "tips", label: "Tips & Best Practices" },
                    { id: "events", label: "Events & Webinars" },
                  ].map((pref) => (
                    <div key={pref.id} className="flex items-center space-x-2">
                      <Checkbox id={pref.id} defaultChecked />
                      <label htmlFor={pref.id} className="text-sm text-gray-700 cursor-pointer">
                        {pref.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <Checkbox id="terms" required />
                <label htmlFor="terms" className="text-sm text-gray-600 cursor-pointer">
                  I agree to receive marketing communications from Nino360. You can unsubscribe at any time.
                </label>
              </div>
              <Button className="w-full bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                Subscribe Now
              </Button>
            </form>
          </Card>
        </div>
      </section>

      {/* What You'll Get Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">What You'll Get</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: TrendingUp,
                title: "Product Updates",
                description: "Be the first to know about new features, improvements, and releases.",
                items: ["New feature announcements", "Product roadmap updates", "Beta program invitations"],
              },
              {
                icon: Lightbulb,
                title: "Industry Insights",
                description:
                  "Stay ahead with expert analysis and trends in HR, talent management, and workforce optimization.",
                items: ["Market trends & analysis", "Expert interviews", "Research reports"],
              },
              {
                icon: CheckCircle2,
                title: "Best Practices",
                description: "Learn from successful customers and get actionable tips to maximize your ROI.",
                items: ["Customer success stories", "Implementation guides", "Tips & tricks"],
              },
            ].map((benefit, index) => (
              <Card key={index} className="p-6 backdrop-blur-sm bg-white/70 border-white/20">
                <div className="w-12 h-12 rounded-xl bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-4">
                  <benefit.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{benefit.title}</h3>
                <p className="text-gray-600 mb-4">{benefit.description}</p>
                <ul className="space-y-2">
                  {benefit.items.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Issues Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Recent Issues</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                date: "January 15, 2025",
                title: "AI-Powered Recruitment: The Future is Here",
                description:
                  "Discover how AI is transforming talent acquisition and what it means for your hiring strategy.",
              },
              {
                date: "January 8, 2025",
                title: "Year in Review: 2024 Product Highlights",
                description: "A comprehensive look at all the features and improvements we shipped in 2024.",
              },
              {
                date: "January 1, 2025",
                title: "HR Trends to Watch in 2025",
                description: "Expert predictions and insights on the biggest HR trends shaping the year ahead.",
              },
            ].map((issue, index) => (
              <Card
                key={index}
                className="p-6 backdrop-blur-sm bg-white/70 border-white/20 hover:shadow-lg transition-shadow"
              >
                <div className="text-sm text-gray-500 mb-2">{issue.date}</div>
                <h3 className="text-lg font-semibold mb-2">{issue.title}</h3>
                <p className="text-gray-600 mb-4">{issue.description}</p>
                <Button variant="outline" size="sm">
                  Read More
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Card className="p-12 backdrop-blur-sm bg-linear-to-br from-blue-500/10 to-purple-500/10 border-white/20 text-center">
            <h2 className="text-3xl font-bold mb-4">Never Miss an Update</h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Join 50,000+ professionals who trust Nino360 for the latest insights and updates.
            </p>
            <Button
              size="lg"
              className="bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              Subscribe Now
            </Button>
          </Card>
        </div>
      </section>
    </div>
  )
}
