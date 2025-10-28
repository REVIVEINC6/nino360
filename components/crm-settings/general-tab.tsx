"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Sparkles, Save } from "lucide-react"
import { getSettings, updateSettings } from "@/app/(dashboard)/crm/actions/settings"
import { motion } from "framer-motion"
import { useToast } from "@/hooks/use-toast"

export function GeneralTab() {
  const [settings, setSettings] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    loadSettings()
  }, [])

  async function loadSettings() {
    try {
      const data = await getSettings()
      setSettings(
        data || {
          default_currency: "USD",
          fiscal_year_start: 1,
          auto_assign_leads: true,
          email_notifications: true,
          ai_lead_scoring: true,
          ai_opportunity_insights: true,
          ai_email_suggestions: true,
          ml_prediction_threshold: 0.7,
        },
      )
    } catch (error) {
      console.error("Failed to load settings:", error)
    } finally {
      setLoading(false)
    }
  }

  async function handleSave() {
    setSaving(true)
    try {
      await updateSettings(settings)
      toast({
        title: "Settings saved",
        description: "Your CRM settings have been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading settings...</div>
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold">General Settings</h3>
        <p className="text-sm text-muted-foreground">Configure general CRM and AI preferences</p>
      </div>

      <div className="glass-card p-6 space-y-6">
        <div className="space-y-4">
          <div>
            <Label>Default Currency</Label>
            <Input
              value={settings.default_currency}
              onChange={(e) => setSettings({ ...settings, default_currency: e.target.value })}
              className="glass-card"
            />
          </div>

          <div>
            <Label>Fiscal Year Start (Month)</Label>
            <Input
              type="number"
              min="1"
              max="12"
              value={settings.fiscal_year_start}
              onChange={(e) => setSettings({ ...settings, fiscal_year_start: Number.parseInt(e.target.value) })}
              className="glass-card"
            />
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t">
          <h4 className="font-medium flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-purple-500" />
            AI & Automation
          </h4>

          <div className="flex items-center justify-between p-4 glass-card">
            <div>
              <p className="font-medium">Auto-assign leads</p>
              <p className="text-sm text-muted-foreground">Automatically assign new leads to sales reps</p>
            </div>
            <Switch
              checked={settings.auto_assign_leads}
              onCheckedChange={(checked) => setSettings({ ...settings, auto_assign_leads: checked })}
            />
          </div>

          <div className="flex items-center justify-between p-4 glass-card">
            <div>
              <p className="font-medium">Email notifications</p>
              <p className="text-sm text-muted-foreground">Send email alerts for important events</p>
            </div>
            <Switch
              checked={settings.email_notifications}
              onCheckedChange={(checked) => setSettings({ ...settings, email_notifications: checked })}
            />
          </div>

          <div className="flex items-center justify-between p-4 glass-card">
            <div>
              <p className="font-medium">AI lead scoring</p>
              <p className="text-sm text-muted-foreground">Use ML to automatically score leads</p>
            </div>
            <Switch
              checked={settings.ai_lead_scoring}
              onCheckedChange={(checked) => setSettings({ ...settings, ai_lead_scoring: checked })}
            />
          </div>

          <div className="flex items-center justify-between p-4 glass-card">
            <div>
              <p className="font-medium">AI opportunity insights</p>
              <p className="text-sm text-muted-foreground">Get AI-powered win probability predictions</p>
            </div>
            <Switch
              checked={settings.ai_opportunity_insights}
              onCheckedChange={(checked) => setSettings({ ...settings, ai_opportunity_insights: checked })}
            />
          </div>

          <div className="flex items-center justify-between p-4 glass-card">
            <div>
              <p className="font-medium">AI email suggestions</p>
              <p className="text-sm text-muted-foreground">Get AI-generated email templates and suggestions</p>
            </div>
            <Switch
              checked={settings.ai_email_suggestions}
              onCheckedChange={(checked) => setSettings({ ...settings, ai_email_suggestions: checked })}
            />
          </div>

          <div>
            <Label>ML Prediction Threshold</Label>
            <Input
              type="number"
              min="0"
              max="1"
              step="0.05"
              value={settings.ml_prediction_threshold}
              onChange={(e) => setSettings({ ...settings, ml_prediction_threshold: Number.parseFloat(e.target.value) })}
              className="glass-card"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Minimum confidence score for ML predictions (0.0 - 1.0)
            </p>
          </div>
        </div>

        <Button
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          <Save className="mr-2 h-4 w-4" />
          {saving ? "Saving..." : "Save Settings"}
        </Button>
      </div>
    </motion.div>
  )
}
