"use client"

import { Button } from "@/components/ui/button"
import { Plus, RefreshCw, Download, Settings } from "lucide-react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

export function PipelineHeader() {
  const router = useRouter()

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-header flex items-center justify-between"
    >
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          Sales Pipeline
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">AI-powered opportunity management with predictive insights</p>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm" className="glass-card bg-transparent">
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
        <Button variant="outline" size="sm" className="glass-card bg-transparent">
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
        <Button variant="outline" size="sm" className="glass-card bg-transparent">
          <Settings className="mr-2 h-4 w-4" />
          Configure
        </Button>
        <Button
          onClick={() => router.push("/crm/opportunities/new")}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Opportunity
        </Button>
      </div>
    </motion.div>
  )
}
