"use client"

import { useEffect } from "react"
import { AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { logger } from "@/lib/logger"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    if (error.message !== "Redirect") {
      logger.error("Next.js Error boundary caught an error", error, {
        digest: error.digest,
      })
    }
  }, [error])

  if (error.message === "Redirect") {
    return null
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-8">
      <div className="flex items-center gap-2 text-destructive">
        <AlertTriangle className="h-8 w-8" />
        <h1 className="text-2xl font-bold">Something went wrong</h1>
      </div>
      <p className="text-center text-muted-foreground max-w-md">{error.message || "An unexpected error occurred"}</p>
      <div className="flex gap-2">
        <Button onClick={reset}>Try again</Button>
        <Button variant="outline" onClick={() => (window.location.href = "/")}>
          Go home
        </Button>
      </div>
    </div>
  )
}
