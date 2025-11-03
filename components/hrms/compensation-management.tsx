"use client"

import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { DollarSign, TrendingUp, Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function CompensationManagement() {
  return (
    <Tabs defaultValue="bands" className="space-y-6">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="bands">
          <DollarSign className="mr-2 h-4 w-4" />
          Salary Bands
        </TabsTrigger>
        <TabsTrigger value="cycles">
          <TrendingUp className="mr-2 h-4 w-4" />
          Review Cycles
        </TabsTrigger>
        <TabsTrigger value="adjustments">
          <Users className="mr-2 h-4 w-4" />
          Adjustments
        </TabsTrigger>
      </TabsList>

      <TabsContent value="bands" className="space-y-4">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-6">Salary Bands by Role</h3>
          <div className="space-y-4">
            {[
              { role: "Senior Engineer", level: "L5", min: "$120K", mid: "$150K", max: "$180K", employees: 12 },
              { role: "Product Manager", level: "L4", min: "$100K", mid: "$130K", max: "$160K", employees: 8 },
              { role: "Designer", level: "L3", min: "$80K", mid: "$100K", max: "$120K", employees: 6 },
            ].map((band) => (
              <Card key={band.role} className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-medium">{band.role}</p>
                    <p className="text-sm text-muted-foreground">Level {band.level}</p>
                  </div>
                  <Badge variant="secondary">{band.employees} employees</Badge>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Min</p>
                    <p className="font-semibold">{band.min}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Mid</p>
                    <p className="font-semibold">{band.mid}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Max</p>
                    <p className="font-semibold">{band.max}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Card>
      </TabsContent>

      <TabsContent value="cycles" className="space-y-4">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold">Compensation Review Cycles</h3>
              <p className="text-sm text-muted-foreground">Annual and mid-year review cycles</p>
            </div>
            <Button>Start New Cycle</Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="p-4">
              <p className="text-sm text-muted-foreground mb-1">Next Review</p>
              <p className="text-2xl font-bold">Q2 2024</p>
              <p className="text-xs text-muted-foreground">Annual cycle</p>
            </Card>
            <Card className="p-4">
              <p className="text-sm text-muted-foreground mb-1">Budget Allocated</p>
              <p className="text-2xl font-bold">$450K</p>
              <p className="text-xs text-muted-foreground">For adjustments</p>
            </Card>
          </div>
        </Card>
      </TabsContent>

      <TabsContent value="adjustments" className="space-y-4">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-6">Pending Adjustments</h3>
          <div className="space-y-3">
            {[
              { name: "John Smith", current: "$140K", proposed: "$155K", increase: "10.7%", status: "Pending" },
              { name: "Sarah Johnson", current: "$120K", proposed: "$135K", increase: "12.5%", status: "Approved" },
            ].map((adj) => (
              <Card key={adj.name} className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-medium">{adj.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {adj.current} → {adj.proposed}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge variant={adj.status === "Approved" ? "default" : "secondary"}>{adj.status}</Badge>
                    <p className="text-sm font-semibold text-green-600 mt-1">+{adj.increase}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
