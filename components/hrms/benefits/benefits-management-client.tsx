"use client"

import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, FileText, DollarSign } from "lucide-react"
import { useBenefitsData } from "@/lib/hooks/use-hrms-data"

export function BenefitsManagementClient() {
  const { plans, enrollment, claims, isLoading, error } = useBenefitsData()

  if (error) {
    return (
      <Card className="p-6">
        <p className="text-red-500">Failed to load benefits data: {error.message}</p>
      </Card>
    )
  }

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
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading plans...</div>
          ) : plans && plans.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {plans.map((plan: any) => (
                <Card key={plan.id} className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-medium">{plan.name}</p>
                      <p className="text-sm text-muted-foreground">{plan.type}</p>
                    </div>
                    <Badge variant="secondary">{plan.enrolled_count || 0} enrolled</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Cost</span>
                    <span className="font-semibold">
                      {plan.currency} {plan.employee_cost?.toLocaleString()}/mo
                    </span>
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-3 bg-transparent">
                    Manage Plan
                  </Button>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">No benefits plans configured</div>
          )}
        </Card>
      </TabsContent>

      <TabsContent value="enrollment" className="space-y-4">
        <Card className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold">Open Enrollment</h3>
            <p className="text-sm text-muted-foreground">{enrollment?.period || "No active enrollment period"}</p>
          </div>

          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading enrollment data...</div>
          ) : enrollment ? (
            <div className="grid gap-4 md:grid-cols-3">
              <Card className="p-4">
                <p className="text-sm text-muted-foreground mb-1">Eligible</p>
                <p className="text-2xl font-bold">{enrollment.eligible || 0}</p>
                <p className="text-xs text-muted-foreground">Employees</p>
              </Card>
              <Card className="p-4">
                <p className="text-sm text-muted-foreground mb-1">Enrolled</p>
                <p className="text-2xl font-bold">{enrollment.enrolled || 0}</p>
                <p className="text-xs text-green-600">{enrollment.participationRate || 0}% participation</p>
              </Card>
              <Card className="p-4">
                <p className="text-sm text-muted-foreground mb-1">Pending</p>
                <p className="text-2xl font-bold">{enrollment.pending || 0}</p>
                <p className="text-xs text-orange-600">Requires action</p>
              </Card>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">No enrollment data available</div>
          )}
        </Card>
      </TabsContent>

      <TabsContent value="claims" className="space-y-4">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-6">Recent Claims</h3>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading claims...</div>
          ) : claims && claims.length > 0 ? (
            <div className="space-y-3">
              {claims.map((claim: any) => (
                <Card key={claim.id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium">
                        {claim.employee?.first_name} {claim.employee?.last_name}
                      </p>
                      <p className="text-sm text-muted-foreground">{claim.type}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {claim.date ? new Date(claim.date).toLocaleDateString() : "-"}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge variant={claim.status === "approved" ? "default" : "secondary"}>{claim.status}</Badge>
                      <p className="text-sm font-semibold mt-1">
                        {claim.currency} {claim.amount?.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">No recent claims</div>
          )}
        </Card>
      </TabsContent>
    </Tabs>
  )
}
