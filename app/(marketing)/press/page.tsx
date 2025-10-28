import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Newspaper, Download, ExternalLink, Award, TrendingUp, Users, Calendar } from "lucide-react"

export const metadata: Metadata = {
  title: "Press & Media | Nino360",
  description: "Latest news, press releases, and media resources from Nino360",
}

const pressReleases = [
  {
    title: "Nino360 Raises $50M Series B to Revolutionize HR Technology",
    date: "March 15, 2024",
    category: "Funding",
    excerpt:
      "Leading HR platform secures major funding round to accelerate AI-powered workforce management innovation.",
    link: "#",
  },
  {
    title: "Nino360 Named Leader in Gartner Magic Quadrant for HCM",
    date: "February 28, 2024",
    category: "Recognition",
    excerpt: "Platform recognized for completeness of vision and ability to execute in human capital management.",
    link: "#",
  },
  {
    title: "Nino360 Launches AI-Powered Talent Intelligence Suite",
    date: "January 20, 2024",
    category: "Product",
    excerpt: "New suite leverages machine learning to transform talent acquisition and workforce planning.",
    link: "#",
  },
  {
    title: "Nino360 Expands to European Market with GDPR Compliance",
    date: "December 10, 2023",
    category: "Expansion",
    excerpt: "Platform now available across EU with full data protection and privacy compliance.",
    link: "#",
  },
]

const mediaKit = [
  { name: "Company Logo Pack", size: "2.4 MB", format: "ZIP", type: "Logos" },
  { name: "Product Screenshots", size: "15.8 MB", format: "ZIP", type: "Images" },
  { name: "Executive Headshots", size: "8.2 MB", format: "ZIP", type: "Photos" },
  { name: "Brand Guidelines", size: "1.2 MB", format: "PDF", type: "Document" },
  { name: "Fact Sheet", size: "450 KB", format: "PDF", type: "Document" },
  { name: "Press Release Template", size: "120 KB", format: "DOCX", type: "Template" },
]

const awards = [
  { title: "Best HR Technology Platform 2024", organization: "HR Tech Awards", year: "2024" },
  { title: "Top 50 SaaS Companies", organization: "SaaS Magazine", year: "2024" },
  { title: "Innovation in AI Award", organization: "Tech Innovation Summit", year: "2023" },
  { title: "Customer Choice Award", organization: "G2 Crowd", year: "2023" },
]

const stats = [
  { icon: Users, label: "Customers", value: "500+" },
  { icon: TrendingUp, label: "YoY Growth", value: "300%" },
  { icon: Award, label: "Industry Awards", value: "15+" },
  { icon: Calendar, label: "Founded", value: "2020" },
]

export default function PressPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-sm border border-white/20 mb-6">
              <Newspaper className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">Press & Media Center</span>
            </div>
            <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Nino360 in the News
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Latest announcements, press releases, and media resources for journalists and partners
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {stats.map((stat, index) => (
              <Card
                key={index}
                className="p-6 bg-white/60 backdrop-blur-sm border-white/20 hover:bg-white/80 transition-all"
              >
                <stat.icon className="h-8 w-8 text-blue-600 mb-3" />
                <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Press Releases */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Latest Press Releases</h2>
            <Button variant="outline" className="gap-2 bg-transparent">
              <ExternalLink className="h-4 w-4" />
              View All
            </Button>
          </div>

          <div className="grid gap-6">
            {pressReleases.map((release, index) => (
              <Card
                key={index}
                className="p-6 bg-white/60 backdrop-blur-sm border-white/20 hover:bg-white/80 transition-all group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <Badge
                        variant="secondary"
                        className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0"
                      >
                        {release.category}
                      </Badge>
                      <span className="text-sm text-gray-500">{release.date}</span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {release.title}
                    </h3>
                    <p className="text-gray-600 mb-4">{release.excerpt}</p>
                    <Link
                      href={release.link}
                      className="text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-2"
                    >
                      Read Full Release
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  </div>
                  <Button variant="ghost" size="icon" className="shrink-0">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Awards & Recognition */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Awards & Recognition</h2>
            <p className="text-lg text-gray-600">Industry recognition for innovation and excellence</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {awards.map((award, index) => (
              <Card
                key={index}
                className="p-6 bg-white/60 backdrop-blur-sm border-white/20 hover:bg-white/80 transition-all text-center"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center mx-auto mb-4">
                  <Award className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{award.title}</h3>
                <p className="text-sm text-gray-600 mb-1">{award.organization}</p>
                <p className="text-xs text-gray-500">{award.year}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Media Kit */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Media Kit</h2>
            <p className="text-lg text-gray-600">Download logos, images, and brand assets</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mediaKit.map((item, index) => (
              <Card
                key={index}
                className="p-6 bg-white/60 backdrop-blur-sm border-white/20 hover:bg-white/80 transition-all group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <Badge variant="outline" className="mb-3">
                      {item.type}
                    </Badge>
                    <h3 className="font-semibold text-gray-900 mb-2">{item.name}</h3>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <span>{item.size}</span>
                      <span>•</span>
                      <span>{item.format}</span>
                    </div>
                  </div>
                </div>
                <Button className="w-full gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  <Download className="h-4 w-4" />
                  Download
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Media Inquiries</h2>
          <p className="text-xl text-white/90 mb-8">
            For press inquiries, interviews, or additional information, please contact our media relations team
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="gap-2">
              <ExternalLink className="h-5 w-5" />
              press@nino360.com
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="gap-2 bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              Download Media Kit
              <Download className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
