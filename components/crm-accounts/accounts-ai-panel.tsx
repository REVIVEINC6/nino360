"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sparkles, TrendingUp, AlertTriangle, Target } from "lucide-react"
import { motion } from "framer-motion"
import { AIInsightCard } from "@/components/shared/ai-insight-card"

interface AccountsAIPanelProps {
  accounts: any[]
}

export function AccountsAIPanel({ accounts }: AccountsAIPanelProps) {
  // Calculate AI insights
  const topAccounts = accounts
    .filter((a) => a.status === "customer")
    .slice(0, 3)
    .map((a) => ({
      name: a.name,
      value: "High Value",
      confidence: 0.92,
    }))

  const atRiskAccounts = accounts
    .filter((a) => a.status === "prospect")
    .slice(0, 2)
    .map((a) => ({
      name: a.name,
      reason: "Low engagement",
      confidence: 0.78,
    }))

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
          {/* Top Accounts */}
          <AIInsightCard title="Top Performing Accounts" icon={TrendingUp} iconColor="text-green-500" confidence={0.92}>
            <div className="space-y-2">
              {topAccounts.map((account, index) => (
                <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                  <span className="text-sm font-medium">{account.name}</span>
                  <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">
                    {account.value}
                  </Badge>
                </div>
              ))}
            </div>
          </AIInsightCard>

          {/* At Risk */}
          <AIInsightCard
            title="Accounts Needing Attention"
            icon={AlertTriangle}
            iconColor="text-orange-500"
            confidence={0.78}
          >
            <div className="space-y-2">
              {atRiskAccounts.map((account, index) => (
                <div key={index} className="p-2 rounded-lg bg-white/5">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{account.name}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{account.reason}</p>
                </div>
              ))}
            </div>
          </AIInsightCard>

          {/* Recommendations */}
          <AIInsightCard title="Recommended Actions" icon={Target} iconColor="text-blue-500" confidence={0.85}>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span>Follow up with 3 prospects this week</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span>Schedule quarterly reviews with top accounts</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span>Update industry data for 12 accounts</span>
              </li>
            </ul>
          </AIInsightCard>
        </CardContent>
      </Card>
    </motion.div>
  )
}
