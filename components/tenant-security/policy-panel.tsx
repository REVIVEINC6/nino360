"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { X, Plus, Save } from "lucide-react"
// import the existing server action that updates org security settings
import { updateSecuritySettings as savePolicies } from "@/app/(dashboard)/tenant/actions/security"
import { toast } from "sonner"
import { ConfirmDialog } from "./confirm-dialog"

interface PolicyPanelProps {
  context: any
  onUpdate: () => void
}

export function PolicyPanel({ context, onUpdate }: PolicyPanelProps) {
  const { security } = context
  const [mfaRequired, setMfaRequired] = useState(security.mfa_required || false)
  const [sessionMax, setSessionMax] = useState(security.session_max_minutes || 720)
  const [sessionIdle, setSessionIdle] = useState(security.session_idle_minutes || 60)
  const [ipAllowlist, setIpAllowlist] = useState<string[]>(security.ip_allowlist || [])
  const [newIp, setNewIp] = useState("")
  const [passwordMinLength, setPasswordMinLength] = useState(security.password_min_length || 12)
  const [passwordSymbols, setPasswordSymbols] = useState(security.password_require_symbols ?? true)
  const [passwordNumbers, setPasswordNumbers] = useState(security.password_require_numbers ?? true)
  const [passwordCases, setPasswordCases] = useState(security.password_require_cases ?? true)
  const [saving, setSaving] = useState(false)
  const [showMfaConfirm, setShowMfaConfirm] = useState(false)

  const handleMfaToggle = (checked: boolean) => {
    if (!checked && mfaRequired) {
      setShowMfaConfirm(true)
    } else {
      setMfaRequired(checked)
    }
  }

  const confirmMfaDisable = () => {
    setMfaRequired(false)
    setShowMfaConfirm(false)
  }

  const addIp = () => {
    if (newIp && !ipAllowlist.includes(newIp)) {
      setIpAllowlist([...ipAllowlist, newIp])
      setNewIp("")
    }
  }

  const removeIp = (ip: string) => {
    setIpAllowlist(ipAllowlist.filter((i) => i !== ip))
  }

  const handleSave = async () => {
    setSaving(true)


    try {
      // only send fields the server action expects
      await savePolicies({
        mfa_required: mfaRequired,
        ip_allowlist: ipAllowlist,
        session_timeout: sessionMax,
      } as any)

      toast.success("Policies updated successfully")
      // notify parent to refresh context
      if (typeof onUpdate === "function") onUpdate()
    } catch (err: any) {
      toast.error(err?.message || "Failed to save policies")
    }

    setSaving(false)
  }

  return (
    <div className="space-y-6">
      {/* MFA & Password Card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="glass p-6 space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">MFA & Password Policy</h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Require MFA for all users</Label>
                  <p className="text-sm text-muted-foreground">Users must enable two-factor authentication</p>
                </div>
                <Switch checked={mfaRequired} onCheckedChange={handleMfaToggle} />
              </div>

              <div className="space-y-2">
                <Label>Minimum password length: {passwordMinLength}</Label>
                <Slider
                  value={[passwordMinLength]}
                  onValueChange={([v]) => setPasswordMinLength(v)}
                  min={8}
                  max={128}
                  step={1}
                  className="w-full"
                />
              </div>

              <div className="flex items-center justify-between">
                <Label>Require symbols (!@#$%)</Label>
                <Switch checked={passwordSymbols} onCheckedChange={setPasswordSymbols} />
              </div>

              <div className="flex items-center justify-between">
                <Label>Require numbers (0-9)</Label>
                <Switch checked={passwordNumbers} onCheckedChange={setPasswordNumbers} />
              </div>

              <div className="flex items-center justify-between">
                <Label>Require mixed case (Aa)</Label>
                <Switch checked={passwordCases} onCheckedChange={setPasswordCases} />
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Sessions Card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="glass p-6 space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Session Policies</h3>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Maximum session lifetime: {sessionMax} minutes</Label>
                <Slider
                  value={[sessionMax]}
                  onValueChange={([v]) => setSessionMax(v)}
                  min={5}
                  max={1440}
                  step={5}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label>Idle timeout: {sessionIdle} minutes</Label>
                <Slider
                  value={[sessionIdle]}
                  onValueChange={([v]) => setSessionIdle(v)}
                  min={5}
                  max={1440}
                  step={5}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* IP Allowlist Card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card className="glass p-6 space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">IP Allowlist</h3>

            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="192.168.1.0/24"
                  value={newIp}
                  onChange={(e) => setNewIp(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addIp()}
                />
                <Button onClick={addIp} size="icon">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {ipAllowlist.map((ip) => (
                  <Badge key={ip} variant="secondary" className="gap-2">
                    {ip}
                    <button onClick={() => removeIp(ip)} className="hover:text-destructive">
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Save Bar */}
      <div className="sticky bottom-4 glass p-4 rounded-lg flex justify-end">
        <Button onClick={handleSave} disabled={saving} className="gap-2">
          <Save className="w-4 h-4" />
          {saving ? "Saving..." : "Save Policies"}
        </Button>
      </div>

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={showMfaConfirm}
        onOpenChange={setShowMfaConfirm}
        title="Disable MFA Requirement?"
        description="This will allow users to access the system without two-factor authentication. This may reduce security."
        onConfirm={confirmMfaDisable}
      />
    </div>
  )
}
