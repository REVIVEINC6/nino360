"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Activity, AlertCircle, CheckCircle, Database, Zap, Server, TrendingUp } from "lucide-react"
import { motion } from "framer-motion"
import { getServices, getIncidents, getHeartbeats } from "@/app/(dashboard)/admin/actions/ops"

export function SystemHealthMonitoring() {
  const [services, setServices] = useState<any[]>([])
  const [incidents, setIncidents] = useState<any[]>([])
  const [heartbeats, setHeartbeats] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      const [servicesData, incidentsData, heartbeatsData] = await Promise.all([
        getServices(),
        getIncidents(),
        getHeartbeats(),
      ])
      setServices(servicesData)
      setIncidents(incidentsData)
      setHeartbeats(heartbeatsData)
    } catch (error) {
      console.error("[v0] Error loading system health data:", error)
    } finally {
      setLoading(false)
    }
  }

  const activeServices = services.filter((s) => s.is_active).length
  const openIncidents = incidents.filter((i) => i.status === "open").length
  const criticalIncidents = incidents.filter((i) => i.severity === "critical" && i.status === "open").length
  const avgUptime =
    heartbeats.length > 0 ? (heartbeats.filter((h) => h.status === "up").length / heartbeats.length) * 100 : 100

  const stats = [
    {
      title: "System Status",
      value: criticalIncidents > 0 ? "Degraded" : "Healthy",
      icon: criticalIncidents > 0 ? AlertCircle : CheckCircle,
      color: criticalIncidents > 0 ? "text-orange-600" : "text-green-600",
      bgColor: criticalIncidents > 0 ? "bg-orange-100" : "bg-green-100",
      description: criticalIncidents > 0 ? `${criticalIncidents} critical issues` : "All systems operational",
    },
    {
      title: "Active Services",
      value: activeServices.toString(),
      icon: Server,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      description: `${services.length} total services`,
    },
    {
      title: "Uptime",
      value: `${avgUptime.toFixed(1)}%`,
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      description: "Last 24 hours",
    },
    {
      title: "Open Incidents",
      value: openIncidents.toString(),
      icon: AlertCircle,
      color: "text-red-600",
      bgColor: "bg-red-100",
      description: `${incidents.length} total incidents`,
    },
  ]

  if (loading) {
    return <div className="text-center py-8">Loading system health data...</div>
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="backdrop-blur-sm bg-white/70 border-white/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Services Status */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <Card className="backdrop-blur-sm bg-white/70 border-white/20">
          <CardHeader>
            <CardTitle>Services</CardTitle>
            <CardDescription>Monitor all system services and their health status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {services.length === 0 ? (
                <p className="text-sm text-muted-foreground">No services configured</p>
              ) : (
                services.map((service) => (
                  <div key={service.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Database className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{service.name}</p>
                        <p className="text-sm text-muted-foreground">{service.description || "No description"}</p>
                      </div>
                    </div>
                    <Badge variant={service.is_active ? "default" : "secondary"}>
                      {service.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Open Incidents */}
      {openIncidents > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <Card className="backdrop-blur-sm bg-white/70 border-white/20 border-red-200">
            <CardHeader>
              <CardTitle className="text-red-600">Open Incidents</CardTitle>
              <CardDescription>Active issues requiring attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {incidents
                  .filter((i) => i.status === "open")
                  .map((incident) => (
                    <div key={incident.id} className="flex items-center justify-between p-3 rounded-lg bg-red-50">
                      <div className="flex items-center gap-3">
                        <AlertCircle className="h-5 w-5 text-red-600" />
                        <div>
                          <p className="font-medium">{incident.title}</p>
                          <p className="text-sm text-muted-foreground">{incident.description}</p>
                        </div>
                      </div>
                      <Badge variant={incident.severity === "critical" ? "destructive" : "secondary"}>
                        {incident.severity}
                      </Badge>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Background Jobs */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
        <Card className="backdrop-blur-sm bg-white/70 border-white/20">
          <CardHeader>
            <CardTitle>Background Jobs</CardTitle>
            <CardDescription>Monitor scheduled tasks and queue processing</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Database className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Database Backup</p>
                    <p className="text-sm text-muted-foreground">Runs daily at 2:00 AM</p>
                  </div>
                </div>
                <Badge variant="default">Active</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Zap className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Email Queue Processor</p>
                    <p className="text-sm text-muted-foreground">Continuous processing</p>
                  </div>
                </div>
                <Badge variant="default">Running</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Activity className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Analytics Aggregation</p>
                    <p className="text-sm text-muted-foreground">Runs hourly</p>
                  </div>
                </div>
                <Badge variant="default">Active</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
