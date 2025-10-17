"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, Users, Clock, Target } from "lucide-react"

export function SmartMetrics() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Performance Metrics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="quality">Quality</TabsTrigger>
            <TabsTrigger value="efficiency">Efficiency</TabsTrigger>
            <TabsTrigger value="sources">Sources</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-4">
              <Card className="p-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Users className="h-4 w-4" />
                  Conversion Rate
                </div>
                <div className="text-2xl font-bold">12.5%</div>
                <p className="text-xs text-green-600">+2.3% vs last month</p>
              </Card>
              <Card className="p-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Clock className="h-4 w-4" />
                  Avg Time to Offer
                </div>
                <div className="text-2xl font-bold">21 days</div>
                <p className="text-xs text-green-600">-4 days vs target</p>
              </Card>
              <Card className="p-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Target className="h-4 w-4" />
                  Offer Acceptance
                </div>
                <div className="text-2xl font-bold">85%</div>
                <p className="text-xs text-green-600">+5% vs industry</p>
              </Card>
              <Card className="p-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <TrendingUp className="h-4 w-4" />
                  Quality of Hire
                </div>
                <div className="text-2xl font-bold">4.2/5</div>
                <p className="text-xs text-green-600">+0.3 vs last quarter</p>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="quality">
            <div className="text-center py-8 text-muted-foreground">
              Quality metrics visualization would appear here
            </div>
          </TabsContent>

          <TabsContent value="efficiency">
            <div className="text-center py-8 text-muted-foreground">
              Efficiency metrics visualization would appear here
            </div>
          </TabsContent>

          <TabsContent value="sources">
            <div className="text-center py-8 text-muted-foreground">Source performance metrics would appear here</div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
