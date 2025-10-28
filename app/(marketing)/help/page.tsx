import Link from "next/link"
import {
  Search,
  BookOpen,
  Video,
  MessageCircle,
  FileText,
  Zap,
  Users,
  Settings,
  Shield,
  CreditCard,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

export default function HelpCenterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            How can we help you?
          </h1>
          <p className="text-xl text-gray-600 mb-8">Search our knowledge base or browse categories below</p>

          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="search"
              placeholder="Search for articles, guides, and tutorials..."
              className="pl-12 pr-4 py-6 text-lg backdrop-blur-sm bg-white/80 border-white/20"
            />
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-4 mb-16">
            {[
              { icon: BookOpen, label: "Documentation", count: "200+ articles" },
              { icon: Video, label: "Video Tutorials", count: "50+ videos" },
              { icon: MessageCircle, label: "Community", count: "10K+ members" },
              { icon: FileText, label: "API Reference", count: "Complete docs" },
            ].map((item, index) => (
              <Card
                key={index}
                className="p-6 backdrop-blur-sm bg-white/80 border-white/20 hover:shadow-lg transition-all cursor-pointer group"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <item.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">{item.label}</h3>
                  <p className="text-sm text-gray-600">{item.count}</p>
                </div>
              </Card>
            ))}
          </div>

          {/* Popular Categories */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Browse by Category
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: Zap,
                  title: "Getting Started",
                  description: "Learn the basics and set up your account",
                  articles: 25,
                },
                {
                  icon: Users,
                  title: "User Management",
                  description: "Manage users, roles, and permissions",
                  articles: 18,
                },
                {
                  icon: Settings,
                  title: "Configuration",
                  description: "Configure your workspace and settings",
                  articles: 32,
                },
                {
                  icon: Shield,
                  title: "Security & Privacy",
                  description: "Security features and data protection",
                  articles: 15,
                },
                {
                  icon: CreditCard,
                  title: "Billing & Plans",
                  description: "Subscriptions, invoices, and payments",
                  articles: 12,
                },
                {
                  icon: FileText,
                  title: "API & Integrations",
                  description: "Connect with third-party services",
                  articles: 28,
                },
              ].map((category, index) => (
                <Card
                  key={index}
                  className="p-6 backdrop-blur-sm bg-white/80 border-white/20 hover:shadow-lg transition-all cursor-pointer group"
                >
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <category.icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-2">{category.title}</h3>
                      <p className="text-sm text-gray-600 mb-3">{category.description}</p>
                      <p className="text-xs text-gray-500">{category.articles} articles</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Popular Articles */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Popular Articles
            </h2>
            <Card className="backdrop-blur-sm bg-white/80 border-white/20">
              <div className="divide-y divide-gray-200">
                {[
                  { title: "How to create your first project", views: "15.2K", category: "Getting Started" },
                  { title: "Setting up single sign-on (SSO)", views: "12.8K", category: "Security" },
                  { title: "Integrating with third-party tools", views: "10.5K", category: "Integrations" },
                  { title: "Managing user roles and permissions", views: "9.3K", category: "User Management" },
                  { title: "Understanding your billing cycle", views: "8.7K", category: "Billing" },
                  { title: "API authentication guide", views: "7.9K", category: "API" },
                ].map((article, index) => (
                  <Link
                    key={index}
                    href="#"
                    className="flex items-center justify-between p-4 hover:bg-gray-50/50 transition-colors group"
                  >
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 group-hover:text-purple-600 transition-colors">
                        {article.title}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">{article.category}</p>
                    </div>
                    <div className="text-sm text-gray-500 ml-4">{article.views} views</div>
                  </Link>
                ))}
              </div>
            </Card>
          </div>

          {/* Contact Support */}
          <Card className="p-8 backdrop-blur-sm bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 border-white/20 text-center">
            <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Can't find what you're looking for?
            </h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Our support team is here to help. Get in touch and we'll get back to you as soon as possible.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:opacity-90">
                Contact Support
              </Button>
              <Button size="lg" variant="outline">
                Join Community
              </Button>
            </div>
          </Card>
        </div>
      </section>
    </div>
  )
}
