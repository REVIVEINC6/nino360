"use client"

import React from "react"

interface ScopesPanelProps {
  context?: any
  onUpdate?: () => void
}

export function ScopesPanel({ context, onUpdate }: ScopesPanelProps) {
  return (
    <div className="p-4">
      <p className="text-sm text-muted-foreground">Scopes panel placeholder</p>
    </div>
  )
}

export default ScopesPanel
