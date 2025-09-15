"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Mail, Search, Filter, Plus, Send, Eye, MousePointer, MessageSquare, Linkedin, Phone } from "lucide-react"

const campaigns = [
  {
    id: 1,
    name: "Q1 Enterprise Outreach",
    type: "Email",
    status: "Active",
    sent: 2847,
    delivered: 2756,
    opened: 1378,
    clicked: 276,
    replied: 89,
    startDate: "2024-01-01",
    endDate: "2024-03-31",
  },
  {
    id: 2,
    name: "LinkedIn Connection Campaign",
    type: "LinkedIn",
    status: "Active",
    sent: 450,
    delivered: 445,
    opened: 312,
    clicked: 89,
    replied: 34,
    startDate: "2024-01-15",
    endDate: "2024-02-15",
  },
  {
    id: 3,
    name: "Follow-up Sequence",
    type: "Email",
    status: "Completed",
    sent: 1234,
    delivered: 1198,
    opened: 719,
    clicked: 144,
    replied: 67,
    startDate: "2023-12-01",
    endDate: "2023-12-31",
  },
]

const sequences = [
  {
    id: 1,
    name: "New Lead Nurture",
    steps: 5,
    active: true,
    contacts: 234,
    openRate: 45.2,
    replyRate: 12.8,
  },
  {
    id: 2,
    name: "Demo Follow-up",
    steps: 3,
    active: true,
    contacts: 89,
    openRate: 67.3,
    replyRate: 23.4,
  },
  {
    id: 3,
    name: "Proposal Follow-up",
    steps: 4,
    active: false,
    contacts: 45,
    openRate: 78.9,
    replyRate: 34.5,
  },
]

export default function CampaignsPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800"
      case "Completed":
        return "bg-blue-100 text-blue-800"
      case "Paused":
        return "bg-yellow-100 text-yellow-800"
      case "Draft":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Email":
        return <Mail className="h-4 w-4" />
      case "LinkedIn":
        return <Linkedin className="h-4 w-4" />
      case "Phone":
        return <Phone className="h-4 w-4" />
      case "SMS":
        return <MessageSquare className="h-4 w-4" />
      default:
        return <Mail className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Campaigns</h1>
          <p className="text-muted-foreground">Email, WhatsApp, SMS, and LinkedIn engagement sequences</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Campaign
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sent</CardTitle>
            <Send className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4,531</div>
            <p className="text-xs text-muted-foreground">+22.1% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Rate</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">48.5%</div>
            <p className="text-xs text-muted-foreground">+3.2% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Click Rate</CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12.8%</div>
            <p className="text-xs text-muted-foreground">+1.8% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reply Rate</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.2%</div>
            <p className="text-xs text-muted-foreground">+0.9% from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="campaigns" className="space-y-4">
        <TabsList>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="sequences">Sequences</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Campaigns</CardTitle>
              <CardDescription>Monitor and manage your outreach campaigns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search campaigns..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" />
                  Filters
                </Button>
              </div>

              <div className="space-y-4">
                {campaigns.map((campaign) => (
                  <Card key={campaign.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            {getTypeIcon(campaign.type)}
                          </div>
                          <div>
                            <h3 className="font-semibold">{campaign.name}</h3>
                            <p className="text-sm text-muted-foreground">{campaign.type} Campaign</p>
                          </div>
                        </div>
                        <Badge className={getStatusColor(campaign.status)}>{campaign.status}</Badge>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">{campaign.sent.toLocaleString()}</div>
                          <div className="text-xs text-muted-foreground">Sent</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">{campaign.delivered.toLocaleString()}</div>
                          <div className="text-xs text-muted-foreground">Delivered</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-orange-600">{campaign.opened.toLocaleString()}</div>
                          <div className="text-xs text-muted-foreground">Opened</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-600">{campaign.clicked}</div>
                          <div className="text-xs text-muted-foreground">Clicked</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-red-600">{campaign.replied}</div>
                          <div className="text-xs text-muted-foreground">Replied</div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Open Rate</span>
                          <span>{((campaign.opened / campaign.delivered) * 100).toFixed(1)}%</span>
                        </div>
                        <Progress value={(campaign.opened / campaign.delivered) * 100} className="h-2" />
                      </div>

                      <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
                        <span>
                          {campaign.startDate} - {campaign.endDate}
                        </span>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            View Details
                          </Button>
                          <Button size="sm" variant="outline">
                            Edit
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sequences" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Email Sequences</CardTitle>
              <CardDescription>Automated follow-up sequences for different scenarios</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sequences.map((sequence) => (
                  <Card key={sequence.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-semibold">{sequence.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {sequence.steps} steps • {sequence.contacts} contacts
                          </p>
                        </div>
                        <Badge
                          className={sequence.active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
                        >
                          {sequence.active ? "Active" : "Inactive"}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <div className="text-sm text-muted-foreground">Open Rate</div>
                          <div className="text-2xl font-bold text-blue-600">{sequence.openRate}%</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Reply Rate</div>
                          <div className="text-2xl font-bold text-green-600">{sequence.replyRate}%</div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          Edit Sequence
                        </Button>
                        <Button size="sm" variant="outline">
                          View Analytics
                        </Button>
                        <Button size="sm" variant="outline">
                          {sequence.active ? "Pause" : "Activate"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Email Templates</CardTitle>
              <CardDescription>Reusable templates for different campaign types</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2">Cold Outreach</h3>
                    <p className="text-sm text-muted-foreground mb-4">Initial contact template for new prospects</p>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        Use Template
                      </Button>
                      <Button size="sm" variant="outline">
                        Edit
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2">Follow-up</h3>
                    <p className="text-sm text-muted-foreground mb-4">Follow-up template for engaged prospects</p>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        Use Template
                      </Button>
                      <Button size="sm" variant="outline">
                        Edit
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2">Demo Invitation</h3>
                    <p className="text-sm text-muted-foreground mb-4">Invite qualified leads to product demo</p>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        Use Template
                      </Button>
                      <Button size="sm" variant="outline">
                        Edit
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
