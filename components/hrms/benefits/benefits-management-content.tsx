"use client"

import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, FileText, DollarSign, Users, TrendingUp, AlertCircle, CheckCircle } from "lucide-react"
import { useBenefitsData } from "@/lib/hooks/use-hrms-data"

export function BenefitsManagementContent() {
  const { plans, enrollment, claims, isLoading, error } = useBenefitsData()

  if (error) {
    return (
      <Card className="glass-card p-6 border-red-200">
        <div className="flex items-center gap-2 text-red-600">
          <AlertCircle className="h-5 w-5" />
          <p>Failed to load benefits data: {error.message}</p>
        </div>
      </Card>
    )
  }

  const kpis = [
    {
      label: "Active Plans",
      value: plans?.length || 0,
      icon: Heart,
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50",
    },
    {
      label: "Enrolled Employees",
      value: enrollment?.enrolled || 0,
      icon: Users,
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-50",
    },
    {
      label: "Participation Rate",
      value: `${enrollment?.participationRate || 0}%`,
      icon: TrendingUp,
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-50",
    },
    {
      label: "Pending Claims",
      value: claims?.filter((c: any) => c.status === "pending").length || 0,
      icon: DollarSign,
      color: "from-orange-500 to-red-500",
      bgColor: "bg-orange-50",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi, index) => (
          <Card key={index} className="glass-card p-6 border-white/20 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{kpi.label}</p>
                <p className="text-3xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {kpi.value}
                </p>
              </div>
              <div className={`p-3 rounded-xl ${kpi.bgColor}`}>
                <kpi.icon className={`h-6 w-6 bg-linear-to-r ${kpi.color} bg-clip-text text-transparent`} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="plans" className="space-y-6">
        <TabsList className="glass-card border-white/20 p-1">
          <TabsTrigger value="plans" className="data-[state=active]:bg-white/50">
            <Heart className="mr-2 h-4 w-4" />
            Plans
          </TabsTrigger>
          <TabsTrigger value="enrollment" className="data-[state=active]:bg-white/50">
            <FileText className="mr-2 h-4 w-4" />
            Enrollment
          </TabsTrigger>
          <TabsTrigger value="claims" className="data-[state=active]:bg-white/50">
            <DollarSign className="mr-2 h-4 w-4" />
            Claims
          </TabsTrigger>
        </TabsList>

        <TabsContent value="plans" className="space-y-4">
          <Card className="glass-card p-6 border-white/20">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Benefits Plans</h3>
              <Button className="bg-linear-to-r from-blue-600 to-purple-600 text-white">Add Plan</Button>
            </div>
            {isLoading ? (
              <div className="text-center py-8 text-gray-500">Loading plans...</div>
            ) : plans && plans.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {plans.map((plan: any) => (
                  <Card key={plan.id} className="glass-card p-4 border-white/20 hover:shadow-lg transition-all">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-medium">{plan.name}</p>
                        <p className="text-sm text-gray-600">{plan.type}</p>
                      </div>
                      <Badge className="bg-blue-100 text-blue-700">{plan.enrolled_count || 0} enrolled</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm mb-3">
                      <span className="text-gray-600">Cost</span>
                      <span className="font-semibold">
                        {plan.currency} {plan.employee_cost?.toLocaleString()}/mo
                      </span>
                    </div>
                    <Button variant="outline" size="sm" className="w-full bg-transparent">
                      Manage Plan
                    </Button>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">No benefits plans configured</div>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="enrollment" className="space-y-4">
          <Card className="glass-card p-6 border-white/20">
            <div className="mb-6">
              <h3 className="text-lg font-semibold">Open Enrollment</h3>
              <p className="text-sm text-gray-600">{enrollment?.period || "No active enrollment period"}</p>
            </div>

            {isLoading ? (
              <div className="text-center py-8 text-gray-500">Loading enrollment data...</div>
            ) : enrollment ? (
              <div className="grid gap-4 md:grid-cols-3">
                <Card className="glass-card p-4 border-white/20">
                  <p className="text-sm text-gray-600 mb-1">Eligible</p>
                  <p className="text-2xl font-bold">{enrollment.eligible || 0}</p>
                  <p className="text-xs text-gray-500">Employees</p>
                </Card>
                <Card className="glass-card p-4 border-white/20">
                  <p className="text-sm text-gray-600 mb-1">Enrolled</p>
                  <p className="text-2xl font-bold">{enrollment.enrolled || 0}</p>
                  <p className="text-xs text-green-600">{enrollment.participationRate || 0}% participation</p>
                </Card>
                <Card className="glass-card p-4 border-white/20">
                  <p className="text-sm text-gray-600 mb-1">Pending</p>
                  <p className="text-2xl font-bold">{enrollment.pending || 0}</p>
                  <p className="text-xs text-orange-600">Requires action</p>
                </Card>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">No enrollment data available</div>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="claims" className="space-y-4">
          <Card className="glass-card p-6 border-white/20">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Recent Claims</h3>
              <Button variant="outline">View All</Button>
            </div>
            {isLoading ? (
              <div className="text-center py-8 text-gray-500">Loading claims...</div>
            ) : claims && claims.length > 0 ? (
              <div className="space-y-3">
                {claims.map((claim: any) => (
                  <Card key={claim.id} className="glass-card p-4 border-white/20 hover:shadow-lg transition-all">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div
                          className={`p-2 rounded-lg ${claim.status === "approved" ? "bg-green-100" : "bg-orange-100"}`}
                        >
                          {claim.status === "approved" ? (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          ) : (
                            <AlertCircle className="h-5 w-5 text-orange-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">
                            {claim.employee?.first_name} {claim.employee?.last_name}
                          </p>
                          <p className="text-sm text-gray-600">{claim.type}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {claim.date ? new Date(claim.date).toLocaleDateString() : "-"}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge
                          className={
                            claim.status === "approved"
                              ? "bg-green-100 text-green-700"
                              : "bg-orange-100 text-orange-700"
                          }
                        >
                          {claim.status}
                        </Badge>
                        <p className="text-sm font-semibold mt-1">
                          {claim.currency} {claim.amount?.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">No recent claims</div>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
