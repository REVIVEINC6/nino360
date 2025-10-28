import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Play, Clock, Eye, Calendar } from "lucide-react"

export default function VideosPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Video Library
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Watch tutorials, product demos, and expert insights to get the most out of Nino360
          </p>
        </div>
      </section>

      {/* Filter Categories */}
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-3 justify-center">
            {["All Videos", "Product Demos", "Tutorials", "Webinars", "Customer Stories", "Expert Talks"].map(
              (category) => (
                <Button
                  key={category}
                  variant={category === "All Videos" ? "default" : "outline"}
                  className={category === "All Videos" ? "bg-gradient-to-r from-blue-600 to-purple-600" : ""}
                >
                  {category}
                </Button>
              ),
            )}
          </div>
        </div>
      </section>

      {/* Featured Video */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Featured Video</h2>
          <Card className="overflow-hidden backdrop-blur-sm bg-white/80 border-white/20 shadow-xl">
            <div className="grid md:grid-cols-2 gap-8 p-8">
              <div className="relative aspect-video bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center group cursor-pointer">
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors rounded-lg" />
                <Play className="w-20 h-20 text-white relative z-10" />
              </div>
              <div className="flex flex-col justify-center">
                <Badge className="w-fit mb-4 bg-gradient-to-r from-blue-600 to-purple-600">Product Demo</Badge>
                <h3 className="text-2xl font-bold mb-4">Complete Platform Overview - 2024</h3>
                <p className="text-gray-600 mb-6">
                  Get a comprehensive tour of Nino360's latest features including AI-powered recruitment, automated
                  workflows, and advanced analytics capabilities.
                </p>
                <div className="flex items-center gap-6 text-sm text-gray-500 mb-6">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>45:30</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    <span>12.5K views</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>Jan 15, 2024</span>
                  </div>
                </div>
                <Button className="w-fit bg-gradient-to-r from-blue-600 to-purple-600">
                  <Play className="w-4 h-4 mr-2" />
                  Watch Now
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Video Grid */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Recent Videos</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {videos.map((video, index) => (
              <Card
                key={index}
                className="overflow-hidden backdrop-blur-sm bg-white/80 border-white/20 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="relative aspect-video bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center group cursor-pointer">
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                  <Play className="w-16 h-16 text-white relative z-10" />
                  <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                    {video.duration}
                  </div>
                </div>
                <div className="p-6">
                  <Badge className="mb-3 bg-gradient-to-r from-blue-600 to-purple-600">{video.category}</Badge>
                  <h3 className="text-lg font-semibold mb-2 line-clamp-2">{video.title}</h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{video.description}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-2">
                      <Eye className="w-3 h-3" />
                      <span>{video.views}</span>
                    </div>
                    <span>{video.date}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Card className="backdrop-blur-sm bg-gradient-to-br from-blue-600/90 to-purple-600/90 border-white/20 shadow-2xl">
            <div className="p-12 text-center text-white">
              <h2 className="text-3xl font-bold mb-4">Subscribe to Our Channel</h2>
              <p className="text-lg mb-8 text-white/90">Get notified when we publish new videos and tutorials</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary">
                  Subscribe on YouTube
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  Email Notifications
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </div>
  )
}

const videos = [
  {
    title: "Getting Started with Nino360 ATS",
    description: "Learn how to set up your applicant tracking system and post your first job in minutes.",
    duration: "12:45",
    views: "8.2K",
    date: "Jan 10, 2024",
    category: "Tutorial",
  },
  {
    title: "AI-Powered Candidate Matching",
    description: "Discover how our AI algorithms help you find the perfect candidates faster.",
    duration: "18:30",
    views: "6.5K",
    date: "Jan 8, 2024",
    category: "Product Demo",
  },
  {
    title: "Advanced Reporting & Analytics",
    description: "Master the reporting tools to gain insights into your recruitment performance.",
    duration: "25:15",
    views: "5.8K",
    date: "Jan 5, 2024",
    category: "Tutorial",
  },
  {
    title: "Customer Success Story: TechCorp",
    description: "See how TechCorp reduced their time-to-hire by 60% using Nino360.",
    duration: "15:20",
    views: "4.9K",
    date: "Jan 3, 2024",
    category: "Customer Stories",
  },
  {
    title: "Automation Workflows Deep Dive",
    description: "Learn how to automate repetitive tasks and save hours every week.",
    duration: "22:40",
    views: "7.1K",
    date: "Dec 28, 2023",
    category: "Tutorial",
  },
  {
    title: "Future of HR Technology - Expert Panel",
    description: "Industry experts discuss emerging trends in HR technology and AI.",
    duration: "45:00",
    views: "9.3K",
    date: "Dec 20, 2023",
    category: "Expert Talks",
  },
]
