"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Shield,
  Lock,
  Key,
  Eye,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Activity,
  Globe,
  Server,
  Settings,
  RefreshCw,
  Plus,
  Trash2,
  Edit,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface SecurityPolicy {
  id: string
  name: string
  description: string
  enabled: boolean
  severity: "low" | "medium" | "high" | "critical"
  lastUpdated: string
}

interface SecurityEvent {
  id: string
  type: "login" | "failed_login" | "permission_change" | "data_access" | "system_change"
  description: string
  user: string
  timestamp: Date
  severity: "info" | "warning" | "error"
  ipAddress: string
  location: string
}

interface SecurityMetric {
  label: string
  value: number
  total: number
  status: "good" | "warning" | "critical"
  trend: "up" | "down" | "stable"
}

export default function SecurityManagement() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [selectedTab, setSelectedTab] = useState("overview")
  const [policies, setPolicies] = useState<SecurityPolicy[]>([])
  const [events, setEvents] = useState<SecurityEvent[]>([])
  const [metrics, setMetrics] = useState<SecurityMetric[]>([])
  const [showAddPolicy, setShowAddPolicy] = useState(false)

  useEffect(() => {
    loadSecurityData()
  }, [])

  const loadSecurityData = async () => {
    setLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setPolicies([
      {
        id: "1",
        name: "Password Policy",
        description: "Enforce strong password requirements",
        enabled: true,
        severity: "high",
        lastUpdated: "2024-01-15",
      },
      {
        id: "2",
        name: "Multi-Factor Authentication",
        description: "Require MFA for all user accounts",
        enabled: true,
        severity: "critical",
        lastUpdated: "2024-01-10",
      },
      {
        id: "3",
        name: "Session Management",
        description: "Automatic session timeout and management",
        enabled: true,
        severity: "medium",
        lastUpdated: "2024-01-12",
      },
      {
        id: "4",
        name: "IP Whitelisting",
        description: "Restrict access to approved IP addresses",
        enabled: false,
        severity: "high",
        lastUpdated: "2024-01-08",
      },
      {
        id: "5",
        name: "Data Encryption",
        description: "Encrypt sensitive data at rest and in transit",
        enabled: true,
        severity: "critical",
        lastUpdated: "2024-01-14",
      },
    ])

    setEvents([
      {
        id: "1",
        type: "login",
        description: "Successful login",
        user: "john.doe@acme.com",
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        severity: "info",
        ipAddress: "192.168.1.100",
        location: "New York, USA",
      },
      {
        id: "2",
        type: "failed_login",
        description: "Failed login attempt",
        user: "unknown@suspicious.com",
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        severity: "warning",
        ipAddress: "203.0.113.1",
        location: "Unknown",
      },
      {
        id: "3",
        type: "permission_change",
        description: "User permissions modified",
        user: "admin@acme.com",
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        severity: "info",
        ipAddress: "192.168.1.50",
        location: "New York, USA",
      },
      {
        id: "4",
        type: "data_access",
        description: "Sensitive data accessed",
        user: "jane.smith@acme.com",
        timestamp: new Date(Date.now() - 45 * 60 * 1000),
        severity: "info",
        ipAddress: "192.168.1.75",
        location: "New York, USA",
      },
      {
        id: "5",
        type: "system_change",
        description: "Security policy updated",
        user: "admin@acme.com",
        timestamp: new Date(Date.now() - 60 * 60 * 1000),
        severity: "warning",
        ipAddress: "192.168.1.50",
        location: "New York, USA",
      },
    ])

    setMetrics([
      {
        label: "Active Sessions",
        value: 247,
        total: 300,
        status: "good",
        trend: "stable",
      },
      {
        label: "Failed Login Attempts",
        value: 12,
        total: 100,
        status: "warning",
        trend: "up",
      },
      {
        label: "Security Policies",
        value: 4,
        total: 5,
        status: "warning",
        trend: "stable",
      },
      {
        label: "Encrypted Data",
        value: 98,
        total: 100,
        status: "good",
        trend: "stable",
      },
    ])

    setLoading(false)
  }

  const togglePolicy = async (policyId: string) => {
    setPolicies((prev) =>
      prev.map((policy) =>
        policy.id === policyId
          ? { ...policy, enabled: !policy.enabled, lastUpdated: new Date().toISOString().split("T")[0] }
          : policy,
      ),
    )

    toast({
      title: "Policy Updated",
      description: "Security policy has been updated successfully.",
    })
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-200"
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getEventIcon = (type: string) => {
    switch (type) {
      case "login":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "failed_login":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "permission_change":
        return <Key className="h-4 w-4 text-blue-500" />
      case "data_access":
        return <Eye className="h-4 w-4 text-purple-500" />
      case "system_change":
        return <Settings className="h-4 w-4 text-orange-500" />
      default:
        return <Activity className="h-4 w-4 text-gray-500" />
    }
  }

  const getEventSeverityColor = (severity: string) => {
    switch (severity) {
      case "error":
        return "text-red-600"
      case "warning":
        return "text-yellow-600"
      default:
        return "text-blue-600"
    }
  }

  const getMetricStatusColor = (status: string) => {
    switch (status) {
      case "critical":
        return "text-red-600"
      case "warning":
        return "text-yellow-600"
      default:
        return "text-green-600"
    }
  }

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Security Management</h1>
          <p className="text-gray-600 mt-1">Monitor and manage security policies and events</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={loadSecurityData} className="bg-transparent">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={() => setShowAddPolicy(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Policy
          </Button>
        </div>
      </div>

      {/* Security Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-gray-600">{metric.label}</h3>
                  <Shield className={`h-4 w-4 ${getMetricStatusColor(metric.status)}`} />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">{metric.value}</span>
                    <span className="text-sm text-gray-500">/ {metric.total}</span>
                  </div>
                  <Progress value={(metric.value / metric.total) * 100} className="h-2" />
                  <div className="flex items-center justify-between text-xs">
                    <span className={getMetricStatusColor(metric.status)}>
                      {metric.status.charAt(0).toUpperCase() + metric.status.slice(1)}
                    </span>
                    <span className="text-gray-500">
                      {metric.trend === "up" ? "↗" : metric.trend === "down" ? "↘" : "→"} {metric.trend}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Security Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="policies">Policies</TabsTrigger>
          <TabsTrigger value="events">Security Events</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Security Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security Status
                </CardTitle>
                <CardDescription>Overall security posture and recommendations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-green-50 border border-green-200">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium text-green-800">System Secure</p>
                      <p className="text-sm text-green-600">All critical policies are active</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Good</Badge>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Password Policy</span>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Multi-Factor Authentication</span>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Data Encryption</span>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">IP Whitelisting</span>
                    <XCircle className="h-4 w-4 text-red-500" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Threats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Recent Security Events
                </CardTitle>
                <CardDescription>Latest security-related activities</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {events.slice(0, 5).map((event, index) => (
                  <div key={event.id} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                    {getEventIcon(event.type)}
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">{event.description}</p>
                        <span className={`text-xs ${getEventSeverityColor(event.severity)}`}>{event.severity}</span>
                      </div>
                      <p className="text-xs text-gray-600">{event.user}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>{event.timestamp.toLocaleTimeString()}</span>
                        <span>{event.ipAddress}</span>
                        <span>{event.location}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="policies" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Security Policies
              </CardTitle>
              <CardDescription>Manage and configure security policies</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {policies.map((policy, index) => (
                  <motion.div
                    key={policy.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 rounded-lg border hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-4">
                      <Switch checked={policy.enabled} onCheckedChange={() => togglePolicy(policy.id)} />
                      <div>
                        <h3 className="font-medium">{policy.name}</h3>
                        <p className="text-sm text-gray-600">{policy.description}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Last updated: {new Date(policy.lastUpdated).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className={getSeverityColor(policy.severity)}>
                        {policy.severity}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Security Event Log
              </CardTitle>
              <CardDescription>Detailed log of all security-related events</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Event</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>IP Address</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Severity</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {events.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getEventIcon(event.type)}
                          {event.description}
                        </div>
                      </TableCell>
                      <TableCell>{event.user}</TableCell>
                      <TableCell>{event.ipAddress}</TableCell>
                      <TableCell>{event.location}</TableCell>
                      <TableCell>{event.timestamp.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`${getEventSeverityColor(event.severity)} border-current`}>
                          {event.severity}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="h-5 w-5" />
                  System Monitoring
                </CardTitle>
                <CardDescription>Real-time system security monitoring</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Firewall Status</span>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Intrusion Detection</span>
                    <Badge className="bg-green-100 text-green-800">Monitoring</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">SSL Certificate</span>
                    <Badge className="bg-green-100 text-green-800">Valid</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Backup Status</span>
                    <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Network Security
                </CardTitle>
                <CardDescription>Network-level security monitoring</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">DDoS Protection</span>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">VPN Connections</span>
                    <span className="text-sm font-medium">24 Active</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Blocked IPs</span>
                    <span className="text-sm font-medium">156 Total</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Traffic Analysis</span>
                    <Badge className="bg-blue-100 text-blue-800">Running</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Add Policy Dialog */}
      <Dialog open={showAddPolicy} onOpenChange={setShowAddPolicy}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Security Policy</DialogTitle>
            <DialogDescription>Create a new security policy for your tenant</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="policyName">Policy Name</Label>
              <Input id="policyName" placeholder="Enter policy name" />
            </div>
            <div>
              <Label htmlFor="policyDescription">Description</Label>
              <Input id="policyDescription" placeholder="Enter policy description" />
            </div>
            <div>
              <Label htmlFor="policySeverity">Severity Level</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="policyEnabled" />
              <Label htmlFor="policyEnabled">Enable policy immediately</Label>
            </div>
            <div className="flex gap-2 pt-4">
              <Button className="flex-1">Create Policy</Button>
              <Button variant="outline" onClick={() => setShowAddPolicy(false)} className="flex-1 bg-transparent">
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
