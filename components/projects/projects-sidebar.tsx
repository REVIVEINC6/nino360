"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { FolderKanban, Target, Users, Sparkles, PlusCircle } from "lucide-react"

export function ProjectsSidebar() {
  const quick = [
    { title: "Active Projects", value: "8", icon: FolderKanban },
    { title: "Milestones (7d)", value: "12", icon: Target },
    { title: "Allocations", value: "23", icon: Users },
  ]

  return (
    <div className="w-80 border-l bg-muted/30 flex flex-col">
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {/* AI Insight */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" /> AI Insights
            </h3>
            <Card className="p-4 bg-primary/5 border-primary/20 text-sm text-muted-foreground">
              Project Alpha is trending behind schedule. Consider reallocating 10h from Beta.
            </Card>
          </div>

          <Separator />

          {/* Snapshot */}
          <div>
            <h3 className="font-semibold mb-3">Snapshot</h3>
            <div className="space-y-2">
              {quick.map((q, i) => (
                <Card key={i} className="p-3 flex items-center gap-3">
                  <q.icon className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1">
                    <div className="text-sm text-muted-foreground">{q.title}</div>
                    <div className="text-lg font-bold">{q.value}</div>
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
                <PlusCircle className="mr-2 h-4 w-4" /> New Project
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                <Target className="mr-2 h-4 w-4" /> Add Milestone
              </Button>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}
