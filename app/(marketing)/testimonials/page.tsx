import type { Metadata } from "next"
import { Star, Quote, Building2, Users, TrendingUp, Award } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Customer Testimonials | Nino360",
  description: "Read what our customers say about Nino360 HRMS platform",
}

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "VP of HR",
    company: "TechCorp Solutions",
    image: "/professional-woman-diverse.png",
    rating: 5,
    text: "Nino360 has transformed how we manage our workforce. The AI-powered insights have helped us reduce time-to-hire by 40% and improve employee retention significantly.",
    category: "Recruitment",
    results: ["40% faster hiring", "25% better retention", "60% time saved"],
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "CEO",
    company: "InnovateLabs",
    image: "/professional-man.jpg",
    rating: 5,
    text: "The platform is incredibly intuitive and powerful. We consolidated 5 different tools into Nino360 and our team productivity increased by 35%. Best investment we made this year.",
    category: "Platform",
    results: ["5 tools replaced", "35% productivity gain", "$50K saved annually"],
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Talent Acquisition Manager",
    company: "Global Ventures",
    image: "/hispanic-professional-woman.png",
    rating: 5,
    text: "The ATS module is exceptional. Candidate tracking, interview scheduling, and communication are seamless. Our hiring managers love the collaborative features.",
    category: "ATS",
    results: ["50% faster screening", "90% manager satisfaction", "3x more candidates"],
  },
  {
    id: 4,
    name: "David Park",
    role: "Operations Director",
    company: "Enterprise Systems",
    image: "/professional-asian-man.png",
    rating: 5,
    text: "Nino360's automation capabilities are game-changing. We automated 80% of our routine HR tasks, freeing up our team to focus on strategic initiatives.",
    category: "Automation",
    results: ["80% tasks automated", "20 hours saved weekly", "95% accuracy"],
  },
  {
    id: 5,
    name: "Jennifer Williams",
    role: "HR Director",
    company: "HealthTech Inc",
    image: "/professional-woman-diverse.png",
    rating: 5,
    text: "The compliance features give us peace of mind. Automated I-9 verification, document management, and audit trails have made compliance effortless.",
    category: "Compliance",
    results: ["100% compliant", "Zero audit issues", "70% less paperwork"],
  },
  {
    id: 6,
    name: "Robert Taylor",
    role: "CTO",
    company: "DataFlow Systems",
    image: "/professional-man.jpg",
    rating: 5,
    text: "The API integration was smooth and the developer documentation is excellent. We integrated Nino360 with our existing systems in just 2 weeks.",
    category: "Integration",
    results: ["2 week integration", "Seamless data sync", "99.9% uptime"],
  },
]

const stats = [
  { label: "Average Rating", value: "4.9/5", icon: Star },
  { label: "Happy Customers", value: "500+", icon: Users },
  { label: "Success Rate", value: "98%", icon: TrendingUp },
  { label: "Industry Awards", value: "12+", icon: Award },
]

const categories = ["All", "Recruitment", "Platform", "ATS", "Automation", "Compliance", "Integration"]

export default function TestimonialsPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-sm border border-white/20 mb-6">
            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
            <span className="text-sm font-medium">Rated 4.9/5 by 500+ customers</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            <span className="bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Customer Testimonials
            </span>
          </h1>

          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Discover how leading organizations are transforming their HR operations with Nino360
          </p>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {stats.map((stat) => (
              <div key={stat.label} className="p-6 rounded-2xl bg-white/60 backdrop-blur-sm border border-white/20">
                <stat.icon className="h-8 w-8 mx-auto mb-3 text-purple-600" />
                <div className="text-3xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Filter Categories */}
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <Button
                key={category}
                variant={category === "All" ? "default" : "outline"}
                className={category === "All" ? "bg-linear-to-r from-blue-600 to-purple-600" : ""}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="p-6 rounded-2xl bg-white/60 backdrop-blur-sm border border-white/20 hover:shadow-xl transition-all duration-300 flex flex-col"
              >
                {/* Quote Icon */}
                <Quote className="h-8 w-8 text-purple-600/20 mb-4" />

                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  ))}
                </div>

                {/* Testimonial Text */}
                <p className="text-gray-700 mb-6 flex-grow leading-relaxed">{testimonial.text}</p>

                {/* Results */}
                <div className="space-y-2 mb-6">
                  {testimonial.results.map((result, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      <div className="h-1.5 w-1.5 rounded-full bg-linear-to-r from-blue-600 to-purple-600" />
                      <span className="text-gray-600">{result}</span>
                    </div>
                  ))}
                </div>

                {/* Author Info */}
                <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
                  <img
                    src={testimonial.image || "/placeholder.svg"}
                    alt={testimonial.name}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                    <div className="text-sm text-gray-500 flex items-center gap-1">
                      <Building2 className="h-3 w-3" />
                      {testimonial.company}
                    </div>
                  </div>
                </div>

                {/* Category Badge */}
                <div className="mt-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-linear-to-r from-blue-600/10 to-purple-600/10 text-purple-700">
                    {testimonial.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Testimonials Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              <span className="bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Video Testimonials
              </span>
            </h2>
            <p className="text-gray-600">Hear directly from our customers</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {[1, 2].map((video) => (
              <div
                key={video}
                className="relative aspect-video rounded-2xl bg-white/60 backdrop-blur-sm border border-white/20 overflow-hidden group cursor-pointer"
              >
                <img
                  src={`/video-thumbnail-concept.png?height=400&width=600&query=video thumbnail ${video}`}
                  alt={`Video testimonial ${video}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/50 transition-colors">
                  <div className="h-16 w-16 rounded-full bg-white flex items-center justify-center group-hover:scale-110 transition-transform">
                    <div className="h-0 w-0 border-l-[16px] border-l-purple-600 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent ml-1" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="relative p-12 rounded-3xl bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 text-white text-center overflow-hidden">
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />

            <div className="relative z-10">
              <h2 className="text-3xl font-bold mb-4">Join 500+ Happy Customers</h2>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Start your journey with Nino360 and experience the transformation
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/demo">Schedule a Demo</Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                  asChild
                >
                  <Link href="/pricing">View Pricing</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
