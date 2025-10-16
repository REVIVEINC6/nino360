"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { UserCheck, Send, ThumbsUp, Minus, ThumbsDown } from "lucide-react"

const benchData = [
  { skill: "React", available: 8, color: "hsl(var(--chart-1))" },
  { skill: "Java", available: 12, color: "hsl(var(--chart-2))" },
  { skill: "Python", available: 6, color: "hsl(var(--chart-3))" },
  { skill: ".NET", available: 10, color: "hsl(var(--chart-4))" },
  { skill: "DevOps", available: 4, color: "hsl(var(--chart-5))" },
]

const campaignResponses = [
  { name: "John Smith", skill: "React", intent: "positive" },
  { name: "Sarah Johnson", skill: "Java", intent: "neutral" },
  { name: "Mike Davis", skill: "Python", intent: "not_now" },
]

export function BenchHotlist() {
  return (
    <Card className="glass-panel border-primary/20 lg:col-span-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5 text-primary" />
            Bench & Hotlist
          </CardTitle>
          <Button className="gap-2">
            <Send className="h-4 w-4" />
            Publish Hotlist
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h4 className="text-sm font-semibold mb-3">Availability Heatmap</h4>
          <div className="grid grid-cols-5 gap-2">
            {benchData.map((item, index) => (
              <motion.div
                key={item.skill}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 rounded-lg text-center"
                style={{ backgroundColor: item.color }}
              >
                <div className="text-2xl font-bold text-white">{item.available}</div>
                <div className="text-xs text-white/90 mt-1">{item.skill}</div>
              </motion.div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold mb-3">Latest Campaign Responses</h4>
          <div className="space-y-2">
            {campaignResponses.map((response, index) => (
              <motion.div
                key={response.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="flex items-center justify-between p-3 rounded-lg bg-background/50"
              >
                <div className="flex-1">
                  <p className="text-sm font-medium">{response.name}</p>
                  <p className="text-xs text-muted-foreground">{response.skill}</p>
                </div>
                <Badge
                  variant={
                    response.intent === "positive" ? "default" : response.intent === "neutral" ? "secondary" : "outline"
                  }
                  className="gap-1"
                >
                  {response.intent === "positive" && <ThumbsUp className="h-3 w-3" />}
                  {response.intent === "neutral" && <Minus className="h-3 w-3" />}
                  {response.intent === "not_now" && <ThumbsDown className="h-3 w-3" />}
                  {response.intent === "positive" ? "Positive" : response.intent === "neutral" ? "Neutral" : "Not Now"}
                </Badge>
              </motion.div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
