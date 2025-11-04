"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Eye, Shield, AlertCircle } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"

interface SettlementRun {
  id: string
  run_number: string
  run_date: string
  status: string
  total_client_receipts: number
  total_vendor_payouts: number
  net_amount: number
  anchor_status: string
  anchor_tx?: string
}

interface SettlementRunsTableProps {
  runs: SettlementRun[]
  onViewDetails?: (runId: string) => void
  onApprove?: (runId: string) => void
  onAnchor?: (runId: string) => void
}

export function SettlementRunsTable({ runs, onViewDetails, onApprove, onAnchor }: SettlementRunsTableProps) {
  const router = useRouter()

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: any; className: string }> = {
      draft: { variant: "secondary", className: "bg-gray-500/20 text-gray-300" },
      pending_approval: { variant: "secondary", className: "bg-yellow-500/20 text-yellow-300" },
      approved: { variant: "secondary", className: "bg-green-500/20 text-green-300" },
      processing: { variant: "secondary", className: "bg-blue-500/20 text-blue-300" },
      completed: { variant: "secondary", className: "bg-emerald-500/20 text-emerald-300" },
      failed: { variant: "secondary", className: "bg-red-500/20 text-red-300" },
    }

    const config = variants[status] || variants.draft

    return (
      <Badge variant={config.variant} className={config.className}>
        {status.replace("_", " ")}
      </Badge>
    )
  }

  const getAnchorBadge = (anchorStatus: string) => {
    if (anchorStatus === "anchored") {
      return (
        <Badge variant="secondary" className="bg-purple-500/20 text-purple-300">
          <Shield className="h-3 w-3 mr-1" />
          Anchored
        </Badge>
      )
    } else if (anchorStatus === "pending") {
      return (
        <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-300">
          <AlertCircle className="h-3 w-3 mr-1" />
          Pending
        </Badge>
      )
    }
    return null
  }

  return (
    <div className="rounded-lg border border-white/10 bg-background/50 backdrop-blur-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-white/10 hover:bg-white/5">
            <TableHead>Run Number</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Client Receipts</TableHead>
            <TableHead className="text-right">Vendor Payouts</TableHead>
            <TableHead className="text-right">Net Amount</TableHead>
            <TableHead>Blockchain</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {runs.map((run) => (
            <TableRow
              key={run.id}
              className="border-white/10 hover:bg-white/5 cursor-pointer"
              onClick={() => router.push(`/finance/pay-on-pay/${run.id}`)}
            >
              <TableCell className="font-medium">{run.run_number}</TableCell>
              <TableCell>{new Date(run.run_date).toLocaleDateString()}</TableCell>
              <TableCell>{getStatusBadge(run.status)}</TableCell>
              <TableCell className="text-right">${run.total_client_receipts.toLocaleString()}</TableCell>
              <TableCell className="text-right">${run.total_vendor_payouts.toLocaleString()}</TableCell>
              <TableCell className="text-right font-medium">${run.net_amount.toLocaleString()}</TableCell>
              <TableCell>{getAnchorBadge(run.anchor_status)}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onViewDetails?.(run.id)}>
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </DropdownMenuItem>
                    {run.status === "pending_approval" && (
                      <DropdownMenuItem onClick={() => onApprove?.(run.id)}>Approve</DropdownMenuItem>
                    )}
                    {run.status === "approved" && run.anchor_status === "pending" && (
                      <DropdownMenuItem onClick={() => onAnchor?.(run.id)}>
                        <Shield className="h-4 w-4 mr-2" />
                        Anchor to Blockchain
                      </DropdownMenuItem>
                    )}
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
