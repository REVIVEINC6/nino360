"use client"

import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"
import { motion } from "framer-motion"

export function EngagementHeader() {
  return (
    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="glass-header p-6 rounded-xl">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Customer Engagement
            </h1>
            <Sparkles className="h-6 w-6 text-purple-500" />
          </div>
          <p className="text-muted-foreground mt-2">AI-powered sequences, templates, and campaigns</p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" className="glass-panel bg-transparent">
            <Sparkles className="mr-2 h-4 w-4" />
            AI Optimize All
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
