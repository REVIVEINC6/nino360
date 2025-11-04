"use client"

import { Chrome, Link2, Unlink } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Provider {
  id: string
  name: string
  connected: boolean
}

interface ConnectedAccountsProps {
  providers: Provider[]
}

export function ConnectedAccounts({ providers }: ConnectedAccountsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {providers.map((provider) => (
        <div
          key={provider.id}
          className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10"
        >
          <div className="flex items-center gap-3">
            <Chrome className="h-5 w-5 text-[#8B5CF6]" />
            <div>
              <p className="text-sm font-medium">{provider.name}</p>
              <p className="text-xs text-muted-foreground">{provider.connected ? "Connected" : "Not connected"}</p>
            </div>
          </div>
          {provider.connected ? (
            <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300 hover:bg-red-500/10" disabled>
              <Unlink className="h-4 w-4" />
            </Button>
          ) : (
            <Button variant="outline" size="sm" className="bg-white/5 border-white/10" disabled>
              <Link2 className="mr-2 h-4 w-4" />
              Connect
            </Button>
          )}
        </div>
      ))}
    </div>
  )
}
