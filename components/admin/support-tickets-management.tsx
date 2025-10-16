"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, AlertCircle, Clock, CheckCircle } from "lucide-react"

export function SupportTicketsManagement() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Support Tickets Triage</CardTitle>
          <CardDescription>Manage and prioritize customer support requests</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tickets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ticket ID</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-mono text-sm">#TKT-1234</TableCell>
                <TableCell className="font-medium">Login issues</TableCell>
                <TableCell>Acme Corp</TableCell>
                <TableCell>
                  <Badge variant="destructive">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    High
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">
                    <Clock className="h-3 w-3 mr-1" />
                    Open
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">2 hours ago</TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">
                    View
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-mono text-sm">#TKT-1233</TableCell>
                <TableCell className="font-medium">Feature request</TableCell>
                <TableCell>TechStart Inc</TableCell>
                <TableCell>
                  <Badge variant="secondary">Low</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="default">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Resolved
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">1 day ago</TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">
                    View
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
