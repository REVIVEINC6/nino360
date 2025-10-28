"use client"

import { motion } from "framer-motion"
import { TrendingUp, TrendingDown } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const vendors = [
  { id: 1, name: "CloudHost Pro", sla: 99.9, onTime: 98, disputes: 0, trend: "up" },
  { id: 2, name: "DevOps Solutions", sla: 98.5, onTime: 95, disputes: 2, trend: "down" },
  { id: 3, name: "Security Plus", sla: 99.5, onTime: 99, disputes: 0, trend: "up" },
]

export function VendorScorecard() {
  return (
    <Card className="glass-panel border-primary/20">
      <CardHeader>
        <CardTitle className="text-base">Vendor Scorecards</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {vendors.map((vendor, index) => (
          <motion.div
            key={vendor.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-3 rounded-lg bg-background/50 space-y-2"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">{vendor.name}</p>
              {vendor.trend === "up" ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
              ) : (
                <TrendingDown className="h-4 w-4 text-destructive" />
              )}
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div>
                <p className="text-muted-foreground">SLA</p>
                <p className="font-semibold">{vendor.sla}%</p>
              </div>
              <div>
                <p className="text-muted-foreground">On-time</p>
                <p className="font-semibold">{vendor.onTime}%</p>
              </div>
              <div>
                <p className="text-muted-foreground">Disputes</p>
                <p className={cn("font-semibold", vendor.disputes > 0 && "text-yellow-500")}>{vendor.disputes}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  )
}
