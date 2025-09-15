"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import {
  Database,
  HardDrive,
  Shield,
  Lock,
  Eye,
  Download,
  Upload,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Search,
  Filter,
  Settings,
  Archive,
  Key,
  Zap,
} from "lucide-react"

export default function TenantDataManagementPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const dataMetrics = {
    totalStorage: 2.4,
    usedStorage: 1.8,
    totalRecords: 1250000,
    activeConnections: 45,
    backupStatus: "healthy",
    lastBackup: "2024-01-15 03:00 AM",
  }

  const tenantData = [
    {
      id: "1",
      tenant: "Acme Corp",
      database: "acme_prod",
      size: "450 GB",
      records: 125000,
      lastAccess: "2024-01-15 14:30",
      status: "active",
      isolation: "complete",
      backup: "enabled",
    },
    {
      id: "2",
      tenant: "TechStart Inc",
      database: "techstart_prod",
      size: "280 GB",
      records: 89000,
      lastAccess: "2024-01-15 12:15",
      status: "active",
      isolation: "complete",
      backup: "enabled",
    },
    {
      id: "3",
      tenant: "Global Solutions",
      database: "global_prod",
      size: "620 GB",
      records: 198000,
      lastAccess: "2024-01-15 16:45",
      status: "maintenance",
      isolation: "complete",
      backup: "enabled",
    },
  ]

  const dataOperations = [
    {
      id: "1",
      operation: "Backup",
      tenant: "Acme Corp",
      status: "completed",
      startTime: "2024-01-15 03:00",
      duration: "45 min",
      size: "450 GB",
    },
    {
      id: "2",
      operation: "Migration",
      tenant: "TechStart Inc",
      status: "in-progress",
      startTime: "2024-01-15 14:00",
      duration: "2h 15min",
      size: "280 GB",
    },
    {
      id: "3",
      operation: "Restore",
      tenant: "Global Solutions",
      status: "pending",
      startTime: "2024-01-15 18:00",
      duration: "Est. 1h 30min",
      size: "620 GB",
    },
  ]

  const complianceChecks = [
    {
      id: "1",
      check: "Data Encryption",
      status: "passed",
      lastCheck: "2024-01-15 10:00",
      description: "All data encrypted at rest and in transit",
    },
    {
      id: "2",
      check: "Access Logging",
      status: "passed",
      lastCheck: "2024-01-15 09:30",
      description: "All data access properly logged",
    },
    {
      id: "3",
      check: "Data Retention",
      status: "warning",
      lastCheck: "2024-01-15 08:45",
      description: "Some records exceed retention policy",
    },
    {
      id: "4",
      check: "Backup Integrity",
      status: "passed",
      lastCheck: "2024-01-15 03:15",
      description: "All backups verified and accessible",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Data Management
            </h1>
            <p className="text-gray-600 mt-2">Tenant data isolation, security, and compliance management</p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
            <Button>
              <Settings className="h-4 w-4 mr-2" />
              Data Settings
            </Button>
          </div>
        </motion.div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="bg-white/70 backdrop-blur-sm border-white/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Storage</CardTitle>
                <HardDrive className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {dataMetrics.usedStorage} / {dataMetrics.totalStorage} TB
                </div>
                <Progress value={(dataMetrics.usedStorage / dataMetrics.totalStorage) * 100} className="mt-2" />
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="bg-white/70 backdrop-blur-sm border-white/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Records</CardTitle>
                <Database className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{dataMetrics.totalRecords.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Across all tenants</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="bg-white/70 backdrop-blur-sm border-white/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Connections</CardTitle>
                <Zap className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">{dataMetrics.activeConnections}</div>
                <p className="text-xs text-muted-foreground">Real-time connections</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card className="bg-white/70 backdrop-blur-sm border-white/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Backup Status</CardTitle>
                <Shield className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600 capitalize">{dataMetrics.backupStatus}</div>
                <p className="text-xs text-muted-foreground">Last: {dataMetrics.lastBackup}</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-white/50 backdrop-blur-sm">
            <TabsTrigger value="overview">Data Overview</TabsTrigger>
            <TabsTrigger value="operations">Operations</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card className="bg-white/70 backdrop-blur-sm border-white/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Tenant Data Overview</CardTitle>
                    <CardDescription>Data isolation and storage management per tenant</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search tenants..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 w-64"
                      />
                    </div>
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tenantData.map((tenant, index) => (
                    <motion.div
                      key={tenant.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 bg-white/50 rounded-lg border border-white/20"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                          <Database className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{tenant.tenant}</h3>
                          <p className="text-sm text-gray-600">{tenant.database}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <p className="font-semibold">{tenant.size}</p>
                          <p className="text-xs text-gray-600">Storage</p>
                        </div>
                        <div className="text-center">
                          <p className="font-semibold">{tenant.records.toLocaleString()}</p>
                          <p className="text-xs text-gray-600">Records</p>
                        </div>
                        <div className="text-center">
                          <Badge
                            variant={tenant.status === "active" ? "default" : "secondary"}
                            className={
                              tenant.status === "active"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }
                          >
                            {tenant.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Settings className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="operations" className="space-y-6">
            <Card className="bg-white/70 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle>Data Operations</CardTitle>
                <CardDescription>Monitor backup, migration, and maintenance operations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dataOperations.map((operation, index) => (
                    <motion.div
                      key={operation.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 bg-white/50 rounded-lg border border-white/20"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center text-white">
                          {operation.operation === "Backup" && <Archive className="h-6 w-6" />}
                          {operation.operation === "Migration" && <RefreshCw className="h-6 w-6" />}
                          {operation.operation === "Restore" && <Upload className="h-6 w-6" />}
                        </div>
                        <div>
                          <h3 className="font-semibold">{operation.operation}</h3>
                          <p className="text-sm text-gray-600">{operation.tenant}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <p className="font-semibold">{operation.size}</p>
                          <p className="text-xs text-gray-600">Size</p>
                        </div>
                        <div className="text-center">
                          <p className="font-semibold">{operation.duration}</p>
                          <p className="text-xs text-gray-600">Duration</p>
                        </div>
                        <Badge
                          variant={
                            operation.status === "completed"
                              ? "default"
                              : operation.status === "in-progress"
                                ? "secondary"
                                : "outline"
                          }
                          className={
                            operation.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : operation.status === "in-progress"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-gray-100 text-gray-800"
                          }
                        >
                          {operation.status}
                        </Badge>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="compliance" className="space-y-6">
            <Card className="bg-white/70 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle>Compliance Monitoring</CardTitle>
                <CardDescription>Data governance and regulatory compliance status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {complianceChecks.map((check, index) => (
                    <motion.div
                      key={check.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 bg-white/50 rounded-lg border border-white/20"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{check.check}</h3>
                        <Badge
                          variant={check.status === "passed" ? "default" : "secondary"}
                          className={
                            check.status === "passed" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                          }
                        >
                          {check.status === "passed" ? (
                            <CheckCircle className="h-3 w-3 mr-1" />
                          ) : (
                            <AlertTriangle className="h-3 w-3 mr-1" />
                          )}
                          {check.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{check.description}</p>
                      <p className="text-xs text-gray-500">Last check: {check.lastCheck}</p>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white/70 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle>Data Security</CardTitle>
                  <CardDescription>Encryption and access control status</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Lock className="h-5 w-5 text-green-600" />
                        <span>Encryption at Rest</span>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Enabled</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Shield className="h-5 w-5 text-green-600" />
                        <span>Encryption in Transit</span>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Enabled</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Key className="h-5 w-5 text-green-600" />
                        <span>Key Management</span>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Eye className="h-5 w-5 text-green-600" />
                        <span>Access Monitoring</span>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Active</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/70 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle>Access Analytics</CardTitle>
                  <CardDescription>Data access patterns and security metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Failed Access Attempts</span>
                      <span className="font-semibold text-red-600">3</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Successful Logins (24h)</span>
                      <span className="font-semibold text-green-600">1,247</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Data Queries (24h)</span>
                      <span className="font-semibold text-blue-600">15,432</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Security Alerts</span>
                      <span className="font-semibold text-yellow-600">2</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
