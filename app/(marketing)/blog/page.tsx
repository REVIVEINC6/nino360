import type { Metadata } from "next"
import { Search, Calendar, User, ArrowRight, TrendingUp, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

export const metadata: Metadata = {
  title: "Blog | Nino360",
  description: "Latest insights, updates, and best practices for HR, recruitment, and workforce management",
}

const categories = [
  "All Posts",
  "Product Updates",
  "HR Best Practices",
  "Recruitment",
  "AI & Automation",
  "Compliance",
  "Case Studies",
]

const featuredPost = {
  title: "The Future of AI in Recruitment: Trends for 2025",
  excerpt:
    "Discover how artificial intelligence is transforming the recruitment landscape and what it means for your hiring strategy.",
  author: "Sarah Johnson",
  date: "January 15, 2025",
  category: "AI & Automation",
  readTime: "8 min read",
  image: "/ai-recruitment.png",
}

const posts = [
  {
    title: "Building a Diverse Workforce: Strategies That Work",
    excerpt: "Learn proven strategies for creating and maintaining a diverse, inclusive workplace culture.",
    author: "Michael Chen",
    date: "January 12, 2025",
    category: "HR Best Practices",
    readTime: "6 min read",
  },
  {
    title: "Nino360 v2.5 Release: AI-Powered Candidate Matching",
    excerpt: "Explore the new AI features that help you find the perfect candidates faster than ever.",
    author: "Product Team",
    date: "January 10, 2025",
    category: "Product Updates",
    readTime: "5 min read",
  },
  {
    title: "GDPR Compliance in 2025: What HR Teams Need to Know",
    excerpt: "Stay compliant with the latest data protection regulations and best practices.",
    author: "Legal Team",
    date: "January 8, 2025",
    category: "Compliance",
    readTime: "10 min read",
  },
  {
    title: "Remote Hiring: Best Practices for Virtual Interviews",
    excerpt: "Master the art of remote recruitment with these proven interview techniques.",
    author: "Emily Rodriguez",
    date: "January 5, 2025",
    category: "Recruitment",
    readTime: "7 min read",
  },
  {
    title: "Case Study: How TechCorp Reduced Time-to-Hire by 40%",
    excerpt: "See how one company transformed their recruitment process with Nino360.",
    author: "Customer Success",
    date: "January 3, 2025",
    category: "Case Studies",
    readTime: "12 min read",
  },
  {
    title: "Automating HR Workflows: A Complete Guide",
    excerpt: "Discover how automation can save your HR team hours every week.",
    author: "David Park",
    date: "December 28, 2024",
    category: "AI & Automation",
    readTime: "9 min read",
  },
]

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Nino360 Blog
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Insights, updates, and best practices for modern HR and recruitment
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input
                type="search"
                placeholder="Search articles..."
                className="pl-12 h-12 bg-white/80 backdrop-blur-sm border-slate-200"
              />
            </div>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2 justify-center mb-16">
            {categories.map((category) => (
              <Button
                key={category}
                variant={category === "All Posts" ? "default" : "outline"}
                className={
                  category === "All Posts"
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                    : "bg-white/80 backdrop-blur-sm hover:bg-white"
                }
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Featured Post */}
          <div className="mb-16">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="relative h-64 md:h-auto bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                  <TrendingUp className="h-24 w-24 text-blue-600/20" />
                </div>
                <div className="p-8 flex flex-col justify-center">
                  <Badge className="w-fit mb-4 bg-gradient-to-r from-blue-600 to-indigo-600">Featured</Badge>
                  <h2 className="text-3xl font-bold mb-4 text-slate-900">{featuredPost.title}</h2>
                  <p className="text-slate-600 mb-6">{featuredPost.excerpt}</p>
                  <div className="flex items-center gap-4 text-sm text-slate-500 mb-6">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>{featuredPost.author}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{featuredPost.date}</span>
                    </div>
                    <span>{featuredPost.readTime}</span>
                  </div>
                  <Button className="w-fit bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                    Read Article
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Posts Grid */}
          <div>
            <h2 className="text-2xl font-bold mb-8 text-slate-900">Recent Posts</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post, index) => (
                <div
                  key={index}
                  className="bg-white/80 backdrop-blur-sm rounded-xl border border-slate-200 p-6 hover:shadow-xl transition-all duration-300 group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <Badge variant="outline" className="bg-gradient-to-r from-blue-50 to-indigo-50">
                      {post.category}
                    </Badge>
                    <span className="text-sm text-slate-500">{post.readTime}</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-slate-900 group-hover:text-blue-600 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-slate-600 mb-4 line-clamp-2">{post.excerpt}</p>
                  <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{post.date}</span>
                    </div>
                  </div>
                  <Button variant="ghost" className="w-full group-hover:bg-blue-50">
                    Read More
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Newsletter Signup */}
          <div className="mt-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 md:p-12 text-center text-white">
            <Zap className="h-12 w-12 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Get the latest insights, product updates, and best practices delivered to your inbox every week.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-white/20 border-white/30 text-white placeholder:text-white/60 h-12"
              />
              <Button className="bg-white text-blue-600 hover:bg-blue-50 h-12 px-8">Subscribe</Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
