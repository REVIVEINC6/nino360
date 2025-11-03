"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"

interface ErrorStateProps {
  message: string
  onRetry: () => void
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="container mx-auto p-6">
      <Card className="glass p-12 text-center">
        <AlertCircle className="w-12 h-12 mx-auto mb-4 text-destructive" />
        <h3 className="text-lg font-semibold mb-2">Error Loading Security Settings</h3>
        <p className="text-muted-foreground mb-6">{message}</p>
        <Button onClick={onRetry}>Retry</Button>
      </Card>
    </div>
  )
}
