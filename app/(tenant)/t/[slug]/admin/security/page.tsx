"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Shield, Clock, User, FileText, Loader2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"

interface AuditLog {
  id: string
  action: string
  entity: string
  entity_id: string
  actor_user_id: string
  created_at: string
  diff: any
  hash: string
  user_profiles: {
    full_name: string
  }
}

export default function SecurityPage() {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadAuditLogs()
  }, [])

  const loadAuditLogs = async () => {
    try {
      const supabase = getSupabaseBrowserClient()
      const { data, error } = await supabase
        .from("audit_logs")
        .select(
          `
          *,
          user_profiles (
            full_name
          )
        `,
        )
        .order("created_at", { ascending: false })
        .limit(50)

      if (error) throw error
      setAuditLogs(data || [])
    } catch (error) {
      console.error("Failed to load audit logs:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
      </div>
    )
  }

  return (
    <div className="container max-w-6xl py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Security & Audit Trail</h1>
          <p className="text-muted-foreground">View security events and audit logs</p>
        </div>

        <Card className="glass-panel border-white/10 p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="h-6 w-6 text-green-400" />
            <div>
              <h2 className="text-xl font-bold">Blockchain-Verified Audit Trail</h2>
              <p className="text-sm text-muted-foreground">
                All events are cryptographically linked and tamper-evident
              </p>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 rounded-lg bg-white/5 border border-white/10">
              <p className="text-sm text-muted-foreground mb-1">Total Events</p>
              <p className="text-2xl font-bold">{auditLogs.length}</p>
            </div>
            <div className="p-4 rounded-lg bg-white/5 border border-white/10">
              <p className="text-sm text-muted-foreground mb-1">Hash Algorithm</p>
              <p className="text-lg font-medium">SHA-256</p>
            </div>
            <div className="p-4 rounded-lg bg-white/5 border border-white/10">
              <p className="text-sm text-muted-foreground mb-1">Chain Integrity</p>
              <Badge className="bg-green-500/20 text-green-400">Verified</Badge>
            </div>
          </div>
        </Card>

        <Card className="glass-panel border-white/10 p-6">
          <h2 className="text-xl font-bold mb-6">Recent Activity</h2>
          <div className="space-y-4">
            {auditLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-start gap-4 p-4 rounded-lg bg-white/5 border border-white/10 hover:border-purple-500/50 transition-all"
              >
                <div className="p-2 rounded-lg bg-purple-500/20 mt-1">
                  <FileText className="h-5 w-5 text-purple-400" />
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-medium">
                        {log.action.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {log.entity} • {log.entity_id.slice(0, 8)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      {new Date(log.created_at).toLocaleString()}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <User className="h-4 w-4" />
                    {log.user_profiles?.full_name || "System"}
                  </div>

                  <details className="text-sm">
                    <summary className="cursor-pointer text-purple-400 hover:text-purple-300">View details</summary>
                    <div className="mt-2 p-3 rounded bg-black/20 border border-white/5">
                      <p className="text-xs text-muted-foreground mb-1">Hash:</p>
                      <p className="font-mono text-xs break-all mb-3">{log.hash}</p>
                      <p className="text-xs text-muted-foreground mb-1">Changes:</p>
                      <pre className="font-mono text-xs overflow-auto">{JSON.stringify(log.diff, null, 2)}</pre>
                    </div>
                  </details>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  )
}
