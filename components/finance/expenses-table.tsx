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
import { MoreHorizontal, Eye, Download, CheckCircle2, XCircle } from "lucide-react"

const expenses = [
  {
    id: "1",
    description: "Software Licenses - Annual Subscription",
    category: "Software",
    amount: "$12,500",
    date: "Jan 5, 2025",
    submittedBy: "John Admin",
    status: "approved",
  },
  {
    id: "2",
    description: "Travel - Client Meeting in NYC",
    category: "Travel",
    amount: "$2,450",
    date: "Jan 8, 2025",
    submittedBy: "Lisa Manager",
    status: "pending",
  },
  {
    id: "3",
    description: "Office Equipment - Laptops",
    category: "Hardware",
    amount: "$8,900",
    date: "Jan 10, 2025",
    submittedBy: "Sarah Recruiter",
    status: "approved",
  },
  {
    id: "4",
    description: "Marketing - LinkedIn Recruiter",
    category: "Marketing",
    amount: "$3,200",
    date: "Jan 12, 2025",
    submittedBy: "Mike Finance",
    status: "pending",
  },
  {
    id: "5",
    description: "Consulting Services - Legal Review",
    category: "Consulting",
    amount: "$5,500",
    date: "Jan 15, 2025",
    submittedBy: "John Admin",
    status: "paid",
  },
]

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
  approved: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  paid: "bg-green-500/10 text-green-600 dark:text-green-400",
  rejected: "bg-red-500/10 text-red-600 dark:text-red-400",
}

export function ExpensesTable() {
  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Description</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Submitted By</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {expenses.map((expense) => (
            <TableRow key={expense.id}>
              <TableCell className="font-medium">{expense.description}</TableCell>
              <TableCell>
                <Badge variant="outline">{expense.category}</Badge>
              </TableCell>
              <TableCell className="font-medium">{expense.amount}</TableCell>
              <TableCell>{expense.date}</TableCell>
              <TableCell>{expense.submittedBy}</TableCell>
              <TableCell>
                <Badge variant="secondary" className={statusColors[expense.status]}>
                  {expense.status}
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
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Download className="mr-2 h-4 w-4" />
                      Download Receipt
                    </DropdownMenuItem>
                    {expense.status === "pending" && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <CheckCircle2 className="mr-2 h-4 w-4" />
                          Approve
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <XCircle className="mr-2 h-4 w-4" />
                          Reject
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
