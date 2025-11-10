"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Flame, Filter, Sparkles, Target, ListChecks } from "lucide-react"

export function HotlistSidebar() {
  return (
    <div className="w-80 border-l bg-muted/30 flex flex-col">
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" /> AI Insights
            </h3>
            <Card className="p-4 bg-primary/5 border-primary/20 text-sm text-muted-foreground">
              4 high-priority requirements match your bench candidates.
            </Card>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Flame className="h-4 w-4" /> Active Requirements
            </h3>
            <div className="space-y-2">
              {["Urgent", "High", "Medium"].map((p) => (
                <Card key={p} className="p-3 text-sm flex items-center justify-between">
                  <span>{p} priority</span>
                  <span className="font-semibold">—</span>
                </Card>
              ))}
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                <Target className="mr-2 h-4 w-4" /> Create Requirement
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                <Filter className="mr-2 h-4 w-4" /> Filter Hotlist
              </Button>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <ListChecks className="h-4 w-4" /> Recent Activity
            </h3>
            <div className="space-y-2 text-sm">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="p-3">Requirement updated #{i}</Card>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}
