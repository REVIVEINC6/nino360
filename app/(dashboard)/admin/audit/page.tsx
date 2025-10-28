"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"

export default function AuditPage() {
  const [rows, setRows] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = getSupabaseBrowserClient()

    async function loadAuditLogs() {
      const { data, error } = await supabase
        .from("audit_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(200)

      if (!error && data) {
        setRows(data)
      }
      setLoading(false)
    }

    loadAuditLogs()

    // Realtime updates (guarded - channel API may not exist depending on runtime)
    let channel: any = null
    try {
      if (typeof supabase.channel === "function") {
        channel = supabase.channel("audit-logs")
        channel = channel
          .on(
            "postgres_changes",
            { event: "INSERT", schema: "sec", table: "audit_logs" },
            (payload: any) => {
              console.log("[v0] New audit log:", payload)
              setRows((prev: any[]) => [payload.new, ...prev].slice(0, 200))
            },
          )
          .subscribe()
      }
    } catch (e) {
      // ignore realtime setup errors in environments where realtime is unsupported
      console.warn("[v0] Realtime setup failed:", e)
      channel = null
    }

    return () => {
      try {
        supabase.removeChannel?.(channel)
      } catch (e) {
        // ignore cleanup errors
      }
    }
  }, [])

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Audit Logs</h1>
        <p className="text-muted-foreground">System activity and security events</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Last 200 audit events</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Loading...</div>
          ) : (
            <div className="border rounded-lg">
              <table className="w-full text-sm">
                <thead className="border-b bg-muted/50">
                  <tr>
                    <th className="p-3 text-left">Time</th>
                    <th className="p-3 text-left">Action</th>
                    <th className="p-3 text-left">Resource</th>
                    <th className="p-3 text-left">User</th>
                    <th className="p-3 text-left">Payload</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.id} className="border-b hover:bg-muted/50">
                      <td className="p-3 text-muted-foreground">{new Date(r.created_at).toLocaleString()}</td>
                      <td className="p-3">
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">{r.action}</span>
                      </td>
                      <td className="p-3 font-medium">{r.resource}</td>
                      <td className="p-3 text-muted-foreground text-xs">{r.user_id?.slice(0, 8)}...</td>
                      <td className="p-3">
                        <pre className="text-xs text-muted-foreground max-w-md overflow-auto">
                          {JSON.stringify(r.payload, null, 2)}
                        </pre>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
