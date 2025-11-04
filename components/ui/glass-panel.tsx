import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

interface GlassPanelProps {
  children: ReactNode
  className?: string
  gradient?: boolean
}

export function GlassPanel({ children, className, gradient = false }: GlassPanelProps) {
  return (
    <div
      className={cn(
        "relative rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl",
        gradient && "bg-linear-to-br from-white/10 to-white/5",
        className,
      )}
    >
      {children}
    </div>
  )
}
