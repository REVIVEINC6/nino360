"use client"

import { useEffect } from "react"
import { AlertTriangle } from "lucide-react"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log to error reporting service
    console.error("Global error:", error)
  }, [error])

  return (
    <html>
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-8">
          <div className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-8 w-8" />
            <h1 className="text-2xl font-bold">Application Error</h1>
          </div>
          <p className="text-center text-gray-600 max-w-md">
            A critical error occurred. Please refresh the page or contact support if the problem persists.
          </p>
          <button onClick={reset} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Try again
          </button>
        </div>
      </body>
    </html>
  )
}
