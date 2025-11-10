import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Search,
  Zap,
  Calendar,
  Mail,
  MessageSquare,
  FileText,
  DollarSign,
  Users,
  Database,
  Shield,
  Cloud,
  Code,
} from "lucide-react"

export const metadata: Metadata = {
  title: "Integrations | Nino360",
  description: "Connect Nino360 with your favorite tools and services",
}

const integrations = [
  {
    name: "Slack",
    description: "Get notifications and updates directly in Slack",
    icon: MessageSquare,
    category: "Communication",
    status: "Available",
  },
  {
    name: "Google Calendar",
    description: "Sync interviews and meetings with Google Calendar",
    icon: Calendar,
    category: "Productivity",
    status: "Available",
  },
  {
    name: "Gmail",
    description: "Send and receive emails directly from Nino360",
    icon: Mail,
    category: "Communication",
    status: "Available",
  },
  {
    name: "Stripe",
    description: "Process payments and manage subscriptions",
    icon: DollarSign,
    category: "Finance",
    status: "Available",
  },
  {
    name: "LinkedIn",
    description: "Import candidate profiles from LinkedIn",
    icon: Users,
    category: "Recruitment",
    status: "Available",
  },
  {
    name: "DocuSign",
    description: "Send and sign documents electronically",
    icon: FileText,
    category: "Documents",
    status: "Available",
  },
  {
    name: "Salesforce",
    description: "Sync contacts and opportunities with Salesforce",
    icon: Database,
    category: "CRM",
    status: "Coming Soon",
  },
  {
    name: "Okta",
    description: "Single sign-on and identity management",
    icon: Shield,
    category: "Security",
    status: "Available",
  },
  {
    name: "AWS",
    description: "Deploy and manage infrastructure on AWS",
    icon: Cloud,
    category: "Infrastructure",
    status: "Available",
  },
  {
    name: "Zapier",
    description: "Connect with 5000+ apps via Zapier",
    icon: Zap,
    category: "Automation",
    status: "Available",
  },
  {
    name: "GitHub",
    description: "Sync code repositories and track issues",
    icon: Code,
    category: "Development",
    status: "Available",
  },
  {
    name: "Microsoft Teams",
    description: "Collaborate and communicate with your team",
    icon: MessageSquare,
    category: "Communication",
    status: "Coming Soon",
  },
]

const categories = [
  "All",
  "Communication",
  "Productivity",
  "Finance",
  "Recruitment",
  "Documents",
  "CRM",
  "Security",
  "Infrastructure",
  "Automation",
  "Development",
]

export default function IntegrationsPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-background via-background to-primary/5">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b bg-linear-to-br from-background via-background to-primary/5 px-6 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-6xl">
              Connect with{" "}
              <span className="bg-linear-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Your Favorite Tools
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-muted-foreground">
              Integrate Nino360 with the tools you already use. Streamline your workflow and boost productivity with
              seamless connections.
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="/auth">Start Free Trial</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/docs">View API Docs</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="px-6 py-12">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search integrations..." className="pl-10" />
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button key={category} variant={category === "All" ? "default" : "outline"} size="sm">
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Integrations Grid */}
      <section className="px-6 pb-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {integrations.map((integration) => {
              const Icon = integration.icon
              return (
                <div
                  key={integration.name}
                  className="group relative overflow-hidden rounded-xl border bg-card/50 p-6 backdrop-blur-sm transition-all hover:border-primary/50 hover:shadow-lg"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-linear-to-br from-primary/20 to-purple-500/20">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{integration.name}</h3>
                        <p className="text-xs text-muted-foreground">{integration.category}</p>
                      </div>
                    </div>
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${
                        integration.status === "Available"
                          ? "bg-green-500/10 text-green-500"
                          : "bg-yellow-500/10 text-yellow-500"
                      }`}
                    >
                      {integration.status}
                    </span>
                  </div>
                  <p className="mt-4 text-sm text-muted-foreground">{integration.description}</p>
                  <Button
                    className="mt-4 w-full"
                    variant={integration.status === "Available" ? "default" : "outline"}
                    disabled={integration.status === "Coming Soon"}
                  >
                    {integration.status === "Available" ? "Connect" : "Coming Soon"}
                  </Button>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* API Section */}
      <section className="border-t px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-2xl border bg-linear-to-br from-primary/5 via-purple-500/5 to-pink-500/5 p-12 text-center backdrop-blur-sm">
            <Code className="mx-auto h-12 w-12 text-primary" />
            <h2 className="mt-6 text-3xl font-bold">Build Custom Integrations</h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Use our powerful REST API to build custom integrations tailored to your specific needs. Full documentation
              and SDKs available.
            </p>
            <div className="mt-8 flex items-center justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="/docs">API Documentation</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/contact">Contact Sales</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
