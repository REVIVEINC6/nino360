"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { listPlacements } from "../actions/placements"

export default function BenchPlacements() {
  const [placements, setPlacements] = useState<any[]>([])

  useEffect(() => {
    listPlacements().then(setPlacements).catch(console.error)
  }, [])

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Placements</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Consultant</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Pay Rate</TableHead>
                <TableHead>Bill Rate</TableHead>
                <TableHead>Type</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {placements.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>
                    <div className="font-medium">
                      {p.consultant?.first_name} {p.consultant?.last_name}
                    </div>
                    <div className="text-xs text-muted-foreground">{p.consultant?.primary_skill}</div>
                  </TableCell>
                  <TableCell>{p.client_name}</TableCell>
                  <TableCell>{p.project_name || "N/A"}</TableCell>
                  <TableCell>{new Date(p.start_date).toLocaleDateString()}</TableCell>
                  <TableCell>{p.end_date ? new Date(p.end_date).toLocaleDateString() : "Ongoing"}</TableCell>
                  <TableCell>
                    ${p.pay_rate} {p.currency}
                  </TableCell>
                  <TableCell>
                    ${p.bill_rate} {p.currency}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{p.employment_type}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
