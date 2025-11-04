"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Shield, Search, Download, CheckCircle2, Clock, AlertCircle, ExternalLink } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface AuditViewProps {
  auditLogs: any[]
}

export function AuditView({ auditLogs }: AuditViewProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredLogs = auditLogs.filter(
    (log) =>
      log.action_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.data_hash?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const stats = {
    total: auditLogs.length,
    verified: auditLogs.filter((log) => log.verification_status === "verified").length,
    pending: auditLogs.filter((log) => log.verification_status === "pending").length,
    failed: auditLogs.filter((log) => log.verification_status === "failed").length,
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Shield className="h-8 w-8 text-blue-500" />
            Blockchain Audit Trail
          </h1>
          <p className="text-muted-foreground">Tamper-proof verification of all applicant activities</p>
        </div>
        <Button>
          <Download className="mr-2 h-4 w-4" />
          Export Audit Log
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-6 bg-linear-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Records</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
            <Shield className="h-8 w-8 text-blue-500" />
          </div>
        </Card>

        <Card className="p-6 bg-linear-to-br from-green-500/10 to-emerald-500/10 border-green-500/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Verified</p>
              <p className="text-2xl font-bold">{stats.verified}</p>
            </div>
            <CheckCircle2 className="h-8 w-8 text-green-500" />
          </div>
        </Card>

        <Card className="p-6 bg-linear-to-br from-yellow-500/10 to-orange-500/10 border-yellow-500/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Pending</p>
              <p className="text-2xl font-bold">{stats.pending}</p>
            </div>
            <Clock className="h-8 w-8 text-yellow-500" />
          </div>
        </Card>

        <Card className="p-6 bg-linear-to-br from-red-500/10 to-pink-500/10 border-red-500/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Failed</p>
              <p className="text-2xl font-bold">{stats.failed}</p>
            </div>
            <AlertCircle className="h-8 w-8 text-red-500" />
          </div>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by action type or hash..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Audit Logs */}
      <Card className="p-6">
        <div className="space-y-4">
          {filteredLogs.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No audit logs found</p>
          ) : (
            filteredLogs.map((log) => (
              <div key={log.id} className="p-4 bg-muted/50 rounded-lg border border-border">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{log.action_type}</span>
                      <Badge variant={log.verification_status === "verified" ? "default" : "secondary"}>
                        {log.verification_status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{new Date(log.created_at).toLocaleString()}</p>
                  </div>
                  {log.verification_status === "verified" && <CheckCircle2 className="h-5 w-5 text-green-600" />}
                  {log.verification_status === "pending" && <Clock className="h-5 w-5 text-yellow-600" />}
                  {log.verification_status === "failed" && <AlertCircle className="h-5 w-5 text-red-600" />}
                </div>

                <div className="grid gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground w-24">Data Hash:</span>
                    <code className="flex-1 px-2 py-1 bg-background rounded font-mono text-xs truncate">
                      {log.data_hash}
                    </code>
                  </div>

                  {log.previous_hash && (
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground w-24">Previous:</span>
                      <code className="flex-1 px-2 py-1 bg-background rounded font-mono text-xs truncate">
                        {log.previous_hash}
                      </code>
                    </div>
                  )}

                  {log.blockchain_tx_hash && (
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground w-24">Transaction:</span>
                      <code className="flex-1 px-2 py-1 bg-background rounded font-mono text-xs truncate">
                        {log.blockchain_tx_hash}
                      </code>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0"
                        onClick={() => window.open(`https://etherscan.io/tx/${log.blockchain_tx_hash}`, "_blank")}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  )}

                  {log.metadata && (
                    <div className="flex items-start gap-2">
                      <span className="text-muted-foreground w-24">Metadata:</span>
                      <pre className="flex-1 px-2 py-1 bg-background rounded text-xs overflow-x-auto">
                        {JSON.stringify(log.metadata, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  )
}
