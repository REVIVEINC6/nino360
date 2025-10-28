"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Send } from "lucide-react"

export function OfferManagement() {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold">Offer Letters</h3>
            <p className="text-sm text-muted-foreground">Create and manage job offers</p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Offer
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Candidate</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Salary</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Sent</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">John Smith</TableCell>
              <TableCell>Senior Engineer</TableCell>
              <TableCell>$150,000</TableCell>
              <TableCell>
                <Badge>Pending</Badge>
              </TableCell>
              <TableCell>2024-01-15</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm">
                  <Send className="mr-2 h-3 w-3" />
                  Resend
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
