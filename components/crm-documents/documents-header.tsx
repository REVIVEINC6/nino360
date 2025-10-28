"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, Filter, Download, Sparkles } from "lucide-react"
import { motion } from "framer-motion"

export function DocumentsHeader() {
  return (
    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="glass-header p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Documents & Proposals
          </h1>
          <p className="text-muted-foreground mt-1">AI-powered document management with smart insights</p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" className="glass-panel bg-transparent">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <Plus className="mr-2 h-4 w-4" />
            Create Document
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search documents..." className="pl-10 glass-panel" />
        </div>

        <Button variant="outline" className="glass-panel bg-transparent">
          <Filter className="mr-2 h-4 w-4" />
          Filters
        </Button>

        <Button variant="outline" className="glass-panel ai-glow bg-transparent">
          <Sparkles className="mr-2 h-4 w-4" />
          AI Insights
        </Button>
      </div>
    </motion.div>
  )
}
