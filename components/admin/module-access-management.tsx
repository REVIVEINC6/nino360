"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Shield, Check, X } from "lucide-react"

export function ModuleAccessManagement() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Module Access & Entitlements</CardTitle>
          <CardDescription>Configure module access permissions per subscription plan</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search plans or modules..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Plan</TableHead>
                <TableHead>HRMS</TableHead>
                <TableHead>CRM</TableHead>
                <TableHead>ATS</TableHead>
                <TableHead>Bench</TableHead>
                <TableHead>VMS</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    <span className="font-medium">Enterprise</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Check className="h-4 w-4 text-green-600" />
                </TableCell>
                <TableCell>
                  <Check className="h-4 w-4 text-green-600" />
                </TableCell>
                <TableCell>
                  <Check className="h-4 w-4 text-green-600" />
                </TableCell>
                <TableCell>
                  <Check className="h-4 w-4 text-green-600" />
                </TableCell>
                <TableCell>
                  <Check className="h-4 w-4 text-green-600" />
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    <span className="font-medium">Professional</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Check className="h-4 w-4 text-green-600" />
                </TableCell>
                <TableCell>
                  <Check className="h-4 w-4 text-green-600" />
                </TableCell>
                <TableCell>
                  <X className="h-4 w-4 text-muted-foreground" />
                </TableCell>
                <TableCell>
                  <X className="h-4 w-4 text-muted-foreground" />
                </TableCell>
                <TableCell>
                  <X className="h-4 w-4 text-muted-foreground" />
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">
                    Edit
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
