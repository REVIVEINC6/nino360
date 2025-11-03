"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Plus, X, Users } from "lucide-react"
import { getHiringTeam, setHiringTeam } from "@/app/(dashboard)/talent/jobs/actions"
import { toast } from "sonner"

interface HiringTeamPanelProps {
  requisitionId: string
}

export function HiringTeamPanel({ requisitionId }: HiringTeamPanelProps) {
  const [team, setTeam] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadTeam()
  }, [requisitionId])

  const loadTeam = async () => {
    try {
      setLoading(true)
      const data = await getHiringTeam(requisitionId)
      setTeam(data)
    } catch (error) {
      console.error("[v0] Error loading team:", error)
      toast.error("Failed to load hiring team")
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      await setHiringTeam(
        requisitionId,
        team.map((m) => ({ user_id: m.user_id, role: m.role })),
      )
      toast.success("Hiring team updated")
    } catch (error) {
      console.error("[v0] Error saving team:", error)
      toast.error("Failed to update team")
    } finally {
      setSaving(false)
    }
  }

  const getRoleBadge = (role: string) => {
    const colors: Record<string, string> = {
      hm: "bg-purple-100 text-purple-800",
      recruiter: "bg-blue-100 text-blue-800",
      coord: "bg-green-100 text-green-800",
      interviewer: "bg-amber-100 text-amber-800",
    }
    return colors[role] || "bg-gray-100 text-gray-800"
  }

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      hm: "Hiring Manager",
      recruiter: "Recruiter",
      coord: "Coordinator",
      interviewer: "Interviewer",
    }
    return labels[role] || role
  }

  if (loading) {
    return (
      <Card className="p-6">
        <p className="text-center text-muted-foreground">Loading hiring team...</p>
      </Card>
    )
  }

  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold mb-2">Hiring Team</h3>
          <p className="text-sm text-muted-foreground">
            Assign team members and define their roles in the hiring process
          </p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <div className="space-y-3">
        {team.length === 0 ? (
          <div className="text-center py-8 space-y-2">
            <Users className="h-12 w-12 mx-auto text-muted-foreground" />
            <h4 className="font-semibold">No Team Members</h4>
            <p className="text-sm text-muted-foreground">Add team members to start building your hiring team</p>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Member
            </Button>
          </div>
        ) : (
          team.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={member.user?.avatar_url || "/placeholder.svg"} />
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{member.user?.full_name || "Unknown"}</p>
                  <p className="text-xs text-muted-foreground">{member.user?.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Badge className={getRoleBadge(member.role)}>{getRoleLabel(member.role)}</Badge>
                <Button variant="ghost" size="sm">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      <Button variant="outline" className="w-full bg-transparent">
        <Plus className="mr-2 h-4 w-4" />
        Add Team Member
      </Button>
    </Card>
  )
}
