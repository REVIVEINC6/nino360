"use client"

import type * as React from "react"
import { ThemeProvider } from "@/components/layout/theme-provider"

export default function ThemeProviderWrapper({ children, ...props }: { children: React.ReactNode }) {
  // Re-export ThemeProvider as a client-only wrapper so server layouts can import it dynamically
  return <ThemeProvider {...(props as any)}>{children}</ThemeProvider>
}
