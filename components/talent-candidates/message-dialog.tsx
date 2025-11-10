"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Mail, Sparkles } from "lucide-react"
import { toast } from "sonner"

interface MessageDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedIds: string[]
  onSuccess: () => void
}

export function MessageDialog({ open, onOpenChange, selectedIds, onSuccess }: MessageDialogProps) {
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSend = async () => {
    if (!subject || !message) {
      toast.error("Please fill in all fields")
      return
    }

    setLoading(true)
    try {
      // TODO: Implement actual messaging functionality
      await new Promise((resolve) => setTimeout(resolve, 1500))
      toast.success(`Message sent to ${selectedIds.length} candidates`)
      onOpenChange(false)
      onSuccess()
    } catch (error) {
      toast.error("Failed to send message")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Send Message to Candidates</DialogTitle>
          <DialogDescription>Compose a message to send to {selectedIds.length} selected candidates</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              placeholder="Enter email subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              placeholder="Enter your message..."
              rows={8}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>

          <Button variant="outline" size="sm" className="w-full bg-transparent">
            <Sparkles className="mr-2 h-4 w-4" />
            Generate with AI
          </Button>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
            Cancel
          </Button>
          <Button onClick={handleSend} disabled={loading} className="flex-1">
            <Mail className="mr-2 h-4 w-4" />
            {loading ? "Sending..." : "Send Message"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
