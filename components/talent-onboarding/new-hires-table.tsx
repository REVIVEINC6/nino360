"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ExternalLink, Mail, Download } from "lucide-react"
import { useRouter } from "next/navigation"

interface Hire {
  id: string
  candidate: {
    first_name: string
    last_name: string
    email: string
  }
  job_title: string
  start_date: string
  status: string
  manager?: {
    email: string
  }
  progress?: number
  blockers?: number
}

interface NewHiresTableProps {
  hires: Hire[]
  onSendReminders?: (hireIds: string[]) => void
  onExport?: (hireIds: string[]) => void
}

export function NewHiresTable({ hires, onSendReminders, onExport }: NewHiresTableProps) {
  const router = useRouter()
  const [selectedHires, setSelectedHires] = useState<string[]>([])

  const toggleHire = (hireId: string) => {
    setSelectedHires((prev) => (prev.includes(hireId) ? prev.filter((id) => id !== hireId) : [...prev, hireId]))
  }

  const toggleAll = () => {
    setSelectedHires((prev) => (prev.length === hires.length ? [] : hires.map((h) => h.id)))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-amber-500/10 text-amber-500 border-amber-500/20"
      case "in_progress":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20"
      case "completed":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      case "on_hold":
        return "bg-orange-500/10 text-orange-500 border-orange-500/20"
      case "canceled":
        return "bg-red-500/10 text-red-500 border-red-500/20"
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20"
    }
  }

  return (
    <div className="space-y-4">
      {selectedHires.length > 0 && (
        <div className="flex items-center gap-2 p-4 bg-background/50 backdrop-blur-sm rounded-lg border">
          <span className="text-sm text-muted-foreground">{selectedHires.length} selected</span>
          <Button size="sm" variant="outline" onClick={() => onSendReminders?.(selectedHires)}>
            <Mail className="h-4 w-4 mr-2" />
            Send Reminders
          </Button>
          <Button size="sm" variant="outline" onClick={() => onExport?.(selectedHires)}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      )}

      <div className="rounded-lg border bg-background/50 backdrop-blur-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox checked={selectedHires.length === hires.length} onCheckedChange={toggleAll} />
              </TableHead>
              <TableHead>Candidate</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Manager</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead>Blockers</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {hires.map((hire) => (
              <TableRow key={hire.id}>
                <TableCell>
                  <Checkbox checked={selectedHires.includes(hire.id)} onCheckedChange={() => toggleHire(hire.id)} />
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">
                      {hire.candidate.first_name} {hire.candidate.last_name}
                    </div>
                    <div className="text-sm text-muted-foreground">{hire.candidate.email}</div>
                  </div>
                </TableCell>
                <TableCell>{hire.job_title}</TableCell>
                <TableCell>{new Date(hire.start_date).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={getStatusColor(hire.status)}>
                    {hire.status.replace("_", " ")}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-muted-foreground">{hire.manager?.email || "—"}</span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-linear-to-r from-indigo-500 to-purple-500"
                        style={{ width: `${hire.progress || 0}%` }}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground">{hire.progress || 0}%</span>
                  </div>
                </TableCell>
                <TableCell>
                  {hire.blockers ? (
                    <Badge variant="destructive">{hire.blockers}</Badge>
                  ) : (
                    <span className="text-sm text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <Button size="sm" variant="ghost" onClick={() => router.push(`/talent/onboarding/${hire.id}`)}>
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
