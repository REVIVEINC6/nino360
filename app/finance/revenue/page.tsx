"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  TrendingUp,
  DollarSign,
  Target,
  BarChart3,
  Users,
  Building,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Filter,
  Download,
} from "lucide-react"

export default function RevenueManagementPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("month")

  const revenueMetrics = {
    totalRevenue: 2450000,
    monthlyGrowth: 12.5,
    quarterlyGrowth: 8.3,
    yearlyGrowth: 15.7,
    recurringRevenue: 1850000,
    oneTimeRevenue: 600000,
    projectedRevenue: 2750000,
  }

  const revenueStreams = [
    {
      id: 1,
      name: "Permanent Placements",
      amount: 1200000,
      percentage: 49,
      growth: 15.2,
      clients: 45,
      placements: 120,
    },
    {
      id: 2,
      name: "Contract Staffing",
      amount: 850000,
      percentage: 35,
      growth: 8.7,
      clients: 32,
      contractors: 85,
    },
    {
      id: 3,
      name: "Retained Search",
      amount: 400000,
      percentage: 16,
      growth: 22.1,
      clients: 18,
      searches: 25,
    },
  ]

  const topClients = [
    { name: "TechCorp Solutions", revenue: 245000, growth: 18.5, placements: 12 },
    { name: "Global Dynamics", revenue: 189000, growth: -5.2, placements: 8 },
    { name: "Innovation Labs", revenue: 156000, growth: 25.8, placements: 15 },
    { name: "Enterprise Systems", revenue: 134000, growth: 12.3, placements: 9 },
    { name: "Digital Ventures", revenue: 98000, growth: 31.2, placements: 6 },
  ]

  const monthlyRevenue = [
    { month: "Jan", revenue: 2100000, target: 2000000, placements: 95 },
    { month: "Feb", revenue: 2250000, target: 2100000, placements: 102 },
    { month: "Mar", revenue: 2450000, target: 2200000, placements: 118 },
    { month: "Apr", revenue: 2380000, target: 2300000, placements: 115 },
    { month: "May", revenue: 2520000, target: 2400000, placements: 125 },
    { month: "Jun", revenue: 2650000, target: 2500000, placements: 132 },
  ]

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(revenueMetrics.totalRevenue)}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />+{revenueMetrics.monthlyGrowth}% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recurring Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{formatCurrency(revenueMetrics.recurringRevenue)}</div>
            <div className="text-xs text-muted-foreground">
              {((revenueMetrics.recurringRevenue / revenueMetrics.totalRevenue) * 100).toFixed(1)}% of total
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projected Revenue</CardTitle>
            <Target className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{formatCurrency(revenueMetrics.projectedRevenue)}</div>
            <div className="text-xs text-muted-foreground">Next month forecast</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Growth Rate</CardTitle>
            <BarChart3 className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">+{revenueMetrics.yearlyGrowth}%</div>
            <div className="text-xs text-muted-foreground">Year over year</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="streams">Revenue Streams</TabsTrigger>
            <TabsTrigger value="clients">Top Clients</TabsTrigger>
            <TabsTrigger value="forecasting">Forecasting</TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              New Revenue Entry
            </Button>
          </div>
        </div>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Monthly Revenue Trend */}
            <Card>
              <CardHeader>
                <CardTitle>Monthly Revenue Trend</CardTitle>
                <CardDescription>Revenue vs targets over the last 6 months</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {monthlyRevenue.map((data, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{data.month}</span>
                        <div className="text-right">
                          <div className="text-sm font-semibold text-green-600">{formatCurrency(data.revenue)}</div>
                          <div className="text-xs text-muted-foreground">
                            Target: {formatCurrency(data.target)} • {data.placements} placements
                          </div>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <Progress value={(data.revenue / 3000000) * 100} className="h-2" />
                        <Progress value={(data.target / 3000000) * 100} className="h-1 opacity-50" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Revenue Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue Breakdown</CardTitle>
                <CardDescription>Current month revenue composition</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Recurring Revenue</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold">{formatCurrency(revenueMetrics.recurringRevenue)}</div>
                      <div className="text-xs text-muted-foreground">
                        {((revenueMetrics.recurringRevenue / revenueMetrics.totalRevenue) * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                  <Progress
                    value={(revenueMetrics.recurringRevenue / revenueMetrics.totalRevenue) * 100}
                    className="h-2"
                  />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-sm">One-time Revenue</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold">{formatCurrency(revenueMetrics.oneTimeRevenue)}</div>
                      <div className="text-xs text-muted-foreground">
                        {((revenueMetrics.oneTimeRevenue / revenueMetrics.totalRevenue) * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                  <Progress
                    value={(revenueMetrics.oneTimeRevenue / revenueMetrics.totalRevenue) * 100}
                    className="h-2"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="streams" className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {revenueStreams.map((stream) => (
              <Card key={stream.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold">{stream.name}</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Building className="h-4 w-4" />
                          {stream.clients} clients
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {stream.placements || stream.contractors || stream.searches} placements
                        </div>
                      </div>
                    </div>
                    <div className="text-right space-y-2">
                      <div className="text-2xl font-bold">{formatCurrency(stream.amount)}</div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{stream.percentage}% of total</Badge>
                        <div
                          className={`flex items-center text-xs ${
                            stream.growth > 0 ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {stream.growth > 0 ? (
                            <ArrowUpRight className="h-3 w-3 mr-1" />
                          ) : (
                            <ArrowDownRight className="h-3 w-3 mr-1" />
                          )}
                          {Math.abs(stream.growth)}%
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Progress value={stream.percentage} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="clients" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Revenue Clients</CardTitle>
              <CardDescription>Highest revenue generating clients this period</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topClients.map((client, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{client.name}</span>
                        <Badge variant="outline">#{index + 1}</Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">{client.placements} placements</div>
                    </div>
                    <div className="text-right space-y-1">
                      <div className="font-semibold">{formatCurrency(client.revenue)}</div>
                      <div
                        className={`flex items-center text-xs ${client.growth > 0 ? "text-green-600" : "text-red-600"}`}
                      >
                        {client.growth > 0 ? (
                          <ArrowUpRight className="h-3 w-3 mr-1" />
                        ) : (
                          <ArrowDownRight className="h-3 w-3 mr-1" />
                        )}
                        {Math.abs(client.growth)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="forecasting" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Forecasting</CardTitle>
              <CardDescription>Predict future revenue based on current trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="forecast-period">Forecast Period</Label>
                    <Input id="forecast-period" placeholder="Next 6 months" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="growth-rate">Expected Growth Rate</Label>
                    <Input id="growth-rate" placeholder="12.5%" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confidence">Confidence Level</Label>
                    <Input id="confidence" placeholder="85%" />
                  </div>
                </div>

                <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
                  <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Advanced Forecasting</h3>
                  <p className="text-muted-foreground mb-4">AI-powered revenue forecasting coming soon</p>
                  <Button>
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Generate Forecast
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
