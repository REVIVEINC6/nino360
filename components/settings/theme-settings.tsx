"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { Loader2, Palette, Type, Eye, Keyboard } from "lucide-react"
import { getThemePreferences, updateThemePreferences } from "@/app/(dashboard)/settings/actions/theme"
import { useToast } from "@/hooks/use-toast"

export function ThemeSettings() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  const [preferences, setPreferences] = useState({
    theme_mode: "system" as "light" | "dark" | "system",
    primary_color: "blue",
    compact_mode: false,
    sidebar_position: "left" as "left" | "right",
    font_size: "medium" as "small" | "medium" | "large",
    font_family: "inter" as "inter" | "system" | "mono",
    reduce_motion: false,
    high_contrast: false,
    keyboard_navigation: true,
    screen_reader_optimized: false,
  })

  const [showShortcuts, setShowShortcuts] = useState(false)

  useEffect(() => {
    loadPreferences()
  }, [])

  async function loadPreferences() {
    const result = await getThemePreferences()
    if (result.error) {
      toast({ title: "Error", description: result.error, variant: "destructive" })
    } else if (result.data) {
      setPreferences(result.data)
    }
    setLoading(false)
  }

  async function handleSave() {
    setSaving(true)
    const result = await updateThemePreferences(preferences)

    if (result.error) {
      toast({ title: "Error", description: result.error, variant: "destructive" })
    } else {
      toast({ title: "Success", description: "Theme preferences updated successfully" })
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
      {/* Appearance */}
      <Card className="p-6 bg-background/50 backdrop-blur-sm border-border/50">
        <div className="flex items-center gap-3 mb-4">
          <Palette className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Appearance</h3>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Theme Mode</Label>
            <Select
              value={preferences.theme_mode}
              onValueChange={(value: any) => setPreferences({ ...preferences, theme_mode: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Primary Color</Label>
            <Select
              value={preferences.primary_color}
              onValueChange={(value) => setPreferences({ ...preferences, primary_color: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="blue">Blue</SelectItem>
                <SelectItem value="purple">Purple</SelectItem>
                <SelectItem value="green">Green</SelectItem>
                <SelectItem value="orange">Orange</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <Label>Compact Mode</Label>
            <Switch
              checked={preferences.compact_mode}
              onCheckedChange={(checked) => setPreferences({ ...preferences, compact_mode: checked })}
            />
          </div>

          <div className="space-y-2">
            <Label>Sidebar Position</Label>
            <Select
              value={preferences.sidebar_position}
              onValueChange={(value: any) => setPreferences({ ...preferences, sidebar_position: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="left">Left</SelectItem>
                <SelectItem value="right">Right</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Typography */}
      <Card className="p-6 bg-background/50 backdrop-blur-sm border-border/50">
        <div className="flex items-center gap-3 mb-4">
          <Type className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Typography</h3>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Font Size</Label>
            <Select
              value={preferences.font_size}
              onValueChange={(value: any) => setPreferences({ ...preferences, font_size: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small">Small</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="large">Large</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Font Family</Label>
            <Select
              value={preferences.font_family}
              onValueChange={(value: any) => setPreferences({ ...preferences, font_family: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="inter">Inter (Default)</SelectItem>
                <SelectItem value="system">System</SelectItem>
                <SelectItem value="mono">Monospace</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Accessibility */}
      <Card className="p-6 bg-background/50 backdrop-blur-sm border-border/50">
        <div className="flex items-center gap-3 mb-4">
          <Eye className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Accessibility</h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Reduce Motion</Label>
              <p className="text-sm text-muted-foreground">Minimize animations and transitions</p>
            </div>
            <Switch
              checked={preferences.reduce_motion}
              onCheckedChange={(checked) => setPreferences({ ...preferences, reduce_motion: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>High Contrast</Label>
              <p className="text-sm text-muted-foreground">Increase contrast for better visibility</p>
            </div>
            <Switch
              checked={preferences.high_contrast}
              onCheckedChange={(checked) => setPreferences({ ...preferences, high_contrast: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Keyboard Navigation</Label>
              <p className="text-sm text-muted-foreground">Enable keyboard shortcuts</p>
            </div>
            <Switch
              checked={preferences.keyboard_navigation}
              onCheckedChange={(checked) => setPreferences({ ...preferences, keyboard_navigation: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Screen Reader Optimized</Label>
              <p className="text-sm text-muted-foreground">Enhanced screen reader support</p>
            </div>
            <Switch
              checked={preferences.screen_reader_optimized}
              onCheckedChange={(checked) => setPreferences({ ...preferences, screen_reader_optimized: checked })}
            />
          </div>
        </div>
      </Card>

      {/* Keyboard Shortcuts */}
      <Card className="p-6 bg-background/50 backdrop-blur-sm border-border/50">
        <div className="flex items-center gap-3 mb-4">
          <Keyboard className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Keyboard Shortcuts</h3>
        </div>

        <Button variant="outline" onClick={() => setShowShortcuts(!showShortcuts)}>
          {showShortcuts ? "Hide" : "Show"} Shortcuts Reference
        </Button>

        {showShortcuts && (
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between py-2 border-b">
              <span className="text-muted-foreground">Search</span>
              <kbd className="px-2 py-1 bg-muted rounded">Ctrl + K</kbd>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-muted-foreground">Settings</span>
              <kbd className="px-2 py-1 bg-muted rounded">Ctrl + ,</kbd>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-muted-foreground">Dashboard</span>
              <kbd className="px-2 py-1 bg-muted rounded">Ctrl + H</kbd>
            </div>
          </div>
        )}
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
