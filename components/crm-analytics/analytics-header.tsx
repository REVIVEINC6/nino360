"use client"

import { Button } from "@/components/ui/button"
import { Download, RefreshCw, Calendar } from "lucide-react"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"

async function fetchJson(url: string, opts?: RequestInit) {
  const res = await fetch(url, opts)
  if (!res.ok) throw new Error(`Request failed: ${res.status}`)
  return res.json()
}

export function AnalyticsHeader() {
  const [refreshing, setRefreshing] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [aiRunning, setAiRunning] = useState(false)

  async function onRefresh() {
    try {
      setRefreshing(true)
      await fetchJson("/api/crm/analytics/refresh")
    } catch (e) {
      console.error("Refresh failed:", e)
    } finally {
      setRefreshing(false)
    }
  }

  async function onExport() {
    try {
      setExporting(true)
      const res = await fetch("/api/crm/analytics/export")
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
      // In a real app we'd surface the text in a drawer/modal. For now, log it and
      // optionally display a notification in the UI.
    } catch (e) {
      console.error("AI Digest failed:", e)
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
        <Button variant="outline" size="sm" className="glass-card bg-transparent" onClick={onAiDigest} disabled={aiRunning}>
          <Calendar className="mr-2 h-4 w-4" />
          {aiRunning ? "Analyzing…" : "AI Digest"}
        </Button>
        <Button variant="outline" size="sm" className="glass-card bg-transparent" onClick={onRefresh} disabled={refreshing}>
          <RefreshCw className="mr-2 h-4 w-4" />
          {refreshing ? "Refreshing…" : "Refresh"}
        </Button>
        <Button variant="outline" size="sm" className="glass-card bg-transparent" onClick={onExport} disabled={exporting}>
          <Download className="mr-2 h-4 w-4" />
          {exporting ? "Exporting…" : "Export"}
        </Button>
      </div>
    </motion.div>
  )
}
