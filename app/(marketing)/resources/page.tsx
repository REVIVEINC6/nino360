import type { Metadata } from "next"
import Link from "next/link"
import { Download, FileText, Video, BookOpen, Code, Presentation } from "lucide-react"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Resources & Downloads | Nino360",
  description: "Access guides, templates, documentation, and tools for Nino360 HRMS platform",
}

const resourceCategories = [
  {
    title: "Documentation",
    icon: BookOpen,
    items: [
      { name: "Getting Started Guide", size: "2.4 MB", format: "PDF" },
      { name: "API Documentation", size: "5.1 MB", format: "PDF" },
      { name: "Admin Guide", size: "3.8 MB", format: "PDF" },
      { name: "Security Whitepaper", size: "1.9 MB", format: "PDF" },
    ],
  },
  {
    title: "Templates",
    icon: FileText,
    items: [
      { name: "Employee Onboarding Template", size: "856 KB", format: "XLSX" },
      { name: "Performance Review Template", size: "1.2 MB", format: "DOCX" },
      { name: "Job Description Templates", size: "2.1 MB", format: "ZIP" },
      { name: "Offer Letter Templates", size: "945 KB", format: "DOCX" },
    ],
  },
  {
    title: "Video Tutorials",
    icon: Video,
    items: [
      { name: "Platform Overview", size: "45 min", format: "Video" },
      { name: "ATS Setup & Configuration", size: "28 min", format: "Video" },
      { name: "HRMS Best Practices", size: "35 min", format: "Video" },
      { name: "Finance Module Training", size: "42 min", format: "Video" },
    ],
  },
  {
    title: "Developer Tools",
    icon: Code,
    items: [
      { name: "API Client Library (Node.js)", size: "124 KB", format: "NPM" },
      { name: "API Client Library (Python)", size: "89 KB", format: "PIP" },
      { name: "Webhook Examples", size: "456 KB", format: "ZIP" },
      { name: "Integration Starter Kit", size: "2.8 MB", format: "ZIP" },
    ],
  },
  {
    title: "Presentations",
    icon: Presentation,
    items: [
      { name: "Executive Overview Deck", size: "8.4 MB", format: "PPTX" },
      { name: "Technical Architecture", size: "6.2 MB", format: "PPTX" },
      { name: "ROI Calculator", size: "1.5 MB", format: "XLSX" },
      { name: "Compliance Overview", size: "3.7 MB", format: "PDF" },
    ],
  },
]

export default function ResourcesPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative border-b bg-gradient-to-b from-background to-muted/20 py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-balance text-5xl font-bold tracking-tight">
              Resources &{" "}
              <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Downloads
              </span>
            </h1>
            <p className="text-balance text-xl text-muted-foreground">
              Access comprehensive guides, templates, documentation, and tools to get the most out of Nino360
            </p>
          </div>
        </div>
      </section>

      {/* Resource Categories */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="space-y-16">
            {resourceCategories.map((category) => {
              const Icon = category.icon
              return (
                <div key={category.title}>
                  <div className="mb-8 flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-sm">
                      <Icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <h2 className="text-3xl font-bold">{category.title}</h2>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {category.items.map((item) => (
                      <div
                        key={item.name}
                        className="group relative overflow-hidden rounded-xl border bg-card p-6 transition-all hover:border-blue-500/50 hover:shadow-lg"
                      >
                        <div className="mb-4 flex items-start justify-between">
                          <Download className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-blue-600" />
                          <span className="rounded-full bg-gradient-to-r from-blue-500/10 to-cyan-500/10 px-3 py-1 text-xs font-medium text-blue-600">
                            {item.format}
                          </span>
                        </div>
                        <h3 className="mb-2 font-semibold text-balance">{item.name}</h3>
                        <p className="mb-4 text-sm text-muted-foreground">{item.size}</p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full transition-all group-hover:border-blue-500 group-hover:bg-blue-500 group-hover:text-white bg-transparent"
                        >
                          Download
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Help Section */}
      <section className="border-t bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold">Need More Help?</h2>
            <p className="mb-8 text-lg text-muted-foreground">
              Can't find what you're looking for? Our support team is here to help.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="/contact">Contact Support</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/docs">View Documentation</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
