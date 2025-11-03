"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sparkles, TrendingUp, Users2, FileText, PlusCircle, Filter, Send, ListChecks } from "lucide-react"

export function CRMDashboardSidebar() {
  const quickStats = [
    { label: "Open Deals", value: "42", trend: "+5%" },
    { label: "This Week Activities", value: "68", trend: "+12%" },
    { label: "Avg Cycle (days)", value: "28", trend: "-3" },
  ]

  const actions = [
    { icon: PlusCircle, label: "New Lead", href: "/crm/leads/new" },
    { icon: Users2, label: "New Contact", href: "/crm/contacts/new" },
    { icon: FileText, label: "New Deal", href: "/crm/opportunities/new" },
    { icon: Send, label: "Log Activity", href: "/crm/activities/new" },
  ]

  const recent = [
    { title: "Acme Corp moved to Proposal", detail: "Deal #D-1041", time: "1h" },
    { title: "Follow-up sent to ZenSoft", detail: "Email", time: "3h" },
    { title: "New lead imported", detail: "CSV import", time: "6h" },
  ]

  return (
    <div className="w-80 border-l bg-muted/30 flex flex-col">
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {/* AI Insights */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              AI Insights
            </h3>
            <Card className="p-4 bg-primary/5 border-primary/20 text-sm text-muted-foreground">
              Deals in "Qualification" stage have 20% higher win rate when a call is logged within 24h.
            </Card>
          </div>

          <Separator />

          {/* Quick Stats */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Snapshot
            </h3>
            <div className="space-y-2">
              {quickStats.map((s) => (
                <Card key={s.label} className="p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{s.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold">{s.value}</span>
                      <Badge variant="secondary" className="text-xs">
                        {s.trend}
                      </Badge>
                    </div>
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
              {actions.map((a) => (
                <Button key={a.label} variant="outline" size="sm" className="w-full justify-start bg-transparent">
                  <a.icon className="mr-2 h-4 w-4" />
                  {a.label}
                </Button>
              ))}
              <Button variant="ghost" size="sm" className="w-full justify-start">
                <Filter className="mr-2 h-4 w-4" />
                Filter Dashboard
              </Button>
            </div>
          </div>

          <Separator />

          {/* Recent Activity */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <ListChecks className="h-4 w-4" /> Recent Activity
            </h3>
            <div className="space-y-3">
              {recent.map((r, i) => (
                <div key={i} className="text-sm">
                  <div className="font-medium">{r.title}</div>
                  <div className="text-muted-foreground">{r.detail} • {r.time} ago</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}
