"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  Settings,
  Shield,
  Database,
  Bell,
  Save,
  RefreshCw,
  AlertCircle,
  Info,
  Zap,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ConfigSection {
  id: string
  title: string
  description: string
  settings: ConfigSetting[]
}

interface ConfigSetting {
  key: string
  label: string
  type: "text" | "number" | "boolean" | "select" | "textarea" | "password"
  value: any
  description?: string
  options?: { label: string; value: string }[]
  required?: boolean
  sensitive?: boolean
}

export default function TenantConfiguration() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [selectedTab, setSelectedTab] = useState("general")
  const [showSensitive, setShowSensitive] = useState<Record<string, boolean>>({})
  const [configSections, setConfigSections] = useState<ConfigSection[]>([])
  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    loadConfiguration()
  }, [])

  const loadConfiguration = async () => {
    setLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setConfigSections([
      {
        id: "general",
        title: "General Settings",
        description: "Basic tenant configuration and preferences",
        settings: [
          {
            key: "tenant_name",
            label: "Tenant Name",
            type: "text",
            value: "Nino360 Platform",
            description: "Display name for the tenant organization",
            required: true,
          },
          {
            key: "tenant_domain",
            label: "Primary Domain",
            type: "text",
            value: "nino360.platform.com",
            description: "Primary domain for tenant access",
            required: true,
          },
          {
            key: "timezone",
            label: "Default Timezone",
            type: "select",
            value: "UTC",
            description: "Default timezone for all tenant operations",
            options: [
              { label: "UTC", value: "UTC" },
              { label: "EST (UTC-5)", value: "America/New_York" },
              { label: "PST (UTC-8)", value: "America/Los_Angeles" },
              { label: "GMT (UTC+0)", value: "Europe/London" },
              { label: "CET (UTC+1)", value: "Europe/Paris" },
            ],
          },
          {
            key: "language",
            label: "Default Language",
            type: "select",
            value: "en",
            description: "Default language for the tenant interface",
            options: [
              { label: "English", value: "en" },
              { label: "Spanish", value: "es" },
              { label: "French", value: "fr" },
              { label: "German", value: "de" },
              { label: "Chinese", value: "zh" },
            ],
          },
          {
            key: "maintenance_mode",
            label: "Maintenance Mode",
            type: "boolean",
            value: false,
            description: "Enable maintenance mode to restrict tenant access",
          },
        ],
      },
      {
        id: "security",
        title: "Security Settings",
        description: "Security policies and authentication configuration",
        settings: [
          {
            key: "password_policy",
            label: "Password Policy",
            type: "select",
            value: "strong",
            description: "Password complexity requirements",
            options: [
              { label: "Basic (8+ characters)", value: "basic" },
              { label: "Strong (8+ chars, mixed case, numbers)", value: "strong" },
              { label: "Very Strong (12+ chars, symbols)", value: "very_strong" },
            ],
          },
          {
            key: "session_timeout",
            label: "Session Timeout (minutes)",
            type: "number",
            value: 60,
            description: "Automatic logout after inactivity",
          },
          {
            key: "mfa_required",
            label: "Require Multi-Factor Authentication",
            type: "boolean",
            value: true,
            description: "Enforce MFA for all user accounts",
          },
          {
            key: "ip_whitelist",
            label: "IP Whitelist",
            type: "textarea",
            value: "192.168.1.0/24\n10.0.0.0/8",
            description: "Allowed IP addresses (one per line)",
          },
          {
            key: "api_key",
            label: "API Key",
            type: "password",
            value: "sk-1234567890abcdef",
            description: "API key for external integrations",
            sensitive: true,
          },
        ],
      },
      {
        id: "database",
        title: "Database Settings",
        description: "Database configuration and connection settings",
        settings: [
          {
            key: "db_host",
            label: "Database Host",
            type: "text",
            value: "localhost",
            description: "Database server hostname or IP address",
            required: true,
          },
          {
            key: "db_port",
            label: "Database Port",
            type: "number",
            value: 5432,
            description: "Database server port number",
          },
          {
            key: "db_name",
            label: "Database Name",
            type: "text",
            value: "nino360_platform",
            description: "Name of the database",
            required: true,
          },
          {
            key: "db_ssl",
            label: "Enable SSL",
            type: "boolean",
            value: true,
            description: "Use SSL for database connections",
          },
          {
            key: "db_pool_size",
            label: "Connection Pool Size",
            type: "number",
            value: 20,
            description: "Maximum number of database connections",
          },
        ],
      },
      {
        id: "notifications",
        title: "Notification Settings",
        description: "Email and notification configuration",
        settings: [
          {
            key: "smtp_host",
            label: "SMTP Host",
            type: "text",
            value: "smtp.gmail.com",
            description: "SMTP server hostname",
          },
          {
            key: "smtp_port",
            label: "SMTP Port",
            type: "number",
            value: 587,
            description: "SMTP server port",
          },
          {
            key: "smtp_username",
            label: "SMTP Username",
            type: "text",
            value: "noreply@nino360.com",
            description: "SMTP authentication username",
          },
          {
            key: "smtp_password",
            label: "SMTP Password",
            type: "password",
            value: "password123",
            description: "SMTP authentication password",
            sensitive: true,
          },
          {
            key: "email_notifications",
            label: "Enable Email Notifications",
            type: "boolean",
            value: true,
            description: "Send email notifications to users",
          },
          {
            key: "notification_frequency",
            label: "Notification Frequency",
            type: "select",
            value: "immediate",
            description: "How often to send notifications",
            options: [
              { label: "Immediate", value: "immediate" },
              { label: "Hourly", value: "hourly" },
              { label: "Daily", value: "daily" },
              { label: "Weekly", value: "weekly" },
            ],
          },
        ],
      },
      {
        id: "integrations",
        title: "Integration Settings",
        description: "Third-party service integrations and API configurations",
        settings: [
          {
            key: "salesforce_enabled",
            label: "Enable Salesforce Integration",
            type: "boolean",
            value: false,
            description: "Connect with Salesforce CRM",
          },
          {
            key: "salesforce_api_key",
            label: "Salesforce API Key",
            type: "password",
            value: "",
            description: "Salesforce API authentication key",
            sensitive: true,
          },
          {
            key: "slack_webhook",
            label: "Slack Webhook URL",
            type: "text",
            value: "",
            description: "Slack webhook for notifications",
          },
          {
            key: "analytics_tracking",
            label: "Enable Analytics Tracking",
            type: "boolean",
            value: true,
            description: "Track user behavior and system usage",
          },
          {
            key: "backup_enabled",
            label: "Enable Automated Backups",
            type: "boolean",
            value: true,
            description: "Automatically backup tenant data",
          },
          {
            key: "backup_frequency",
            label: "Backup Frequency",
            type: "select",
            value: "daily",
            description: "How often to perform backups",
            options: [
              { label: "Hourly", value: "hourly" },
              { label: "Daily", value: "daily" },
              { label: "Weekly", value: "weekly" },
              { label: "Monthly", value: "monthly" },
            ],
          },
        ],
      },
    ])

    setLoading(false)
  }

  const handleSettingChange = (sectionId: string, settingKey: string, value: any) => {
    setConfigSections((prev) =>
      prev.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              settings: section.settings.map((setting) =>
                setting.key === settingKey ? { ...setting, value } : setting,
              ),
            }
          : section,
      ),
    )
    setHasChanges(true)
  }

  const handleSave = async () => {
    setSaving(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "Configuration Saved",
        description: "All settings have been successfully updated.",
      })

      setHasChanges(false)
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Failed to save configuration. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleReset = async () => {
    await loadConfiguration()
    setHasChanges(false)
    toast({
      title: "Configuration Reset",
      description: "All settings have been reset to their saved values.",
    })
  }

  const toggleSensitiveVisibility = (key: string) => {
    setShowSensitive((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const renderSetting = (sectionId: string, setting: ConfigSetting) => {
    const commonProps = {
      id: setting.key,
      value: setting.value,
      onChange: (value: any) => handleSettingChange(sectionId, setting.key, value),
    }

    switch (setting.type) {
      case "text":
        return (
          <Input
            {...commonProps}
            onChange={(e) => commonProps.onChange(e.target.value)}
            placeholder={setting.description}
          />
        )

      case "password":
        return (
          <div className="relative">
            <Input
              {...commonProps}
              type={showSensitive[setting.key] ? "text" : "password"}
              onChange={(e) => commonProps.onChange(e.target.value)}
              placeholder={setting.description}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => toggleSensitiveVisibility(setting.key)}
            >
              {showSensitive[setting.key] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
        )

      case "number":
        return (
          <Input
            {...commonProps}
            type="number"
            onChange={(e) => commonProps.onChange(Number.parseInt(e.target.value) || 0)}
            placeholder={setting.description}
          />
        )

      case "boolean":
        return <Switch checked={setting.value} onCheckedChange={commonProps.onChange} />

      case "select":
        return (
          <Select value={setting.value} onValueChange={commonProps.onChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              {setting.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )

      case "textarea":
        return (
          <Textarea
            {...commonProps}
            onChange={(e) => commonProps.onChange(e.target.value)}
            placeholder={setting.description}
            rows={4}
          />
        )

      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tenant Configuration</h1>
          <p className="text-gray-600 mt-1">Manage system settings and configuration options</p>
        </div>
        <div className="flex gap-2">
          {hasChanges && (
            <Button variant="outline" onClick={handleReset} className="bg-transparent">
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          )}
          <Button onClick={handleSave} disabled={saving || !hasChanges}>
            {saving ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
            Save Changes
          </Button>
        </div>
      </div>

      {/* Status Banner */}
      {hasChanges && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <span className="text-sm font-medium text-yellow-800">
                You have unsaved changes. Don't forget to save your configuration.
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Configuration Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="database" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Database
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="integrations" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Integrations
          </TabsTrigger>
        </TabsList>

        {configSections.map((section) => (
          <TabsContent key={section.id} value={section.id} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {section.id === "general" && <Settings className="h-5 w-5" />}
                  {section.id === "security" && <Shield className="h-5 w-5" />}
                  {section.id === "database" && <Database className="h-5 w-5" />}
                  {section.id === "notifications" && <Bell className="h-5 w-5" />}
                  {section.id === "integrations" && <Zap className="h-5 w-5" />}
                  {section.title}
                </CardTitle>
                <CardDescription>{section.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {section.settings.map((setting, index) => (
                  <motion.div
                    key={setting.key}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <Label htmlFor={setting.key} className="text-sm font-medium">
                        {setting.label}
                        {setting.required && <span className="text-red-500 ml-1">*</span>}
                        {setting.sensitive && (
                          <Badge variant="outline" className="ml-2 text-xs">
                            <Lock className="h-3 w-3 mr-1" />
                            Sensitive
                          </Badge>
                        )}
                      </Label>
                    </div>
                    {renderSetting(section.id, setting)}
                    {setting.description && (
                      <p className="text-xs text-gray-600 flex items-center gap-1">
                        <Info className="h-3 w-3" />
                        {setting.description}
                      </p>
                    )}
                    {index < section.settings.length - 1 && <Separator className="mt-4" />}
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
