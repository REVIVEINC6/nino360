"use client"

import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { setRole } from "@/app/(app)/tenant/users/actions"
import { toast } from "sonner"

interface RoleDropdownProps {
  userId: string
  currentRole: string
}

export function RoleDropdown({ userId, currentRole }: RoleDropdownProps) {
  const [role, setRoleState] = useState(currentRole)
  const [loading, setLoading] = useState(false)

  const handleChange = async (newRole: string) => {
    setLoading(true)
    try {
      const result = await setRole({ userId, role: newRole as any })
      if (result.success) {
        setRoleState(newRole)
        toast.success("Role updated successfully")
      } else {
        toast.error(result.error || "Failed to update role")
      }
    } catch (error) {
      toast.error("Failed to update role")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Select value={role} onValueChange={handleChange} disabled={loading}>
      <SelectTrigger className="w-[140px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="tenant_admin">Tenant Admin</SelectItem>
        <SelectItem value="manager">Manager</SelectItem>
        <SelectItem value="member">Member</SelectItem>
        <SelectItem value="viewer">Viewer</SelectItem>
      </SelectContent>
    </Select>
  )
}
