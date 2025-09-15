"use client"

import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Shield, CheckCircle, AlertTriangle } from "lucide-react"

interface BlockchainBadgeProps {
  verified?: boolean
  hash?: string
  timestamp?: Date
  action?: string
}

export function BlockchainBadge({
  verified = true,
  hash = "0x1a2b3c4d5e6f...",
  timestamp = new Date(),
  action = "Published",
}: BlockchainBadgeProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge
            variant="outline"
            className={`flex items-center gap-1 ${
              verified
                ? "text-green-700 bg-green-50 border-green-200"
                : "text-orange-700 bg-orange-50 border-orange-200"
            }`}
          >
            {verified ? <CheckCircle className="h-3 w-3" /> : <AlertTriangle className="h-3 w-3" />}
            <Shield className="h-3 w-3" />
            Blockchain
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <div className="space-y-1 text-xs">
            <div>
              <strong>Action:</strong> {action}
            </div>
            <div>
              <strong>Hash:</strong> {hash}
            </div>
            <div>
              <strong>Timestamp:</strong> {timestamp.toLocaleString()}
            </div>
            <div>
              <strong>Status:</strong> {verified ? "Verified" : "Pending"}
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
