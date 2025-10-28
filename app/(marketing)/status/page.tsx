import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Clock, Activity, Server, Database, Globe, Zap } from "lucide-react"

export default function StatusPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <Activity className="h-8 w-8 text-green-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              System Status
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Real-time status and uptime monitoring for all Nino360 services
          </p>
        </div>

        {/* Overall Status */}
        <Card className="p-8 mb-8 backdrop-blur-sm bg-white/80 border-green-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <CheckCircle2 className="h-12 w-12 text-green-600" />
              <div>
                <h2 className="text-2xl font-bold text-green-600">All Systems Operational</h2>
                <p className="text-muted-foreground">Last updated: {new Date().toLocaleString()}</p>
              </div>
            </div>
            <Badge className="bg-green-100 text-green-700 border-green-300 px-4 py-2 text-lg">99.9% Uptime</Badge>
          </div>
        </Card>

        {/* Service Status */}
        <div className="grid gap-6 mb-12">
          <h2 className="text-2xl font-bold">Service Status</h2>

          {[
            { name: "API Services", icon: Server, status: "operational", uptime: "99.99%", responseTime: "45ms" },
            { name: "Database", icon: Database, status: "operational", uptime: "99.98%", responseTime: "12ms" },
            { name: "Web Application", icon: Globe, status: "operational", uptime: "99.97%", responseTime: "120ms" },
            { name: "Authentication", icon: Zap, status: "operational", uptime: "99.99%", responseTime: "35ms" },
            { name: "File Storage", icon: Server, status: "operational", uptime: "99.96%", responseTime: "80ms" },
            { name: "Email Delivery", icon: Activity, status: "operational", uptime: "99.95%", responseTime: "250ms" },
          ].map((service, index) => (
            <Card key={index} className="p-6 backdrop-blur-sm bg-white/80 hover:shadow-lg transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-gradient-to-br from-blue-100 to-purple-100">
                    <service.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{service.name}</h3>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-sm text-muted-foreground">Uptime: {service.uptime}</span>
                      <span className="text-sm text-muted-foreground">Response: {service.responseTime}</span>
                    </div>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-700 border-green-300">
                  <CheckCircle2 className="h-4 w-4 mr-1" />
                  Operational
                </Badge>
              </div>
            </Card>
          ))}
        </div>

        {/* Incident History */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Recent Incidents</h2>
          <Card className="p-6 backdrop-blur-sm bg-white/80">
            <div className="text-center py-8">
              <CheckCircle2 className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <p className="text-lg font-semibold">No incidents reported</p>
              <p className="text-muted-foreground">All systems have been running smoothly for the past 90 days</p>
            </div>
          </Card>
        </div>

        {/* Uptime History */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">90-Day Uptime History</h2>
          <Card className="p-6 backdrop-blur-sm bg-white/80">
            <div className="grid grid-cols-90 gap-1">
              {Array.from({ length: 90 }).map((_, i) => (
                <div
                  key={i}
                  className="h-8 bg-green-500 rounded hover:bg-green-600 transition-colors cursor-pointer"
                  title={`Day ${i + 1}: 100% uptime`}
                />
              ))}
            </div>
            <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
              <span>90 days ago</span>
              <span>Today</span>
            </div>
            <div className="flex items-center gap-4 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded" />
                <span className="text-sm">Operational</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-500 rounded" />
                <span className="text-sm">Degraded</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded" />
                <span className="text-sm">Outage</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Scheduled Maintenance */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Scheduled Maintenance</h2>
          <Card className="p-6 backdrop-blur-sm bg-white/80">
            <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <Clock className="h-6 w-6 text-blue-600 mt-1" />
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-2">Upcoming Database Optimization</h3>
                <p className="text-muted-foreground mb-2">
                  We will be performing routine database optimization to improve performance.
                </p>
                <div className="flex items-center gap-4 text-sm">
                  <span className="font-medium">Scheduled: March 15, 2025 at 2:00 AM UTC</span>
                  <Badge variant="outline">2 hours duration</Badge>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Subscribe to Updates */}
        <Card className="p-8 backdrop-blur-sm bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Subscribe to Status Updates</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Get notified about incidents, maintenance windows, and service updates via email or SMS
            </p>
            <div className="flex gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                Subscribe via Email
              </Button>
              <Button size="lg" variant="outline">
                Subscribe via SMS
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
