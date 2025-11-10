"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { TrendingUp, Info, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { getSalesForecast, getCashflowForecast } from "@/app/(dashboard)/dashboard/actions"
import type { ForecastData } from "@/app/(dashboard)/dashboard/actions"

interface ForecastCardProps {
  title: string
  type: "sales" | "cashflow"
}

export function ForecastCard({ title, type }: ForecastCardProps) {
  const [whatIfMode, setWhatIfMode] = useState(false)
  const [data, setData] = useState<ForecastData[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const forecastData = type === "sales" ? await getSalesForecast() : await getCashflowForecast()
        setData(forecastData)
      } catch (error) {
        console.error(`[v0] Error fetching ${type} forecast:`, error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [type])

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}>
      <Card className="glass-panel border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              {title}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Label htmlFor={`what-if-${type}`} className="text-xs text-muted-foreground">
                What-if
              </Label>
              <Switch id={`what-if-${type}`} checked={whatIfMode} onCheckedChange={setWhatIfMode} />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-[200px]">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={data}>
                <defs>
                  <linearGradient id={`gradient-${type}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Area type="monotone" dataKey="upper" stroke="none" fill="hsl(var(--primary) / 0.1)" strokeWidth={0} />
                <Area type="monotone" dataKey="lower" stroke="none" fill="hsl(var(--background))" strokeWidth={0} />
                <Area
                  type="monotone"
                  dataKey="actual"
                  stroke="hsl(var(--primary))"
                  fill={`url(#gradient-${type})`}
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="forecast"
                  stroke="hsl(var(--primary))"
                  strokeDasharray="5 5"
                  fill="none"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
          <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground">
            <Info className="h-3.5 w-3.5" />
            <span>90-day projection with 60-90% confidence band</span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
