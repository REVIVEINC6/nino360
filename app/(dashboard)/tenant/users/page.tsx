"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Download,
  UserPlus,
  Mail,
  CheckCircle,
  XCircle,
  Filter,
  Eye,
  Users,
  Activity,
  Shield,
  Upload,
  Trash2,
} from "lucide-react"
import {
  listTenantMembers,
  inviteUser,
  listInvitations,
  resendInvite,
  cancelInvite,
  updateMemberRole,
  removeMember,
  bulkInvite,
  exportMembers,
  getMemberDetails,
} from "./actions"
import { createBrowserClient } from "@supabase/ssr"
import { useToast } from "@/hooks/use-toast"
import { Textarea } from "@/components/ui/textarea"

export default function TenantUsersPage() {
  const [members, setMembers] = useState<any[]>([])
  const [invitations, setInvitations] = useState<any[]>([])
  const [page, setPage] = useState(1)
  const [per] = useState(20)
  const [q, setQ] = useState("")
  const [total, setTotal] = useState(0)
  const [selected, setSelected] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [roleFilter, setRoleFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("joined_at")
  const [sortOrder, setSortOrder] = useState<string>("desc")

  // Dialogs
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false)
  const [bulkImportDialogOpen, setBulkImportDialogOpen] = useState(false)
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false)

  // Forms
  const [inviteForm, setInviteForm] = useState({ email: "", role: "member" })
  const [bulkEmails, setBulkEmails] = useState("")
  const [selectedMember, setSelectedMember] = useState<any>(null)
  const [memberDetails, setMemberDetails] = useState<any>(null)

  const { toast } = useToast()

  const [metrics, setMetrics] = useState({
    total: 0,
    active: 0,
    invited: 0,
    admins: 0,
  })

  const loadMembers = async () => {
    setLoading(true)
    try {
      const result = await listTenantMembers({
        q,
        page,
        per,
        role: roleFilter === "all" ? undefined : roleFilter,
        status: statusFilter === "all" ? undefined : statusFilter,
        sortBy,
        sortOrder,
      })

      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
        return
      }

      setMembers(result.members)
      setTotal(result.total)

      // Calculate metrics
      const activeCount = result.members.filter((m: any) => m.status === "active").length
      const invitedCount = result.members.filter((m: any) => m.status === "invited").length
      const adminCount = result.members.filter((m: any) => m.role === "tenant_admin").length

      setMetrics({
        total: result.total,
        active: activeCount,
        invited: invitedCount,
        admins: adminCount,
      })
    } catch (error: any) {
      console.error("[v0] Error loading members:", error)
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const loadInvitations = async () => {
    try {
      const result = await listInvitations()
      if (!result.error) {
        setInvitations(result.invitations)
      }
    } catch (error: any) {
      console.error("[v0] Error loading invitations:", error)
    }
  }

  useEffect(() => {
    loadMembers()
    loadInvitations()
  }, [q, page, per, roleFilter, statusFilter, sortBy, sortOrder])

  // Real-time updates
  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    )

    const channel = supabase
      .channel("tenant-members")
      .on("postgres_changes", { event: "*", schema: "core", table: "tenant_members" }, () => {
        loadMembers()
      })
      .on("postgres_changes", { event: "*", schema: "core", table: "invitations" }, () => {
        loadInvitations()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [q, page, per, roleFilter, statusFilter, sortBy, sortOrder])

  const handleInvite = async () => {
    try {
      const result = await inviteUser(inviteForm)
      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
        return
      }

      toast({
        title: "Success",
        description: "Invitation sent successfully",
      })
      setInviteDialogOpen(false)
      setInviteForm({ email: "", role: "member" })
      loadMembers()
      loadInvitations()
    } catch (error: any) {
      console.error("[v0] Error inviting user:", error)
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const handleBulkImport = async () => {
    try {
      const emails = bulkEmails
        .split("\n")
        .map((e) => e.trim())
        .filter((e) => e.length > 0)

      const result = await bulkInvite({ emails, role: "member" })
      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
        return
      }

      toast({
        title: "Success",
        description: `${result.invited} invitation(s) sent`,
      })
      setBulkImportDialogOpen(false)
      setBulkEmails("")
      loadMembers()
      loadInvitations()
    } catch (error: any) {
      console.error("[v0] Error bulk inviting:", error)
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const handleResendInvite = async (inviteId: string) => {
    try {
      const result = await resendInvite(inviteId)
      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
        return
      }

      toast({
        title: "Success",
        description: "Invitation resent",
      })
    } catch (error: any) {
      console.error("[v0] Error resending invite:", error)
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const handleCancelInvite = async (inviteId: string) => {
    try {
      const result = await cancelInvite(inviteId)
      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
        return
      }

      toast({
        title: "Success",
        description: "Invitation cancelled",
      })
      loadInvitations()
    } catch (error: any) {
      console.error("[v0] Error cancelling invite:", error)
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const handleUpdateRole = async (userId: string, newRole: string) => {
    try {
      const result = await updateMemberRole({ user_id: userId, role: newRole })
      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
        return
      }

      toast({
        title: "Success",
        description: "Role updated successfully",
      })
      loadMembers()
    } catch (error: any) {
      console.error("[v0] Error updating role:", error)
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const handleRemoveMember = async (userId: string) => {
    if (!confirm("Are you sure you want to remove this member?")) return

    try {
      const result = await removeMember(userId)
      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
        return
      }

      toast({
        title: "Success",
        description: "Member removed successfully",
      })
      loadMembers()
    } catch (error: any) {
      console.error("[v0] Error removing member:", error)
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const handleExport = async () => {
    try {
      const csv = await exportMembers(q)
      const blob = new Blob([csv], { type: "text/csv" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `tenant-members-${new Date().toISOString()}.csv`
      a.click()
      URL.revokeObjectURL(url)
      toast({
        title: "Success",
        description: "Members exported successfully",
      })
    } catch (error: any) {
      console.error("[v0] Error exporting:", error)
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const handleViewDetails = async (member: any) => {
    setSelectedMember(member)
    setDetailsDialogOpen(true)

    try {
      const details = await getMemberDetails(member.user_id)
      setMemberDetails(details)
    } catch (error: any) {
      console.error("[v0] Error loading member details:", error)
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const totalPages = Math.max(1, Math.ceil(total / per))

  const getRoleColor = (role: string) => {
    switch (role) {
      case "tenant_admin":
        return "default"
      case "manager":
        return "secondary"
      case "member":
        return "outline"
      case "viewer":
        return "outline"
      default:
        return "secondary"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "default"
      case "invited":
        return "secondary"
      case "suspended":
        return "destructive"
      default:
        return "secondary"
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Team Members</h1>
          <p className="text-muted-foreground">Manage users, roles, and invitations for your organization</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setBulkImportDialogOpen(true)}>
            <Upload className="mr-2 h-4 w-4" />
            Bulk Import
          </Button>
          <Button onClick={() => setInviteDialogOpen(true)}>
            <UserPlus className="mr-2 h-4 w-4" />
            Invite User
          </Button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-2xl font-bold">{metrics.total}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-2xl font-bold">{metrics.active}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Invites</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-blue-500" />
              <span className="text-2xl font-bold">{metrics.invited}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Administrators</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-purple-500" />
              <span className="text-2xl font-bold">{metrics.admins}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="members" className="space-y-4">
        <TabsList>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="invitations">
            Invitations
            {invitations.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {invitations.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="members" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Team Directory</CardTitle>
                  <CardDescription>Search, filter, and manage team members</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={handleExport}>
                  <Download className="mr-2 h-4 w-4" />
                  Export CSV
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Input
                  placeholder="Search by email or name..."
                  value={q}
                  onChange={(e) => {
                    setQ(e.target.value)
                    setPage(1)
                  }}
                  className="md:col-span-2"
                />

                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="tenant_admin">Admin</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="member">Member</SelectItem>
                    <SelectItem value="viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="invited">Invited</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {loading ? (
                <div className="text-center py-8 text-muted-foreground">Loading members...</div>
              ) : members.length === 0 ? (
                <div className="text-center py-12 space-y-3">
                  <div className="text-muted-foreground">
                    <Filter className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium">No members found</p>
                    <p className="text-sm">Try adjusting your search or filters</p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setQ("")
                      setRoleFilter("all")
                      setStatusFilter("all")
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              ) : (
                <div className="border rounded-lg">
                  <table className="w-full text-sm">
                    <thead className="border-b bg-muted/50">
                      <tr>
                        <th className="p-3 text-left">Email</th>
                        <th className="p-3 text-left">Name</th>
                        <th className="p-3 text-left">Role</th>
                        <th className="p-3 text-left">Status</th>
                        <th className="p-3 text-left">Joined</th>
                        <th className="p-3 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {members.map((member) => (
                        <tr key={member.user_id} className="border-b hover:bg-muted/50">
                          <td className="p-3">{member.email}</td>
                          <td className="p-3">{member.full_name || "-"}</td>
                          <td className="p-3">
                            <Select
                              value={member.role}
                              onValueChange={(value) => handleUpdateRole(member.user_id, value)}
                            >
                              <SelectTrigger className="w-[140px]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="tenant_admin">Admin</SelectItem>
                                <SelectItem value="manager">Manager</SelectItem>
                                <SelectItem value="member">Member</SelectItem>
                                <SelectItem value="viewer">Viewer</SelectItem>
                              </SelectContent>
                            </Select>
                          </td>
                          <td className="p-3">
                            <Badge variant={getStatusColor(member.status)}>{member.status}</Badge>
                          </td>
                          <td className="p-3 text-muted-foreground">
                            {member.joined_at ? new Date(member.joined_at).toLocaleDateString() : "-"}
                          </td>
                          <td className="p-3">
                            <div className="flex gap-2">
                              <Button variant="ghost" size="sm" onClick={() => handleViewDetails(member)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveMember(member.user_id)}
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Showing {members.length} of {total} members
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    Previous
                  </Button>
                  <span className="px-3 py-2 text-sm">
                    Page {page} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => p + 1)}
                    disabled={page >= totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invitations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending Invitations</CardTitle>
              <CardDescription>Manage and track user invitations</CardDescription>
            </CardHeader>
            <CardContent>
              {invitations.length === 0 ? (
                <div className="text-center py-12 space-y-3">
                  <div className="text-muted-foreground">
                    <Mail className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium">No pending invitations</p>
                    <p className="text-sm">Invite users to join your organization</p>
                  </div>
                  <Button onClick={() => setInviteDialogOpen(true)}>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Invite User
                  </Button>
                </div>
              ) : (
                <div className="border rounded-lg">
                  <table className="w-full text-sm">
                    <thead className="border-b bg-muted/50">
                      <tr>
                        <th className="p-3 text-left">Email</th>
                        <th className="p-3 text-left">Role</th>
                        <th className="p-3 text-left">Invited By</th>
                        <th className="p-3 text-left">Sent</th>
                        <th className="p-3 text-left">Expires</th>
                        <th className="p-3 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invitations.map((invite) => (
                        <tr key={invite.id} className="border-b hover:bg-muted/50">
                          <td className="p-3">{invite.email}</td>
                          <td className="p-3">
                            <Badge variant={getRoleColor(invite.role)}>{invite.role}</Badge>
                          </td>
                          <td className="p-3 text-muted-foreground">{invite.invited_by_email || "-"}</td>
                          <td className="p-3 text-muted-foreground">
                            {new Date(invite.created_at).toLocaleDateString()}
                          </td>
                          <td className="p-3 text-muted-foreground">
                            {new Date(invite.expires_at).toLocaleDateString()}
                          </td>
                          <td className="p-3">
                            <div className="flex gap-2">
                              <Button variant="ghost" size="sm" onClick={() => handleResendInvite(invite.id)}>
                                <Mail className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleCancelInvite(invite.id)}
                                className="text-destructive hover:text-destructive"
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Invite Dialog */}
      <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite User</DialogTitle>
            <DialogDescription>Send an invitation to join your organization</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Email Address</Label>
              <Input
                type="email"
                placeholder="user@example.com"
                value={inviteForm.email}
                onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
              />
            </div>
            <div>
              <Label>Role</Label>
              <Select value={inviteForm.role} onValueChange={(value) => setInviteForm({ ...inviteForm, role: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tenant_admin">Admin</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="member">Member</SelectItem>
                  <SelectItem value="viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setInviteDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleInvite}>Send Invitation</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Import Dialog */}
      <Dialog open={bulkImportDialogOpen} onOpenChange={setBulkImportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bulk Import Users</DialogTitle>
            <DialogDescription>Enter email addresses (one per line) to invite multiple users</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Email Addresses</Label>
              <Textarea
                placeholder="user1@example.com&#10;user2@example.com&#10;user3@example.com"
                value={bulkEmails}
                onChange={(e) => setBulkEmails(e.target.value)}
                rows={10}
              />
              <p className="text-xs text-muted-foreground mt-2">
                {bulkEmails.split("\n").filter((e) => e.trim().length > 0).length} email(s) entered
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBulkImportDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleBulkImport}>Send Invitations</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Member Details Dialog */}
      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Member Details</DialogTitle>
            <DialogDescription>View member information and activity</DialogDescription>
          </DialogHeader>

          {selectedMember && (
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="permissions">Permissions</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Email</Label>
                    <p className="text-sm text-muted-foreground">{selectedMember.email}</p>
                  </div>
                  <div>
                    <Label>Full Name</Label>
                    <p className="text-sm text-muted-foreground">{selectedMember.full_name || "-"}</p>
                  </div>
                  <div>
                    <Label>Role</Label>
                    <Badge variant={getRoleColor(selectedMember.role)}>{selectedMember.role}</Badge>
                  </div>
                  <div>
                    <Label>Status</Label>
                    <Badge variant={getStatusColor(selectedMember.status)}>{selectedMember.status}</Badge>
                  </div>
                  <div>
                    <Label>Joined</Label>
                    <p className="text-sm text-muted-foreground">
                      {selectedMember.joined_at ? new Date(selectedMember.joined_at).toLocaleString() : "-"}
                    </p>
                  </div>
                  <div>
                    <Label>User ID</Label>
                    <p className="text-xs text-muted-foreground font-mono">{selectedMember.user_id}</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="permissions" className="space-y-4">
                {memberDetails?.permissions && memberDetails.permissions.length > 0 ? (
                  <div className="space-y-2">
                    {memberDetails.permissions.map((perm: any) => (
                      <div key={perm.key} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4 text-primary" />
                          <span className="font-medium">{perm.description}</span>
                        </div>
                        <Badge variant="outline">{perm.key}</Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-8">No permissions assigned</p>
                )}
              </TabsContent>

              <TabsContent value="activity" className="space-y-4">
                {memberDetails?.activity && memberDetails.activity.length > 0 ? (
                  <div className="space-y-2">
                    {memberDetails.activity.map((log: any) => (
                      <div key={log.id} className="flex items-start gap-3 p-3 border rounded-lg">
                        <Activity className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-sm">{log.action}</span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(log.created_at).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">{log.resource}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-8">No recent activity</p>
                )}
              </TabsContent>
            </Tabs>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setDetailsDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
