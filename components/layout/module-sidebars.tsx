"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Sparkles } from "lucide-react"

export function DefaultModuleSidebar({ title }: { title: string }) {
  return (
    <div className="w-80 border-l bg-card/50 backdrop-blur-sm p-6 space-y-6 overflow-y-auto">
      {/* Overview */}
      <div>
        <h3 className="font-semibold mb-4">Overview</h3>
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center justify-between">
            <span>{title} Items</span>
            <Badge variant="secondary">—</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span>Status</span>
            <Badge variant="secondary">—</Badge>
          </div>
        </div>
      </div>
      <Separator />

      <div>
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <Sparkles className="h-4 w-4" /> AI Insights
        </h3>
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4 text-sm text-muted-foreground">
            Insights will appear here as you use {title}.
          </CardContent>
        </Card>
      </div>
      <Separator />
      <div>
        <h3 className="font-semibold mb-3">Quick Actions</h3>
        <div className="space-y-2">
          <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
            New item
          </Button>
          <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
            Export
          </Button>
        </div>
      </div>
      <Separator />
      <div>
        <h3 className="font-semibold mb-3">Recent Activity</h3>
        <Card>
          <CardContent className="p-4 space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="text-sm">
                <div className="font-medium">Activity item {i}</div>
                <div className="text-muted-foreground">Details coming soon</div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
