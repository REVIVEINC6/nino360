"use client"

import React from "react"

export function ErrorState({ message, onRetry }: { message?: string | null; onRetry?: () => void }) {
  return (
    <div className="p-6 text-center">
      <p className="mb-4 text-red-600">{message || "An error occurred"}</p>
      {onRetry && (
        <button onClick={onRetry} className="mt-2 underline">
          Retry
        </button>
      )}
    </div>
  )
}

export default ErrorState
