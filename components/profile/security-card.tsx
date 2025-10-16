"use client"

import { Mail, Shield, Key, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface SecurityCardProps {
  email: string
  lastLogin?: string | null
  totpEnabled?: boolean
}

export function SecurityCard({ email, lastLogin, totpEnabled = false }: SecurityCardProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
        <div className="flex items-center gap-3">
          <Mail className="h-5 w-5 text-[#8B5CF6]" />
          <div>
            <p className="text-sm font-medium">Email</p>
            <p className="text-sm text-muted-foreground">{email}</p>
          </div>
        </div>
        <Badge variant="outline" className="border-[#8B5CF6]/30 text-[#8B5CF6]">
          Verified
        </Badge>
      </div>

      <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
        <div className="flex items-center gap-3">
          <Shield className="h-5 w-5 text-[#8B5CF6]" />
          <div>
            <p className="text-sm font-medium">Two-Factor Authentication</p>
            <p className="text-sm text-muted-foreground">{totpEnabled ? "Enabled" : "Not enabled"}</p>
          </div>
        </div>
        <Button variant="outline" size="sm" className="bg-white/5 border-white/10" disabled>
          {totpEnabled ? "Disable" : "Enable"}
        </Button>
      </div>

      {lastLogin && (
        <div className="flex items-center gap-3 p-4 rounded-lg bg-white/5 border border-white/10">
          <Clock className="h-5 w-5 text-[#8B5CF6]" />
          <div>
            <p className="text-sm font-medium">Last Login</p>
            <p className="text-sm text-muted-foreground">{new Date(lastLogin).toLocaleString()}</p>
          </div>
        </div>
      )}

      <Button variant="outline" className="w-full bg-white/5 border-white/10 hover:bg-white/10">
        <Key className="mr-2 h-4 w-4" />
        Change Password
      </Button>
    </div>
  )
}
