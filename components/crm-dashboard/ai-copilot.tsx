"use client"

import { useState, useTransition } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sparkles, ArrowRight } from "lucide-react"
import { aiDigest } from "@/app/(dashboard)/crm/dashboard/actions"
import { toast } from "sonner"
import Link from "next/link"

interface AiCopilotProps {
  from: string
  to: string
}

export function AiCopilot({ from, to }: AiCopilotProps) {
  const [digest, setDigest] = useState<{
    text: string
    actions: Array<{ label: string; href: string }>
    tokens: number
    cost: number
  } | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleGenerate = () => {
    startTransition(async () => {
      try {
        const result = await aiDigest({ from, to })
        setDigest(result)
      } catch (error) {
        toast.error("Failed to generate AI digest")
      }
    })
  }

  return (
    <Card className="glass-panel border-[#D0FF00]/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-[#D0FF00]" />
          AI Copilot
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!digest ? (
          <div className="text-center py-8">
            <p className="text-sm text-muted-foreground mb-4">Get AI-powered insights and recommendations</p>
            <Button
              onClick={handleGenerate}
              disabled={isPending}
              className="bg-linear-to-r from-[#4F46E5] to-[#8B5CF6]"
            >
              {isPending ? "Generating..." : "Summarize Period"}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <p className="text-sm whitespace-pre-wrap">{digest.text}</p>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground">Recommended Actions:</p>
              {digest.actions.map((action, i) => (
                <Link key={i} href={action.href}>
                  <Button variant="outline" size="sm" className="w-full justify-between bg-transparent">
                    {action.label}
                    <ArrowRight className="h-3 w-3" />
                  </Button>
                </Link>
              ))}
            </div>

            <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border/50">
              <span>{digest.tokens} tokens</span>
              <span>${digest.cost.toFixed(4)} cost</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
