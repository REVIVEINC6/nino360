"use client"

import { useMemo, useState } from "react"
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
  const [loading] = useState(false)

  const rows = useMemo(() => initialRows || [], [initialRows])

  const filtered = useMemo(() => {
    if (!query) return rows
    const q = query.toLowerCase().trim()
    return rows.filter((r) =>
      [r.name, r.email, r.company, r.title].some((v) => (v || "").toLowerCase().includes(q)),
    )
  }, [rows, query])

  const start = (page - 1) * pageSize
  const pageRows = filtered.slice(start, start + pageSize)

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
            <div className="text-sm text-muted-foreground">{total ?? rows.length} total</div>
            <Button>
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
                    <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                      <Mail className="mr-2 h-3 w-3" />
                      Email
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 bg-transparent">
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
          <div className="text-muted-foreground">Showing {start + 1}-{Math.min(start + pageSize, filtered.length)} of {filtered.length}</div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
              Prev
            </Button>
            <Button variant="outline" size="sm" disabled={start + pageSize >= filtered.length} onClick={() => setPage((p) => p + 1)}>
              Next
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
