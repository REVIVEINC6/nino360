"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Users, Zap, Calendar, Sparkles } from "lucide-react"

export function BenchSidebar() {
  const stats = [
    { title: "On Bench", value: "18" },
    { title: "Avg Bench Days", value: "21" },
    { title: "Active Allocations", value: "32" },
  ]

  const suggestions = [
    { title: "Match 5 consultants to Open Java roles", action: "Review Matches" },
    { title: "Automate status updates", action: "Enable Automation" },
  ]

  return (
    <div className="w-80 border-l bg-muted/30 flex flex-col">
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {/* AI Insights */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" /> AI Insights
            </h3>
            <Card className="p-4 bg-primary/5 border-primary/20 text-sm text-muted-foreground">
              Prioritize outreach to 7 consultants idle {">"} 30 days.
            </Card>
          </div>

          <Separator />

          {/* Snapshot */}
          <div>
            <h3 className="font-semibold mb-3">Snapshot</h3>
            <div className="space-y-2">
              {stats.map((s, i) => (
                <Card key={i} className="p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{s.title}</span>
                    <span className="text-lg font-bold">{s.value}</span>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <Separator />

          {/* Quick Actions */}
          <div>
            <h3 className="font-semibold mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                <Zap className="mr-2 h-4 w-4" /> Generate Matches
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                <Calendar className="mr-2 h-4 w-4" /> Plan Outreach
              </Button>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}
