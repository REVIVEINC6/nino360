"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts"
import {
  Globe,
  Users,
  TrendingUp,
  DollarSign,
  Target,
  Plus,
  Activity,
  Search,
  Filter,
  Download,
  RefreshCw,
} from "lucide-react"

const leadSources = [
  {
    id: "website",
    name: "Website",
    description: "Organic website visitors and form submissions",
    leads: 1247,
    conversions: 156,
    conversionRate: 12.5,
    cost: 2500,
    costPerLead: 2.01,
    revenue: 234000,
    roi: 9260,
    trend: "up",
    change: 15.3,
    color: "#3b82f6",
    icon: Globe,
    status: "active",
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    description: "LinkedIn ads and organic social media",
    leads: 892,
    conversions: 98,
    conversionRate: 11.0,
    cost: 8500,
    costPerLead: 9.53,
    revenue: 147000,
    roi: 1629,
    trend: "up",
    change: 8.7,
    color: "#0077b5",
    icon: Users,
    status: "active",
  },
  {
    id: "google-ads",
    name: "Google Ads",
    description: "Paid search and display advertising",
    leads: 634,
    conversions: 67,
    conversionRate: 10.6,
    cost: 12000,
    costPerLead: 18.93,
    revenue: 100500,
    roi: 738,
    trend: "down",
    change: -3.2,
    color: "#ea4335",
    icon: Target,
    status: "active",
  },
  {
    id: "referrals",
    name: "Referrals",
    description: "Customer and partner referrals",
    leads: 423,
    conversions: 89,
    conversionRate: 21.0,
    cost: 1500,
    costPerLead: 3.55,
    revenue: 133500,
    roi: 8800,
    trend: "up",
    change: 12.1,
    color: "#10b981",
    icon: Users,
    status: "active",
  },
  {
    id: "email",
    name: "Email Marketing",
    description: "Email campaigns and newsletters",
    leads: 567,
    conversions: 45,
    conversionRate: 7.9,
    cost: 800,
    costPerLead: 1.41,
    revenue: 67500,
    roi: 8338,
    trend: "stable",
    change: 0.5,
    color: "#8b5cf6",
    icon: Activity,
    status: "active",
  },
  {
    id: "events",
    name: "Events & Trade Shows",
    description: "Industry events and conferences",
    leads: 234,
    conversions: 34,
    conversionRate: 14.5,
    cost: 15000,
    costPerLead: 64.1,
    revenue: 51000,
    roi: 240,
    trend: "up",
    change: 5.8,
    color: "#f59e0b",
    icon: Users,
    status: "seasonal",
  },
]

const monthlyData = [
  { month: "Jan", website: 98, linkedin: 67, googleAds: 45, referrals: 23, email: 34, events: 12 },
  { month: "Feb", website: 112, linkedin: 78, googleAds: 52, referrals: 28, email: 41, events: 8 },
  { month: "Mar", website: 134, linkedin: 89, googleAds: 48, referrals: 35, email: 38, events: 15 },
  { month: "Apr", website: 156, linkedin: 98, googleAds: 67, referrals: 42, email: 45, events: 18 },
  { month: "May", website: 142, linkedin: 87, googleAds: 59, referrals: 38, email: 52, events: 22 },
  { month: "Jun", website: 168, linkedin: 105, googleAds: 71, referrals: 45, email: 48, events: 25 },
]

