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
import { MoreHorizontal, Eye, FileText, Download } from "lucide-react"

const contracts = [
  {
    id: "1",
    contractNumber: "VND-2024-001",
    vendor: "Elite Tech Staffing",
    title: "Staff Augmentation Services",
    startDate: "Jan 1, 2024",
    endDate: "Dec 31, 2024",
    value: "$850,000",
    status: "active",
  },
  {
    id: "2",
    contractNumber: "VND-2024-002",
    vendor: "Global Consulting Partners",
    title: "Consulting Services Agreement",
    startDate: "Mar 1, 2024",
    endDate: "Feb 28, 2025",
    value: "$450,000",
    status: "active",
  },
  {
    id: "3",
    contractNumber: "VND-2024-003",
    vendor: "Freelance Network",
    title: "Freelancer Platform Access",
    startDate: "Jan 15, 2024",
    endDate: "Jan 14, 2025",
    value: "$120,000",
    status: "active",
  },
  {
    id: "4",
    contractNumber: "VND-2023-045",
    vendor: "TechPro Solutions",
    title: "Recruitment Services",
    startDate: "Jun 1, 2023",
    endDate: "May 31, 2024",
    value: "$280,000",
    status: "expired",
  },
  {
    id: "5",
    contractNumber: "VND-2024-004",
    vendor: "CloudStaff Inc",
    title: "Cloud Infrastructure Support",
    startDate: "Apr 1, 2024",
    endDate: "Mar 31, 2025",
    value: "$650,000",
    status: "active",
  },
]

const statusColors: Record<string, string> = {
  draft: "bg-gray-500/10 text-gray-600 dark:text-gray-400",
  active: "bg-green-500/10 text-green-600 dark:text-green-400",
  expired: "bg-red-500/10 text-red-600 dark:text-red-400",
  terminated: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
}

export function ContractsTable() {
  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Contract #</TableHead>
            <TableHead>Vendor</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>End Date</TableHead>
            <TableHead>Value</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contracts.map((contract) => (
            <TableRow key={contract.id}>
              <TableCell className="font-mono text-sm">{contract.contractNumber}</TableCell>
              <TableCell className="font-medium">{contract.vendor}</TableCell>
              <TableCell>{contract.title}</TableCell>
              <TableCell>{contract.startDate}</TableCell>
              <TableCell>{contract.endDate}</TableCell>
              <TableCell className="font-medium">{contract.value}</TableCell>
              <TableCell>
                <Badge variant="secondary" className={statusColors[contract.status]}>
                  {contract.status}
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
                      <FileText className="mr-2 h-4 w-4" />
                      View Document
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Download className="mr-2 h-4 w-4" />
                      Download PDF
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
