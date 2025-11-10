"use client"

import { useState, useTransition } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import { AIInsightCard } from '@/components/shared/ai-insight-card'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

interface AccountsAIPanelProps {
  accounts: any[]
}

export function AccountsAIPanel({ accounts }: AccountsAIPanelProps) {
  const [insight, setInsight] = useState<string | null>(null)
  const [tokens, setTokens] = useState<number | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleGenerate = () => {
    startTransition(async () => {
      try {
        const res = await fetch('/api/crm/accounts/insights', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({}) })
        if (!res.ok) throw new Error('AI insights failed')
        const json = await res.json()
        if (json?.text) setInsight(json.text)
        if (json?.tokens) setTokens(json.tokens)
      } catch (err: any) {
        toast.error(err?.message || 'Failed to generate insights')
      }
    })
  }

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
      <Card className="glass-card border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-500" />
            AI Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">Generate an AI summary for visible accounts</div>
            <Button onClick={handleGenerate} disabled={isPending} className="bg-linear-to-r from-purple-600 to-violet-600">
              {isPending ? 'Generating...' : 'Summarize Accounts'}
            </Button>
          </div>

          {insight ? (
            <AIInsightCard title="AI Summary" confidence={0.9} type="success">
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <p className="whitespace-pre-wrap">{insight}</p>
              </div>
              {tokens !== null && <div className="text-xs text-muted-foreground pt-2">Tokens: {tokens}</div>}
            </AIInsightCard>
          ) : (
            <AIInsightCard title="Top Performing Accounts" confidence={0.92} type="success">
              <div className="space-y-2">
                {accounts
                  .filter((a) => a.status === 'customer')
                  .slice(0, 3)
                  .map((a, i) => (
                    <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                      <span className="text-sm font-medium">{a.name}</span>
                      <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">
                        High Value
                      </Badge>
                    </div>
                  ))}
              </div>
            </AIInsightCard>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
