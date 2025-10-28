'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Bot, Zap, Globe, Mic, MessageSquare, Mail, Slack } from 'lucide-react'
import { getCopilotSettings, updateCopilotSettings } from '@/app/(app)/tenant/copilot/actions'
import { useToast } from '@/hooks/use-toast'

export function TenantCopilotContent() {
  const [settings, setSettings] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const data = await getCopilotSettings()
      setSettings(data)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load copilot settings',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      await updateCopilotSettings(settings)
      toast({
        title: 'Success',
        description: 'Copilot settings updated successfully'
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update settings',
        variant: 'destructive'
      })
    }
  }

  if (loading || !settings) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      {/* Usage Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg">
              <MessageSquare className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Queries</p>
              <p className="text-2xl font-bold">{settings.usage.totalQueries.toLocaleString()}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avg Response Time</p>
              <p className="text-2xl font-bold">{settings.usage.avgResponseTime}s</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-pink-50 to-blue-50 border-pink-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-pink-500 to-blue-500 rounded-lg">
              <Bot className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Satisfaction</p>
              <p className="text-2xl font-bold">{settings.usage.satisfaction}/5.0</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Configuration Tabs */}
      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card className="p-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable AI Copilot</Label>
                  <p className="text-sm text-muted-foreground">
                    Turn on AI assistant for your organization
                  </p>
                </div>
                <Switch
                  checked={settings.enabled}
                  onCheckedChange={(checked) => setSettings({ ...settings, enabled: checked })}
                />
              </div>

              <div className="space-y-2">
                <Label>AI Model</Label>
                <Select
                  value={settings.model}
                  onValueChange={(value) => setSettings({ ...settings, model: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gpt-4">GPT-4 (Most Capable)</SelectItem>
                    <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo (Faster)</SelectItem>
                    <SelectItem value="claude-3">Claude 3 (Alternative)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Temperature: {settings.temperature}</Label>
                <Slider
                  value={[settings.temperature]}
                  onValueChange={([value]) => setSettings({ ...settings, temperature: value })}
                  min={0}
                  max={1}
                  step={0.1}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  Lower values make responses more focused, higher values more creative
                </p>
              </div>

              <div className="space-y-2">
                <Label>Max Tokens: {settings.maxTokens}</Label>
                <Slider
                  value={[settings.maxTokens]}
                  onValueChange={([value]) => setSettings({ ...settings, maxTokens: value })}
                  min={500}
                  max={4000}
                  step={100}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  Maximum length of AI responses
                </p>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="space-y-4">
          <Card className="p-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Zap className="h-5 w-5 text-purple-600" />
                  <div className="space-y-0.5">
                    <Label>Auto-Suggest</Label>
                    <p className="text-sm text-muted-foreground">
                      Provide suggestions as you type
                    </p>
                  </div>
                </div>
                <Switch
                  checked={settings.features.autoSuggest}
                  onCheckedChange={(checked) => 
                    setSettings({ 
                      ...settings, 
                      features: { ...settings.features, autoSuggest: checked }
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bot className="h-5 w-5 text-blue-600" />
                  <div className="space-y-0.5">
                    <Label>Context-Aware</Label>
                    <p className="text-sm text-muted-foreground">
                      Use conversation history for better responses
                    </p>
                  </div>
                </div>
                <Switch
                  checked={settings.features.contextAware}
                  onCheckedChange={(checked) => 
                    setSettings({ 
                      ...settings, 
                      features: { ...settings.features, contextAware: checked }
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Globe className="h-5 w-5 text-green-600" />
                  <div className="space-y-0.5">
                    <Label>Multi-Language Support</Label>
                    <p className="text-sm text-muted-foreground">
                      Respond in multiple languages
                    </p>
                  </div>
                </div>
                <Switch
                  checked={settings.features.multiLanguage}
                  onCheckedChange={(checked) => 
                    setSettings({ 
                      ...settings, 
                      features: { ...settings.features, multiLanguage: checked }
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Mic className="h-5 w-5 text-pink-600" />
                  <div className="space-y-0.5">
                    <Label>Voice Input</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable voice-to-text input
                    </p>
                  </div>
                </div>
                <Switch
                  checked={settings.features.voiceInput}
                  onCheckedChange={(checked) => 
                    setSettings({ 
                      ...settings, 
                      features: { ...settings.features, voiceInput: checked }
                    })
                  }
                />
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-4">
          <Card className="p-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Slack className="h-5 w-5 text-purple-600" />
                  <div className="space-y-0.5">
                    <Label>Slack Integration</Label>
                    <p className="text-sm text-muted-foreground">
                      Use Copilot in Slack channels
                    </p>
                  </div>
                </div>
                <Switch
                  checked={settings.integrations.slack}
                  onCheckedChange={(checked) => 
                    setSettings({ 
                      ...settings, 
                      integrations: { ...settings.integrations, slack: checked }
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <MessageSquare className="h-5 w-5 text-blue-600" />
                  <div className="space-y-0.5">
                    <Label>Microsoft Teams</Label>
                    <p className="text-sm text-muted-foreground">
                      Use Copilot in Teams chats
                    </p>
                  </div>
                </div>
                <Switch
                  checked={settings.integrations.teams}
                  onCheckedChange={(checked) => 
                    setSettings({ 
                      ...settings, 
                      integrations: { ...settings.integrations, teams: checked }
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-pink-600" />
                  <div className="space-y-0.5">
                    <Label>Email Integration</Label>
                    <p className="text-sm text-muted-foreground">
                      Draft emails with AI assistance
                    </p>
                  </div>
                </div>
                <Switch
                  checked={settings.integrations.email}
                  onCheckedChange={(checked) => 
                    setSettings({ 
                      ...settings, 
                      integrations: { ...settings.integrations, email: checked }
                    })
                  }
                />
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-4">
          <Card className="p-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Advanced Settings</h3>
                <p className="text-sm text-muted-foreground">
                  Configure advanced AI behavior and performance settings
                </p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">
                  Advanced settings coming soon...
                </p>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} className="bg-gradient-to-r from-blue-600 to-purple-600">
          Save Changes
        </Button>
      </div>
    </div>
  )
}
