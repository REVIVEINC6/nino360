import type { Metadata } from "next"
import Link from "next/link"
import { CheckCircle2, AlertCircle, XCircle, Clock, Activity, Database, Cloud, Zap, Shield, Globe } from "lucide-react"

export const metadata: Metadata = {
  title: "API Status | Nino360",
  description: "Real-time status of Nino360 API services and infrastructure",
}

const services = [
  {
    name: "Core API",
    status: "operational",
    uptime: "99.99%",
    latency: "45ms",
    icon: Activity,
  },
  {
    name: "Authentication Service",
    status: "operational",
    uptime: "99.98%",
    latency: "32ms",
    icon: Shield,
  },
  {
    name: "Database",
    status: "operational",
    uptime: "99.99%",
    latency: "12ms",
    icon: Database,
  },
  {
    name: "File Storage",
    status: "operational",
    uptime: "99.97%",
    latency: "78ms",
    icon: Cloud,
  },
  {
    name: "Webhooks",
    status: "operational",
    uptime: "99.95%",
    latency: "156ms",
    icon: Zap,
  },
  {
    name: "CDN",
    status: "operational",
    uptime: "99.99%",
    latency: "23ms",
    icon: Globe,
  },
]

const incidents = [
  {
    date: "2025-01-15",
    title: "Increased API Latency",
    status: "resolved",
    duration: "23 minutes",
    severity: "minor",
  },
  {
    date: "2025-01-08",
    title: "Database Connection Issues",
    status: "resolved",
    duration: "12 minutes",
    severity: "major",
  },
  {
    date: "2024-12-28",
    title: "Scheduled Maintenance",
    status: "completed",
    duration: "2 hours",
    severity: "maintenance",
  },
]

const metrics = [
  { label: "Overall Uptime", value: "99.98%", period: "Last 30 days" },
  { label: "Average Response Time", value: "58ms", period: "Last 24 hours" },
  { label: "Total Requests", value: "2.4M", period: "Last 24 hours" },
  { label: "Error Rate", value: "0.02%", period: "Last 24 hours" },
]

export default function APIStatusPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            API Status
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Real-time monitoring of Nino360 API services and infrastructure
          </p>
        </div>

        {/* Overall Status */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-200 p-8 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
              <div>
                <h2 className="text-2xl font-bold text-gray-900">All Systems Operational</h2>
                <p className="text-gray-600">All services are running normally</p>
              </div>
            </div>
          </div>
        </div>

        {/* Services Status */}
        <div className="max-w-4xl mx-auto mb-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Service Status</h2>
          <div className="grid gap-4">
            {services.map((service) => {
              const Icon = service.icon
              return (
                <div
                  key={service.name}
                  className="bg-white/70 backdrop-blur-sm rounded-xl border border-gray-200 p-6 shadow-lg hover:shadow-xl transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{service.name}</h3>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="text-sm text-gray-600">Uptime: {service.uptime}</span>
                          <span className="text-sm text-gray-600">Latency: {service.latency}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                      <span className="text-sm font-medium text-green-600">Operational</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="max-w-4xl mx-auto mb-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Performance Metrics</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {metrics.map((metric) => (
              <div
                key={metric.label}
                className="bg-white/70 backdrop-blur-sm rounded-xl border border-gray-200 p-6 shadow-lg"
              >
                <div className="text-3xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  {metric.value}
                </div>
                <div className="text-gray-900 font-medium mb-1">{metric.label}</div>
                <div className="text-sm text-gray-600">{metric.period}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Incidents */}
        <div className="max-w-4xl mx-auto mb-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Recent Incidents</h2>
          <div className="space-y-4">
            {incidents.map((incident, index) => (
              <div key={index} className="bg-white/70 backdrop-blur-sm rounded-xl border border-gray-200 p-6 shadow-lg">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3">
                    {incident.severity === "major" && <XCircle className="w-5 h-5 text-red-600 mt-0.5" />}
                    {incident.severity === "minor" && <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />}
                    {incident.severity === "maintenance" && <Clock className="w-5 h-5 text-blue-600 mt-0.5" />}
                    <div>
                      <h3 className="font-semibold text-gray-900">{incident.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{incident.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {incident.status}
                    </span>
                    <p className="text-sm text-gray-600 mt-1">Duration: {incident.duration}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Subscribe to Updates */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl p-8 text-center text-white shadow-xl">
            <h2 className="text-2xl font-bold mb-4">Subscribe to Status Updates</h2>
            <p className="mb-6 text-blue-50">Get notified about service incidents and scheduled maintenance</p>
            <div className="flex gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button className="px-6 py-3 bg-white text-purple-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Subscribe
              </button>
            </div>
            <div className="mt-6 flex items-center justify-center gap-6 text-sm text-blue-50">
              <Link href="/system-status" className="hover:text-white transition-colors">
                System Status
              </Link>
              <Link href="/developers" className="hover:text-white transition-colors">
                API Documentation
              </Link>
              <Link href="/support" className="hover:text-white transition-colors">
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
