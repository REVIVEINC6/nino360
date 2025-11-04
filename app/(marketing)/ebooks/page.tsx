import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { BookOpen, Download, Clock, FileText, TrendingUp, Users, Target, Zap } from "lucide-react"
import Link from "next/link"

export default function EBooksPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-sm border border-white/20 mb-6">
            <BookOpen className="h-4 w-4 text-purple-600" />
            <span className="text-sm font-medium text-gray-700">Free eBooks & Guides</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            <span className="bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Expert Guides
            </span>
            <br />
            for HR & Talent Leaders
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Download our comprehensive eBooks and guides to stay ahead in HR, recruitment, and workforce management.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { label: "eBooks Available", value: "30+" },
              { label: "Total Downloads", value: "150K+" },
              { label: "Average Rating", value: "4.8/5" },
              { label: "Topics Covered", value: "15+" },
            ].map((stat) => (
              <Card key={stat.label} className="p-6 bg-white/60 backdrop-blur-sm border-white/20">
                <div className="text-3xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-3 justify-center mb-12">
            {["All", "Recruitment", "HR Management", "Compliance", "Leadership", "Technology"].map((category) => (
              <Button
                key={category}
                variant={category === "All" ? "default" : "outline"}
                className={category === "All" ? "bg-linear-to-r from-blue-600 to-purple-600" : ""}
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Featured eBook */}
          <Card className="p-8 bg-white/60 backdrop-blur-sm border-white/20 mb-12">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="aspect-[3/4] bg-linear-to-br from-blue-600 via-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                <BookOpen className="h-32 w-32 text-white" />
              </div>
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-linear-to-r from-blue-600 to-purple-600 text-white text-sm mb-4">
                  Featured
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  The Complete Guide to Modern Talent Acquisition
                </h2>
                <p className="text-gray-600 mb-6">
                  A comprehensive 120-page guide covering everything from sourcing strategies to candidate experience
                  optimization. Learn how leading companies are transforming their hiring processes with AI and
                  automation.
                </p>
                <div className="flex flex-wrap gap-4 mb-6">
                  <div className="flex items-center gap-2 text-gray-600">
                    <FileText className="h-4 w-4" />
                    <span className="text-sm">120 pages</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">3 hour read</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Download className="h-4 w-4" />
                    <span className="text-sm">25K+ downloads</span>
                  </div>
                </div>
                <Button size="lg" className="bg-linear-to-r from-blue-600 to-purple-600">
                  <Download className="h-4 w-4 mr-2" />
                  Download Free eBook
                </Button>
              </div>
            </div>
          </Card>

          {/* eBooks Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "HR Analytics & Metrics That Matter",
                description: "Learn how to measure and improve HR performance with data-driven insights.",
                pages: 85,
                readTime: "2 hours",
                downloads: "18K+",
                category: "HR Management",
                icon: TrendingUp,
              },
              {
                title: "Building a Remote-First Culture",
                description: "Best practices for managing distributed teams and maintaining company culture.",
                pages: 95,
                readTime: "2.5 hours",
                downloads: "22K+",
                category: "Leadership",
                icon: Users,
              },
              {
                title: "Compliance Handbook 2025",
                description: "Stay compliant with the latest employment laws and regulations.",
                pages: 110,
                readTime: "3 hours",
                downloads: "15K+",
                category: "Compliance",
                icon: FileText,
              },
              {
                title: "AI in Recruitment: A Practical Guide",
                description: "Leverage AI and automation to streamline your hiring process.",
                pages: 75,
                readTime: "2 hours",
                downloads: "20K+",
                category: "Technology",
                icon: Zap,
              },
              {
                title: "Employee Retention Strategies",
                description: "Proven tactics to reduce turnover and keep your best talent.",
                pages: 90,
                readTime: "2.5 hours",
                downloads: "19K+",
                category: "HR Management",
                icon: Target,
              },
              {
                title: "Diversity & Inclusion Playbook",
                description: "Create an inclusive workplace that attracts diverse talent.",
                pages: 100,
                readTime: "2.5 hours",
                downloads: "17K+",
                category: "Leadership",
                icon: Users,
              },
            ].map((ebook) => (
              <Card
                key={ebook.title}
                className="p-6 bg-white/60 backdrop-blur-sm border-white/20 hover:shadow-lg transition-shadow"
              >
                <div className="aspect-[3/4] bg-linear-to-br from-blue-600 via-purple-600 to-pink-600 rounded-lg flex items-center justify-center mb-4">
                  <ebook.icon className="h-16 w-16 text-white" />
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs mb-3">
                  {ebook.category}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{ebook.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{ebook.description}</p>
                <div className="flex flex-wrap gap-3 mb-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <FileText className="h-3 w-3" />
                    <span>{ebook.pages} pages</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{ebook.readTime}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Download className="h-3 w-3" />
                    <span>{ebook.downloads}</span>
                  </div>
                </div>
                <Button className="w-full bg-transparent" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Card className="p-12 bg-linear-to-br from-blue-600 via-purple-600 to-pink-600 border-0 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Want More Exclusive Content?</h2>
            <p className="text-xl text-white/90 mb-8">
              Subscribe to our newsletter and get early access to new eBooks, guides, and research reports.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/newsletter">Subscribe to Newsletter</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-white/10 text-white border-white/20 hover:bg-white/20"
                asChild
              >
                <Link href="/contact">Request Custom Content</Link>
              </Button>
            </div>
          </Card>
        </div>
      </section>
    </div>
  )
}
