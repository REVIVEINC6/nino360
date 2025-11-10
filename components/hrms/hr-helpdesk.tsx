"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, MessageSquare, Clock } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function HRHelpDesk() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-4">
          <p className="text-sm text-muted-foreground mb-1">Open Tickets</p>
          <p className="text-2xl font-bold">23</p>
          <p className="text-xs text-orange-600">Requires attention</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground mb-1">In Progress</p>
          <p className="text-2xl font-bold">12</p>
          <p className="text-xs text-muted-foreground">Being resolved</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground mb-1">Avg Response Time</p>
          <p className="text-2xl font-bold">2.5h</p>
          <p className="text-xs text-green-600">Within SLA</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground mb-1">Satisfaction</p>
          <p className="text-2xl font-bold">4.5/5</p>
          <p className="text-xs text-green-600">+0.2 from last month</p>
        </Card>
      </div>

      <Tabs defaultValue="open" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="open">Open</TabsTrigger>
          <TabsTrigger value="in-progress">In Progress</TabsTrigger>
          <TabsTrigger value="resolved">Resolved</TabsTrigger>
        </TabsList>

        <TabsContent value="open">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Open Tickets</h3>
              <Button>
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
                  <TableHead>Priority</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-mono text-sm">#1234</TableCell>
                  <TableCell>John Smith</TableCell>
                  <TableCell>Benefits enrollment question</TableCell>
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
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="in-progress">
          <Card className="p-6">
            <p className="text-sm text-muted-foreground">12 tickets currently being resolved</p>
          </Card>
        </TabsContent>

        <TabsContent value="resolved">
          <Card className="p-6">
            <p className="text-sm text-muted-foreground">156 tickets resolved this month</p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
