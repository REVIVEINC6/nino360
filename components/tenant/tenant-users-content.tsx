"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { UserPlus, Search, Mail, Shield, Calendar, MoreVertical, Ban, Edit } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { inviteUser, updateUserRole, deactivateUser } from "@/app/(app)/tenant/users/actions"
import { useToast } from "@/hooks/use-toast"

interface User {
  id: string
  email: string
  full_name: string
  role: string
  status: string
  last_login: string
  created_at: string
}

interface TenantUsersContentProps {
  users: User[]
}

export function TenantUsersContent({ users: initialUsers }: TenantUsersContentProps) {
  const [users, setUsers] = useState(initialUsers)
  const [searchQuery, setSearchQuery] = useState("")
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false)
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteRole, setInviteRole] = useState("user")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const filteredUsers = users.filter(
    (user) =>
      user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleInviteUser = async () => {
    if (!inviteEmail) return

    setLoading(true)
    try {
      await inviteUser(inviteEmail, inviteRole)
      toast({
        title: "Invitation sent",
        description: `Invitation sent to ${inviteEmail}`,
      })
      setInviteDialogOpen(false)
      setInviteEmail("")
      setInviteRole("user")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send invitation",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateRole = async (userId: string, newRole: string) => {
    try {
      await updateUserRole(userId, newRole)
      setUsers(users.map((u) => (u.id === userId ? { ...u, role: newRole } : u)))
      toast({
        title: "Role updated",
        description: "User role has been updated successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user role",
        variant: "destructive",
      })
    }
  }

  const handleDeactivateUser = async (userId: string) => {
    try {
      await deactivateUser(userId)
      setUsers(users.map((u) => (u.id === userId ? { ...u, status: "inactive" } : u)))
      toast({
        title: "User deactivated",
        description: "User has been deactivated successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to deactivate user",
        variant: "destructive",
      })
    }
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-700 border-purple-300"
      case "manager":
        return "bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-700 border-blue-300"
      default:
        return "bg-gradient-to-r from-gray-500/20 to-slate-500/20 text-gray-700 border-gray-300"
    }
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-700 border-green-300"
      case "inactive":
        return "bg-gradient-to-r from-red-500/20 to-rose-500/20 text-red-700 border-red-300"
      default:
        return "bg-gradient-to-r from-yellow-500/20 to-amber-500/20 text-yellow-700 border-yellow-300"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            User Management
          </h1>
          <p className="text-muted-foreground mt-1">Manage users and their access to your organization</p>
        </div>
        <Button
          onClick={() => setInviteDialogOpen(true)}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Invite User
        </Button>
      </div>

      {/* Search */}
      <Card className="p-4 bg-white/50 backdrop-blur-sm border-white/20">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, or role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      {/* Users List */}
      <div className="grid gap-4">
        {filteredUsers.map((user) => (
          <Card
            key={user.id}
            className="p-6 bg-white/50 backdrop-blur-sm border-white/20 hover:shadow-lg transition-all"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4 flex-1">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                  {user.full_name?.charAt(0) || user.email.charAt(0).toUpperCase()}
                </div>

                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-lg">{user.full_name || "No Name"}</h3>
                    <Badge className={getRoleBadgeColor(user.role)}>
                      <Shield className="h-3 w-3 mr-1" />
                      {user.role}
                    </Badge>
                    <Badge className={getStatusBadgeColor(user.status)}>{user.status}</Badge>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Mail className="h-4 w-4" />
                      {user.email}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Last login: {user.last_login ? new Date(user.last_login).toLocaleDateString() : "Never"}
                    </div>
                  </div>
                </div>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => {
                      const newRole = prompt("Enter new role (admin, manager, user):")
                      if (newRole) handleUpdateRole(user.id, newRole)
                    }}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Change Role
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDeactivateUser(user.id)} className="text-red-600">
                    <Ban className="h-4 w-4 mr-2" />
                    Deactivate
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </Card>
        ))}
      </div>

      {/* Invite Dialog */}
      <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite User</DialogTitle>
            <DialogDescription>Send an invitation to join your organization</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="user@example.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select value={inviteRole} onValueChange={setInviteRole}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setInviteDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleInviteUser}
              disabled={loading || !inviteEmail}
              className="bg-gradient-to-r from-blue-600 to-purple-600"
            >
              {loading ? "Sending..." : "Send Invitation"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
