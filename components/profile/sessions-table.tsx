"use client"

import { useState } from "react"
import { Monitor, Smartphone, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { revokeSession } from "@/app/(app)/profile/actions"

interface Session {
  id: string
  device: string
  ip: string
  last_seen: string
}

interface SessionsTableProps {
  sessions: Session[]
}

export function SessionsTable({ sessions }: SessionsTableProps) {
  const [revoking, setRevoking] = useState<string | null>(null)
  const { toast } = useToast()

  const handleRevoke = async (sessionId: string) => {
    setRevoking(sessionId)
    const result = await revokeSession(sessionId)

    if (result.error) {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive",
      })
    } else {
      toast({
        title: "Success",
        description: result.message,
      })
    }

    setRevoking(null)
  }

  return (
    <div className="space-y-3">
      {sessions.map((session) => (
        <div
          key={session.id}
          className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10"
        >
          <div className="flex items-center gap-3">
            {session.device.includes("Mobile") ? (
              <Smartphone className="h-5 w-5 text-[#8B5CF6]" />
            ) : (
              <Monitor className="h-5 w-5 text-[#8B5CF6]" />
            )}
            <div>
              <p className="text-sm font-medium">{session.device}</p>
              <p className="text-xs text-muted-foreground">
                {session.ip} • {new Date(session.last_seen).toLocaleString()}
              </p>
            </div>
          </div>
          {session.id !== "current" && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleRevoke(session.id)}
              disabled={revoking === session.id}
              className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      ))}
    </div>
  )
}
