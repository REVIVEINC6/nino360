"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Loader2 } from "lucide-react"
import { askCopilot } from "@/app/(dashboard)/dashboard/actions"
import { motion, AnimatePresence } from "framer-motion"

export function CopilotTile() {
  const [question, setQuestion] = useState("")
  const [answer, setAnswer] = useState<string | null>(null)
  const [tokens, setTokens] = useState(0)
  const [cost, setCost] = useState(0)
  const [sources, setSources] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  const handleAsk = async () => {
    if (!question.trim() || loading) return

    setLoading(true)
    setAnswer(null)

    try {
      const response = await askCopilot({ question })
      setAnswer(response.answer)
      setTokens(response.tokens)
      setCost(response.cost)
      setSources(response.sources)
    } catch (error) {
      console.error("[v0] Error asking copilot:", error)
      setAnswer("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          AI Copilot
        </CardTitle>
        <CardDescription>Ask questions about your metrics and activity</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Textarea
            placeholder="e.g., What's our hiring pipeline looking like? How many invoices are overdue?"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            rows={3}
            disabled={loading}
          />
          <Button onClick={handleAsk} disabled={loading || !question.trim()} className="w-full">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Thinking...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Ask Copilot
              </>
            )}
          </Button>
        </div>

        <AnimatePresence>
          {answer && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-3"
            >
              <div className="rounded-lg bg-muted p-4">
                <p className="text-sm leading-relaxed">{answer}</p>
              </div>

              {sources.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">Sources:</p>
                  <div className="flex flex-wrap gap-2">
                    {sources.map((source, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {source}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span>{tokens} tokens</span>
                <span>•</span>
                <span>${cost.toFixed(4)} cost</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}
