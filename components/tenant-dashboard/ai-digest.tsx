"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bot, RefreshCw, Sparkles } from "lucide-react"
import { useState } from "react"
import { getAiDigest } from "@/app/(dashboard)/tenant/dashboard/actions"

interface AiDigestProps {
  initialDigest: {
    text: string
    tokens: number
    cost: number
  }
  dateRange: {
    from: string
    to: string
  }
}

export function AiDigest({ initialDigest, dateRange }: AiDigestProps) {
  const [digest, setDigest] = useState(initialDigest)
  const [isRegenerating, setIsRegenerating] = useState(false)

  const handleRegenerate = async () => {
    setIsRegenerating(true)
    try {
      const result = await getAiDigest()
      if ("error" in result) {
        console.error("Failed to regenerate digest:", result.error)
      } else {
        setDigest(result)
      }
    } finally {
      setIsRegenerating(false)
    }
  }

  return (
    <div className="animate-fade-in">
      <Card className="glass-card p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">AI Weekly Digest</h3>
            <Sparkles className="h-4 w-4 text-yellow-500" />
          </div>
          <Button variant="ghost" size="sm" onClick={handleRegenerate} disabled={isRegenerating}>
            <RefreshCw className={`h-4 w-4 ${isRegenerating ? "animate-spin" : ""}`} />
          </Button>
        </div>
        <div className="space-y-4">
          <p className="text-sm leading-relaxed text-foreground/90">{digest.text}</p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>{digest.tokens} tokens</span>
            <span>•</span>
            <span>${digest.cost.toFixed(4)} cost</span>
          </div>
        </div>
      </Card>
    </div>
  )
}
