"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { inviteUsers } from "@/app/(dashboard)/tenant/users/actions"
import { toast } from "sonner"

interface InviteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function InviteDialog({ open, onOpenChange }: InviteDialogProps) {
  const [emails, setEmails] = useState("")
  const [role, setRole] = useState<string>("member")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const emailList = emails
        .split(/[\n,]/)
        .map((e) => e.trim())
        .filter(Boolean)

      const result = await inviteUsers({
        invites: emailList.map((email) => ({ email, role: role as any })),
      })

      if (result.success) {
        toast.success(`Invited ${result.inserted} users successfully`)
        if (result.duplicates > 0) {
          toast.info(`${result.duplicates} users were already members`)
        }
        onOpenChange(false)
        setEmails("")
      } else {
        toast.error(result.error || "Failed to invite users")
      }
    } catch (error) {
      toast.error("Failed to invite users")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite Users</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Email Addresses</label>
            <Textarea
              placeholder="Enter email addresses (one per line or comma-separated)"
              value={emails}
              onChange={(e) => setEmails(e.target.value)}
              rows={5}
              className="mt-2"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Role</label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tenant_admin">Tenant Admin</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
                <SelectItem value="member">Member</SelectItem>
                <SelectItem value="viewer">Viewer</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={loading || !emails.trim()}>
              {loading ? "Inviting..." : "Send Invites"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
