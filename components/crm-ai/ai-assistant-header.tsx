"use client"

import { Bot, Sparkles } from "lucide-react"
import { motion } from "framer-motion"

export function AIAssistantHeader() {
  return (
    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="glass-panel p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-lg opacity-50" />
            <div className="relative bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-full">
              <Bot className="h-6 w-6 text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI Assistant
            </h1>
            <p className="text-sm text-muted-foreground">Your intelligent CRM companion powered by GPT-4o</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20">
            <Sparkles className="h-4 w-4 text-blue-500" />
            <span className="text-sm font-medium">AI Powered</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
