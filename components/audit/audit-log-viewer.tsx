"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Shield, CheckCircle2, AlertTriangle, Search } from "lucide-react"
import { motion } from "framer-motion"

interface AuditLog {
  id: string
  created_at: string
  action: string
  entity: string
  entity_id: string
  user: { email: string }
  metadata: Record<string, any>
  diff: Record<string, any>
  hash: string
  prev_hash: string
}

interface AuditLogViewerProps {
  tenantId: string
}

export function AuditLogViewer({ tenantId }: AuditLogViewerProps) {
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [loading, setLoading] = useState(true)
  const [verifying, setVerifying] = useState(false)
  const [verification, setVerification] = useState<any>(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [entityFilter, setEntityFilter] = useState<string>("all")
  const [actionFilter, setActionFilter] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchLogs()
  }, [page, entityFilter, actionFilter])

  const fetchLogs = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        tenant_id: tenantId,
        page: page.toString(),
        limit: "20",
      })

      if (entityFilter !== "all") params.append("entity", entityFilter)
      if (actionFilter !== "all") params.append("action", actionFilter)

      const response = await fetch(`/api/audit/logs?${params}`)
      const data = await response.json()

      if (response.ok) {
        setLogs(data.logs)
        setTotalPages(data.totalPages)
      }
    } catch (error) {
      console.error("[v0] Error fetching audit logs:", error)
    } finally {
      setLoading(false)
    }
  }

  const verifyChain = async () => {
    setVerifying(true)
    try {
      const response = await fetch("/api/audit/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tenant_id: tenantId }),
      })

      const data = await response.json()
      setVerification(data)
    } catch (error) {
      console.error("[v0] Error verifying audit chain:", error)
    } finally {
      setVerifying(false)
    }
  }

  const filteredLogs = logs.filter((log) => {
    if (!searchTerm) return true
    const searchLower = searchTerm.toLowerCase()
    return (
      log.action.toLowerCase().includes(searchLower) ||
      log.entity.toLowerCase().includes(searchLower) ||
      log.user.email.toLowerCase().includes(searchLower)
    )
  })

  return (
    <div className="space-y-6">
      {/* Verification Status */}
      <Card className="glass-card border-neon p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="h-6 w-6 text-[#D0FF00]" />
            <div>
              <h3 className="font-semibold">Blockchain Verification</h3>
              <p className="text-sm text-muted-foreground">Hash-chained audit trail ensures tamper-evident logging</p>
            </div>
          </div>
          <Button
            onClick={verifyChain}
            disabled={verifying}
            className="bg-gradient-to-r from-[#D0FF00] to-[#F81CE5] text-black"
          >
            {verifying ? "Verifying..." : "Verify Chain"}
          </Button>
        </div>

        {verification && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 rounded-lg bg-background/50"
          >
            <div className="flex items-center gap-2 mb-2">
              {verification.valid ? (
                <>
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span className="font-semibold text-green-500">Chain Verified</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  <span className="font-semibold text-red-500">Chain Compromised</span>
                </>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              Total logs: {verification.totalLogs}
              {!verification.valid && ` | Invalid logs: ${verification.invalidLogs.length}`}
            </p>
          </motion.div>
        )}
      </Card>

      {/* Filters */}
      <Card className="glass-card border-neon p-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={entityFilter} onValueChange={setEntityFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by entity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All entities</SelectItem>
              <SelectItem value="tenant">Tenant</SelectItem>
              <SelectItem value="user">User</SelectItem>
              <SelectItem value="subscription">Subscription</SelectItem>
              <SelectItem value="invoice">Invoice</SelectItem>
              <SelectItem value="feature_flag">Feature Flag</SelectItem>
            </SelectContent>
          </Select>
          <Select value={actionFilter} onValueChange={setActionFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by action" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All actions</SelectItem>
              <SelectItem value="create">Create</SelectItem>
              <SelectItem value="update">Update</SelectItem>
              <SelectItem value="delete">Delete</SelectItem>
              <SelectItem value="login">Login</SelectItem>
              <SelectItem value="logout">Logout</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Audit Logs */}
      <div className="space-y-3">
        {loading ? (
          <Card className="glass-card border-neon p-6 text-center">
            <p className="text-muted-foreground">Loading audit logs...</p>
          </Card>
        ) : filteredLogs.length === 0 ? (
          <Card className="glass-card border-neon p-6 text-center">
            <p className="text-muted-foreground">No audit logs found</p>
          </Card>
        ) : (
          filteredLogs.map((log, index) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="glass-card border-neon p-4 hover:border-[#D0FF00] transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="outline" className="border-[#D0FF00]">
                        {log.action}
                      </Badge>
                      <Badge variant="outline" className="border-[#F81CE5]">
                        {log.entity}
                      </Badge>
                      <span className="text-sm text-muted-foreground">by {log.user.email}</span>
                    </div>
                    <p className="text-sm font-mono text-muted-foreground">Entity ID: {log.entity_id}</p>
                    {Object.keys(log.diff).length > 0 && (
                      <details className="text-sm">
                        <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                          View changes
                        </summary>
                        <pre className="mt-2 p-2 rounded bg-background/50 overflow-x-auto">
                          {JSON.stringify(log.diff, null, 2)}
                        </pre>
                      </details>
                    )}
                    <p className="text-xs text-muted-foreground font-mono">Hash: {log.hash.substring(0, 16)}...</p>
                  </div>
                  <div className="text-right text-sm text-muted-foreground">
                    {new Date(log.created_at).toLocaleString()}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button variant="outline" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  )
}
