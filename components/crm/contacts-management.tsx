"use client"

import { useMemo, useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Mail, Phone, Building2, MessageSquare } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

type Contact = {
  id?: string
  name: string
  title?: string
  company?: string
  email?: string
  phone?: string
  status?: string
}

export function ContactsManagement({ initialRows, total }: { initialRows?: Contact[]; total?: number }) {
  const [query, setQuery] = useState("")
  const [page, setPage] = useState(1)
  const pageSize = 12
  const [loading, setLoading] = useState(false)
  const [rows, setRows] = useState<Contact[]>(initialRows || [])
  const [totalCount, setTotalCount] = useState<number>(total || (initialRows || []).length)
  const [showAdd, setShowAdd] = useState(false)
  const [newContact, setNewContact] = useState({ first_name: "", last_name: "", email: "" })

  const filtered = useMemo(() => {
    if (!query) return rows
    const q = query.toLowerCase().trim()
    return rows.filter((r) => [r.name, r.email, r.company, r.title].some((v) => (v || "").toLowerCase().includes(q)))
  }, [rows, query])

  const start = (page - 1) * pageSize
  const pageRows = filtered.slice(start, start + pageSize)

  useEffect(() => {
    // fetch page when page changes or initial mount
    async function fetchPage() {
      setLoading(true)
      try {
        const res = await fetch('/api/crm/contacts/list', { method: 'POST', body: JSON.stringify({ page, pageSize, q: query }) })
        const json = await res.json()
        if (json.success) {
          setRows(json.rows || [])
          setTotalCount(json.total || 0)
        }
      } catch (e) {
        console.error('Failed to fetch contacts page', e)
      } finally {
        setLoading(false)
      }
    }
    fetchPage()
  }, [page])

  async function handleCreate() {
    try {
      setLoading(true)
      const res = await fetch('/api/crm/contacts/create', { method: 'POST', body: JSON.stringify(newContact) })
      const json = await res.json()
      if (json.success) {
        setShowAdd(false)
        setNewContact({ first_name: '', last_name: '', email: '' })
        setPage(1)
        // refresh
        const r = await fetch('/api/crm/contacts/list', { method: 'POST', body: JSON.stringify({ page: 1, pageSize }) })
        const j = await r.json()
        if (j.success) {
          setRows(j.rows || [])
          setTotalCount(j.total || 0)
        }
      } else {
        alert('Create failed: ' + (json.error || 'unknown'))
      }
    } catch (e) {
      console.error(e)
      alert('Create failed')
    } finally {
      setLoading(false)
    }
  }

  async function handleEmail(contact: Contact) {
    if (!contact.email) return
    window.location.href = `mailto:${contact.email}`
  }

  async function handleMessage(contact: Contact) {
    // Open a minimal composer: for now use mailto as a fallback or open modal
    if (!contact.email) return
    window.location.href = `mailto:${contact.email}?subject=Message from Nino360`
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="relative flex-1 max-w-md">
            <label htmlFor="contacts-search" className="sr-only">
              Search contacts
            </label>
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="contacts-search"
              aria-label="Search contacts"
              placeholder="Search contacts..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10"
            />
            <p className="sr-only" aria-live="polite">
              {filtered.length} contacts shown
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-sm text-muted-foreground">{totalCount ?? rows.length} total</div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={async () => {
                const ids = rows.map(r => r.id).filter(Boolean)
                const res = await fetch('/api/crm/contacts/insights', { method: 'POST', body: JSON.stringify({ contactIds: ids }) })
                const j = await res.json()
                if (j.success) alert('Insights:\n' + j.text)
                else alert('Insights failed: ' + (j.error || 'unknown'))
              }}>Insights</Button>
              <Button variant="outline" size="sm" onClick={async () => {
                const ids = rows.map(r => r.id).filter(Boolean)
                const res = await fetch('/api/crm/contacts/export', { method: 'POST', body: JSON.stringify({ ids }) })
                if (res.ok) {
                  const blob = await res.blob()
                  const url = URL.createObjectURL(blob)
                  const a = document.createElement('a')
                  a.href = url
                  a.download = 'contacts.csv'
                  document.body.appendChild(a)
                  a.click()
                  a.remove()
                } else {
                  const j = await res.json()
                  alert('Export failed: ' + (j.error || 'unknown'))
                }
              }}>Export</Button>
            </div>
            <Button onClick={() => setShowAdd(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Contact
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="p-4">
                <Skeleton className="h-6 w-3/4 mb-3" />
                <Skeleton className="h-4 w-1/2 mb-2" />
                <Skeleton className="h-8" />
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {pageRows.length === 0 ? (
              <Card className="p-6 col-span-full">
                <div className="text-center">
                  <p className="text-lg font-medium">No contacts</p>
                  <p className="text-sm text-muted-foreground mt-2">Try adjusting your search or add a new contact.</p>
                  <div className="mt-4">
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Contact
                    </Button>
                  </div>
                </div>
              </Card>
            ) : (
              pageRows.map((contact) => (
                <Card key={contact.id ?? contact.email} className="p-4">
                  <div className="flex items-start gap-3 mb-4">
                    <Avatar>
                      <AvatarFallback>
                        {contact.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate">{contact.name}</p>
                      <p className="text-sm text-muted-foreground truncate">{contact.title}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Building2 className="h-3 w-3 text-muted-foreground" />
                        <p className="text-xs text-muted-foreground truncate">{contact.company}</p>
                      </div>
                    </div>
                    {contact.status ? <Badge variant="secondary">{contact.status}</Badge> : null}
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="truncate">{contact.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{contact.phone}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1 bg-transparent" onClick={() => handleEmail(contact)}>
                      <Mail className="mr-2 h-3 w-3" />
                      Email
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 bg-transparent" onClick={() => handleMessage(contact)}>
                      <MessageSquare className="mr-2 h-3 w-3" />
                      Message
                    </Button>
                  </div>
                </Card>
              ))
            )}
          </div>
        )}

        {/* Pagination */}
        <div className={cn("flex items-center justify-between mt-6", "text-sm")}>
          <div className="text-muted-foreground">Showing {start + 1}-{Math.min(start + pageSize, totalCount)} of {totalCount}</div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
              Prev
            </Button>
            <Button variant="outline" size="sm" disabled={start + pageSize >= totalCount} onClick={() => setPage((p) => p + 1)}>
              Next
            </Button>
          </div>
        </div>
      </Card>
      {showAdd ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white p-6 rounded shadow max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">Add Contact</h3>
            <div className="space-y-2">
              <Input placeholder="First name" value={(newContact as any).first_name} onChange={(e) => setNewContact({ ...(newContact as any), first_name: e.target.value })} />
              <Input placeholder="Last name" value={(newContact as any).last_name} onChange={(e) => setNewContact({ ...(newContact as any), last_name: e.target.value })} />
              <Input placeholder="Email" value={(newContact as any).email} onChange={(e) => setNewContact({ ...(newContact as any), email: e.target.value })} />
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setShowAdd(false)}>Cancel</Button>
              <Button onClick={() => handleCreate()} disabled={loading}>Create</Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
