"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, FileText, Download, Send, Eye } from "lucide-react"

export function DocumentsCenter() {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold">Quotes & Proposals</h3>
            <p className="text-sm text-muted-foreground">Manage sales documents and proposals</p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Document
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Document</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  Q1 2024 Proposal
                </div>
              </TableCell>
              <TableCell>Acme Corp</TableCell>
              <TableCell>$45,000</TableCell>
              <TableCell>
                <Badge>Sent</Badge>
              </TableCell>
              <TableCell>2024-01-15</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="icon">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  Enterprise Quote
                </div>
              </TableCell>
              <TableCell>TechStart Inc</TableCell>
              <TableCell>$120,000</TableCell>
              <TableCell>
                <Badge variant="secondary">Draft</Badge>
              </TableCell>
              <TableCell>2024-01-14</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="icon">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-4">
          <p className="text-sm text-muted-foreground mb-1">Total Value</p>
          <p className="text-2xl font-bold">$1.2M</p>
          <p className="text-xs text-green-600">+15% from last quarter</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground mb-1">Pending Approval</p>
          <p className="text-2xl font-bold">12</p>
          <p className="text-xs text-muted-foreground">Awaiting signature</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground mb-1">Acceptance Rate</p>
          <p className="text-2xl font-bold">68%</p>
          <p className="text-xs text-green-600">+5% from last quarter</p>
        </Card>
      </div>
    </div>
  )
}
