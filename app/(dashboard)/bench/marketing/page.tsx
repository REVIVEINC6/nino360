"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Mail, Phone, Linkedin } from "lucide-react"
import { listTargets } from "../actions/marketing"

export default function BenchMarketing() {
  const [targets, setTargets] = useState<any[]>([])

  useEffect(() => {
    listTargets().then(setTargets).catch(console.error)
  }, [])

  const channelIcons: Record<string, any> = {
    email: Mail,
    phone: Phone,
    linkedin: Linkedin,
  }

  const statusColors: Record<string, string> = {
    queued: "bg-gray-100 text-gray-800",
    sent: "bg-blue-100 text-blue-800",
    responded: "bg-purple-100 text-purple-800",
    interested: "bg-green-100 text-green-800",
    not_interested: "bg-red-100 text-red-800",
    blocked: "bg-gray-100 text-gray-800",
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Marketing Targets</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Account</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Channel</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Action</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {targets.map((t) => {
                const Icon = channelIcons[t.channel] || Mail
                return (
                  <TableRow key={t.id}>
                    <TableCell className="font-medium">{t.account_name}</TableCell>
                    <TableCell>
                      <div>{t.contact_name}</div>
                      <div className="text-xs text-muted-foreground">{t.contact_email}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        {t.channel}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={statusColors[t.status] || ""}>{t.status}</Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">{t.last_action || "N/A"}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {new Date(t.created_at).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
