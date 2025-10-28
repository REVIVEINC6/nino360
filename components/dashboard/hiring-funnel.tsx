"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, TrendingDown } from "lucide-react"
import { cn } from "@/lib/utils"

const funnelStages = [
  { name: "Applicants", count: 450, width: 100, conversion: 100 },
  { name: "Screen", count: 180, width: 80, conversion: 40 },
  { name: "Interview", count: 72, width: 60, conversion: 40 },
  { name: "Offer", count: 18, width: 40, conversion: 25 },
]

export function HiringFunnel() {
  return (
    <Card className="glass-panel border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          Hiring Funnel
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {funnelStages.map((stage, index) => (
            <motion.div
              key={stage.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.15 }}
              className="space-y-2"
            >
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{stage.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">{stage.count}</span>
                  {index > 0 && (
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <TrendingDown className="h-3 w-3" />
                      {stage.conversion}%
                    </span>
                  )}
                </div>
              </div>
              <div
                className={cn(
                  "h-12 rounded-lg flex items-center justify-center font-semibold text-white transition-all",
                  "bg-gradient-to-r from-primary to-primary/70",
                )}
                style={{ width: `${stage.width}%` }}
              >
                {stage.count}
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
