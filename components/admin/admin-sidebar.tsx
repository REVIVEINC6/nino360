"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Shield, UserCog, ServerCog, Sparkles, Bell, Wrench } from "lucide-react"

export function AdminSidebar() {
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
              System has 2 pending migrations and 1 low-priority incident.
            </Card>
          </div>

          <Separator />

          {/* Admin Snapshot */}
          <div>
            <h3 className="font-semibold mb-3">Snapshot</h3>
            <div className="space-y-2">
              <Card className="p-3 flex items-center gap-3">
                <UserCog className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <div className="text-sm text-muted-foreground">Active Users</div>
                  <div className="text-lg font-bold">—</div>
                </div>
              </Card>
              <Card className="p-3 flex items-center gap-3">
                <ServerCog className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <div className="text-sm text-muted-foreground">Services</div>
                  <div className="text-lg font-bold">—</div>
                </div>
              </Card>
            </div>
          </div>

          <Separator />

          {/* Quick Actions */}
          <div>
            <h3 className="font-semibold mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                <Shield className="mr-2 h-4 w-4" /> Security Audit
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                <Bell className="mr-2 h-4 w-4" /> View Alerts
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                <Wrench className="mr-2 h-4 w-4" /> Maintenance
              </Button>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}
