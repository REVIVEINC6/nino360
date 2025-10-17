"use client"

import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

interface PageSidebarProps {
  children: ReactNode
  className?: string
  position?: "left" | "right"
  width?: string
}

export function PageSidebar({ children, className, position = "right", width = "w-80" }: PageSidebarProps) {
  return (
    <aside
      className={cn(
        "border-border bg-muted/10 overflow-auto",
        width,
        position === "left" ? "border-r" : "border-l",
        className,
      )}
    >
      <div className="p-6 space-y-6">{children}</div>
    </aside>
  )
}

interface PageSidebarSectionProps {
  children: ReactNode
  className?: string
}

export function PageSidebarSection({ children, className }: PageSidebarSectionProps) {
  return <div className={cn("space-y-4", className)}>{children}</div>
}
