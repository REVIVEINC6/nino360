"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, Target, TrendingUp, DollarSign, Plus, Filter, Download, BarChart3 } from "lucide-react"

const crmStats = [
  {
    title: "Total Leads",
    value: "1,234",
    change: "+12%",
    icon: Target,
    color: "text-blue-600",
  },
  {
    title: "Qualified Leads",
    value: "456",
    change: "+8%",
    icon: Users,
    color: "text-green-600",
  },
  {
    title: "Conversion Rate",
    value: "24.5%",
    change: "+2.1%",
    icon: TrendingUp,
    color: "text-purple-600",
  },
  {
    title: "Revenue Pipeline",
    value: "$125,430",
    change: "+15%",
    icon: DollarSign,
    color: "text-emerald-600",
  },
]

const recentLeads = [
  { name: "Acme Corp", status: "Qualified", value: "$25,000", source: "Website" },
  { name: "TechStart Inc", status: "New", value: "$15,000", source: "Referral" },
  { name: "Global Solutions", status: "Contacted", value: "$45,000", source: "LinkedIn" },
  { name: "Innovation Labs", status: "Qualified", value: "$30,000", source: "Email" },
]

export default function CRMPage() {
  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">CRM Dashboard</h1>
          <p className="text-muted-foreground">Manage your customer relationships and sales pipeline</p>
        </div>
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
            Add Lead
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {crmStats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">{stat.change}</span> from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Recent Leads */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Recent Leads
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentLeads.map((lead, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{lead.name}</p>
                    <p className="text-sm text-muted-foreground">Source: {lead.source}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{lead.value}</p>
                    <Badge variant={lead.status === "Qualified" ? "default" : "secondary"} className="text-xs">
                      {lead.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pipeline Overview */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Pipeline Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { stage: "New Leads", count: 45, color: "bg-blue-500" },
                { stage: "Qualified", count: 32, color: "bg-green-500" },
                { stage: "Proposal", count: 18, color: "bg-yellow-500" },
                { stage: "Negotiation", count: 12, color: "bg-orange-500" },
                { stage: "Closed Won", count: 8, color: "bg-emerald-500" },
              ].map((stage, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${stage.color}`} />
                    <span className="text-sm">{stage.stage}</span>
                  </div>
                  <Badge variant="outline">{stage.count}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
              <Plus className="h-6 w-6" />
              Add Lead
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
              <Users className="h-6 w-6" />
              Import Contacts
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
              <BarChart3 className="h-6 w-6" />
              View Reports
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
              <TrendingUp className="h-6 w-6" />
              Pipeline Analysis
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
