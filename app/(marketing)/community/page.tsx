import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Users, MessageSquare, Calendar, Award, TrendingUp, Heart } from "lucide-react"

export const metadata: Metadata = {
  title: "Community | Nino360",
  description: "Join the Nino360 community of HR professionals, recruiters, and business leaders.",
}

export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Join Our Community
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Connect with thousands of HR professionals, recruiters, and business leaders who are transforming their
            organizations with Nino360.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              Join Community
            </Button>
            <Button size="lg" variant="outline">
              Browse Discussions
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Users, label: "Members", value: "10,000+" },
              { icon: MessageSquare, label: "Discussions", value: "5,000+" },
              { icon: Calendar, label: "Events", value: "100+" },
              { icon: Award, label: "Contributors", value: "500+" },
            ].map((stat, index) => (
              <div
                key={index}
                className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg text-center"
              >
                <stat.icon className="w-8 h-8 mx-auto mb-3 text-purple-600" />
                <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Community Channels */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Community Channels
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Discussion Forum",
                description: "Ask questions, share insights, and learn from other Nino360 users.",
                icon: MessageSquare,
                members: "8,500+",
                posts: "4,200+",
                link: "/community/forum",
              },
              {
                title: "Slack Community",
                description: "Real-time chat with fellow users and Nino360 experts.",
                icon: MessageSquare,
                members: "3,200+",
                posts: "Active",
                link: "https://slack.nino360.com",
              },
              {
                title: "User Groups",
                description: "Join local or industry-specific user groups for networking.",
                icon: Users,
                members: "50+ Groups",
                posts: "2,500+",
                link: "/community/groups",
              },
              {
                title: "Events & Webinars",
                description: "Attend virtual and in-person events to learn and network.",
                icon: Calendar,
                members: "100+ Events",
                posts: "Monthly",
                link: "/events",
              },
              {
                title: "Champions Program",
                description: "Become a Nino360 champion and help others succeed.",
                icon: Award,
                members: "200+ Champions",
                posts: "Elite",
                link: "/community/champions",
              },
              {
                title: "Feature Requests",
                description: "Vote on and suggest new features for the platform.",
                icon: TrendingUp,
                members: "1,500+ Ideas",
                posts: "Active",
                link: "/community/feature-requests",
              },
            ].map((channel, index) => (
              <div
                key={index}
                className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <channel.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{channel.title}</h3>
                <p className="text-gray-600 mb-4">{channel.description}</p>
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>{channel.members} members</span>
                  <span>{channel.posts} posts</span>
                </div>
                <Link href={channel.link}>
                  <Button variant="outline" className="w-full bg-transparent">
                    Join Channel
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Discussions */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Recent Discussions
          </h2>
          <div className="space-y-4">
            {[
              {
                title: "Best practices for onboarding remote employees",
                author: "Sarah Johnson",
                replies: 24,
                views: 342,
                category: "HRMS",
                time: "2 hours ago",
              },
              {
                title: "How to optimize candidate sourcing with AI",
                author: "Michael Chen",
                replies: 18,
                views: 256,
                category: "ATS",
                time: "5 hours ago",
              },
              {
                title: "Integration tips for Slack and Nino360",
                author: "Emily Rodriguez",
                replies: 31,
                views: 489,
                category: "Integrations",
                time: "1 day ago",
              },
              {
                title: "Managing compliance across multiple states",
                author: "David Park",
                replies: 15,
                views: 198,
                category: "Compliance",
                time: "1 day ago",
              },
            ].map((discussion, index) => (
              <div
                key={index}
                className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                        {discussion.category}
                      </span>
                      <span className="text-sm text-gray-500">{discussion.time}</span>
                    </div>
                    <h3 className="text-lg font-semibold mb-2 hover:text-purple-600 cursor-pointer">
                      {discussion.title}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>by {discussion.author}</span>
                      <span>•</span>
                      <span>{discussion.replies} replies</span>
                      <span>•</span>
                      <span>{discussion.views} views</span>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    View
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Button variant="outline" size="lg">
              View All Discussions
            </Button>
          </div>
        </div>
      </section>

      {/* Community Guidelines */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <Heart className="w-8 h-8 text-pink-600" />
              <h2 className="text-2xl font-bold">Community Guidelines</h2>
            </div>
            <div className="space-y-4 text-gray-600">
              <p>
                <strong>Be Respectful:</strong> Treat all community members with respect and kindness.
              </p>
              <p>
                <strong>Stay On Topic:</strong> Keep discussions relevant to Nino360 and HR/recruitment topics.
              </p>
              <p>
                <strong>Share Knowledge:</strong> Help others by sharing your experiences and insights.
              </p>
              <p>
                <strong>No Spam:</strong> Avoid promotional content and spam. Focus on adding value.
              </p>
              <p>
                <strong>Protect Privacy:</strong> Don't share confidential or personal information.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Join?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Become part of a thriving community of HR professionals and business leaders.
          </p>
          <Button
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            Create Your Account
          </Button>
        </div>
      </section>
    </div>
  )
}
