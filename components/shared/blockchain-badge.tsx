"use client"

import { Badge } from "@/components/ui/badge"
import { Shield, Check } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface BlockchainBadgeProps {
  hash?: string
  verified?: boolean
  timestamp?: string
  size?: "sm" | "md" | "lg" | string
}

export function BlockchainBadge({ hash, verified, timestamp, size = "md" }: BlockchainBadgeProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
            <Badge
              variant={verified ? "default" : "secondary"}
              className={"gap-1.5 cursor-help bg-linear-to-r from-emerald-500 to-teal-500 text-white border-0"}
              >
            {verified ? <Check className="h-3 w-3" /> : <Shield className="h-3 w-3" />}
            Blockchain Verified
          </Badge>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <div className="space-y-1">
            <p className="font-semibold">Blockchain Audit Trail</p>
            <p className="text-xs text-muted-foreground">Hash: {hash ? `${hash.slice(0, 16)}...` : "N/A"}</p>
            {timestamp && <p className="text-xs text-muted-foreground">Verified: {timestamp}</p>}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
