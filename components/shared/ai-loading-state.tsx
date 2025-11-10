"use client"

import { Brain, Loader2 } from "lucide-react"
import { motion } from "framer-motion"

interface AILoadingStateProps {
  message?: string
}

export function AILoadingState({ message = "AI is thinking..." }: AILoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-4">
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
        className="relative"
      >
        <div className="absolute inset-0 bg-linear-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full blur-xl opacity-50" />
        <div className="relative p-4 rounded-full bg-white/80 backdrop-blur-xl border border-slate-200/50">
          <Brain className="h-8 w-8 text-indigo-600" />
        </div>
      </motion.div>
      <div className="flex items-center gap-2 text-slate-600">
        <Loader2 className="h-4 w-4 animate-spin" />
        <p className="text-sm font-medium">{message}</p>
      </div>
    </div>
  )
}
