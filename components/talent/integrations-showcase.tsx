"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, CheckCircle, Star, Users, TrendingUp, Zap, Globe, Shield, BarChart3 } from "lucide-react"

interface Integration {
  id: string
  name: string
  category: "job-boards" | "social" | "productivity" | "ats" | "assessment"
  logo: string
  description: string
  status: "connected" | "available" | "premium"
  features: string[]
  metrics?: {
    jobsPosted?: number
    applicants?: number
    hires?: number
    responseRate?: number
  }
  pricing?: string
  popular?: boolean
}

const integrations: Integration[] = [
  {
    id: "indeed",
    name: "Indeed",
    category: "job-boards",
    logo: "🔍",
    description: "World's #1 job site with over 250 million unique visitors monthly",
    status: "connected",
    features: ["Job posting", "Resume search", "Sponsored jobs", "Analytics"],
    metrics: { jobsPosted: 45, applicants: 1250, hires: 23, responseRate: 78 },
    popular: true,
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    category: "social",
    logo: "💼",
    description: "Professional network with 900+ million members worldwide",
    status: "connected",
    features: ["Job posting", "Talent search", "InMail", "Company pages"],
    metrics: { jobsPosted: 32, applicants: 890, hires: 18, responseRate: 65 },
    popular: true,
  },
  {
    id: "glassdoor",
    name: "Glassdoor",
    category: "job-boards",
    logo: "🏢",
    description: "Job search with company reviews and salary insights",
    status: "connected",
    features: ["Job posting", "Employer branding", "Salary data", "Reviews"],
    metrics: { jobsPosted: 28, applicants: 567, hires: 12, responseRate: 52 },
  },
  {
    id: "monster",
    name: "Monster",
    category: "job-boards",
    logo: "👹",
    description: "Global employment website with career advice and tools",
    status: "available",
    features: ["Job posting", "Resume database", "Candidate matching", "Branding"],
    pricing: "$299/month",
  },
  {
    id: "dice",
    name: "Dice",
    category: "job-boards",
    logo: "🎲",
    description: "Tech-focused job board for IT and engineering professionals",
    status: "premium",
    features: ["Tech job posting", "Skills matching", "Salary tools", "Tech insights"],
    pricing: "$399/month",
  },
  {
    id: "ziprecruiter",
    name: "ZipRecruiter",
    category: "job-boards",
    logo: "⚡",
    description: "AI-powered job matching platform",
    status: "available",
    features: ["One-click posting", "AI matching", "Mobile app", "Candidate screening"],
    pricing: "$249/month",
  },
  {
    id: "facebook",
    name: "Facebook Jobs",
    category: "social",
    logo: "📘",
    description: "Social media job posting and recruitment",
    status: "connected",
    features: ["Job posting", "Social recruiting", "Targeted ads", "Community reach"],
    metrics: { jobsPosted: 15, applicants: 234, hires: 5, responseRate: 34 },
  },
  {
    id: "slack",
    name: "Slack",
    category: "productivity",
    logo: "💬",
    description: "Team communication and collaboration platform",
    status: "connected",
    features: ["Team notifications", "Interview scheduling", "Candidate updates", "Workflows"],
  },
  {
    id: "teams",
    name: "Microsoft Teams",
    category: "productivity",
    logo: "🟦",
    description: "Video conferencing and collaboration suite",
    status: "connected",
    features: ["Video interviews", "Team collaboration", "Calendar integration", "File sharing"],
  },
  {
    id: "zoom",
    name: "Zoom",
    category: "productivity",
    logo: "📹",
    description: "Video conferencing platform for remote interviews",
    status: "connected",
    features: ["Video interviews", "Recording", "Screen sharing", "Waiting rooms"],
  },
  {
    id: "greenhouse",
    name: "Greenhouse",
    category: "ats",
    logo: "🌱",
    description: "Applicant tracking and recruiting software",
    status: "premium",
    features: ["ATS integration", "Interview kits", "Reporting", "Compliance"],
    pricing: "$6,000/year",
  },
  {
    id: "workday",
    name: "Workday",
    category: "ats",
    logo: "☀️",
    description: "Enterprise HR and talent management suite",
    status: "premium",
    features: ["Full HR suite", "Talent acquisition", "Analytics", "Mobile app"],
    pricing: "Custom pricing",
  },
  {
    id: "codility",
    name: "Codility",
    category: "assessment",
    logo: "💻",
    description: "Technical assessment platform for developers",
    status: "available",
    features: ["Coding tests", "Live interviews", "Plagiarism detection", "Skills insights"],
    pricing: "$450/month",
  },
  {
    id: "hackerrank",
    name: "HackerRank",
    category: "assessment",
    logo: "🏆",
    description: "Technical skills assessment and coding challenges",
    status: "available",
    features: ["Coding challenges", "Skills certification", "Interview prep", "Leaderboards"],
    pricing: "$199/month",
  },
  {
    id: "calendly",
    name: "Calendly",
    category: "productivity",
    logo: "📅",
    description: "Automated scheduling for interviews and meetings",
    status: "connected",
    features: ["Interview scheduling", "Calendar sync", "Automated reminders", "Time zones"],
  },
]

