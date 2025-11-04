"use client"

import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, DollarSign, Target, Clock } from "lucide-react"
import { Progress } from "@/components/ui/progress"

export function CRMAnalytics() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Win Rate</p>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </div>
          <p className="text-2xl font-bold">42%</p>
          <p className="text-xs text-green-600">+5% from last quarter</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Avg Deal Size</p>
            <DollarSign className="h-4 w-4 text-blue-500" />
          </div>
          <p className="text-2xl font-bold">$45K</p>
          <p className="text-xs text-green-600">+12% from last quarter</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Sales Cycle</p>
            <Clock className="h-4 w-4 text-orange-500" />
          </div>
          <p className="text-2xl font-bold">45 days</p>
          <p className="text-xs text-red-600">+3 days from last quarter</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Pipeline Value</p>
            <Target className="h-4 w-4 text-purple-500" />
          </div>
          <p className="text-2xl font-bold">$2.4M</p>
          <p className="text-xs text-green-600">+18% from last quarter</p>
        </Card>
      </div>

      <Tabs defaultValue="funnel" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="funnel">Conversion Funnel</TabsTrigger>
          <TabsTrigger value="velocity">Stage Velocity</TabsTrigger>
          <TabsTrigger value="attribution">Attribution</TabsTrigger>
        </TabsList>

        <TabsContent value="funnel" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-6">Sales Funnel Analysis</h3>
            <div className="space-y-4">
              {[
                { stage: "Leads", count: 1234, conversion: 100 },
                { stage: "Qualified", count: 456, conversion: 37 },
                { stage: "Demo", count: 234, conversion: 19 },
                { stage: "Proposal", count: 123, conversion: 10 },
                { stage: "Negotiation", count: 67, conversion: 5 },
                { stage: "Closed Won", count: 45, conversion: 3.6 },
              ].map((stage) => (
                <div key={stage.stage}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{stage.stage}</span>
                    <span className="text-sm text-muted-foreground">
                      {stage.count} ({stage.conversion}%)
                    </span>
                  </div>
                  <Progress value={stage.conversion} className="h-2" />
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="velocity" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-6">Average Time in Stage</h3>
            <div className="space-y-4">
              {[
                { stage: "Qualified", days: 5 },
                { stage: "Demo", days: 8 },
                { stage: "Proposal", days: 12 },
                { stage: "Negotiation", days: 15 },
                { stage: "Closed", days: 5 },
              ].map((stage) => (
                <div key={stage.stage} className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="font-medium">{stage.stage}</span>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{stage.days} days</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="attribution" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-6">Lead Source Attribution</h3>
            <div className="space-y-4">
              {[
                { source: "Website", leads: 456, revenue: "$1.2M", roi: "245%" },
                { source: "Referrals", leads: 234, revenue: "$890K", roi: "312%" },
                { source: "Events", leads: 123, revenue: "$450K", roi: "178%" },
                { source: "Social Media", leads: 89, revenue: "$234K", roi: "156%" },
              ].map((source) => (
                <div key={source.source} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{source.source}</span>
                    <span className="text-sm text-green-600">{source.roi} ROI</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Leads</p>
                      <p className="font-semibold">{source.leads}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Revenue</p>
                      <p className="font-semibold">{source.revenue}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
