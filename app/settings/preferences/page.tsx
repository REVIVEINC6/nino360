"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Palette, Volume2, Eye, Layout, Save } from "lucide-react"

export default function PreferencesPage() {
  const [preferences, setPreferences] = useState({
    theme: "system",
    colorScheme: "blue",
    fontSize: [14],
    compactMode: false,
    animationsEnabled: true,
    soundEnabled: true,
    soundVolume: [50],
    notificationsEnabled: true,
    emailNotifications: true,
    pushNotifications: false,
    autoSave: true,
    autoSaveInterval: 5,
    showTooltips: true,
    keyboardShortcuts: true,
    dataTablePageSize: 25,
    dashboardRefreshRate: 30,
  })

  const handleSave = () => {
    console.log("Saving preferences:", preferences)
  }

  return (
    <div className="space-y-6">
      {/* Appearance Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            <CardTitle>Appearance</CardTitle>
          </div>
          <CardDescription>Customize the look and feel of your platform interface</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="theme">Theme</Label>
              <Select
                value={preferences.theme}
                onValueChange={(value) => setPreferences({ ...preferences, theme: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="colorScheme">Color Scheme</Label>
              <Select
                value={preferences.colorScheme}
                onValueChange={(value) => setPreferences({ ...preferences, colorScheme: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select color scheme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="blue">Blue</SelectItem>
                  <SelectItem value="green">Green</SelectItem>
                  <SelectItem value="purple">Purple</SelectItem>
                  <SelectItem value="orange">Orange</SelectItem>
                  <SelectItem value="red">Red</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-3">
            <Label>Font Size: {preferences.fontSize[0]}px</Label>
            <Slider
              value={preferences.fontSize}
              onValueChange={(value) => setPreferences({ ...preferences, fontSize: value })}
              max={20}
              min={12}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Small (12px)</span>
              <span>Large (20px)</span>
            </div>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Compact Mode</Label>
              <p className="text-sm text-muted-foreground">Reduce spacing and padding for a more compact interface</p>
            </div>
            <Switch
              checked={preferences.compactMode}
              onCheckedChange={(checked) => setPreferences({ ...preferences, compactMode: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Animations</Label>
              <p className="text-sm text-muted-foreground">Enable smooth transitions and animations</p>
            </div>
            <Switch
              checked={preferences.animationsEnabled}
              onCheckedChange={(checked) => setPreferences({ ...preferences, animationsEnabled: checked })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Audio Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Volume2 className="h-5 w-5" />
            <CardTitle>Audio</CardTitle>
          </div>
          <CardDescription>Configure sound and audio feedback settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Sound Effects</Label>
              <p className="text-sm text-muted-foreground">Enable sound effects for notifications and interactions</p>
            </div>
            <Switch
              checked={preferences.soundEnabled}
              onCheckedChange={(checked) => setPreferences({ ...preferences, soundEnabled: checked })}
            />
          </div>

          {preferences.soundEnabled && (
            <div className="space-y-3">
              <Label>Volume: {preferences.soundVolume[0]}%</Label>
              <Slider
                value={preferences.soundVolume}
                onValueChange={(value) => setPreferences({ ...preferences, soundVolume: value })}
                max={100}
                min={0}
                step={5}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Mute</span>
                <span>Max</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Behavior Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Layout className="h-5 w-5" />
            <CardTitle>Behavior</CardTitle>
          </div>
          <CardDescription>Configure application behavior and interaction preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Auto Save</Label>
              <p className="text-sm text-muted-foreground">Automatically save changes as you work</p>
            </div>
            <div className="flex items-center gap-2">
              {preferences.autoSave && <Badge variant="default">Enabled</Badge>}
              <Switch
                checked={preferences.autoSave}
                onCheckedChange={(checked) => setPreferences({ ...preferences, autoSave: checked })}
              />
            </div>
          </div>

          {preferences.autoSave && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="autoSaveInterval">Auto Save Interval</Label>
                <Select
                  value={preferences.autoSaveInterval.toString()}
                  onValueChange={(value) =>
                    setPreferences({ ...preferences, autoSaveInterval: Number.parseInt(value) })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select interval" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 minute</SelectItem>
                    <SelectItem value="5">5 minutes</SelectItem>
                    <SelectItem value="10">10 minutes</SelectItem>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Show Tooltips</Label>
              <p className="text-sm text-muted-foreground">Display helpful tooltips on hover</p>
            </div>
            <Switch
              checked={preferences.showTooltips}
              onCheckedChange={(checked) => setPreferences({ ...preferences, showTooltips: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Keyboard Shortcuts</Label>
              <p className="text-sm text-muted-foreground">Enable keyboard shortcuts for faster navigation</p>
            </div>
            <Switch
              checked={preferences.keyboardShortcuts}
              onCheckedChange={(checked) => setPreferences({ ...preferences, keyboardShortcuts: checked })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Data Display Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            <CardTitle>Data Display</CardTitle>
          </div>
          <CardDescription>Configure how data is displayed in tables and dashboards</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dataTablePageSize">Table Page Size</Label>
              <Select
                value={preferences.dataTablePageSize.toString()}
                onValueChange={(value) => setPreferences({ ...preferences, dataTablePageSize: Number.parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select page size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10 rows</SelectItem>
                  <SelectItem value="25">25 rows</SelectItem>
                  <SelectItem value="50">50 rows</SelectItem>
                  <SelectItem value="100">100 rows</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="dashboardRefreshRate">Dashboard Refresh Rate</Label>
              <Select
                value={preferences.dashboardRefreshRate.toString()}
                onValueChange={(value) =>
                  setPreferences({ ...preferences, dashboardRefreshRate: Number.parseInt(value) })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select refresh rate" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 seconds</SelectItem>
                  <SelectItem value="30">30 seconds</SelectItem>
                  <SelectItem value="60">1 minute</SelectItem>
                  <SelectItem value="300">5 minutes</SelectItem>
                  <SelectItem value="0">Manual only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Actions */}
      <div className="flex justify-end gap-2">
        <Button variant="outline">Reset to Defaults</Button>
        <Button onClick={handleSave}>
          <Save className="h-4 w-4 mr-2" />
          Save Preferences
        </Button>
      </div>
    </div>
  )
}
