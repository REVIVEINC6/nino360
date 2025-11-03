"use client"

import { Shield } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function AnchorBadge({ status }: { status?: string }) {
  if (status !== "anchored") return null
  return (
    <Badge variant="secondary" className="bg-purple-500/20 text-purple-300">
      <Shield className="h-3 w-3 mr-1" /> Anchored
    </Badge>
  )
}
