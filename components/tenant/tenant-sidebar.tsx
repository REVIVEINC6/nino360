"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Building, Users, Settings, Sparkles } from "lucide-react"

export function TenantSidebar() {
  return (
    <div className="w-80 border-l bg-muted/30 flex flex-col">
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" /> AI Insights
            </h3>
            <Card className="p-4 bg-primary/5 border-primary/20 text-sm text-muted-foreground">
              Suggested: enforce SSO for all admins to improve security.
            </Card>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-3">Tenant Overview</h3>
            <div className="space-y-2">
              <Card className="p-3 flex items-center gap-3">
                <Building className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <div className="text-sm text-muted-foreground">Tenants</div>
                  <div className="text-lg font-bold">—</div>
                </div>
              </Card>
              <Card className="p-3 flex items-center gap-3">
                <Users className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <div className="text-sm text-muted-foreground">Users</div>
                  <div className="text-lg font-bold">—</div>
                </div>
              </Card>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                <Settings className="mr-2 h-4 w-4" /> Configure
              </Button>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}
