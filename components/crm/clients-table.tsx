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
import { MoreHorizontal, Eye, Edit, Trash2, Mail } from "lucide-react"
import Link from "next/link"

const clients = [
  {
    id: "1",
    name: "TechCorp Inc",
    industry: "Technology",
    tier: "platinum",
    status: "active",
    accountManager: "Lisa Manager",
    openPositions: 5,
    revenue: "$450,000",
    location: "San Francisco, CA",
  },
  {
    id: "2",
    name: "FinanceHub LLC",
    industry: "Finance",
    tier: "gold",
    status: "active",
    accountManager: "Lisa Manager",
    openPositions: 3,
    revenue: "$320,000",
    location: "New York, NY",
  },
  {
    id: "3",
    name: "HealthTech Solutions",
    industry: "Healthcare",
    tier: "silver",
    status: "active",
    accountManager: "John Admin",
    openPositions: 2,
    revenue: "$180,000",
    location: "Boston, MA",
  },
  {
    id: "4",
    name: "RetailMax Corp",
    industry: "Retail",
    tier: "bronze",
    status: "prospect",
    accountManager: "Sarah Recruiter",
    openPositions: 0,
    revenue: "$0",
    location: "Chicago, IL",
  },
  {
    id: "5",
    name: "EduLearn Platform",
    industry: "Education",
    tier: "silver",
    status: "active",
    accountManager: "Lisa Manager",
    openPositions: 4,
    revenue: "$210,000",
    location: "Austin, TX",
  },
]

const tierColors: Record<string, string> = {
  platinum: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  gold: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
  silver: "bg-gray-500/10 text-gray-600 dark:text-gray-400",
  bronze: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
}

export function ClientsTable() {
  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Client</TableHead>
            <TableHead>Industry</TableHead>
            <TableHead>Tier</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Account Manager</TableHead>
            <TableHead>Open Positions</TableHead>
            <TableHead>Revenue</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.map((client) => (
            <TableRow key={client.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={`/placeholder-32px.png?height=32&width=32`} />
                    <AvatarFallback>
                      {client.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{client.name}</p>
                    <p className="text-sm text-muted-foreground">{client.location}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>{client.industry}</TableCell>
              <TableCell>
                <Badge variant="secondary" className={tierColors[client.tier]}>
                  {client.tier}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant={client.status === "active" ? "default" : "secondary"}>{client.status}</Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">{client.accountManager}</TableCell>
              <TableCell>
                <Badge variant="outline">{client.openPositions}</Badge>
              </TableCell>
              <TableCell className="font-medium">{client.revenue}</TableCell>
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
                    <DropdownMenuItem asChild>
                      <Link href={`/crm/${client.id}`}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Client
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Mail className="mr-2 h-4 w-4" />
                      Send Email
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Client
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
