"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Mail, Phone, Building2, MessageSquare } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function ContactsManagement() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search contacts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Contact
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[
            {
              name: "Sarah Johnson",
              title: "VP of Sales",
              company: "Acme Corp",
              email: "sarah@acme.com",
              phone: "+1 (555) 123-4567",
              status: "Active",
            },
            {
              name: "Mike Chen",
              title: "CTO",
              company: "TechStart Inc",
              email: "mike@techstart.com",
              phone: "+1 (555) 987-6543",
              status: "Active",
            },
            {
              name: "Emily Davis",
              title: "Product Manager",
              company: "Innovation Labs",
              email: "emily@innovation.com",
              phone: "+1 (555) 456-7890",
              status: "Active",
            },
          ].map((contact) => (
            <Card key={contact.email} className="p-4">
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
                <Badge variant="secondary">{contact.status}</Badge>
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
          ))}
        </div>
      </Card>
    </div>
  )
}
