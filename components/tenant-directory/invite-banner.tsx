"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail, X } from "lucide-react"

interface InviteBannerProps {
  count: number
  onAcceptAll?: () => void
  onDismiss?: () => void
}

export function InviteBanner({ count, onAcceptAll, onDismiss }: InviteBannerProps) {
  if (count === 0) return null

  return (
  <Card className="border-[#F81CE5]/30 bg-linear-to-r from-[#F81CE5]/10 to-[#D0FF00]/10 p-4 backdrop-blur-xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Mail className="h-5 w-5 text-[#F81CE5]" />
          <div>
            <p className="font-medium text-white">
              You have {count} pending invitation{count > 1 ? "s" : ""}
            </p>
            <p className="text-sm text-white/60">Review and accept to join these organizations</p>
          </div>
        </div>
          <div className="flex gap-2">
            <Button
              onClick={() => onAcceptAll?.()}
              size="sm"
              className="bg-linear-to-r from-[#4F46E5] to-[#8B5CF6] hover:from-[#4338CA] hover:to-[#7C3AED]"
            >
              Accept All
            </Button>
            <Button onClick={() => onDismiss?.()} size="sm" variant="ghost" className="text-white/60">
              <X className="h-4 w-4" />
            </Button>
          </div>
      </div>
    </Card>
  )
}
