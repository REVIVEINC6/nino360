"use client"

import { Component, type ReactNode } from "react"
import { AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { logger } from "@/lib/logger"

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

function isNextNavigationError(error: Error): boolean {
  // Next.js redirect and notFound errors have specific properties
  return (
    error.message === "NEXT_REDIRECT" ||
    error.message === "NEXT_NOT_FOUND" ||
    error.message === "Redirect" ||
    error.message.includes("NEXT_REDIRECT") ||
    error.message.includes("NEXT_NOT_FOUND") ||
    (error as any).digest?.startsWith("NEXT_REDIRECT") ||
    (error as any).digest?.startsWith("NEXT_NOT_FOUND")
  )
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    if (isNextNavigationError(error)) {
      throw error
    }
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    if (isNextNavigationError(error)) {
      throw error
    }

    logger.error("React Error Boundary caught an error", error, {
      componentStack: errorInfo.componentStack,
    })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 p-8">
          <div className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-6 w-6" />
            <h2 className="text-xl font-semibold">Something went wrong</h2>
          </div>
          <p className="text-center text-muted-foreground max-w-md">
            {this.state.error?.message || "An unexpected error occurred"}
          </p>
          <Button
            onClick={() => {
              this.setState({ hasError: false, error: undefined })
              window.location.reload()
            }}
          >
            Reload Page
          </Button>
        </div>
      )
    }

    return this.props.children
  }
}
