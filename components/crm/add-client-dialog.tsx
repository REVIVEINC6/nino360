"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus } from "lucide-react"
import { createClient } from "@/app/(dashboard)/crm/actions/accounts"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export function AddClientDialog() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const data = {
      name: formData.get("name") as string,
      industry: formData.get("industry") as string,
      tier: formData.get("tier") as string,
      status: formData.get("status") as string,
      location: formData.get("location") as string,
      notes: formData.get("notes") as string,
    }

    const result = await createClient(data)

    if (result.success) {
      toast.success("Client created successfully")
      setOpen(false)
      router.refresh()
    } else {
      toast.error(result.error || "Failed to create client")
    }

    setLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Client
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add New Client</DialogTitle>
            <DialogDescription>Create a new client account in your CRM system.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Company Name *</Label>
              <Input id="name" name="name" placeholder="Acme Corporation" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="industry">Industry</Label>
              <Input id="industry" name="industry" placeholder="Technology" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="tier">Tier</Label>
                <Select name="tier" defaultValue="bronze">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="platinum">Platinum</SelectItem>
                    <SelectItem value="gold">Gold</SelectItem>
                    <SelectItem value="silver">Silver</SelectItem>
                    <SelectItem value="bronze">Bronze</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select name="status" defaultValue="prospect">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="prospect">Prospect</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" name="location" placeholder="San Francisco, CA" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea id="notes" name="notes" placeholder="Additional information..." rows={3} />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Client"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
