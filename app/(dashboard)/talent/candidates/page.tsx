"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Download, Tag } from "lucide-react"
import { listCandidates, upsertCandidate, bulkTag, listTags, listSources } from "../actions/candidates"

export default function CandidatesPage() {
  const [q, setQ] = useState("")
  const [page, setPage] = useState(1)
  const [per] = useState(25)
  const [rows, setRows] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [selected, setSelected] = useState<string[]>([])
  const [tags, setTags] = useState<any[]>([])
  const [sources, setSources] = useState<any[]>([])
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [formData, setFormData] = useState<any>({})

  const load = async () => {
    try {
      const result = await listCandidates({ q, page, per })
      setRows(result.rows || [])
      setTotal(result.total || 0)
    } catch (error) {
      console.error("[v0] Error loading candidates:", error)
      setRows([])
      setTotal(0)
    }
  }

  const loadTags = async () => {
    try {
      const data = await listTags()
      setTags(data || [])
    } catch (error) {
      console.error("[v0] Error loading tags:", error)
      setTags([])
    }
  }

  const loadSources = async () => {
    try {
      const data = await listSources()
      setSources(data || [])
    } catch (error) {
      console.error("[v0] Error loading sources:", error)
      setSources([])
    }
  }

  useEffect(() => {
    load()
  }, [q, page, per])

  useEffect(() => {
    loadTags()
    loadSources()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await upsertCandidate(formData)
      setIsAddOpen(false)
      setFormData({})
      load()
    } catch (error) {
      console.error("[v0] Error saving candidate:", error)
    }
  }

  const handleBulkTag = async (tagId: string) => {
    if (selected.length === 0) return
    try {
      await bulkTag({ candidate_ids: selected, tag_id: tagId })
      setSelected([])
      load()
    } catch (error) {
      console.error("[v0] Error tagging candidates:", error)
    }
  }

  const toggleSelect = (id: string) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]))
  }

  const toggleSelectAll = () => {
    if (selected.length === rows.length) {
      setSelected([])
    } else {
      setSelected(rows.map((r) => r.id))
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Candidates</h1>
          <p className="text-muted-foreground">Manage your talent pool and track candidate progress</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Candidate
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add Candidate</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first_name">First Name</Label>
                  <Input
                    id="first_name"
                    value={formData.first_name || ""}
                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last_name">Last Name</Label>
                  <Input
                    id="last_name"
                    value={formData.last_name || ""}
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={formData.email || ""}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone || ""}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="current_title">Current Title</Label>
                <Input
                  id="current_title"
                  value={formData.current_title || ""}
                  onChange={(e) => setFormData({ ...formData, current_title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="summary">Summary</Label>
                <Textarea
                  id="summary"
                  value={formData.summary || ""}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Save</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, skills, title..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="pl-8"
          />
        </div>
        {selected.length > 0 && tags.length > 0 && (
          <Select onValueChange={handleBulkTag}>
            <SelectTrigger className="w-[180px]">
              <Tag className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Tag selected" />
            </SelectTrigger>
            <SelectContent>
              {tags.map((tag) => (
                <SelectItem key={tag.id} value={tag.id}>
                  {tag.tag}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={selected.length === rows.length && rows.length > 0}
                  onCheckedChange={toggleSelectAll}
                />
              </TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Skills</TableHead>
              <TableHead>Exp</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Updated</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  No candidates found. Add your first candidate to get started.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>
                    <Checkbox checked={selected.includes(row.id)} onCheckedChange={() => toggleSelect(row.id)} />
                  </TableCell>
                  <TableCell className="font-medium">
                    {row.full_name || `${row.first_name || ""} ${row.last_name || ""}`.trim() || "N/A"}
                  </TableCell>
                  <TableCell>{row.email || "N/A"}</TableCell>
                  <TableCell>{row.headline || row.current_title || "N/A"}</TableCell>
                  <TableCell>
                    <div className="flex gap-1 flex-wrap">
                      {(row.skills || []).slice(0, 3).map((skill: string) => (
                        <Badge key={skill} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                      {row.skills?.length > 3 && <Badge variant="outline">+{row.skills.length - 3}</Badge>}
                    </div>
                  </TableCell>
                  <TableCell>{row.experience_years ? `${row.experience_years}y` : "N/A"}</TableCell>
                  <TableCell>
                    <Badge variant={row.status === "active" ? "default" : "secondary"}>{row.status}</Badge>
                  </TableCell>
                  <TableCell>{row.updated_at ? new Date(row.updated_at).toLocaleDateString() : "N/A"}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {rows.length > 0 ? (page - 1) * per + 1 : 0} to {Math.min(page * per, total)} of {total} candidates
        </p>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
            Previous
          </Button>
          <Button variant="outline" onClick={() => setPage((p) => p + 1)} disabled={page * per >= total}>
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
