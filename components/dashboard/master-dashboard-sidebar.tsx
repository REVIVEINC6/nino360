"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sparkles, Brain, Rocket, Zap, Compass, PlayCircle, Database } from "lucide-react"

export function MasterDashboardSidebar() {
  return (
    <div className="w-80 border-l bg-muted/30 flex flex-col">
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" /> Nino360 AI
            </h3>
            <Card className="p-4 bg-primary/5 border-primary/20 text-sm text-muted-foreground">
              Your AI copilot is curating insights across CRM, HRMS, Finance, and Projects.
            </Card>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Brain className="h-4 w-4" /> Generative Actions
            </h3>
            <div className="space-y-2">
              {[
                { label: "Draft Q4 exec summary", icon: Rocket },
                { label: "Explain KPI anomalies", icon: Zap },
                { label: "Suggest next best actions", icon: Compass },
              ].map((a) => (
                <Button key={a.label} variant="outline" size="sm" className="w-full justify-start bg-transparent">
                  <a.icon className="mr-2 h-4 w-4" /> {a.label}
                </Button>
              ))}
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-3">Data Feeds</h3>
            <div className="space-y-2 text-sm">
              {[
                "Real-time ledger",
                "CRM pipeline",
                "Bench utilization",
                "Project telemetry",
              ].map((s, i) => (
                <Card key={i} className="p-3 flex items-center gap-2">
                  <Database className="h-4 w-4" /> {s}
                </Card>
              ))}
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <Button size="sm" className="w-full">
              <PlayCircle className="mr-2 h-4 w-4" /> Run AI Briefing
            </Button>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}

export default MasterDashboardSidebar
