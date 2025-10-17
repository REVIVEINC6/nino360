"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { syncInvoice, resolveDispute } from "@/app/(dashboard)/admin/billing/actions"
import { toast } from "sonner"
import { RefreshCw, AlertCircle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface Invoice {
  id: string
  tenant: { name: string; slug: string }
  amount: number
  status: string
  dispute_status?: string
  created_at: string
  due_date: string
  synced_at?: string
}

interface BillingTableProps {
  invoices: Invoice[]
}

export function BillingTable({ invoices }: BillingTableProps) {
  const [syncing, setSyncing] = useState<string | null>(null)
  const [disputeDialog, setDisputeDialog] = useState<string | null>(null)
  const [resolution, setResolution] = useState("")

  const handleSync = async (invoiceId: string) => {
    setSyncing(invoiceId)
    try {
      await syncInvoice(invoiceId)
      toast.success("Invoice synced successfully")
    } catch (error) {
      toast.error("Failed to sync invoice")
      console.error(error)
    } finally {
      setSyncing(null)
    }
  }

  const handleResolveDispute = async () => {
    if (!disputeDialog || !resolution) return

    try {
      await resolveDispute(disputeDialog, resolution)
      toast.success("Dispute resolved successfully")
      setDisputeDialog(null)
      setResolution("")
    } catch (error) {
      toast.error("Failed to resolve dispute")
      console.error(error)
    }
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tenant</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Sync Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell className="font-medium">{invoice.tenant.name}</TableCell>
                <TableCell>${invoice.amount.toFixed(2)}</TableCell>
                <TableCell>
                  <Badge variant={invoice.status === "paid" ? "default" : "secondary"}>{invoice.status}</Badge>
                </TableCell>
                <TableCell>{new Date(invoice.due_date).toLocaleDateString()}</TableCell>
                <TableCell>
                  {invoice.synced_at ? (
                    <Badge variant="outline">Synced</Badge>
                  ) : (
                    <Badge variant="secondary">Pending</Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleSync(invoice.id)}
                      disabled={syncing === invoice.id}
                    >
                      <RefreshCw className={`h-4 w-4 ${syncing === invoice.id ? "animate-spin" : ""}`} />
                    </Button>
                    {invoice.dispute_status === "open" && (
                      <Button size="sm" variant="outline" onClick={() => setDisputeDialog(invoice.id)}>
                        <AlertCircle className="h-4 w-4 mr-1" />
                        Resolve
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!disputeDialog} onOpenChange={() => setDisputeDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Resolve Dispute</DialogTitle>
            <DialogDescription>Provide resolution details for this billing dispute</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="resolution">Resolution Notes</Label>
              <Textarea
                id="resolution"
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
                placeholder="Describe how the dispute was resolved..."
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDisputeDialog(null)}>
              Cancel
            </Button>
            <Button onClick={handleResolveDispute}>Resolve Dispute</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
