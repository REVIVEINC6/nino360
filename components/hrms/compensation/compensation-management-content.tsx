"use client"

import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { DollarSign, TrendingUp, Users, BarChart3, AlertCircle, CheckCircle, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export function CompensationManagementContent() {
  // Mock data - replace with actual data fetching
  const stats = {
    activeCycles: 2,
    pendingReviews: 45,
    avgIncrease: 4.2,
    budgetUsed: 67,
  }

  const bands = [
    {
      id: "1",
      job_family: "Engineering",
      grade: "E5",
      level: "Senior",
      region: "US",
      currency: "USD",
      min_amount: 120000,
      mid_amount: 150000,
      max_amount: 180000,
      employee_count: 24,
      compa_ratio: 98.5,
    },
    {
      id: "2",
      job_family: "Product",
      grade: "P4",
      level: "Lead",
      region: "US",
      currency: "USD",
      min_amount: 130000,
      mid_amount: 160000,
      max_amount: 190000,
      employee_count: 12,
      compa_ratio: 102.3,
    },
    {
      id: "3",
      job_family: "Sales",
      grade: "S3",
      level: "Manager",
      region: "US",
      currency: "USD",
      min_amount: 100000,
      mid_amount: 125000,
      max_amount: 150000,
      employee_count: 18,
      compa_ratio: 95.8,
    },
  ]

  const cycles = [
    {
      id: "1",
      name: "2025 Annual Review",
      kind: "ANNUAL",
      status: "OPEN",
      period_from: "2025-01-01",
      period_to: "2025-12-31",
      budget_total: 2500000,
      budget_used: 1675000,
      proposals_count: 45,
      approved_count: 28,
    },
    {
      id: "2",
      name: "2025 Mid-Year Adjustment",
      kind: "MIDYEAR",
      status: "DRAFT",
      period_from: "2025-07-01",
      period_to: "2025-12-31",
      budget_total: 500000,
      budget_used: 0,
      proposals_count: 0,
      approved_count: 0,
    },
  ]

  const proposals = [
    {
      id: "1",
      employee: { first_name: "Sarah", last_name: "Chen", email: "sarah.chen@company.com" },
      current_base: 145000,
      proposed_base: 155000,
      merit_pct: 6.9,
      status: "PENDING",
      manager: "John Smith",
      ai_recommendation: "APPROVE",
      equity_score: 92,
    },
    {
      id: "2",
      employee: { first_name: "Michael", last_name: "Johnson", email: "michael.j@company.com" },
      current_base: 128000,
      proposed_base: 135000,
      merit_pct: 5.5,
      status: "APPROVED",
      manager: "Jane Doe",
      ai_recommendation: "APPROVE",
      equity_score: 88,
    },
    {
      id: "3",
      employee: { first_name: "Emily", last_name: "Rodriguez", email: "emily.r@company.com" },
      current_base: 162000,
      proposed_base: 175000,
      merit_pct: 8.0,
      status: "PENDING",
      manager: "John Smith",
      ai_recommendation: "REVIEW",
      equity_score: 75,
    },
  ]

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="glass-card p-6 backdrop-blur-xl bg-white/70 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Cycles</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mt-2">
                {stats.activeCycles}
              </p>
              <p className="text-xs text-gray-500 mt-1">Review periods</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
          </div>
        </Card>

        <Card className="glass-card p-6 backdrop-blur-xl bg-white/70 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Reviews</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mt-2">
                {stats.pendingReviews}
              </p>
              <p className="text-xs text-gray-500 mt-1">Awaiting approval</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
              <Clock className="h-6 w-6 text-white" />
            </div>
          </div>
        </Card>

        <Card className="glass-card p-6 backdrop-blur-xl bg-white/70 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Increase</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mt-2">
                {stats.avgIncrease}%
              </p>
              <p className="text-xs text-gray-500 mt-1">Merit adjustments</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
          </div>
        </Card>

        <Card className="glass-card p-6 backdrop-blur-xl bg-white/70 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Budget Used</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mt-2">
                {stats.budgetUsed}%
              </p>
              <p className="text-xs text-gray-500 mt-1">Of total allocation</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
          </div>
        </Card>
      </div>

      {/* AI Insights */}
      <Card className="glass-card p-6 backdrop-blur-xl bg-white/70 border border-white/20 shadow-xl">
        <div className="flex items-start gap-4">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
            <BarChart3 className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-2">AI Compensation Insights</h3>
            <div className="grid gap-3 md:grid-cols-3">
              <div className="p-3 rounded-lg bg-green-50 border border-green-200">
                <p className="text-sm font-medium text-green-900">Pay Equity Score</p>
                <p className="text-2xl font-bold text-green-600 mt-1">87/100</p>
                <p className="text-xs text-green-700 mt-1">Above industry average</p>
              </div>
              <div className="p-3 rounded-lg bg-orange-50 border border-orange-200">
                <p className="text-sm font-medium text-orange-900">Compression Risk</p>
                <p className="text-2xl font-bold text-orange-600 mt-1">12</p>
                <p className="text-xs text-orange-700 mt-1">Employees flagged</p>
              </div>
              <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
                <p className="text-sm font-medium text-blue-900">Market Alignment</p>
                <p className="text-2xl font-bold text-blue-600 mt-1">94%</p>
                <p className="text-xs text-blue-700 mt-1">Within competitive range</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="bands" className="space-y-6">
        <TabsList className="glass-card backdrop-blur-xl bg-white/70 border border-white/20 p-1">
          <TabsTrigger
            value="bands"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white"
          >
            <DollarSign className="mr-2 h-4 w-4" />
            Salary Bands
          </TabsTrigger>
          <TabsTrigger
            value="cycles"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white"
          >
            <TrendingUp className="mr-2 h-4 w-4" />
            Review Cycles
          </TabsTrigger>
          <TabsTrigger
            value="proposals"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white"
          >
            <Users className="mr-2 h-4 w-4" />
            Proposals
          </TabsTrigger>
          <TabsTrigger
            value="equity"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white"
          >
            <BarChart3 className="mr-2 h-4 w-4" />
            Pay Equity
          </TabsTrigger>
        </TabsList>

        <TabsContent value="bands" className="space-y-4">
          <Card className="glass-card p-6 backdrop-blur-xl bg-white/70 border border-white/20 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Salary Bands by Role</h3>
              <Button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600">
                Add Band
              </Button>
            </div>
            <div className="space-y-4">
              {bands.map((band) => (
                <Card
                  key={band.id}
                  className="p-4 bg-white/50 border border-white/30 hover:bg-white/70 transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-medium text-gray-900">{band.job_family}</p>
                      <p className="text-sm text-gray-600">
                        Grade {band.grade} • Level {band.level} • {band.region}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                        {band.employee_count} employees
                      </Badge>
                      <Badge
                        variant={band.compa_ratio > 100 ? "destructive" : "default"}
                        className={band.compa_ratio > 100 ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}
                      >
                        CR: {band.compa_ratio}%
                      </Badge>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Min</p>
                      <p className="font-semibold text-gray-900">
                        {band.currency} {band.min_amount.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Mid</p>
                      <p className="font-semibold text-gray-900">
                        {band.currency} {band.mid_amount.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Max</p>
                      <p className="font-semibold text-gray-900">
                        {band.currency} {band.max_amount.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="cycles" className="space-y-4">
          <Card className="glass-card p-6 backdrop-blur-xl bg-white/70 border border-white/20 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Compensation Review Cycles</h3>
                <p className="text-sm text-gray-600">Annual and mid-year review cycles</p>
              </div>
              <Button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600">
                Start New Cycle
              </Button>
            </div>

            <div className="space-y-4">
              {cycles.map((cycle) => (
                <Card
                  key={cycle.id}
                  className="p-6 bg-white/50 border border-white/30 hover:bg-white/70 transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="font-semibold text-gray-900">{cycle.name}</h4>
                      <p className="text-sm text-gray-600">
                        {cycle.period_from} to {cycle.period_to}
                      </p>
                    </div>
                    <Badge
                      variant={cycle.status === "OPEN" ? "default" : "secondary"}
                      className={cycle.status === "OPEN" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}
                    >
                      {cycle.status}
                    </Badge>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2 mb-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Budget Progress</p>
                      <div className="flex items-center gap-2">
                        <Progress value={(cycle.budget_used / cycle.budget_total) * 100} className="flex-1" />
                        <span className="text-sm font-medium text-gray-900">
                          {((cycle.budget_used / cycle.budget_total) * 100).toFixed(0)}%
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        ${cycle.budget_used.toLocaleString()} of ${cycle.budget_total.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Proposals</p>
                      <div className="flex items-center gap-4">
                        <div>
                          <p className="text-2xl font-bold text-gray-900">{cycle.proposals_count}</p>
                          <p className="text-xs text-gray-500">Total</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-green-600">{cycle.approved_count}</p>
                          <p className="text-xs text-gray-500">Approved</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                    <Button variant="outline" size="sm">
                      Export
                    </Button>
                    {cycle.status === "OPEN" && (
                      <Button size="sm" className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                        Review Proposals
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="proposals" className="space-y-4">
          <Card className="glass-card p-6 backdrop-blur-xl bg-white/70 border border-white/20 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Compensation Proposals</h3>
            <div className="space-y-3">
              {proposals.map((proposal) => (
                <Card
                  key={proposal.id}
                  className="p-4 bg-white/50 border border-white/30 hover:bg-white/70 transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <p className="font-medium text-gray-900">
                          {proposal.employee.first_name} {proposal.employee.last_name}
                        </p>
                        <Badge
                          variant={proposal.status === "APPROVED" ? "default" : "secondary"}
                          className={
                            proposal.status === "APPROVED"
                              ? "bg-green-100 text-green-700"
                              : "bg-orange-100 text-orange-700"
                          }
                        >
                          {proposal.status}
                        </Badge>
                        {proposal.ai_recommendation === "APPROVE" ? (
                          <Badge className="bg-blue-100 text-blue-700">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            AI Approved
                          </Badge>
                        ) : (
                          <Badge className="bg-yellow-100 text-yellow-700">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            AI Review
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{proposal.employee.email}</p>
                      <p className="text-xs text-gray-500 mt-1">Manager: {proposal.manager}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Current → Proposed</p>
                      <p className="font-semibold text-gray-900">
                        ${proposal.current_base.toLocaleString()} → ${proposal.proposed_base.toLocaleString()}
                      </p>
                      <p className="text-sm font-semibold text-green-600 mt-1">+{proposal.merit_pct}%</p>
                      <p className="text-xs text-gray-500 mt-1">Equity Score: {proposal.equity_score}/100</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                    {proposal.status === "PENDING" && (
                      <>
                        <Button size="sm" className="bg-green-500 text-white hover:bg-green-600">
                          Approve
                        </Button>
                        <Button size="sm" variant="destructive">
                          Reject
                        </Button>
                      </>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="equity" className="space-y-4">
          <Card className="glass-card p-6 backdrop-blur-xl bg-white/70 border border-white/20 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Pay Equity Analysis</h3>
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-3">
                <Card className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200">
                  <p className="text-sm font-medium text-green-900">Gender Pay Gap</p>
                  <p className="text-3xl font-bold text-green-600 mt-2">2.1%</p>
                  <p className="text-xs text-green-700 mt-1">Below 5% target</p>
                </Card>
                <Card className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200">
                  <p className="text-sm font-medium text-blue-900">Compa-Ratio Avg</p>
                  <p className="text-3xl font-bold text-blue-600 mt-2">98.7%</p>
                  <p className="text-xs text-blue-700 mt-1">Within target range</p>
                </Card>
                <Card className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200">
                  <p className="text-sm font-medium text-purple-900">Compression Cases</p>
                  <p className="text-3xl font-bold text-purple-600 mt-2">8</p>
                  <p className="text-xs text-purple-700 mt-1">Require attention</p>
                </Card>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-3">AI Recommendations</h4>
                <div className="space-y-2">
                  <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-900">Overall equity score is strong</p>
                      <p className="text-xs text-blue-700 mt-1">
                        Your compensation structure shows minimal bias across demographics
                      </p>
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-orange-50 border border-orange-200 flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-orange-900">Review compression in Engineering</p>
                      <p className="text-xs text-orange-700 mt-1">
                        8 senior engineers are within 5% of their direct reports' salaries
                      </p>
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-green-50 border border-green-200 flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-green-900">Market alignment is competitive</p>
                      <p className="text-xs text-green-700 mt-1">
                        94% of roles are within competitive range for your market
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
