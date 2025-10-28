"use client"

import { AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ErrorState() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <AlertCircle className="h-12 w-12 text-destructive mb-4" />
      <h3 className="text-lg font-semibold mb-2">Failed to load users</h3>
      <p className="text-muted-foreground mb-4">There was an error loading the user list</p>
      <Button onClick={() => window.location.reload()}>Retry</Button>
    </div>
  )
}
