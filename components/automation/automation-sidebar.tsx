"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bot, Sparkles, Play, Zap, PlugZap } from "lucide-react"

export function AutomationSidebar() {
  return (
    <div className="w-80 border-l bg-muted/30 flex flex-col">
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" /> AI Insights
            </h3>
            <Card className="p-4 bg-primary/5 border-primary/20 text-sm text-muted-foreground">
              3 rules can be optimized with AI for better precision.
            </Card>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                <Bot className="mr-2 h-4 w-4" /> New Rule
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                <PlugZap className="mr-2 h-4 w-4" /> New Webhook
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                <Play className="mr-2 h-4 w-4" /> Run Now
              </Button>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-3">Recent Runs</h3>
            <div className="space-y-2 text-sm">
              {["Rule #12", "Webhook #7", "Rule #9"].map((r, i) => (
                <Card key={i} className="p-3 flex justify-between">
                  <span>{r}</span>
                  <Zap className="h-4 w-4 text-amber-500" />
                </Card>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}
