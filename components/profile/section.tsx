"use client"

import { motion } from "framer-motion"
import type { ReactNode } from "react"

interface SectionProps {
  title: string
  description?: string
  children: ReactNode
  className?: string
}

export function Section({ title, description, children, className = "" }: SectionProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-6 shadow-[0_0_1px_#ffffff33] ${className}`}
    >
      <div className="mb-6">
        <h2 className="text-xl font-bold bg-gradient-to-r from-[#4F46E5] via-[#8B5CF6] to-[#A855F7] bg-clip-text text-transparent">
          {title}
        </h2>
        {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
      </div>
      {children}
    </motion.section>
  )
}
