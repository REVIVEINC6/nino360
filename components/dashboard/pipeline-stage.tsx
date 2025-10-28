"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { DollarSign } from "lucide-react"

const stages = [
  { name: "Prospect", value: 2400000, count: 12, color: "hsl(var(--chart-1))" },
  { name: "Qualify", value: 1800000, count: 8, color: "hsl(var(--chart-2))" },
  { name: "Propose", value: 1200000, count: 5, color: "hsl(var(--chart-3))" },
  { name: "Negotiate", value: 800000, count: 3, color: "hsl(var(--chart-4))" },
  { name: "Commit", value: 400000, count: 2, color: "hsl(var(--chart-5))" },
]

const topDeals = [
  { name: "Enterprise CRM Deal", value: 450000, stage: "Negotiate", probability: 75 },
  { name: "Cloud Migration Project", value: 320000, stage: "Propose", probability: 60 },
  { name: "Staff Augmentation", value: 180000, stage: "Commit", probability: 90 },
]

export function PipelineStage() {
  const totalValue = stages.reduce((sum, stage) => sum + stage.value, 0)

  return (
    <Card className="glass-panel border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-primary" />
          Pipeline by Stage
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          {stages.map((stage, index) => (
            <motion.div
              key={stage.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="space-y-2"
            >
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{stage.name}</span>
                <span className="text-muted-foreground">
                  ${(stage.value / 1000).toFixed(0)}K ({stage.count})
                </span>
              </div>
              <Progress
                value={(stage.value / totalValue) * 100}
                className="h-2"
                style={{ "--progress-background": stage.color } as any}
              />
            </motion.div>
          ))}
        </div>

        <div className="space-y-2 pt-4 border-t">
          <h4 className="text-sm font-semibold">Top Deals</h4>
          {topDeals.map((deal, index) => (
            <motion.div
              key={deal.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="flex items-center justify-between p-2 rounded-lg bg-background/50 text-sm"
            >
              <div className="flex-1">
                <p className="font-medium">{deal.name}</p>
                <p className="text-xs text-muted-foreground">
                  {deal.stage} • {deal.probability}% prob
                </p>
              </div>
              <span className="font-semibold">${(deal.value / 1000).toFixed(0)}K</span>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
