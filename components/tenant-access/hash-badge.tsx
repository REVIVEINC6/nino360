"use client"

import React from "react"

export function HashBadge({ hash, size = "sm" }: { hash?: string; size?: "sm" | "md" | "lg" }) {
  if (!hash) return null
  return (
    <span className={`inline-flex items-center rounded px-2 py-0.5 text-xs bg-gray-100 text-gray-800`}>
      {hash.slice(0, 8)}
    </span>
  )
}

export default HashBadge
