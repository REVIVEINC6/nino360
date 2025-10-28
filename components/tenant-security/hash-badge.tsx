"use client"

import { Badge } from "@/components/ui/badge"
import { Shield } from "lucide-react"

export function HashBadge({ hash }: { hash: string }) {
  return (
    <Badge variant="outline" className="gap-2">
      <Shield className="w-3 h-3" />
      Chain: {hash.substring(0, 8)}...
    </Badge>
  )
}
