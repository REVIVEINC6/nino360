"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"

interface Consultant {
  id: string
  full_name: string
  email: string | null
  location: string | null
  work_auth: string | null
  skills: string[]
  seniority: string | null
  current_role: string | null
  rolloff_date: string | null
  status: string
}

interface ConsultantsTableProps {
  consultants: Consultant[]
}

export function ConsultantsTable({ consultants }: ConsultantsTableProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const getBenchDays = (rolloffDate: string | null) => {
    if (!rolloffDate) return 0
    const days = Math.floor((Date.now() - new Date(rolloffDate).getTime()) / (1000 * 60 * 60 * 24))
    return Math.max(0, days)
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Skills</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Work Auth</TableHead>
            <TableHead>Bench Days</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {consultants.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center text-muted-foreground">
                No consultants found
              </TableCell>
            </TableRow>
          ) : (
            consultants.map((consultant) => (
              <TableRow key={consultant.id}>
                <TableCell className="font-medium">{consultant.full_name}</TableCell>
                <TableCell>{consultant.current_role || "-"}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {consultant.skills.slice(0, 3).map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {consultant.skills.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{consultant.skills.length - 3}
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>{consultant.location || "-"}</TableCell>
                <TableCell>{consultant.work_auth || "-"}</TableCell>
                <TableCell>{getBenchDays(consultant.rolloff_date)}</TableCell>
                <TableCell>
                  <Badge variant={consultant.status === "bench" ? "default" : "secondary"}>{consultant.status}</Badge>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedId(consultant.id)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
