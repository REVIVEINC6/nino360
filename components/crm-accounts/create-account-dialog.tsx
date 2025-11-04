"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { upsertAccount } from "@/app/(dashboard)/crm/actions/accounts"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

interface CreateAccountDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateAccountDialog({ open, onOpenChange }: CreateAccountDialogProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    domain: "",
    industry: "",
    size: "",
    status: "prospect" as const,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await upsertAccount(formData)
      toast.success("Account created successfully")
      onOpenChange(false)
      setFormData({ name: "", domain: "", industry: "", size: "", status: "prospect" })
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create account")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-modal">
        <DialogHeader>
          <DialogTitle>Create New Account</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Account Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Acme Corporation"
              required
              className="glass-card"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="domain">Domain</Label>
            <Input
              id="domain"
              value={formData.domain}
              onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
              placeholder="acme.com"
              className="glass-card"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="industry">Industry</Label>
              <Input
                id="industry"
                value={formData.industry}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                placeholder="Technology"
                className="glass-card"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="size">Company Size</Label>
              <Select value={formData.size} onValueChange={(value) => setFormData({ ...formData, size: value })}>
                <SelectTrigger className="glass-card">
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent className="glass-card">
                  <SelectItem value="startup">Startup (1-10)</SelectItem>
                  <SelectItem value="small">Small (11-50)</SelectItem>
                  <SelectItem value="medium">Medium (51-200)</SelectItem>
                  <SelectItem value="large">Large (201-1000)</SelectItem>
                  <SelectItem value="enterprise">Enterprise (1000+)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value: any) => setFormData({ ...formData, status: value })}>
              <SelectTrigger className="glass-card">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="glass-card">
                <SelectItem value="prospect">Prospect</SelectItem>
                <SelectItem value="customer">Customer</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="bg-linear-to-r from-blue-600 to-purple-600">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Account
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
