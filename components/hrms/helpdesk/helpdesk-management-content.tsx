"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, MessageSquare, Clock, TrendingUp, AlertCircle, CheckCircle, Users } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function HelpdeskManagementContent() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="glass-card p-6 hover-lift">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-muted-foreground">Open Tickets</p>
            <AlertCircle className="h-5 w-5 text-orange-500" />
          </div>
          <p className="text-3xl font-bold bg-linear-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            23
          </p>
          <div className="flex items-center gap-1 mt-2">
            <TrendingUp className="h-3 w-3 text-orange-600" />
            <p className="text-xs text-orange-600">+3 from yesterday</p>
          </div>
        </Card>

        <Card className="glass-card p-6 hover-lift">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-muted-foreground">In Progress</p>
            <Users className="h-5 w-5 text-blue-500" />
          </div>
          <p className="text-3xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            12
          </p>
          <div className="flex items-center gap-1 mt-2">
            <Clock className="h-3 w-3 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">Being resolved</p>
          </div>
        </Card>

        <Card className="glass-card p-6 hover-lift">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-muted-foreground">Avg Response Time</p>
            <Clock className="h-5 w-5 text-green-500" />
          </div>
          <p className="text-3xl font-bold bg-linear-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            2.5h
          </p>
          <div className="flex items-center gap-1 mt-2">
            <CheckCircle className="h-3 w-3 text-green-600" />
            <p className="text-xs text-green-600">Within SLA</p>
          </div>
        </Card>

        <Card className="glass-card p-6 hover-lift">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-muted-foreground">Satisfaction</p>
            <CheckCircle className="h-5 w-5 text-green-500" />
          </div>
          <p className="text-3xl font-bold bg-linear-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
            4.5/5
          </p>
          <div className="flex items-center gap-1 mt-2">
            <TrendingUp className="h-3 w-3 text-green-600" />
            <p className="text-xs text-green-600">+0.2 from last month</p>
          </div>
        </Card>
      </div>

      {/* AI Insights */}
      <Card className="glass-card p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-blue-500" />
          AI-Powered Insights
        </h3>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="p-4 rounded-lg bg-orange-50 border border-orange-200">
            <p className="text-sm font-medium text-orange-900 mb-1">High Priority Alert</p>
            <p className="text-xs text-orange-700">5 tickets require immediate attention</p>
          </div>
          <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
            <p className="text-sm font-medium text-blue-900 mb-1">AI Triage Active</p>
            <p className="text-xs text-blue-700">18 tickets auto-categorized today</p>
          </div>
          <div className="p-4 rounded-lg bg-green-50 border border-green-200">
            <p className="text-sm font-medium text-green-900 mb-1">SLA Compliance</p>
            <p className="text-xs text-green-700">95% of tickets resolved within SLA</p>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="glass-card grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="open">Open Tickets</TabsTrigger>
          <TabsTrigger value="in-progress">In Progress</TabsTrigger>
          <TabsTrigger value="resolved">Resolved</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card className="glass-card p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 rounded-lg bg-white/50">
                <div className="h-10 w-10 rounded-full bg-linear-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                  JS
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">John Smith opened a new ticket</p>
                  <p className="text-xs text-muted-foreground">Benefits enrollment question - 2 hours ago</p>
                </div>
                <Badge variant="destructive">High</Badge>
              </div>
              <div className="flex items-start gap-4 p-4 rounded-lg bg-white/50">
                <div className="h-10 w-10 rounded-full bg-linear-to-br from-green-500 to-teal-500 flex items-center justify-center text-white font-semibold">
                  SD
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Sarah Davis resolved a ticket</p>
                  <p className="text-xs text-muted-foreground">PTO request approved - 3 hours ago</p>
                </div>
                <Badge variant="outline">Resolved</Badge>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="open">
          <Card className="glass-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Open Tickets</h3>
              <Button className="bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <Plus className="mr-2 h-4 w-4" />
                New Ticket
              </Button>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ticket ID</TableHead>
                  <TableHead>Employee</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-mono text-sm">#HD-1234</TableCell>
                  <TableCell>John Smith</TableCell>
                  <TableCell>Benefits enrollment question</TableCell>
                  <TableCell>
                    <Badge variant="outline">Benefits</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="destructive">High</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm">2 hours ago</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      <MessageSquare className="mr-2 h-3 w-3" />
                      Respond
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-mono text-sm">#HD-1235</TableCell>
                  <TableCell>Sarah Davis</TableCell>
                  <TableCell>PTO request approval</TableCell>
                  <TableCell>
                    <Badge variant="outline">Time Off</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">Medium</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm">4 hours ago</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      <MessageSquare className="mr-2 h-3 w-3" />
                      Respond
                    </Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="in-progress">
          <Card className="glass-card p-6">
            <h3 className="text-lg font-semibold mb-4">In Progress Tickets</h3>
            <p className="text-sm text-muted-foreground">12 tickets currently being resolved by the team</p>
          </Card>
        </TabsContent>

        <TabsContent value="resolved">
          <Card className="glass-card p-6">
            <h3 className="text-lg font-semibold mb-4">Resolved Tickets</h3>
            <p className="text-sm text-muted-foreground">156 tickets resolved this month with 95% satisfaction rate</p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