export default function IntegrationsShowcase() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  const filteredIntegrations = integrations.filter((integration) => {
    const matchesSearch =
      integration.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      integration.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || integration.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "connected":
        return "bg-green-100 text-green-800"
      case "available":
        return "bg-blue-100 text-blue-800"
      case "premium":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "connected":
        return "Connected"
      case "available":
        return "Available"
      case "premium":
        return "Premium"
      default:
        return status
    }
  }

  const connectedIntegrations = integrations.filter((i) => i.status === "connected")
  const totalMetrics = connectedIntegrations.reduce(
    (acc, integration) => {
      if (integration.metrics) {
        acc.jobsPosted += integration.metrics.jobsPosted || 0
        acc.applicants += integration.metrics.applicants || 0
        acc.hires += integration.metrics.hires || 0
      }
      return acc
    },
    { jobsPosted: 0, applicants: 0, hires: 0 },
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Talent Acquisition Integrations</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Unlock the full potential of your recruitment efforts with ESG OS all-in-one talent acquisition platform,
          featuring seamless integrations with top job boards and productivity apps.
        </p>
      </div>

      {/* Integration Diagram */}
      <div className="flex justify-center my-8">
        <div className="relative">
          <img
            src="/images/talent-integrations-diagram.png"
            alt="ESG OS Talent Integrations Ecosystem"
            className="max-w-full h-auto rounded-lg shadow-lg"
          />
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Connected Platforms</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{connectedIntegrations.length}</div>
            <p className="text-xs text-muted-foreground">Active integrations</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Jobs Posted</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMetrics.jobsPosted}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applicants</CardTitle>
            <Users className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMetrics.applicants.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Successful Hires</CardTitle>
            <Star className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMetrics.hires}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search integrations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full sm:w-auto">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="job-boards">Job Boards</TabsTrigger>
            <TabsTrigger value="social">Social</TabsTrigger>
            <TabsTrigger value="productivity">Productivity</TabsTrigger>
            <TabsTrigger value="ats">ATS</TabsTrigger>
            <TabsTrigger value="assessment">Assessment</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Integration Benefits */}
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              Streamlined Workflows
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Automate job posting across multiple platforms and sync candidate data seamlessly.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-500" />
              Enterprise Security
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              SOC 2 compliant integrations with enterprise-grade security and data protection.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-500" />
              Advanced Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Unified reporting and analytics across all your recruitment channels and platforms.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Integrations Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredIntegrations.map((integration) => (
          <Card key={integration.id} className="relative">
            {integration.popular && <Badge className="absolute -top-2 -right-2 bg-orange-500">Popular</Badge>}
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{integration.logo}</div>
                  <div>
                    <CardTitle className="text-lg">{integration.name}</CardTitle>
                    <Badge className={getStatusColor(integration.status)}>{getStatusText(integration.status)}</Badge>
                  </div>
                </div>
              </div>
              <CardDescription>{integration.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Features */}
              <div>
                <h4 className="font-medium mb-2">Features</h4>
                <div className="flex flex-wrap gap-1">
                  {integration.features.map((feature, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Metrics */}
              {integration.metrics && (
                <div>
                  <h4 className="font-medium mb-2">Performance</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>Jobs: {integration.metrics.jobsPosted}</div>
                    <div>Applicants: {integration.metrics.applicants}</div>
                    <div>Hires: {integration.metrics.hires}</div>
                    <div>Response: {integration.metrics.responseRate}%</div>
                  </div>
                </div>
              )}

              {/* Pricing */}
              {integration.pricing && (
                <div>
                  <h4 className="font-medium mb-1">Pricing</h4>
                  <p className="text-sm text-muted-foreground">{integration.pricing}</p>
                </div>
              )}

              {/* Action Button */}
              <div className="pt-2">
                {integration.status === "connected" ? (
                  <Button variant="outline" className="w-full bg-transparent">
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Manage
                  </Button>
                ) : integration.status === "premium" ? (
                  <Button className="w-full">
                    <Star className="mr-2 h-4 w-4" />
                    Upgrade
                  </Button>
                ) : (
                  <Button variant="default" className="w-full">
                    <Globe className="mr-2 h-4 w-4" />
                    Connect
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredIntegrations.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No integrations found matching your criteria.</p>
        </div>
      )}
    </div>
  )
}
