"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mail, Copy, CheckCircle } from "lucide-react"
import { listRoles } from "../actions/roles"
import { listTenants } from "../actions/tenants"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { TwoPane } from "@/components/layout/two-pane"
import { AdminSidebar } from "@/components/admin/admin-sidebar"

export default function InvitationsPage() {
  const [roles, setRoles] = useState<any[]>([])
  const [tenants, setTenants] = useState<any[]>([])
  const [invitations, setInvitations] = useState<any[]>([])
  const [form, setForm] = useState({ email: "", tenant_id: "", role_id: "" })
  const [inviteLink, setInviteLink] = useState("")
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    ;(async () => {
  const [rolesData, tenantsData] = await Promise.all([listRoles(), listTenants()])
  setRoles(rolesData)
  // `listTenants` returns { rows, total } - callers here expect an array of tenants.
  // Accept either an array (legacy) or the new { rows } shape.
  setTenants(Array.isArray(tenantsData) ? tenantsData : tenantsData.rows || [])

      // Load existing invitations
      const supabase = getSupabaseBrowserClient()
      const { data } = await supabase.from("invitations").select("*").order("created_at", { ascending: false })

      if (data) setInvitations(data)
    })()
  }, [])

  const handleInvite = async () => {
    try {
      const response = await fetch("/api/admin/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })

      const data = await response.json()

      if (!response.ok) {
        alert(`Error: ${data.error}`)
        return
      }

      setInviteLink(data.invite_link)
      setForm({ email: "", tenant_id: "", role_id: "" })

      // Reload invitations
      const supabase = getSupabaseBrowserClient()
      const { data: invData } = await supabase.from("invitations").select("*").order("created_at", { ascending: false })

      if (invData) setInvitations(invData)
    } catch (error) {
      console.error("[v0] Error creating invitation:", error)
      alert("Failed to create invitation")
    }
  }

  const copyLink = () => {
    navigator.clipboard.writeText(inviteLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <TwoPane right={<AdminSidebar />}>
      <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Invitations</h1>
        <p className="text-muted-foreground">Invite users to join your organization</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Send Invitation</CardTitle>
          <CardDescription>Invite a user via email with a specific role</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="user@example.com"
                value={form.email}
                onChange={(e) => setForm((v) => ({ ...v, email: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tenant">Tenant</Label>
              <Select value={form.tenant_id} onValueChange={(v) => setForm((f) => ({ ...f, tenant_id: v }))}>
                <SelectTrigger id="tenant">
                  <SelectValue placeholder="Select tenant" />
                </SelectTrigger>
                <SelectContent>
                  {tenants.map((t: any) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select value={form.role_id} onValueChange={(v) => setForm((f) => ({ ...f, role_id: v }))}>
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((r: any) => (
                    <SelectItem key={r.id} value={r.id}>
                      {r.key}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button onClick={handleInvite}>
            <Mail className="mr-2 h-4 w-4" />
            Send Invitation
          </Button>

          {inviteLink && (
            <div className="mt-4 p-4 bg-muted rounded-lg space-y-2">
              <p className="text-sm font-medium">Invitation Link Generated:</p>
              <div className="flex gap-2">
                <Input value={inviteLink} readOnly className="font-mono text-xs" />
                <Button variant="outline" size="icon" onClick={copyLink}>
                  {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">Share this link with the user. It expires in 7 days.</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pending Invitations</CardTitle>
          <CardDescription>Track sent invitations and their status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg">
            <table className="w-full text-sm">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Expires</th>
                  <th className="p-3 text-left">Created</th>
                </tr>
              </thead>
              <tbody>
                {invitations.map((inv: any) => (
                  <tr key={inv.id} className="border-b hover:bg-muted/50">
                    <td className="p-3 font-medium">{inv.email}</td>
                    <td className="p-3">
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          inv.status === "accepted"
                            ? "bg-green-100 text-green-700"
                            : inv.status === "pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                        }`}
                      >
                        {inv.status}
                      </span>
                    </td>
                    <td className="p-3 text-muted-foreground">{new Date(inv.expires_at).toLocaleDateString()}</td>
                    <td className="p-3 text-muted-foreground">{new Date(inv.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      </div>
    </TwoPane>
  )
}
