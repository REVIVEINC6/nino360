"use client"

import { Button } from "@/components/ui/button"
import { Download, RefreshCw, Calendar } from "lucide-react"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"

async function fetchJson(url: string, opts?: RequestInit) {
  const res = await fetch(url, opts)
  if (!res.ok) throw new Error(`Request failed: ${res.status}`)
  return res.json()
}

export function AnalyticsHeader() {
  const [refreshing, setRefreshing] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [aiRunning, setAiRunning] = useState(false)
  const [canRead, setCanRead] = useState(false)
  const [canAi, setCanAi] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    let mounted = true
    async function loadPermissions() {
      try {
        const res = await fetch('/api/auth/post-login')
        if (!res.ok) throw new Error(`Auth fetch failed: ${res.status}`)
        const json = await res.json()
        // Expecting { role: string, permissions?: string[] }
        const perms: string[] = json.permissions || []
        if (!mounted) return
        setCanRead(perms.includes('crm:analytics:read'))
        setCanAi(perms.includes('crm:analytics:ai'))
      } catch (e) {
        console.error('Failed to load permissions', e)
        // Keep conservative defaults (buttons disabled)
        if (mounted) {
          setCanRead(false)
          setCanAi(false)
        }
      }
    }

    loadPermissions()
    return () => {
      mounted = false
    }
  }, [])

  async function onRefresh() {
    try {
      setRefreshing(true)
      const body = await fetchJson('/api/crm/analytics/refresh')
      toast({ title: 'Refresh started', description: 'Analytics refresh queued' })
      return body
    } catch (e) {
      console.error("Refresh failed:", e)
      toast({ title: 'Refresh failed', description: String(e) })
    } finally {
      setRefreshing(false)
    }
  }

  async function onExport() {
    try {
      setExporting(true)
      const res = await fetch('/api/crm/analytics/export')
      if (!res.ok) throw new Error("Export failed")
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "opportunities.csv"
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    } catch (e) {
      console.error("Export failed:", e)
      toast({ title: 'Export failed', description: String(e) })
    } finally {
      setExporting(false)
    }
  }

  async function onAiDigest() {
    try {
      setAiRunning(true)
      const now = new Date()
      const from = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString()
      const to = now.toISOString()
      const body = await fetchJson("/api/crm/analytics/ai-digest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ from, to }),
      })
      console.log("AI Digest result:", body)
      toast({ title: 'AI Digest ready', description: 'Check the activity log or AI panel for results' })
    } catch (e) {
      console.error("AI Digest failed:", e)
      toast({ title: 'AI Digest failed', description: String(e) })
    } finally {
      setAiRunning(false)
    }
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-header flex items-center justify-between"
    >
      <div>
        <h1 className="text-3xl font-bold bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          CRM Analytics
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          AI-powered insights with predictive analytics and attribution modeling
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Badge className="ai-glow">ML-Powered</Badge>
        <Button
          variant="outline"
          size="sm"
          className="glass-card bg-transparent"
          onClick={onAiDigest}
          disabled={aiRunning || !canAi}
          title={!canAi ? 'You do not have permission to run AI digests' : undefined}
        >
          <Calendar className="mr-2 h-4 w-4" />
          {aiRunning ? "Analyzing…" : "AI Digest"}
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="glass-card bg-transparent"
          onClick={onRefresh}
          disabled={refreshing || !canRead}
          title={!canRead ? 'You do not have permission to refresh analytics' : undefined}
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          {refreshing ? "Refreshing…" : "Refresh"}
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="glass-card bg-transparent"
          onClick={onExport}
          disabled={exporting || !canRead}
          title={!canRead ? 'You do not have permission to export analytics' : undefined}
        >
          <Download className="mr-2 h-4 w-4" />
          {exporting ? "Exporting…" : "Export"}
        </Button>
      </div>
    </motion.div>
  )
}
