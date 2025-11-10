"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Plus, X } from "lucide-react"
import { sendInvitations } from "@/app/(dashboard)/tenant/onboarding/actions"
import { useToast } from "@/hooks/use-toast"

interface InviteUsersStepProps {
  tenantId: string
  onComplete: () => void
}

interface Invite {
  email: string
  role: string
  full_name: string
}

export function InviteUsersStep({ tenantId, onComplete }: InviteUsersStepProps) {
  const { toast } = useToast()
  const [invites, setInvites] = useState<Invite[]>([{ email: "", role: "viewer", full_name: "" }])

  const addInvite = () => {
    setInvites([...invites, { email: "", role: "viewer", full_name: "" }])
  }

  const removeInvite = (index: number) => {
    setInvites(invites.filter((_, i) => i !== index))
  }

  const updateInvite = (index: number, field: keyof Invite, value: string) => {
    const updated = [...invites]
    updated[index] = { ...updated[index], [field]: value }
    setInvites(updated)
  }

  const handleSend = async () => {
    const validInvites = invites.filter((inv) => inv.email && inv.role)

    if (validInvites.length === 0) {
      onComplete()
      return
    }

    try {
      await sendInvitations({
        tenant_id: tenantId,
        invites: validInvites,
      })
      toast({
        title: "Success",
        description: `${validInvites.length} invitation(s) sent successfully`,
      })
      onComplete()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send invitations",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-white/60 text-sm">
        Invite team members to join your workspace. You can skip this and invite users later.
      </p>

      {invites.map((invite, index) => (
        <div key={index} className="flex gap-3 items-end">
          <div className="flex-1 space-y-2">
            <Label className="text-white">Email</Label>
            <Input
              type="email"
              placeholder="user@example.com"
              value={invite.email}
              onChange={(e) => updateInvite(index, "email", e.target.value)}
              className="bg-white/5 border-white/10 text-white"
            />
          </div>
          <div className="flex-1 space-y-2">
            <Label className="text-white">Full Name</Label>
            <Input
              placeholder="John Doe"
              value={invite.full_name}
              onChange={(e) => updateInvite(index, "full_name", e.target.value)}
              className="bg-white/5 border-white/10 text-white"
            />
          </div>
          <div className="w-40 space-y-2">
            <Label className="text-white">Role</Label>
            <Select value={invite.role} onValueChange={(v) => updateInvite(index, "role", v)}>
              <SelectTrigger className="bg-white/5 border-white/10 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
                <SelectItem value="recruiter">Recruiter</SelectItem>
                <SelectItem value="viewer">Viewer</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {invites.length > 1 && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeInvite(index)}
              className="text-white/60 hover:text-white"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      ))}

      <Button
        variant="outline"
        onClick={addInvite}
        className="w-full bg-white/5 border-white/10 text-white hover:bg-white/10"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Another Invite
      </Button>

      <button
        onClick={handleSend}
        className="w-full bg-[#8B5CF6] hover:bg-[#8B5CF6]/90 text-white py-2 px-4 rounded-lg transition-colors mt-6"
      >
        Send Invitations
      </button>
    </div>
  )
}
