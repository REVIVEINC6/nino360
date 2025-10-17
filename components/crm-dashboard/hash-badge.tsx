"use client"

import { Button } from "@/components/ui/button"
import { Hash } from "lucide-react"

interface HashBadgeProps {
  hash: string
  onVerify: () => void
}

export function HashBadge({ hash, onVerify }: HashBadgeProps) {
  return (
    <Button variant="ghost" size="sm" onClick={onVerify} className="h-6 px-2 text-xs font-mono">
      <Hash className="h-3 w-3 mr-1" />
      {hash.slice(0, 6)}...
    </Button>
  )
}
