"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search, FileText, Download, Activity, Shield, Brain, Database } from "lucide-react"
import { motion } from "framer-motion"
import { exportLogs } from "@/app/(dashboard)/admin/audit-ai/actions"

interface AuditAILogsManagementProps {
  auditLogs: any[]
  aiLogs: any[]
  stats: {
    totalAudit: number
    totalAI: number
    totalSecurity: number
    avgResponseTime: number
  }
}

export function AuditAILogsManagement({ auditLogs, aiLogs, stats }: AuditAILogsManagementProps) {
  const [search, setSearch] = useState("")
  const [filterType, setFilterType] = useState("all")

  const allLogs = filterType === "ai" ? aiLogs : filterType === "audit" ? auditLogs : [...auditLogs, ...aiLogs]

  const filteredLogs = allLogs.filter((log) => {
    const searchLower = search.toLowerCase()
    return (
      log.action?.toLowerCase().includes(searchLower) ||
      log.user_id?.toLowerCase().includes(searchLower) ||
      log.tenant_id?.toLowerCase().includes(searchLower)
    )
  })

  const handleExport = async () => {
    try {
      const data = await exportLogs(filterType as any)
      const csv = convertToCSV(data)
      downloadCSV(csv, `audit-logs-${filterType}-${new Date().toISOString()}.csv`)
    } catch (error) {
      console.error("[v0] Error exporting logs:", error)
    }
  }

  const convertToCSV = (data: any[]) => {
    if (data.length === 0) return ""
    const headers = Object.keys(data[0]).join(",")
    const rows = data.map((row) => Object.values(row).join(","))
    return [headers, ...rows].join("\n")
  }

  const downloadCSV = (csv: string, filename: string) => {
    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    a.click()
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="backdrop-blur-xl bg-white/70 border-white/20 shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Audit Logs</CardTitle>
              <div className="h-8 w-8 rounded-lg bg-linear-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <Database className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalAudit.toLocaleString()}</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="backdrop-blur-xl bg-white/70 border-white/20 shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">AI Interactions</CardTitle>
              <div className="h-8 w-8 rounded-lg bg-linear-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                <Brain className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalAI.toLocaleString()}</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="backdrop-blur-xl bg-white/70 border-white/20 shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Security Events</CardTitle>
              <div className="h-8 w-8 rounded-lg bg-linear-to-br from-red-500 to-red-600 flex items-center justify-center">
                <Shield className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalSecurity.toLocaleString()}</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="backdrop-blur-xl bg-white/70 border-white/20 shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
              <div className="h-8 w-8 rounded-lg bg-linear-to-br from-green-500 to-green-600 flex items-center justify-center">
                <Activity className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.avgResponseTime}ms</div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Filters */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <Card className="backdrop-blur-xl bg-white/70 border-white/20 shadow-xl">
          <CardHeader>
            <CardTitle className="bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Audit & AI Logs
            </CardTitle>
            <CardDescription>Cross-tenant audit trail and AI interaction logs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-1 gap-2">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search logs..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-8 backdrop-blur-xl bg-white/50 border-white/20"
                  />
                </div>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-[180px] backdrop-blur-xl bg-white/50 border-white/20">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Logs</SelectItem>
                    <SelectItem value="audit">Audit Logs</SelectItem>
                    <SelectItem value="ai">AI Interactions</SelectItem>
                    <SelectItem value="security">Security Events</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                variant="outline"
                onClick={handleExport}
                className="backdrop-blur-xl bg-white/50 border-white/20 hover:bg-white/70"
              >
                <Download className="h-4 w-4 mr-2" />
                Export Logs
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Logs Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
        <Card className="backdrop-blur-xl bg-white/70 border-white/20 shadow-xl">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Tenant</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No logs found. Audit and AI logs will appear here.</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredLogs.map((log, index) => (
                    <TableRow key={log.id || index}>
                      <TableCell className="font-mono text-xs">{new Date(log.created_at).toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant={log.action?.includes("ai") ? "default" : "secondary"}>
                          {log.action?.includes("ai") ? "AI" : "Audit"}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-xs">{log.tenant_id?.slice(0, 8)}...</TableCell>
                      <TableCell className="font-mono text-xs">{log.user_id?.slice(0, 8)}...</TableCell>
                      <TableCell>{log.action}</TableCell>
                      <TableCell>
                        <Badge variant={log.status === "success" ? "default" : "destructive"}>
                          {log.status || "success"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
