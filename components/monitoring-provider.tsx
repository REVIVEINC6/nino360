"use client"

import type React from "react"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { monitoring } from "@/lib/monitoring"

export function MonitoringProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  // Initialize monitoring on mount
  useEffect(() => {
    monitoring.init()
  }, [])

  // Track page views on route change
  useEffect(() => {
    if (pathname) {
      monitoring.trackPageView(pathname)
    }
  }, [pathname])

  return <>{children}</>
}
