"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, TrendingUp, AlertCircle, Target } from "lucide-react"
import { motion } from "framer-motion"
import { AIInsightCard } from "@/components/shared/ai-insight-card"

interface LeadsAIPanelProps {
  leads: any[]
}

export function LeadsAIPanel({ leads }: LeadsAIPanelProps) {
  const highScore = leads.filter((l) => (l.score || 0) > 70)
  const needsFollowUp = leads.filter((l) => l.status === "contacted")
  const readyToConvert = leads.filter((l) => l.status === "qualified")

  return (
    <div className="space-y-4">
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
        <Card className="glass-card border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-500" />
              AI Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <AIInsightCard
              title="High-Score Leads"
              description={`${highScore.length} leads with AI score >70`}
              confidence={94}
              type="success"
            />

            <AIInsightCard
              title="Needs Follow-Up"
              description={`${needsFollowUp.length} contacted leads awaiting response`}
              confidence={88}
              type="warning"
            />

            <AIInsightCard
              title="Ready to Convert"
              description={`${readyToConvert.length} qualified leads ready for conversion`}
              confidence={91}
              type="info"
            />
          </CardContent>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
        <Card className="glass-card border-white/20">
          <CardHeader>
            <CardTitle className="text-sm">Top Scoring Leads</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {leads
              .sort((a, b) => (b.score || 0) - (a.score || 0))
              .slice(0, 3)
              .map((lead) => (
                <div
                  key={lead.id}
                  className="p-3 rounded-lg bg-linear-to-r from-blue-50 to-purple-50 border border-blue-200"
                >
                  <p className="text-sm font-medium text-blue-900">
                    {lead.first_name} {lead.last_name}
                  </p>
                  <p className="text-xs text-blue-700 mt-1">
                    {lead.company} • Score: {lead.score || 0}
                  </p>
                </div>
              ))}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
