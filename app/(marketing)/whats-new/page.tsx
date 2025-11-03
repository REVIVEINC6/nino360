import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Zap, Shield, Brain, Rocket, Bell } from "lucide-react"

export default function WhatsNewPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <Badge className="mb-4 bg-linear-to-r from-blue-600 to-purple-600 text-white border-0">
            Latest Updates
          </Badge>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            What's New in Nino360
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Stay up to date with the latest features, improvements, and updates to the Nino360 platform
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button
              size="lg"
              className="bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Bell className="mr-2 h-5 w-5" />
              Subscribe to Updates
            </Button>
            <Button size="lg" variant="outline">
              View Full Changelog
            </Button>
          </div>
        </div>
      </section>

      {/* Latest Release */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="backdrop-blur-sm bg-white/70 rounded-2xl border border-white/20 shadow-xl p-8 mb-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <Badge className="mb-2 bg-linear-to-r from-green-600 to-emerald-600 text-white border-0">
                  Latest Release
                </Badge>
                <h2 className="text-3xl font-bold mb-2">Version 3.5.0</h2>
                <p className="text-gray-600">Released on January 15, 2025</p>
              </div>
              <Sparkles className="h-12 w-12 text-purple-600" />
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                  <Brain className="h-5 w-5 text-purple-600" />
                  AI-Powered Features
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 mt-1">•</span>
                    <span>Introduced AI Resume Parser with 95% accuracy for automatic candidate profile creation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 mt-1">•</span>
                    <span>Smart Job Matching algorithm now considers cultural fit and soft skills</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 mt-1">•</span>
                    <span>AI-powered interview question generator based on job requirements</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                  <Zap className="h-5 w-5 text-blue-600" />
                  Performance Improvements
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>Dashboard load time reduced by 40% with optimized queries</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>Bulk operations now process 10x faster with parallel processing</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>Real-time notifications with WebSocket support for instant updates</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-600" />
                  Security Enhancements
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">•</span>
                    <span>Enhanced multi-factor authentication with biometric support</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">•</span>
                    <span>Advanced audit logging with blockchain verification</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">•</span>
                    <span>Automated security scanning and vulnerability detection</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Updates */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Recent Updates</h2>

          <div className="space-y-6">
            {[
              {
                version: "3.4.2",
                date: "January 8, 2025",
                type: "Bug Fixes",
                badge: "bg-yellow-600",
                items: [
                  "Fixed issue with email notifications not being sent for interview reminders",
                  "Resolved calendar sync issues with Google Calendar",
                  "Fixed pagination bug in candidate search results",
                  "Corrected timezone display issues in global teams view",
                ],
              },
              {
                version: "3.4.0",
                date: "December 20, 2024",
                type: "New Features",
                badge: "bg-blue-600",
                items: [
                  "Added bulk candidate import from LinkedIn",
                  "Introduced customizable email templates for all communications",
                  "New analytics dashboard with predictive hiring metrics",
                  "Mobile app improvements with offline mode support",
                ],
              },
              {
                version: "3.3.5",
                date: "December 10, 2024",
                type: "Improvements",
                badge: "bg-purple-600",
                items: [
                  "Enhanced search functionality with fuzzy matching",
                  "Improved UI/UX for mobile devices",
                  "Better integration with Slack and Microsoft Teams",
                  "Optimized database queries for faster report generation",
                ],
              },
            ].map((update, index) => (
              <div key={index} className="backdrop-blur-sm bg-white/70 rounded-xl border border-white/20 shadow-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <Badge className={`mb-2 ${update.badge} text-white border-0`}>{update.type}</Badge>
                    <h3 className="text-xl font-bold">Version {update.version}</h3>
                    <p className="text-gray-600 text-sm">{update.date}</p>
                  </div>
                </div>
                <ul className="space-y-2 text-gray-700">
                  {update.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-purple-600 mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Coming Soon */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-linear-to-r from-orange-600 to-red-600 text-white border-0">Coming Soon</Badge>
            <h2 className="text-3xl font-bold mb-4">What's Next</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Here's a sneak peek at what we're working on for upcoming releases
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Brain,
                title: "AI Interview Assistant",
                description:
                  "Real-time AI assistance during video interviews with suggested questions and candidate insights",
                quarter: "Q1 2025",
              },
              {
                icon: Rocket,
                title: "Advanced Automation",
                description: "No-code workflow builder for custom recruitment and HR processes",
                quarter: "Q1 2025",
              },
              {
                icon: Zap,
                title: "Skills Assessment Platform",
                description: "Built-in coding challenges and skills tests with automated evaluation",
                quarter: "Q2 2025",
              },
              {
                icon: Shield,
                title: "Blockchain Verification",
                description: "Verify candidate credentials and employment history on blockchain",
                quarter: "Q2 2025",
              },
              {
                icon: Sparkles,
                title: "Predictive Analytics",
                description: "AI-powered predictions for candidate success and retention rates",
                quarter: "Q2 2025",
              },
              {
                icon: Bell,
                title: "Mobile App Redesign",
                description: "Complete mobile experience overhaul with native performance",
                quarter: "Q3 2025",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="backdrop-blur-sm bg-white/70 rounded-xl border border-white/20 shadow-lg p-6 hover:shadow-xl transition-shadow"
              >
                <div className="w-12 h-12 rounded-lg bg-linear-to-br from-blue-600 to-purple-600 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <Badge className="mb-2 bg-orange-100 text-orange-700 border-0">{feature.quarter}</Badge>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="backdrop-blur-sm bg-linear-to-r from-blue-600 to-purple-600 rounded-2xl p-8 sm:p-12 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
            <p className="text-lg mb-8 text-blue-100">
              Subscribe to our newsletter to get notified about new features and updates
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="bg-white text-purple-600 hover:bg-gray-100">
                <Bell className="mr-2 h-5 w-5" />
                Subscribe to Updates
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 bg-transparent">
                View Full Changelog
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
