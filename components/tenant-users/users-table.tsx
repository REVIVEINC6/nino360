"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Shield, Clock } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { RoleDropdown } from "./role-dropdown"
import { StatusDropdown } from "./status-dropdown"
import { formatDistanceToNow } from "date-fns"

interface UsersTableProps {
  initialData: {
    rows: any[]
    total: number
  }
  canManage: boolean
  onOpenAudit: (userId: string) => void
}

export function UsersTable({ initialData, canManage, onOpenAudit }: UsersTableProps) {
  const [data, setData] = useState(initialData)

  return (
    <div className="rounded-lg border border-white/10 bg-white/5 backdrop-blur-xl">
      <Table>
        <TableHeader>
          <TableRow className="border-white/10 hover:bg-white/5">
            <TableHead>Member</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>MFA</TableHead>
            <TableHead>Last Seen</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.rows.map((member) => (
            <TableRow key={member.user_id || member.email} className="border-white/10 hover:bg-white/5">
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={member.avatar_url || undefined} />
                    <AvatarFallback>
                      {member.full_name
                        ?.split(" ")
                        .map((n: string) => n[0])
                        .join("")
                        .toUpperCase() || member.email[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{member.full_name || "Pending"}</div>
                    <div className="text-sm text-muted-foreground">{member.email}</div>
                    {member.title && <div className="text-xs text-muted-foreground">{member.title}</div>}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                {canManage ? (
                  <RoleDropdown userId={member.user_id} currentRole={member.role} />
                ) : (
                  <Badge variant="outline">{member.role}</Badge>
                )}
              </TableCell>
              <TableCell>
                {canManage ? (
                  <StatusDropdown userId={member.user_id} currentStatus={member.status} />
                ) : (
                  <Badge
                    variant={
                      member.status === "active" ? "default" : member.status === "invited" ? "secondary" : "destructive"
                    }
                  >
                    {member.status}
                  </Badge>
                )}
              </TableCell>
              <TableCell>
                {member.mfa_enabled ? (
                  <Shield className="h-4 w-4 text-green-500" />
                ) : (
                  <Shield className="h-4 w-4 text-muted-foreground" />
                )}
              </TableCell>
              <TableCell>
                {member.last_login_at ? (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {formatDistanceToNow(new Date(member.last_login_at), { addSuffix: true })}
                  </div>
                ) : (
                  <span className="text-sm text-muted-foreground">Never</span>
                )}
              </TableCell>
              <TableCell>
                <span className="text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(member.created_at), { addSuffix: true })}
                </span>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => member.user_id && onOpenAudit(member.user_id)}>
                      View Audit Log
                    </DropdownMenuItem>
                    {member.status === "invited" && canManage && (
                      <>
                        <DropdownMenuItem>Resend Invite</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Revoke Invite</DropdownMenuItem>
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
