"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Eye, Download, Mail, CheckCircle2 } from "lucide-react"

const invoices = [
  {
    id: "1",
    invoiceNumber: "INV-2025-001",
    client: "TechCorp Inc",
    project: "E-commerce Platform",
    invoiceDate: "Jan 1, 2025",
    dueDate: "Jan 31, 2025",
    amount: "$45,000",
    status: "paid",
  },
  {
    id: "2",
    invoiceNumber: "INV-2025-002",
    client: "FinanceHub LLC",
    project: "Mobile Banking App",
    invoiceDate: "Jan 5, 2025",
    dueDate: "Feb 4, 2025",
    amount: "$62,500",
    status: "sent",
  },
  {
    id: "3",
    invoiceNumber: "INV-2025-003",
    client: "HealthTech Solutions",
    project: "Patient Portal",
    invoiceDate: "Jan 8, 2025",
    dueDate: "Feb 7, 2025",
    amount: "$38,000",
    status: "sent",
  },
  {
    id: "4",
    invoiceNumber: "INV-2024-098",
    client: "TechCorp Inc",
    project: "E-commerce Platform",
    invoiceDate: "Dec 15, 2024",
    dueDate: "Jan 14, 2025",
    amount: "$52,000",
    status: "overdue",
  },
  {
    id: "5",
    invoiceNumber: "INV-2025-004",
    client: "EduLearn Platform",
    project: "Learning Management System",
    invoiceDate: "Jan 10, 2025",
    dueDate: "Feb 9, 2025",
    amount: "$41,500",
    status: "draft",
  },
]

const statusColors: Record<string, string> = {
  draft: "bg-gray-500/10 text-gray-600 dark:text-gray-400",
  sent: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  paid: "bg-green-500/10 text-green-600 dark:text-green-400",
  overdue: "bg-red-500/10 text-red-600 dark:text-red-400",
  cancelled: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
}

export function InvoicesTable() {
  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Invoice #</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Project</TableHead>
            <TableHead>Invoice Date</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => (
            <TableRow key={invoice.id}>
              <TableCell className="font-mono text-sm">{invoice.invoiceNumber}</TableCell>
              <TableCell className="font-medium">{invoice.client}</TableCell>
              <TableCell>{invoice.project}</TableCell>
              <TableCell>{invoice.invoiceDate}</TableCell>
              <TableCell>{invoice.dueDate}</TableCell>
              <TableCell className="font-medium">{invoice.amount}</TableCell>
              <TableCell>
                <Badge variant="secondary" className={statusColors[invoice.status]}>
                  {invoice.status}
                </Badge>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Eye className="mr-2 h-4 w-4" />
                      View Invoice
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Download className="mr-2 h-4 w-4" />
                      Download PDF
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Mail className="mr-2 h-4 w-4" />
                      Send to Client
                    </DropdownMenuItem>
                    {invoice.status !== "paid" && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <CheckCircle2 className="mr-2 h-4 w-4" />
                          Mark as Paid
                        </DropdownMenuItem>
                      </>
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
