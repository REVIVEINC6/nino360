"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Key, Send } from "lucide-react"

interface PayoutInstruction {
  id: string
  vendor_name: string
  amount: number
  currency: string
  payment_method: string
  status: string
  tss_request_id?: string
}

interface PayoutInstructionsTableProps {
  payouts: PayoutInstruction[]
  onSubmitForSigning?: (payoutId: string) => void
}

export function PayoutInstructionsTable({ payouts, onSubmitForSigning }: PayoutInstructionsTableProps) {
  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      pending: "bg-gray-500/20 text-gray-300",
      signing: "bg-yellow-500/20 text-yellow-300",
      signed: "bg-blue-500/20 text-blue-300",
      submitted: "bg-cyan-500/20 text-cyan-300",
      processing: "bg-purple-500/20 text-purple-300",
      completed: "bg-green-500/20 text-green-300",
      failed: "bg-red-500/20 text-red-300",
    }

    return (
      <Badge variant="secondary" className={variants[status] || variants.pending}>
        {status}
      </Badge>
    )
  }

  return (
    <div className="rounded-lg border border-white/10 bg-background/50 backdrop-blur-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-white/10 hover:bg-white/5">
            <TableHead>Vendor</TableHead>
            <TableHead>Payment Method</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>TSS Request</TableHead>
            <TableHead className="w-[100px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payouts.map((payout) => (
            <TableRow key={payout.id} className="border-white/10 hover:bg-white/5">
              <TableCell className="font-medium">{payout.vendor_name}</TableCell>
              <TableCell className="capitalize">{payout.payment_method.replace("_", " ")}</TableCell>
              <TableCell className="text-right">
                {payout.currency} {payout.amount.toLocaleString()}
              </TableCell>
              <TableCell>{getStatusBadge(payout.status)}</TableCell>
              <TableCell>
                {payout.tss_request_id ? (
                  <code className="text-xs bg-background/50 px-2 py-1 rounded">{payout.tss_request_id}</code>
                ) : (
                  <span className="text-sm text-muted-foreground">-</span>
                )}
              </TableCell>
              <TableCell>
                {payout.status === "pending" && (
                  <Button size="sm" variant="outline" onClick={() => onSubmitForSigning?.(payout.id)}>
                    <Key className="h-4 w-4 mr-2" />
                    Sign
                  </Button>
                )}
                {payout.status === "signed" && (
                  <Button size="sm" variant="outline">
                    <Send className="h-4 w-4 mr-2" />
                    Submit
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
