"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Card } from "@/components/ui/card"
import { Loader2, Brain, Sparkles, Shield, Database } from "lucide-react"
import { getAIPreferences, updateAIPreferences } from "@/app/(dashboard)/settings/actions/ai"
import { useToast } from "@/hooks/use-toast"

function AIPreferencesForm() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  const [preferences, setPreferences] = useState({
    copilot_enabled: true,
    auto_suggestions: true,
    context_awareness: "full" as "full" | "limited" | "off",
    preferred_model: "gpt-4",
    temperature: 0.7,
    max_tokens: 2000,
    enable_code_completion: true,
    enable_email_drafts: true,
    enable_document_summary: true,
    enable_meeting_notes: true,
    data_retention_days: 30,
    allow_training: false,
  })

  useEffect(() => {
    loadPreferences()
  }, [])

  async function loadPreferences() {
    const result = await getAIPreferences()
    if (result.error) {
      toast({ title: "Error", description: result.error, variant: "destructive" })
    } else if (result.data) {
      setPreferences(result.data)
    }
    setLoading(false)
  }

  async function handleSave() {
    setSaving(true)
    const result = await updateAIPreferences(preferences)

    if (result.error) {
      toast({ title: "Error", description: result.error, variant: "destructive" })
    } else {
      toast({ title: "Success", description: "AI preferences updated successfully" })
    }
    setSaving(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Copilot Settings */}
      <Card className="p-6 bg-background/50 backdrop-blur-sm border-border/50">
        <div className="flex items-center gap-3 mb-4">
          <Brain className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">AI Copilot</h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Enable AI Copilot</Label>
              <p className="text-sm text-muted-foreground">Turn on AI-powered assistance across the platform</p>
            </div>
            <Switch
              checked={preferences.copilot_enabled}
              onCheckedChange={(checked) => setPreferences({ ...preferences, copilot_enabled: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Auto Suggestions</Label>
              <p className="text-sm text-muted-foreground">Show AI suggestions automatically as you type</p>
            </div>
            <Switch
              checked={preferences.auto_suggestions}
              onCheckedChange={(checked) => setPreferences({ ...preferences, auto_suggestions: checked })}
              disabled={!preferences.copilot_enabled}
            />
          </div>

          <div className="space-y-2">
            <Label>Context Awareness</Label>
            <Select
              value={preferences.context_awareness}
              onValueChange={(value: any) => setPreferences({ ...preferences, context_awareness: value })}
              disabled={!preferences.copilot_enabled}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="full">Full - Use all available context</SelectItem>
                <SelectItem value="limited">Limited - Use current page only</SelectItem>
                <SelectItem value="off">Off - No context sharing</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Model Configuration */}
      <Card className="p-6 bg-background/50 backdrop-blur-sm border-border/50">
        <div className="flex items-center gap-3 mb-4">
          <Sparkles className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Model Configuration</h3>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Preferred Model</Label>
            <Select
              value={preferences.preferred_model}
              onValueChange={(value) => setPreferences({ ...preferences, preferred_model: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gpt-4">GPT-4 (Most capable)</SelectItem>
                <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo (Faster)</SelectItem>
                <SelectItem value="claude-3">Claude 3 (Alternative)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Temperature: {preferences.temperature}</Label>
              <span className="text-sm text-muted-foreground">
                {preferences.temperature < 0.3 ? "Focused" : preferences.temperature < 0.7 ? "Balanced" : "Creative"}
              </span>
            </div>
            <Slider
              value={[preferences.temperature]}
              onValueChange={([value]) => setPreferences({ ...preferences, temperature: value })}
              min={0}
              max={1}
              step={0.1}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label>Max Tokens: {preferences.max_tokens}</Label>
            <Slider
              value={[preferences.max_tokens]}
              onValueChange={([value]) => setPreferences({ ...preferences, max_tokens: value })}
              min={500}
              max={4000}
              step={100}
              className="w-full"
            />
          </div>
        </div>
      </Card>

      {/* Feature Toggles */}
      <Card className="p-6 bg-background/50 backdrop-blur-sm border-border/50">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">AI Features</h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Code Completion</Label>
            <Switch
              checked={preferences.enable_code_completion}
              onCheckedChange={(checked) => setPreferences({ ...preferences, enable_code_completion: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label>Email Draft Assistance</Label>
            <Switch
              checked={preferences.enable_email_drafts}
              onCheckedChange={(checked) => setPreferences({ ...preferences, enable_email_drafts: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label>Document Summarization</Label>
            <Switch
              checked={preferences.enable_document_summary}
              onCheckedChange={(checked) => setPreferences({ ...preferences, enable_document_summary: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label>Meeting Notes Generation</Label>
            <Switch
              checked={preferences.enable_meeting_notes}
              onCheckedChange={(checked) => setPreferences({ ...preferences, enable_meeting_notes: checked })}
            />
          </div>
        </div>
      </Card>

      {/* Privacy & Data */}
      <Card className="p-6 bg-background/50 backdrop-blur-sm border-border/50">
        <div className="flex items-center gap-3 mb-4">
          <Database className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Privacy & Data</h3>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Data Retention (days)</Label>
            <Select
              value={preferences.data_retention_days.toString()}
              onValueChange={(value) => setPreferences({ ...preferences, data_retention_days: Number.parseInt(value) })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">7 days</SelectItem>
                <SelectItem value="30">30 days</SelectItem>
                <SelectItem value="90">90 days</SelectItem>
                <SelectItem value="365">1 year</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Allow Model Training</Label>
              <p className="text-sm text-muted-foreground">Allow your interactions to improve AI models</p>
            </div>
            <Switch
              checked={preferences.allow_training}
              onCheckedChange={(checked) => setPreferences({ ...preferences, allow_training: checked })}
            />
          </div>
        </div>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving}>
          {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Preferences
        </Button>
      </div>
    </div>
  )
}

export { AIPreferencesForm as AiPreferencesForm }