export default function LeadSourcesPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTimeframe, setSelectedTimeframe] = useState("6m")

  const filteredSources = leadSources.filter(
    (source) =>
      source.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      source.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const totalLeads = leadSources.reduce((sum, source) => sum + source.leads, 0)
  const totalConversions = leadSources.reduce((sum, source) => sum + source.conversions, 0)
  const totalCost = leadSources.reduce((sum, source) => sum + source.cost, 0)
  const totalRevenue = leadSources.reduce((sum, source) => sum + source.revenue, 0)
  const avgConversionRate = (totalConversions / totalLeads) * 100
  const avgCostPerLead = totalCost / totalLeads
  const totalROI = ((totalRevenue - totalCost) / totalCost) * 100

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-500" />
      case "down":
        return <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />
      default:
        return <Activity className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200"
      case "seasonal":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "paused":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-blue-100 text-blue-800 border-blue-200"
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(value)
  }

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Lead Sources</h1>
          <p className="text-muted-foreground">Track and optimize your lead generation channels</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Source
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Leads</p>
                <p className="text-2xl font-bold">{totalLeads.toLocaleString()}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">Across all sources</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Conversion Rate</p>
                <p className="text-2xl font-bold">{formatPercentage(avgConversionRate)}</p>
              </div>
              <Target className="h-8 w-8 text-green-500" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">Lead to customer</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Cost Per Lead</p>
                <p className="text-2xl font-bold">{formatCurrency(avgCostPerLead)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-orange-500" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">Blended average</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total ROI</p>
                <p className="text-2xl font-bold">{formatPercentage(totalROI)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-500" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">Return on investment</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Search and Filters */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search sources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>

          {/* Lead Sources Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredSources.map((source, index) => {
              const IconComponent = source.icon
              return (
                <motion.div
                  key={source.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg shadow-lg" style={{ backgroundColor: `${source.color}20` }}>
                            <IconComponent className="h-5 w-5" style={{ color: source.color }} />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{source.name}</CardTitle>
                            <CardDescription className="text-sm">{source.description}</CardDescription>
                          </div>
                        </div>
                        <Badge className={getStatusColor(source.status)}>{source.status}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {/* Key Metrics */}
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground">Leads</p>
                            <p className="text-xl font-bold">{source.leads.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Conversions</p>
                            <p className="text-xl font-bold">{source.conversions}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Conv. Rate</p>
                            <p className="text-lg font-semibold text-green-600">
                              {formatPercentage(source.conversionRate)}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Cost/Lead</p>
                            <p className="text-lg font-semibold">{formatCurrency(source.costPerLead)}</p>
                          </div>
                        </div>

                        {/* Performance Indicator */}
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>ROI</span>
                            <span className="font-medium">{formatPercentage(source.roi)}</span>
                          </div>
                          <Progress value={Math.min(source.roi / 100, 100)} className="h-2" />
                        </div>

                        {/* Trend */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {getTrendIcon(source.trend)}
                            <span
                              className={`text-sm font-medium ${
                                source.trend === "up"
                                  ? "text-green-600"
                                  : source.trend === "down"
                                    ? "text-red-600"
                                    : "text-gray-600"
                              }`}
                            >
                              {source.change > 0 ? "+" : ""}
                              {source.change}%
                            </span>
                          </div>
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Lead Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Lead Distribution</CardTitle>
                <CardDescription>Breakdown of leads by source</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={leadSources}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="leads"
                      label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {leadSources.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Conversion Rates */}
            <Card>
              <CardHeader>
                <CardTitle>Conversion Rates</CardTitle>
                <CardDescription>Lead to customer conversion by source</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={leadSources}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value}%`, "Conversion Rate"]} />
                    <Bar dataKey="conversionRate" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Performance Table */}
          <Card>
            <CardHeader>
              <CardTitle>Detailed Performance Metrics</CardTitle>
              <CardDescription>Comprehensive view of all lead source metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Source</th>
                      <th className="text-right p-2">Leads</th>
                      <th className="text-right p-2">Conversions</th>
                      <th className="text-right p-2">Conv. Rate</th>
                      <th className="text-right p-2">Cost</th>
                      <th className="text-right p-2">Cost/Lead</th>
                      <th className="text-right p-2">Revenue</th>
                      <th className="text-right p-2">ROI</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leadSources.map((source) => (
                      <tr key={source.id} className="border-b hover:bg-gray-50">
                        <td className="p-2">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: source.color }} />
                            {source.name}
                          </div>
                        </td>
                        <td className="text-right p-2">{source.leads.toLocaleString()}</td>
                        <td className="text-right p-2">{source.conversions}</td>
                        <td className="text-right p-2">{formatPercentage(source.conversionRate)}</td>
                        <td className="text-right p-2">{formatCurrency(source.cost)}</td>
                        <td className="text-right p-2">{formatCurrency(source.costPerLead)}</td>
                        <td className="text-right p-2">{formatCurrency(source.revenue)}</td>
                        <td className="text-right p-2 font-semibold text-green-600">{formatPercentage(source.roi)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Lead Generation Trends</CardTitle>
              <CardDescription>Monthly lead volume by source over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="website" stroke="#3b82f6" strokeWidth={2} />
                  <Line type="monotone" dataKey="linkedin" stroke="#0077b5" strokeWidth={2} />
                  <Line type="monotone" dataKey="googleAds" stroke="#ea4335" strokeWidth={2} />
                  <Line type="monotone" dataKey="referrals" stroke="#10b981" strokeWidth={2} />
                  <Line type="monotone" dataKey="email" stroke="#8b5cf6" strokeWidth={2} />
                  <Line type="monotone" dataKey="events" stroke="#f59e0b" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Lead Source Configuration</CardTitle>
              <CardDescription>Manage tracking and attribution settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <Label htmlFor="attribution-window">Attribution Window (days)</Label>
                  <Input id="attribution-window" type="number" defaultValue="30" className="mt-1 max-w-xs" />
                  <p className="text-sm text-muted-foreground mt-1">
                    How long to attribute conversions to a lead source
                  </p>
                </div>

                <div>
                  <Label htmlFor="utm-tracking">UTM Parameter Tracking</Label>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked />
                      <span className="text-sm">Track utm_source</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked />
                      <span className="text-sm">Track utm_medium</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked />
                      <span className="text-sm">Track utm_campaign</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button>Save Settings</Button>
                  <Button variant="outline">Reset to Default</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
