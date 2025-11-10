"use client"

import { Badge } from "@/components/ui/badge"

import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, TrendingDown, DollarSign, Clock } from "lucide-react"
import { Progress } from "@/components/ui/progress"

export function HRAnalytics() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Total Headcount</p>
            <Users className="h-4 w-4 text-blue-500" />
          </div>
          <p className="text-2xl font-bold">234</p>
          <p className="text-xs text-green-600">+12 from last quarter</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Attrition Rate</p>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </div>
          <p className="text-2xl font-bold">8.5%</p>
          <p className="text-xs text-green-600">-1.2% from last quarter</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Avg Tenure</p>
            <Clock className="h-4 w-4 text-purple-500" />
          </div>
          <p className="text-2xl font-bold">3.2 yrs</p>
          <p className="text-xs text-green-600">+0.3 from last quarter</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Cost per Hire</p>
            <DollarSign className="h-4 w-4 text-green-500" />
          </div>
          <p className="text-2xl font-bold">$4.2K</p>
          <p className="text-xs text-green-600">-$500 from last quarter</p>
        </Card>
      </div>

      <Tabs defaultValue="headcount" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="headcount">Headcount Trends</TabsTrigger>
          <TabsTrigger value="attrition">Attrition Analysis</TabsTrigger>
          <TabsTrigger value="diversity">Diversity Metrics</TabsTrigger>
        </TabsList>

        <TabsContent value="headcount" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-6">Headcount by Department</h3>
            <div className="space-y-4">
              {[
                { dept: "Engineering", count: 89, growth: 12 },
                { dept: "Sales", count: 45, growth: 8 },
                { dept: "Marketing", count: 23, growth: 3 },
                { dept: "Operations", count: 34, growth: 5 },
                { dept: "HR", count: 12, growth: 1 },
              ].map((dept) => (
                <div key={dept.dept}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{dept.dept}</span>
                    <span className="text-sm text-muted-foreground">
                      {dept.count} (+{dept.growth})
                    </span>
                  </div>
                  <Progress value={(dept.count / 234) * 100} className="h-2" />
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="attrition" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-6">Attrition by Reason</h3>
            <div className="space-y-4">
              {[
                { reason: "Better Opportunity", count: 12, percentage: 35 },
                { reason: "Relocation", count: 8, percentage: 24 },
                { reason: "Compensation", count: 6, percentage: 18 },
                { reason: "Work-Life Balance", count: 5, percentage: 15 },
                { reason: "Other", count: 3, percentage: 8 },
              ].map((item) => (
                <div key={item.reason} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{item.reason}</p>
                    <p className="text-sm text-muted-foreground">{item.count} employees</p>
                  </div>
                  <Badge variant="secondary">{item.percentage}%</Badge>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="diversity" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-6">Diversity & Inclusion Metrics</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="p-4">
                <p className="text-sm text-muted-foreground mb-2">Gender Distribution</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Female</span>
                    <span className="font-semibold">42%</span>
                  </div>
                  <Progress value={42} />
                  <div className="flex justify-between text-sm">
                    <span>Male</span>
                    <span className="font-semibold">56%</span>
                  </div>
                  <Progress value={56} />
                  <div className="flex justify-between text-sm">
                    <span>Non-binary</span>
                    <span className="font-semibold">2%</span>
                  </div>
                  <Progress value={2} />
                </div>
              </Card>

              <Card className="p-4">
                <p className="text-sm text-muted-foreground mb-2">Leadership Diversity</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Women in Leadership</span>
                    <span className="font-semibold">38%</span>
                  </div>
                  <Progress value={38} />
                  <div className="flex justify-between text-sm">
                    <span>Underrepresented Groups</span>
                    <span className="font-semibold">25%</span>
                  </div>
                  <Progress value={25} />
                </div>
              </Card>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
