import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Mic, Play, Calendar, Clock, Download, Rss, Music, Users } from "lucide-react"

export default function PodcastPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-sm border border-white/20 mb-6">
            <Mic className="h-4 w-4 text-purple-600" />
            <span className="text-sm font-medium bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              The HR Tech Podcast
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Conversations on the Future of Work
          </h1>

          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Join industry leaders, HR experts, and innovators as they discuss trends, challenges, and solutions shaping
            the modern workplace.
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <Button
              size="lg"
              className="bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Play className="mr-2 h-5 w-5" />
              Listen Now
            </Button>
            <Button size="lg" variant="outline">
              <Rss className="mr-2 h-5 w-5" />
              Subscribe
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { icon: Music, label: "Episodes", value: "150+" },
              { icon: Users, label: "Listeners", value: "50K+" },
              { icon: Mic, label: "Guests", value: "200+" },
              { icon: Calendar, label: "Weekly", value: "New" },
            ].map((stat, index) => (
              <Card key={index} className="p-6 bg-white/60 backdrop-blur-sm border-white/20 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-linear-to-br from-blue-500 to-purple-500 mb-4">
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div className="text-3xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Episode */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Latest Episode
          </h2>

          <Card className="p-8 bg-white/60 backdrop-blur-sm border-white/20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="aspect-video bg-linear-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <Play className="h-20 w-20 text-white" />
              </div>

              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-sm font-medium mb-4">
                  Episode 150
                </div>

                <h3 className="text-2xl font-bold mb-4">The Future of AI in Talent Acquisition</h3>

                <p className="text-gray-600 mb-6">
                  Join us as we explore how artificial intelligence is transforming the recruitment landscape with
                  industry expert Sarah Johnson, VP of Talent at TechCorp.
                </p>

                <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-6">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>Jan 15, 2025</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>45 minutes</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button className="bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    <Play className="mr-2 h-4 w-4" />
                    Play Episode
                  </Button>
                  <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Recent Episodes */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Recent Episodes
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                episode: 149,
                title: "Building a Culture of Continuous Learning",
                guest: "Michael Chen, CLO at InnovateCo",
                date: "Jan 8, 2025",
                duration: "38 min",
                category: "Learning & Development",
              },
              {
                episode: 148,
                title: "Remote Work Best Practices for 2025",
                guest: "Emily Rodriguez, Remote Work Consultant",
                date: "Jan 1, 2025",
                duration: "42 min",
                category: "Remote Work",
              },
              {
                episode: 147,
                title: "Diversity, Equity, and Inclusion Strategies",
                guest: "David Thompson, DEI Director",
                date: "Dec 25, 2024",
                duration: "50 min",
                category: "DEI",
              },
              {
                episode: 146,
                title: "Performance Management Reimagined",
                guest: "Lisa Wang, HR Tech Innovator",
                date: "Dec 18, 2024",
                duration: "35 min",
                category: "Performance",
              },
              {
                episode: 145,
                title: "The Rise of Skills-Based Hiring",
                guest: "James Miller, Talent Strategist",
                date: "Dec 11, 2024",
                duration: "40 min",
                category: "Recruitment",
              },
              {
                episode: 144,
                title: "Employee Wellbeing in the Digital Age",
                guest: "Dr. Amanda Foster, Workplace Psychologist",
                date: "Dec 4, 2024",
                duration: "48 min",
                category: "Wellbeing",
              },
            ].map((episode, index) => (
              <Card
                key={index}
                className="p-6 bg-white/60 backdrop-blur-sm border-white/20 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium">
                    Episode {episode.episode}
                  </span>
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs">
                    {episode.category}
                  </span>
                </div>

                <h3 className="text-lg font-semibold mb-2 line-clamp-2">{episode.title}</h3>

                <p className="text-sm text-gray-600 mb-4">{episode.guest}</p>

                <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>{episode.date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{episode.duration}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="flex-1 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    <Play className="mr-1 h-3 w-3" />
                    Play
                  </Button>
                  <Button size="sm" variant="outline">
                    <Download className="h-3 w-3" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Subscribe Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Card className="p-8 bg-linear-to-br from-blue-600 via-purple-600 to-pink-600 text-white">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">Never Miss an Episode</h2>
              <p className="text-lg mb-8 text-white/90">Subscribe to get notified when new episodes are released</p>

              <div className="flex flex-wrap gap-4 justify-center">
                <Button size="lg" variant="secondary">
                  <Music className="mr-2 h-5 w-5" />
                  Apple Podcasts
                </Button>
                <Button size="lg" variant="secondary">
                  <Music className="mr-2 h-5 w-5" />
                  Spotify
                </Button>
                <Button size="lg" variant="secondary">
                  <Music className="mr-2 h-5 w-5" />
                  Google Podcasts
                </Button>
                <Button size="lg" variant="secondary">
                  <Rss className="mr-2 h-5 w-5" />
                  RSS Feed
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </div>
  )
}
