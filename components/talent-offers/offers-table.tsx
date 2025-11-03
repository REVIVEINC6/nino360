"use client"

import { useState } from "react"
import { MoreHorizontal, Eye, Send, CheckCircle, FileText, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatDistanceToNow } from "date-fns"

interface Offer {
  id: string
  number: string
  status: string
  comp: { base: number; currency: string }
  valid_until: string
  updated_at: string
  application?: {
    candidate?: {
      full_name: string
    }
    requisition?: {
      title: string
    }
  }
}

interface OffersTableProps {
  offers: Offer[]
  onSelect: (ids: string[]) => void
  onOpen: (id: string) => void
  onSend: (id: string) => void
  onRequestApproval: (id: string) => void
}

const statusConfig: Record<string, { label: string; variant: any; icon: any }> = {
  draft: { label: "Draft", variant: "secondary", icon: FileText },
  awaiting_approval: { label: "Awaiting Approval", variant: "default", icon: Clock },
  approved: { label: "Approved", variant: "default", icon: CheckCircle },
  sent: { label: "Sent", variant: "default", icon: Send },
  viewed: { label: "Viewed", variant: "default", icon: Eye },
  accepted: { label: "Accepted", variant: "default", icon: CheckCircle },
  declined: { label: "Declined", variant: "destructive", icon: null },
  expired: { label: "Expired", variant: "destructive", icon: null },
}

export function OffersTable({ offers, onSelect, onOpen, onSend, onRequestApproval }: OffersTableProps) {
  const [selected, setSelected] = useState<string[]>([])

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = offers.map((o) => o.id)
      setSelected(allIds)
      onSelect(allIds)
    } else {
      setSelected([])
      onSelect([])
    }
  }

  const handleSelectOne = (id: string, checked: boolean) => {
    const newSelected = checked ? [...selected, id] : selected.filter((s) => s !== id)
    setSelected(newSelected)
    onSelect(newSelected)
  }

  return (
    <div className="rounded-lg border border-white/10 bg-black/20 backdrop-blur-xl">
      <Table>
        <TableHeader>
          <TableRow className="border-white/10 hover:bg-white/5">
            <TableHead className="w-12">
              <Checkbox
                checked={selected.length === offers.length && offers.length > 0}
                onCheckedChange={handleSelectAll}
              />
            </TableHead>
            <TableHead>Number</TableHead>
            <TableHead>Candidate</TableHead>
            <TableHead>Requisition</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Total Comp</TableHead>
            <TableHead>Valid Until</TableHead>
            <TableHead>Updated</TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {offers.map((offer) => {
            const config = statusConfig[offer.status] || statusConfig.draft
            const Icon = config.icon

            return (
              <TableRow
                key={offer.id}
                className="border-white/10 hover:bg-white/5 cursor-pointer"
                onClick={() => onOpen(offer.id)}
              >
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <Checkbox
                    checked={selected.includes(offer.id)}
                    onCheckedChange={(checked) => handleSelectOne(offer.id, checked as boolean)}
                  />
                </TableCell>
                <TableCell className="font-mono text-sm">{offer.number}</TableCell>
                <TableCell>{offer.application?.candidate?.full_name || "—"}</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {offer.application?.requisition?.title || "—"}
                </TableCell>
                <TableCell>
                  <Badge variant={config.variant} className="gap-1">
                    {Icon && <Icon className="h-3 w-3" />}
                    {config.label}
                  </Badge>
                </TableCell>
                <TableCell className="font-semibold">
                  {offer.comp.base.toLocaleString()} {offer.comp.currency}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{offer.valid_until}</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(offer.updated_at), { addSuffix: true })}
                </TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onOpen(offer.id)}>
                        <Eye className="h-4 w-4 mr-2" />
                        Open
                      </DropdownMenuItem>
                      {offer.status === "approved" && (
                        <DropdownMenuItem onClick={() => onSend(offer.id)}>
                          <Send className="h-4 w-4 mr-2" />
                          Send Offer
                        </DropdownMenuItem>
                      )}
                      {offer.status === "draft" && (
                        <DropdownMenuItem onClick={() => onRequestApproval(offer.id)}>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Request Approval
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem>
                        <FileText className="h-4 w-4 mr-2" />
                        Version History
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
