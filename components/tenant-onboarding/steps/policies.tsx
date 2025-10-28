"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { savePolicies } from "@/app/(dashboard)/tenant/onboarding/actions"
import { useToast } from "@/hooks/use-toast"

interface PoliciesStepProps {
  tenantId: string
  onComplete: () => void
}

export function PoliciesStep({ tenantId, onComplete }: PoliciesStepProps) {
  const { toast } = useToast()
  const [policies, setPolicies] = useState({
    terms_url: "",
    privacy_url: "",
    data_retention_days: 365,
    require_2fa: false,
    password_min_length: 12,
    session_timeout_minutes: 480,
  })

  const handleSave = async () => {
    try {
      await savePolicies({
        tenant_id: tenantId,
        ...policies,
      })
      toast({
        title: "Success",
        description: "Policies saved successfully",
      })
      onComplete()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save policies",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-white">Terms of Service URL</Label>
          <Input
            type="url"
            placeholder="https://example.com/terms"
            value={policies.terms_url}
            onChange={(e) => setPolicies({ ...policies, terms_url: e.target.value })}
            className="bg-white/5 border-white/10 text-white"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-white">Privacy Policy URL</Label>
          <Input
            type="url"
            placeholder="https://example.com/privacy"
            value={policies.privacy_url}
            onChange={(e) => setPolicies({ ...policies, privacy_url: e.target.value })}
            className="bg-white/5 border-white/10 text-white"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-white">Data Retention (days)</Label>
          <Input
            type="number"
            min="30"
            value={policies.data_retention_days}
            onChange={(e) => setPolicies({ ...policies, data_retention_days: Number.parseInt(e.target.value) })}
            className="bg-white/5 border-white/10 text-white"
          />
        </div>

        <div className="flex items-center justify-between">
          <Label className="text-white">Require Two-Factor Authentication</Label>
          <Switch
            checked={policies.require_2fa}
            onCheckedChange={(checked) => setPolicies({ ...policies, require_2fa: checked })}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-white">Minimum Password Length</Label>
          <Input
            type="number"
            min="8"
            max="32"
            value={policies.password_min_length}
            onChange={(e) => setPolicies({ ...policies, password_min_length: Number.parseInt(e.target.value) })}
            className="bg-white/5 border-white/10 text-white"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-white">Session Timeout (minutes)</Label>
          <Input
            type="number"
            min="15"
            value={policies.session_timeout_minutes}
            onChange={(e) => setPolicies({ ...policies, session_timeout_minutes: Number.parseInt(e.target.value) })}
            className="bg-white/5 border-white/10 text-white"
          />
        </div>
      </div>

      <button
        onClick={handleSave}
        className="w-full bg-[#8B5CF6] hover:bg-[#8B5CF6]/90 text-white py-2 px-4 rounded-lg transition-colors"
      >
        Save Policies
      </button>
    </div>
  )
}
