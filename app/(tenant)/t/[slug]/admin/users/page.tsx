"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { UserPlus, Mail, MoreVertical, Trash2, Shield, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"

interface Member {
  id: string
  user_id: string
  role: string
  status: string
  joined_at: string
  user_profiles: {
    full_name: string
    email: string
    avatar_url: string | null
  }
}

export default function UsersPage() {
  const [members, setMembers] = useState<Member[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isInviting, setIsInviting] = useState(false)
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteRole, setInviteRole] = useState("member")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    loadMembers()
  }, [])

  const loadMembers = async () => {
    try {
      const supabase = getSupabaseBrowserClient()
      const { data, error } = await supabase
        .from("tenant_members")
        .select(
          `
          *,
          user_profiles (
            full_name,
            email,
            avatar_url
          )
        `,
        )
        .order("joined_at", { ascending: false })

      if (error) throw error
      setMembers(data || [])
    } catch (error) {
      console.error("Failed to load members:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInvite = async () => {
    setIsInviting(true)
    try {
      const response = await fetch("/api/admin/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: inviteEmail, role: inviteRole }),
      })

      if (!response.ok) throw new Error("Failed to send invite")

      toast({
        title: "Invite sent",
        description: `Invitation sent to ${inviteEmail}`,
      })

      setInviteEmail("")
      setIsDialogOpen(false)
      loadMembers()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send invite",
        variant: "destructive",
      })
    } finally {
      setIsInviting(false)
    }
  }

  const handleRemoveMember = async (memberId: string) => {
    try {
      const supabase = getSupabaseBrowserClient()
      const { error } = await supabase.from("tenant_members").delete().eq("id", memberId)

      if (error) throw error

      toast({
        title: "Member removed",
        description: "User has been removed from the workspace",
      })

      loadMembers()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to remove member",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
      </div>
    )
  }

  return (
    <div className="container max-w-6xl py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">User Management</h1>
            <p className="text-muted-foreground">Manage team members and their roles</p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
                <UserPlus className="mr-2 h-4 w-4" />
                Invite User
              </Button>
            </DialogTrigger>
            <DialogContent className="glass-panel border-white/10">
              <DialogHeader>
                <DialogTitle>Invite Team Member</DialogTitle>
                <DialogDescription>Send an invitation to join your workspace</DialogDescription>
              </DialogHeader>

              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="colleague@company.com"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="bg-white/5 border-white/10"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <select
                    id="role"
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value)}
                    className="w-full h-10 px-3 rounded-md bg-white/5 border border-white/10"
                  >
                    <option value="member">Member</option>
                    <option value="manager">Manager</option>
                    <option value="tenant_admin">Admin</option>
                  </select>
                </div>

                <Button
                  onClick={handleInvite}
                  disabled={isInviting || !inviteEmail}
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                >
                  {isInviting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Mail className="mr-2 h-4 w-4" />
                      Send Invite
                    </>
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Card className="glass-panel border-white/10 p-6">
          <div className="space-y-4">
            {members.map((member) => {
              const initials = member.user_profiles?.full_name
                ?.split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()

              return (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10 hover:border-purple-500/50 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={member.user_profiles?.avatar_url || "/placeholder.svg"} />
                      <AvatarFallback className="bg-gradient-to-br from-purple-500 to-indigo-500">
                        {initials}
                      </AvatarFallback>
                    </Avatar>

                    <div>
                      <p className="font-medium">{member.user_profiles?.full_name || "Unknown"}</p>
                      <p className="text-sm text-muted-foreground">{member.user_profiles?.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <Badge
                      variant={member.status === "active" ? "default" : "secondary"}
                      className={
                        member.status === "active"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-yellow-500/20 text-yellow-400"
                      }
                    >
                      {member.status}
                    </Badge>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Shield className="h-4 w-4" />
                      <span className="capitalize">{member.role.replace("_", " ")}</span>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="glass-panel border-white/10">
                        <DropdownMenuItem
                          onClick={() => handleRemoveMember(member.id)}
                          className="text-red-400 focus:text-red-400"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Remove
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      </motion.div>
    </div>
  )
}
