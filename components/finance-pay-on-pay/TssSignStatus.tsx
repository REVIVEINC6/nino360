"use client"

import { Badge } from "@/components/ui/badge"

export function TssSignStatus({ status }: { status?: string }) {
  const map: Record<string, string> = {
    signing: "bg-yellow-500/20 text-yellow-300",
    signed: "bg-blue-500/20 text-blue-300",
    submitted: "bg-cyan-500/20 text-cyan-300",
    completed: "bg-green-500/20 text-green-300",
    failed: "bg-red-500/20 text-red-300",
  }
  const cls = map[status || ""] || "bg-gray-500/20 text-gray-300"
  return (
    <Badge variant="secondary" className={cls}>
      {status || "pending"}
    </Badge>
  )
}
