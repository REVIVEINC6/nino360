"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Clock, Target } from "lucide-react"
import { MLConfidenceMeter } from "@/components/shared/ml-confidence-meter"

export function AnalyticsTabs() {
  const funnelData = [
    { stage: "Leads", count: 1234, conversion: 100, mlScore: 92 },
    { stage: "Qualified", count: 456, conversion: 37, mlScore: 88 },
    { stage: "Demo", count: 234, conversion: 19, mlScore: 85 },
    { stage: "Proposal", count: 123, conversion: 10, mlScore: 78 },
    { stage: "Negotiation", count: 67, conversion: 5, mlScore: 82 },
    { stage: "Closed Won", count: 45, conversion: 3.6, mlScore: 95 },
  ]

  const velocityData = [
    { stage: "Qualified", days: 5, target: 7, performance: "good" },
    { stage: "Demo", days: 8, target: 10, performance: "good" },
    { stage: "Proposal", days: 12, target: 14, performance: "good" },
    { stage: "Negotiation", days: 15, target: 12, performance: "warning" },
    { stage: "Closed", days: 5, target: 7, performance: "good" },
  ]

  const attributionData = [
    { source: "Website", leads: 456, revenue: 1200000, roi: 245, mlScore: 89 },
    { source: "Referrals", leads: 234, revenue: 890000, roi: 312, mlScore: 94 },
    { source: "Events", leads: 123, revenue: 450000, roi: 178, mlScore: 76 },
    { source: "Social Media", leads: 89, revenue: 234000, roi: 156, mlScore: 71 },
  ]

  return (
    <Card className="glass-panel">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Detailed Analytics
          <Badge className="ai-glow">AI-Enhanced</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="funnel" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="funnel">Conversion Funnel</TabsTrigger>
            <TabsTrigger value="velocity">Stage Velocity</TabsTrigger>
            <TabsTrigger value="attribution">Attribution</TabsTrigger>
          </TabsList>

          <TabsContent value="funnel" className="space-y-4">
            <div className="space-y-4">
              {funnelData.map((stage, index) => (
                <div key={stage.stage} className="glass-card p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-purple-500 text-sm font-bold text-white">
                        {index + 1}
                      </div>
                      <span className="font-semibold">{stage.stage}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold">{stage.count}</p>
                      <p className="text-xs text-muted-foreground">{stage.conversion.toFixed(1)}%</p>
                    </div>
                  </div>
                  <Progress value={stage.conversion} className="mb-3 h-2" />
                  <MLConfidenceMeter confidence={stage.mlScore} label="ML Prediction Accuracy" size="sm" />
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="velocity" className="space-y-4">
            <div className="space-y-3">
              {velocityData.map((stage) => (
                <div key={stage.stage} className="glass-card p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-muted-foreground" />
                      <span className="font-semibold">{stage.stage}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Actual</p>
                        <p className="text-lg font-bold">{stage.days} days</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Target</p>
                        <p className="text-lg font-bold text-muted-foreground">{stage.target} days</p>
                      </div>
                      <Badge variant={stage.performance === "good" ? "default" : "destructive"}>
                        {stage.performance === "good" ? "On Track" : "At Risk"}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="attribution" className="space-y-4">
            <div className="space-y-3">
              {attributionData.map((source) => (
                <div key={source.source} className="glass-card p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Target className="h-5 w-5 text-muted-foreground" />
                      <span className="font-semibold">{source.source}</span>
                    </div>
                    <Badge variant="outline" className="text-green-600">
                      {source.roi}% ROI
                    </Badge>
                  </div>
                  <div className="mb-3 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Leads</p>
                      <p className="text-lg font-bold">{source.leads}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Revenue</p>
                      <p className="text-lg font-bold">${(source.revenue / 1000000).toFixed(2)}M</p>
                    </div>
                  </div>
                  <MLConfidenceMeter confidence={source.mlScore} label="Attribution Confidence" size="sm" />
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
