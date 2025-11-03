"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { DollarSign, FileDown, Upload, Sparkles, AlertTriangle, ArrowDownRight, ArrowUpRight } from "lucide-react"

export function FinanceSidebar() {
  const kpis = [
    { label: "AR Open", value: "$1.2M", trend: <ArrowDownRight className="h-3 w-3 text-green-600" /> },
    { label: "AP Open", value: "$650K", trend: <ArrowUpRight className="h-3 w-3 text-red-600" /> },
    { label: "Overdue Invoices", value: "23", trend: <ArrowUpRight className="h-3 w-3 text-orange-600" /> },
  ]

  const recentAlerts = [
    { title: "Invoice #INV-1042 overdue", detail: "7 days past due", tone: "orange" },
    { title: "AP bill approval pending", detail: "Marketing - $8,240", tone: "blue" },
    { title: "Low runway warning", detail: "3.5 months", tone: "red" },
  ]

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
              Early-payment discount opportunity detected for 5 invoices (avg 1.5%).
            </Card>
          </div>

          <Separator />

          {/* Snapshot */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Finance Snapshot
            </h3>
            <div className="space-y-2">
              {kpis.map((k) => (
                <Card key={k.label} className="p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{k.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold">{k.value}</span>
                      {k.trend}
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
              <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                <Upload className="mr-2 h-4 w-4" /> Import Invoices
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                <FileDown className="mr-2 h-4 w-4" /> Export AR Aging
              </Button>
            </div>
          </div>

          <Separator />

          {/* Alerts */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" /> Alerts
            </h3>
            <div className="space-y-3">
              {recentAlerts.map((a, i) => (
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
