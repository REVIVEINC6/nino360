"use client"

import type * as React from "react"
import { ErrorBoundary } from "@/components/error-boundary"

export default function ErrorBoundaryWrapper({ children }: { children: React.ReactNode }) {
  return <ErrorBoundary>{children}</ErrorBoundary>
}
