import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, AlertTriangle, CheckCircle2, Clock, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Incident Reports | Nino360",
  description: "Historical incident reports and post-mortem analysis for Nino360 platform",
}

const incidents = [
  {
    id: "INC-2025-001",
    title: "API Gateway Latency Spike",
    date: "2025-01-15",
    duration: "45 minutes",
    severity: "Medium",
    status: "Resolved",
    impact: "Increased response times for API requests",
    rootCause: "Database connection pool exhaustion during peak traffic",
    resolution: "Increased connection pool size and implemented better connection management",
    affectedServices: ["Core API", "Authentication"],
  },
  {
    id: "INC-2024-012",
    title: "Authentication Service Outage",
    date: "2024-12-20",
    duration: "2 hours",
    severity: "High",
    status: "Resolved",
    impact: "Users unable to log in or access protected resources",
    rootCause: "Certificate expiration on authentication service",
    resolution: "Renewed certificates and implemented automated renewal monitoring",
    affectedServices: ["Authentication", "Core API"],
  },
  {
    id: "INC-2024-011",
    title: "File Upload Service Degradation",
    date: "2024-12-05",
    duration: "1.5 hours",
    severity: "Low",
    status: "Resolved",
    impact: "Slow file upload speeds for documents and attachments",
    rootCause: "CDN cache misconfiguration after deployment",
    resolution: "Corrected CDN cache rules and improved deployment validation",
    affectedServices: ["File Storage", "CDN"],
  },
  {
    id: "INC-2024-010",
    title: "Database Performance Issues",
    date: "2024-11-28",
    duration: "3 hours",
    severity: "High",
    status: "Resolved",
    impact: "Slow query performance affecting all platform features",
    rootCause: "Missing database indexes after schema migration",
    resolution: "Added missing indexes and improved migration testing procedures",
    affectedServices: ["Database", "Core API"],
  },
  {
    id: "INC-2024-009",
    title: "Webhook Delivery Delays",
    date: "2024-11-10",
    duration: "4 hours",
    severity: "Medium",
    status: "Resolved",
    impact: "Delayed webhook notifications to integrated systems",
    rootCause: "Message queue backlog due to increased event volume",
    resolution: "Scaled webhook workers and optimized queue processing",
    affectedServices: ["Webhooks"],
  },
]

const stats = [
  { label: "Total Incidents (2024)", value: "12", trend: "-25%" },
  { label: "Avg Resolution Time", value: "2.3h", trend: "-15%" },
  { label: "Platform Uptime", value: "99.95%", trend: "+0.05%" },
  { label: "MTTR", value: "1.8h", trend: "-20%" },
]

export default function IncidentReportsPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-12">
        <Link href="/">
          <Button variant="ghost" className="mb-8">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>

        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Incident Reports
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl">
            Transparent reporting of platform incidents, root cause analysis, and resolution details.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-12">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all"
            >
              <div className="text-3xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground mb-2">{stat.label}</div>
              <div className="flex items-center text-sm text-green-600">
                <TrendingUp className="h-4 w-4 mr-1" />
                {stat.trend}
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-6">
          {incidents.map((incident) => (
            <div
              key={incident.id}
              className="bg-white/70 backdrop-blur-sm rounded-xl p-8 border border-gray-200 hover:shadow-lg transition-all"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-sm font-mono text-muted-foreground">{incident.id}</span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        incident.severity === "High"
                          ? "bg-red-100 text-red-700"
                          : incident.severity === "Medium"
                            ? "bg-orange-100 text-orange-700"
                            : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {incident.severity}
                    </span>
                    <span className="flex items-center gap-1 text-sm text-green-600">
                      <CheckCircle2 className="h-4 w-4" />
                      {incident.status}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{incident.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{incident.date}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {incident.duration}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-orange-600" />
                    Impact
                  </h4>
                  <p className="text-muted-foreground">{incident.impact}</p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Root Cause</h4>
                  <p className="text-muted-foreground">{incident.rootCause}</p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Resolution</h4>
                  <p className="text-muted-foreground">{incident.resolution}</p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Affected Services</h4>
                  <div className="flex flex-wrap gap-2">
                    {incident.affectedServices.map((service) => (
                      <span
                        key={service}
                        className="px-3 py-1 bg-linear-to-r from-blue-100 to-purple-100 text-blue-700 rounded-full text-sm"
                      >
                        {service}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 rounded-xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Subscribe to Status Updates</h2>
          <p className="mb-6 text-white/90">Get notified about incidents and maintenance windows via email or SMS</p>
          <Link href="/system-status">
            <Button size="lg" variant="secondary">
              Subscribe to Updates
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
