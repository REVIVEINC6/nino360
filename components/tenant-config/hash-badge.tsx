"use client"

import { Badge } from "@/components/ui/badge"
import { Shield } from "lucide-react"

export function HashBadge() {
  return (
    <Badge variant="outline" className="gap-2">
      <Shield className="h-3 w-3" />
      <span className="font-mono text-xs">abc123...</span>
    </Badge>
  )
}
