"use client"

import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import type { ReactNode } from "react"

interface GlassPanelProps {
  children: ReactNode
  className?: string
  gradient?: boolean
  hover?: boolean
}

export function GlassPanel({ children, className, gradient = false, hover = true }: GlassPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "relative overflow-hidden rounded-xl backdrop-blur-xl bg-white/80 border border-slate-200/50 shadow-lg",
        hover && "hover:shadow-xl hover:border-slate-300/50 transition-all duration-300",
        gradient &&
          "before:absolute before:inset-0 before:bg-linear-to-br before:from-blue-500/5 before:via-purple-500/5 before:to-pink-500/5 before:pointer-events-none",
        className,
      )}
    >
      {children}
    </motion.div>
  )
}
