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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MoreHorizontal, Eye, Edit, Mail, Star } from "lucide-react"

const vendors = [
  {
    id: "1",
    name: "Elite Tech Staffing",
    type: "Staffing Agency",
    contact: "Robert Martinez",
    email: "robert@elitetech.example.com",
    phone: "+1 (555) 201-0001",
    activeContracts: 8,
    status: "active",
    rating: 5,
  },
  {
    id: "2",
    name: "Global Consulting Partners",
    type: "Consulting Firm",
    contact: "Lisa Anderson",
    email: "lisa@globalcp.example.com",
    phone: "+1 (555) 201-0002",
    activeContracts: 5,
    status: "active",
    rating: 4,
  },
  {
    id: "3",
    name: "Freelance Network",
    type: "Freelancer Platform",
    contact: "Tom Wilson",
    email: "tom@freelancenet.example.com",
    phone: "+1 (555) 201-0003",
    activeContracts: 12,
    status: "active",
    rating: 3,
  },
  {
    id: "4",
    name: "TechPro Solutions",
    type: "Staffing Agency",
    contact: "Emily Davis",
    email: "emily@techpro.example.com",
    phone: "+1 (555) 201-0004",
    activeContracts: 3,
    status: "inactive",
    rating: 4,
  },
  {
    id: "5",
    name: "CloudStaff Inc",
    type: "Contractor",
    contact: "Michael Brown",
    email: "michael@cloudstaff.example.com",
    phone: "+1 (555) 201-0005",
    activeContracts: 6,
    status: "active",
    rating: 5,
  },
]

const statusColors: Record<string, string> = {
  active: "bg-green-500/10 text-green-600 dark:text-green-400",
  inactive: "bg-gray-500/10 text-gray-600 dark:text-gray-400",
  blacklisted: "bg-red-500/10 text-red-600 dark:text-red-400",
}

export function VendorsTable() {
  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Vendor</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Active Contracts</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {vendors.map((vendor) => (
            <TableRow key={vendor.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder-32px.png?height=32&width=32" />
                    <AvatarFallback>
                      {vendor.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{vendor.name}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>{vendor.type}</TableCell>
              <TableCell>
                <div>
                  <p className="text-sm font-medium">{vendor.contact}</p>
                  <p className="text-xs text-muted-foreground">{vendor.email}</p>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline">{vendor.activeContracts}</Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  {Array.from({ length: vendor.rating }).map((_, i) => (
                    <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="secondary" className={statusColors[vendor.status]}>
                  {vendor.status}
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
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Vendor
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Mail className="mr-2 h-4 w-4" />
                      Send Email
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
