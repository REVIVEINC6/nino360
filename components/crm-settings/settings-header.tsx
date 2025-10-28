"use client"

import { Settings, Sparkles } from "lucide-react"
import { motion } from "framer-motion"

export function CRMSettingsHeader() {
  return (
    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="glass-panel p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-sm">
            <Settings className="h-8 w-8 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              CRM Settings
            </h1>
            <p className="text-muted-foreground flex items-center gap-2 mt-1">
              <Sparkles className="h-4 w-4 text-purple-500" />
              Configure stages, SLAs, dedupe rules, and AI preferences
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
