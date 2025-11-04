"use client"

import { AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ErrorStateProps {
  onRetry: () => void
}

export function ErrorState({ onRetry }: ErrorStateProps) {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-white/20 bg-white/5 p-12 text-center backdrop-blur-xl">
      <AlertCircle className="mb-4 h-12 w-12 text-red-500/60" />
      <h3 className="mb-2 text-lg font-semibold text-white">Failed to load tenants</h3>
      <p className="mb-6 max-w-sm text-sm text-white/60">
        There was an error loading your organizations. Please try again.
      </p>
      <Button onClick={onRetry} variant="outline" className="border-white/20 bg-transparent">
        Retry
      </Button>
    </div>
  )
}
