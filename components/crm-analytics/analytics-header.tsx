"use client"

import { Button } from "@/components/ui/button"
import { Download, RefreshCw, Calendar } from "lucide-react"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"

export function AnalyticsHeader() {
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
        <Button variant="outline" size="sm" className="glass-card bg-transparent">
          <Calendar className="mr-2 h-4 w-4" />
          Date Range
        </Button>
        <Button variant="outline" size="sm" className="glass-card bg-transparent">
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
        <Button variant="outline" size="sm" className="glass-card bg-transparent">
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>
    </motion.div>
  )
}
