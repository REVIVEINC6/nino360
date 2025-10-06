"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AIChatInterface from "@/components/ai/ai-chat-interface"
import { Lightbulb, MessageSquare, BarChart3, Filter } from "lucide-react"

// Minimal mock types
type Insight = {
  id: string
  title: string
  description: string
  type: "positive" | "negative" | "neutral" | "warning"
  impact: "high" | "medium" | "low"
  category: string
}

type Metric = { id: string; name: string; value: number }

const mockInsights: Insight[] = [
  { id: "i1", title: "Hiring spike", description: "Hiring increased 20%", type: "positive", impact: "medium", category: "talent" },
  { id: "i2", title: "Invoice Delays", description: "Several invoices overdue", type: "warning", impact: "high", category: "finance" },
]

const mockMetrics: Metric[] = [{ id: "m1", name: "MRR", value: 12000 }, { id: "m2", name: "Active Users", value: 340 }]

export default function AIInsightsDrawer({ trigger, module = "general", context = {}, isOpen: propIsOpen, onOpenChange, }: { trigger?: React.ReactNode; module?: string; context?: Record<string, any>; isOpen?: boolean; onOpenChange?: (open: boolean) => void }) {
  const [isOpen, setIsOpen] = useState<boolean>(propIsOpen ?? false)
  useEffect(() => {
    if (typeof propIsOpen === "boolean") setIsOpen(propIsOpen)
  }, [propIsOpen])

  const [activeTab, setActiveTab] = useState("chat")

  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        <div className="text-lg font-medium">AI Copilot</div>
        <div>
          <Button onClick={() => { setIsOpen(!isOpen); onOpenChange?.(!isOpen) }} size="sm">
            {isOpen ? "Close" : "Open"}
          </Button>
        </div>
      </div>

      {isOpen && (
        <div className="mt-4">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v)}>
            <TabsList>
              <TabsTrigger value="chat" className="flex items-center gap-2"><MessageSquare className="h-4 w-4"/>Chat</TabsTrigger>
              <TabsTrigger value="insights" className="flex items-center gap-2"><Lightbulb className="h-4 w-4"/>Insights</TabsTrigger>
              <TabsTrigger value="metrics" className="flex items-center gap-2"><BarChart3 className="h-4 w-4"/>Metrics</TabsTrigger>
            </TabsList>

            <div className="mt-4">
              <TabsContent value="chat">
                <div className="h-80 border rounded">
                  <AIChatInterface module={module} context={context} className="h-full" />
                </div>
              </TabsContent>

              <TabsContent value="insights">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg">Recent Insights</h4>
                    <Button variant="outline" size="sm"><Filter className="h-4 w-4 mr-2" />Filter</Button>
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    {mockInsights.map((insight) => (
                      <Card key={insight.id}>
                        <CardContent>
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-semibold">{insight.title}</div>
                              <div className="text-sm text-muted-foreground">{insight.description}</div>
                            </div>
                            <div>
                              <Badge variant={insight.impact === 'high' ? 'destructive' : 'secondary'}>{insight.impact}</Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="metrics">
                <div className="space-y-3">
                  {mockMetrics.map((m) => (
                    <Card key={m.id}>
                      <CardContent className="flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">{m.name}</div>
                        <div className="text-xl font-bold">{m.value}</div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      )}
    </div>
  )
}
// Named exports for compatibility (component is exported as default and named)
export { AIInsightsDrawer }
export { AIInsightsDrawer as AiInsightsDrawer }
