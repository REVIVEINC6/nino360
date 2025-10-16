"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { setStatus } from "@/app/(app)/tenant/users/actions"
import { toast } from "sonner"

interface StatusDropdownProps {
  userId: string
  currentStatus: string
}

export function StatusDropdown({ userId, currentStatus }: StatusDropdownProps) {
  const [status, setStatusState] = useState(currentStatus)
  const [loading, setLoading] = useState(false)

  const handleToggle = async () => {
    const newStatus = status === "active" ? "suspended" : "active"
    setLoading(true)
    try {
      const result = await setStatus({ userId, status: newStatus as any })
      if (result.success) {
        setStatusState(newStatus)
        toast.success(`User ${newStatus === "active" ? "activated" : "suspended"} successfully`)
      } else {
        toast.error(result.error || "Failed to update status")
      }
    } catch (error) {
      toast.error("Failed to update status")
    } finally {
      setLoading(false)
    }
  }

  if (currentStatus === "invited") {
    return <Badge variant="secondary">Invited</Badge>
  }

  return (
    <Button variant="ghost" size="sm" onClick={handleToggle} disabled={loading}>
      <Badge variant={status === "active" ? "default" : "destructive"}>{status}</Badge>
    </Button>
  )
}
