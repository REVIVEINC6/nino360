"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Building2, FileCheck, Send, Sparkles, ShieldAlert } from "lucide-react"

export function VMSSidebar() {
  const stats = [
    { label: "Active Vendors", value: "24" },
    { label: "Compliance Pending", value: "12" },
    { label: "Open Submissions", value: "89" },
  ]

  const alerts = [
    { title: "Insurance Certificate Expiring", detail: "GlobalStaff LLC - 7 days" },
    { title: "MSA renewal required", detail: "TechVendor Inc. - 15 days" },
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
              Vendors with complete compliance get 30% faster onboarding.
            </Card>
          </div>

          <Separator />

          {/* Snapshot */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Building2 className="h-4 w-4" /> Snapshot
            </h3>
            <div className="space-y-2">
              {stats.map((s) => (
                <Card key={s.label} className="p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{s.label}</span>
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
                <FileCheck className="mr-2 h-4 w-4" /> New Compliance Item
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                <Send className="mr-2 h-4 w-4" /> Submit Candidate
              </Button>
            </div>
          </div>

          <Separator />

          {/* Alerts */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <ShieldAlert className="h-4 w-4" /> Alerts
            </h3>
            <div className="space-y-3">
              {alerts.map((a, i) => (
                <Card key={i} className="p-3">
                  <div className="text-sm font-medium">{a.title}</div>
                  <div className="text-xs text-muted-foreground">{a.detail}</div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}
