"use client"

import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, FileText, DollarSign } from "lucide-react"

export function BenefitsManagement() {
  return (
    <Tabs defaultValue="plans" className="space-y-6">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="plans">
          <Heart className="mr-2 h-4 w-4" />
          Plans
        </TabsTrigger>
        <TabsTrigger value="enrollment">
          <FileText className="mr-2 h-4 w-4" />
          Enrollment
        </TabsTrigger>
        <TabsTrigger value="claims">
          <DollarSign className="mr-2 h-4 w-4" />
          Claims
        </TabsTrigger>
      </TabsList>

      <TabsContent value="plans" className="space-y-4">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-6">Benefits Plans</h3>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              { name: "Health Insurance", provider: "Blue Cross", enrolled: 45, cost: "$450/mo" },
              { name: "Dental Insurance", provider: "Delta Dental", enrolled: 38, cost: "$50/mo" },
              { name: "Vision Insurance", provider: "VSP", enrolled: 32, cost: "$25/mo" },
              { name: "401(k) Plan", provider: "Fidelity", enrolled: 42, cost: "Varies" },
            ].map((plan) => (
              <Card key={plan.name} className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-medium">{plan.name}</p>
                    <p className="text-sm text-muted-foreground">{plan.provider}</p>
                  </div>
                  <Badge variant="secondary">{plan.enrolled} enrolled</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Cost</span>
                  <span className="font-semibold">{plan.cost}</span>
                </div>
                <Button variant="outline" size="sm" className="w-full mt-3 bg-transparent">
                  Manage Plan
                </Button>
              </Card>
            ))}
          </div>
        </Card>
      </TabsContent>

      <TabsContent value="enrollment" className="space-y-4">
        <Card className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold">Open Enrollment</h3>
            <p className="text-sm text-muted-foreground">Current enrollment period: Jan 1 - Jan 31, 2024</p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Card className="p-4">
              <p className="text-sm text-muted-foreground mb-1">Eligible</p>
              <p className="text-2xl font-bold">52</p>
              <p className="text-xs text-muted-foreground">Employees</p>
            </Card>
            <Card className="p-4">
              <p className="text-sm text-muted-foreground mb-1">Enrolled</p>
              <p className="text-2xl font-bold">45</p>
              <p className="text-xs text-green-600">87% participation</p>
            </Card>
            <Card className="p-4">
              <p className="text-sm text-muted-foreground mb-1">Pending</p>
              <p className="text-2xl font-bold">7</p>
              <p className="text-xs text-orange-600">Requires action</p>
            </Card>
          </div>
        </Card>
      </TabsContent>

      <TabsContent value="claims" className="space-y-4">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-6">Recent Claims</h3>
          <div className="space-y-3">
            {[
              { employee: "John Smith", type: "Medical", amount: "$1,250", status: "Approved", date: "2024-01-15" },
              { employee: "Sarah Johnson", type: "Dental", amount: "$350", status: "Pending", date: "2024-01-14" },
            ].map((claim, index) => (
              <Card key={index} className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium">{claim.employee}</p>
                    <p className="text-sm text-muted-foreground">{claim.type}</p>
                    <p className="text-xs text-muted-foreground mt-1">{claim.date}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant={claim.status === "Approved" ? "default" : "secondary"}>{claim.status}</Badge>
                    <p className="text-sm font-semibold mt-1">{claim.amount}</p>
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
