"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign } from "lucide-react"
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts"

const agingData = [
  { bucket: "0-30", ar: 450000, ap: 280000 },
  { bucket: "31-60", ar: 180000, ap: 120000 },
  { bucket: "61-90", ar: 90000, ap: 60000 },
  { bucket: "90+", ar: 45000, ap: 30000 },
]

export function ArApAging() {
  return (
    <Card className="glass-panel border-primary/20 neon-glow-hover">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5 neon-text-lime" />
          <span className="brand-gradient-text">AR/AP Aging</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={agingData}>
            <XAxis dataKey="bucket" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} />
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
                backdropFilter: "blur(20px)",
              }}
              formatter={(value: number) => `$${(value / 1000).toFixed(1)}K`}
            />
            <Legend />
            <Bar dataKey="ar" name="Accounts Receivable" fill="#d0ff00" radius={[4, 4, 0, 0]} />
            <Bar dataKey="ap" name="Accounts Payable" fill="#f81ce5" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
