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
import { MoreHorizontal, Mail, Shield, Trash2 } from "lucide-react"

const users = [
  {
    id: "1",
    name: "John Admin",
    email: "john@acme-staffing.com",
    role: "admin",
    department: "Management",
    status: "active",
    lastLogin: "2 hours ago",
  },
  {
    id: "2",
    name: "Sarah Recruiter",
    email: "sarah@acme-staffing.com",
    role: "recruiter",
    department: "Talent Acquisition",
    status: "active",
    lastLogin: "5 hours ago",
  },
  {
    id: "3",
    name: "Mike Finance",
    email: "mike@acme-staffing.com",
    role: "finance",
    department: "Finance",
    status: "active",
    lastLogin: "1 day ago",
  },
  {
    id: "4",
    name: "Lisa Manager",
    email: "lisa@acme-staffing.com",
    role: "account_manager",
    department: "Client Relations",
    status: "active",
    lastLogin: "3 hours ago",
  },
  {
    id: "5",
    name: "Tom Employee",
    email: "tom@acme-staffing.com",
    role: "employee",
    department: "Operations",
    status: "inactive",
    lastLogin: "1 week ago",
  },
]

const roleColors: Record<string, string> = {
  admin: "bg-red-500/10 text-red-600 dark:text-red-400",
  recruiter: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  finance: "bg-green-500/10 text-green-600 dark:text-green-400",
  account_manager: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  employee: "bg-gray-500/10 text-gray-600 dark:text-gray-400",
}

export function UsersTable() {
  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Last Login</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={`/placeholder-32px.png?height=32&width=32`} />
                    <AvatarFallback>
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="secondary" className={roleColors[user.role]}>
                  {user.role.replace("_", " ")}
                </Badge>
              </TableCell>
              <TableCell>{user.department}</TableCell>
              <TableCell>
                <Badge variant={user.status === "active" ? "default" : "secondary"}>{user.status}</Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">{user.lastLogin}</TableCell>
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
                      <Mail className="mr-2 h-4 w-4" />
                      Send Email
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Shield className="mr-2 h-4 w-4" />
                      Change Role
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Remove User
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
