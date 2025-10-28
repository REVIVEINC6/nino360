"use client"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Mail, Phone, Building2, Sparkles, Users, Trash2 } from "lucide-react"
import { ScoreChip } from "./score-chip"
import { formatDistanceToNow } from "date-fns"

interface Contact {
  id: string
  first_name: string
  last_name: string
  email: string
  phone?: string
  title?: string
  account?: { id: string; name: string }
  owner?: { id: string; full_name: string; avatar_url?: string }
  tags?: string[]
  health_score?: number
  last_engaged_at?: string
  created_at: string
}

interface ContactsTableProps {
  contacts: Contact[]
  selectedIds: string[]
  onSelectionChange: (ids: string[]) => void
  onOpenProfile: (id: string) => void
  onEdit: (id: string) => void
  onEnrich: (id: string) => void
  onAssign: (id: string) => void
  onMerge: (id: string) => void
  onDelete: (id: string) => void
}

export function ContactsTable({
  contacts,
  selectedIds,
  onSelectionChange,
  onOpenProfile,
  onEdit,
  onEnrich,
  onAssign,
  onMerge,
  onDelete,
}: ContactsTableProps) {
  const allSelected = contacts.length > 0 && selectedIds.length === contacts.length
  const someSelected = selectedIds.length > 0 && selectedIds.length < contacts.length

  const toggleAll = () => {
    if (allSelected) {
      onSelectionChange([])
    } else {
      onSelectionChange(contacts.map((c) => c.id))
    }
  }

  const toggleOne = (id: string) => {
    if (selectedIds.includes(id)) {
      onSelectionChange(selectedIds.filter((i) => i !== id))
    } else {
      onSelectionChange([...selectedIds, id])
    }
  }

  return (
    <div className="rounded-lg border backdrop-blur-xl bg-white/5 border-white/10 shadow-[0_0_1px_#ffffff33]">
      <Table>
        <TableHeader>
          <TableRow className="border-white/10 hover:bg-white/5">
            <TableHead className="w-12">
              <Checkbox
                checked={allSelected}
                onCheckedChange={toggleAll}
                aria-label="Select all"
                className={someSelected ? "data-[state=checked]:bg-primary/50" : ""}
              />
            </TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Account</TableHead>
            <TableHead>Owner</TableHead>
            <TableHead>Tags</TableHead>
            <TableHead>Health</TableHead>
            <TableHead>Last Engaged</TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contacts.map((contact) => (
            <TableRow
              key={contact.id}
              className="border-white/10 hover:bg-white/5 cursor-pointer"
              onClick={() => onOpenProfile(contact.id)}
            >
              <TableCell onClick={(e) => e.stopPropagation()}>
                <Checkbox
                  checked={selectedIds.includes(contact.id)}
                  onCheckedChange={() => toggleOne(contact.id)}
                  aria-label={`Select ${contact.first_name} ${contact.last_name}`}
                />
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-gradient-to-br from-[#4F46E5] to-[#8B5CF6] text-white text-xs">
                      {contact.first_name[0]}
                      {contact.last_name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">
                      {contact.first_name} {contact.last_name}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      {contact.email && (
                        <div className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          <span className="truncate max-w-[200px]">{contact.email}</span>
                        </div>
                      )}
                      {contact.phone && (
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          <span>{contact.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                {contact.account ? (
                  <div className="flex items-center gap-1">
                    <Building2 className="h-3 w-3 text-muted-foreground" />
                    <span className="text-sm">{contact.account.name}</span>
                  </div>
                ) : (
                  <span className="text-sm text-muted-foreground">—</span>
                )}
              </TableCell>
              <TableCell>
                {contact.owner ? (
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs">
                        {contact.owner.full_name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{contact.owner.full_name}</span>
                  </div>
                ) : (
                  <span className="text-sm text-muted-foreground">Unassigned</span>
                )}
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {contact.tags?.slice(0, 2).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {contact.tags && contact.tags.length > 2 && (
                    <Badge variant="secondary" className="text-xs">
                      +{contact.tags.length - 2}
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <ScoreChip score={contact.health_score || 50} />
              </TableCell>
              <TableCell>
                {contact.last_engaged_at ? (
                  <span className="text-sm">
                    {formatDistanceToNow(new Date(contact.last_engaged_at), { addSuffix: true })}
                  </span>
                ) : (
                  <span className="text-sm text-muted-foreground">Never</span>
                )}
              </TableCell>
              <TableCell onClick={(e) => e.stopPropagation()}>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onOpenProfile(contact.id)}>Open Profile</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEdit(contact.id)}>Edit</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEnrich(contact.id)}>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Enrich with AI
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onAssign(contact.id)}>
                      <Users className="mr-2 h-4 w-4" />
                      Assign Owner
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onMerge(contact.id)}>Merge Duplicates</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDelete(contact.id)} className="text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
