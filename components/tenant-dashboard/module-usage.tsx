"use client"

import { Card } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { motion } from "framer-motion"
import { TrendingUp } from "lucide-react"

interface ModuleUsageProps {
  data: Array<{
    module: string
    count: number
  }>
}

export function ModuleUsage({ data }: ModuleUsageProps) {
  const chartData = data.map((item, index) => ({
    ...item,
    events: item.count,
    fill: `hsl(var(--chart-${(index % 5) + 1}))`,
  }))

  const totalEvents = data.reduce((sum, item) => sum + item.count, 0)

  return (
    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
      <Card className="glass-card p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Module Usage</h3>
            <p className="text-sm text-muted-foreground">Activity across all modules</p>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-1.5">
            <TrendingUp className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">{totalEvents} events</span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis
              dataKey="module"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--popover))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
              cursor={{ fill: "hsl(var(--muted))", opacity: 0.1 }}
            />
            <Legend />
            <Bar dataKey="events" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </motion.div>
  )
}
