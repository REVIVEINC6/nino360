"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Zap } from "lucide-react"
import { Switch } from "@/components/ui/switch"

export function TalentAutomation() {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold">Automation Rules</h3>
            <p className="text-sm text-muted-foreground">Automate repetitive recruitment tasks</p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Rule
          </Button>
        </div>

        <div className="space-y-3">
          {[
            { name: "Auto-screen candidates", description: "Screen based on minimum requirements", enabled: true },
            { name: "Send interview reminders", description: "24 hours before scheduled interviews", enabled: true },
            { name: "Request feedback", description: "After interview completion", enabled: true },
          ].map((rule) => (
            <div key={rule.name} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <Zap className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">{rule.name}</p>
                  <p className="text-sm text-muted-foreground">{rule.description}</p>
                </div>
              </div>
              <Switch checked={rule.enabled} />
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
