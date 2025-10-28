"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Download, Plus } from "lucide-react"
import { listConsultants, changeStatus } from "../actions/consultants"

export default function BenchConsultants() {
  const [q, setQ] = useState("")
  const [status, setStatus] = useState("all") // Updated default value to 'all'
  const [page, setPage] = useState(1)
  const [per] = useState(25)
  const [rows, setRows] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [selected, setSelected] = useState<string[]>([])

  const load = async () => {
    try {
  const result: any = await listConsultants({ q, status: status as any, page, per })
      // result may be either an array or { rows, total }
      if (Array.isArray(result)) {
        setRows(result)
        setTotal(result.length)
      } else {
        setRows(result.rows || [])
        setTotal(result.total || 0)
      }
    } catch (error) {
      console.error("[v0] Failed to load consultants:", error)
    }
  }

  useEffect(() => {
    load()
  }, [q, status, page, per])

  const bulkChangeStatus = async (newStatus: string) => {
    try {
      await Promise.all(selected.map((id) => changeStatus(id, newStatus)))
      setSelected([])
      await load()
    } catch (error) {
      console.error("[v0] Failed to change status:", error)
    }
  }

  const toggleSelect = (id: string) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]))
  }

  const statusColors: Record<string, string> = {
    bench: "bg-blue-100 text-blue-800",
    marketing: "bg-purple-100 text-purple-800",
    interview: "bg-orange-100 text-orange-800",
    offered: "bg-green-100 text-green-800",
    deployed: "bg-emerald-100 text-emerald-800",
    hold: "bg-yellow-100 text-yellow-800",
    inactive: "bg-gray-100 text-gray-800",
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2 items-end flex-wrap">
        <Input
          className="max-w-xs"
          placeholder="Search skill/name..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem> {/* Updated value prop to 'all' */}
            <SelectItem value="bench">Bench</SelectItem>
            <SelectItem value="marketing">Marketing</SelectItem>
            <SelectItem value="interview">Interview</SelectItem>
            <SelectItem value="offered">Offered</SelectItem>
            <SelectItem value="deployed">Deployed</SelectItem>
            <SelectItem value="hold">Hold</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" onClick={() => bulkChangeStatus("marketing")} disabled={!selected.length}>
          Move to Marketing
        </Button>
        <Button variant="outline" asChild>
          <a href={`/api/bench/export?type=consultants&q=${encodeURIComponent(q)}`}>
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </a>
        </Button>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Consultant
        </Button>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12"></TableHead>
              <TableHead>Name</TableHead>
              <TableHead>WA</TableHead>
              <TableHead>Primary Skill</TableHead>
              <TableHead>Skills</TableHead>
              <TableHead>Exp</TableHead>
              <TableHead>Rate</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Updated</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((r) => (
              <TableRow key={r.id}>
                <TableCell>
                  <Checkbox checked={selected.includes(r.id)} onCheckedChange={() => toggleSelect(r.id)} />
                </TableCell>
                <TableCell>
                  <div className="font-medium">
                    {r.first_name} {r.last_name}
                  </div>
                  <div className="text-xs text-muted-foreground">{r.email}</div>
                </TableCell>
                <TableCell>{r.work_authorization}</TableCell>
                <TableCell>{r.primary_skill}</TableCell>
                <TableCell>
                  <div className="text-xs">
                    {(r.skills || []).slice(0, 3).join(", ")}
                    {(r.skills || []).length > 3 && "..."}
                  </div>
                </TableCell>
                <TableCell>{r.experience_years}y</TableCell>
                <TableCell>${r.current_rate}</TableCell>
                <TableCell>
                  <Badge className={statusColors[r.status] || ""}>{r.status}</Badge>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {new Date(r.updated_at).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-between items-center">
        <Button variant="outline" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
          Previous
        </Button>
        <span className="text-sm text-muted-foreground">
          Page {page} of {Math.max(1, Math.ceil(total / per))}
        </span>
        <Button variant="outline" onClick={() => setPage((p) => p + 1)} disabled={page * per >= total}>
          Next
        </Button>
      </div>
    </div>
  )
}
