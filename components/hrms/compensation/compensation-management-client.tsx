"use client"

import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { DollarSign, TrendingUp, Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useCompensationData } from "@/lib/hooks/use-hrms-data"

export function CompensationManagementClient() {
  const { bands, cycles, adjustments, isLoading, error } = useCompensationData()

  if (error) {
    return (
      <Card className="p-6">
        <p className="text-red-500">Failed to load compensation data: {error.message}</p>
      </Card>
    )
  }

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
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading salary bands...</div>
          ) : bands && bands.length > 0 ? (
            <div className="space-y-4">
              {bands.map((band) => (
                <Card key={band.id} className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-medium">{band.job_family}</p>
                      <p className="text-sm text-muted-foreground">
                        Grade {band.grade} • Level {band.level}
                      </p>
                    </div>
                    <Badge variant="secondary">{band.employee_count || 0} employees</Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Min</p>
                      <p className="font-semibold">
                        {band.currency} {band.min_base?.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Mid</p>
                      <p className="font-semibold">
                        {band.currency} {band.mid_base?.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Max</p>
                      <p className="font-semibold">
                        {band.currency} {band.max_base?.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">No salary bands configured</div>
          )}
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

          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading cycles...</div>
          ) : cycles ? (
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="p-4">
                <p className="text-sm text-muted-foreground mb-1">Next Review</p>
                <p className="text-2xl font-bold">{cycles.nextReview || "Not scheduled"}</p>
                <p className="text-xs text-muted-foreground">{cycles.cycleType || "Annual cycle"}</p>
              </Card>
              <Card className="p-4">
                <p className="text-sm text-muted-foreground mb-1">Budget Allocated</p>
                <p className="text-2xl font-bold">{cycles.budgetAllocated || "$0"}</p>
                <p className="text-xs text-muted-foreground">For adjustments</p>
              </Card>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">No active cycles</div>
          )}
        </Card>
      </TabsContent>

      <TabsContent value="adjustments" className="space-y-4">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-6">Pending Adjustments</h3>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading adjustments...</div>
          ) : adjustments && adjustments.length > 0 ? (
            <div className="space-y-3">
              {adjustments.map((adj) => (
                <Card key={adj.id} className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-medium">
                        {adj.employee?.first_name} {adj.employee?.last_name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {adj.currency} {adj.current_base?.toLocaleString()} → {adj.currency}{" "}
                        {adj.proposed_base?.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge variant={adj.status === "approved" ? "default" : "secondary"}>{adj.status}</Badge>
                      <p className="text-sm font-semibold text-green-600 mt-1">+{adj.increase_pct?.toFixed(1)}%</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">No pending adjustments</div>
          )}
        </Card>
      </TabsContent>
    </Tabs>
  )
}
