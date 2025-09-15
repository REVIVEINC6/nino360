"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Settings, Bell, Shield, Calendar, DollarSign, Clock, Globe, Save, RefreshCw } from "lucide-react"

interface HRSettings {
  general: {
    companyName: string
    companyAddress: string
    companyPhone: string
    companyEmail: string
    timezone: string
    dateFormat: string
    currency: string
  }
  workSchedule: {
    standardWorkHours: number
    workDaysPerWeek: number
    startTime: string
    endTime: string
    lunchBreakDuration: number
    overtimeThreshold: number
  }
  leave: {
    annualLeaveEntitlement: number
    sickLeaveEntitlement: number
    maternityLeaveWeeks: number
    paternityLeaveWeeks: number
    carryOverLimit: number
    approvalRequired: boolean
  }
  payroll: {
    payFrequency: "weekly" | "bi-weekly" | "monthly"
    payPeriodStart: number
    taxCalculationMethod: "automatic" | "manual"
    overtimeRate: number
    defaultCurrency: string
    bankingDetails: boolean
  }
  notifications: {
    emailNotifications: boolean
    smsNotifications: boolean
    leaveRequestNotifications: boolean
    payrollNotifications: boolean
    performanceReviewReminders: boolean
    birthdayReminders: boolean
  }
  security: {
    passwordPolicy: {
      minLength: number
      requireUppercase: boolean
      requireNumbers: boolean
      requireSpecialChars: boolean
      expiryDays: number
    }
    twoFactorAuth: boolean
    sessionTimeout: number
    ipWhitelist: string[]
  }
  integrations: {
    emailProvider: string
    calendarIntegration: boolean
    slackIntegration: boolean
    teamsIntegration: boolean
    apiAccess: boolean
  }
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<HRSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("general")

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockSettings: HRSettings = {
        general: {
          companyName: "Nino360 Inc.",
          companyAddress: "123 Business Ave, Suite 100, New York, NY 10001",
          companyPhone: "+1 (555) 123-4567",
          companyEmail: "hr@nino360.com",
          timezone: "America/New_York",
          dateFormat: "MM/DD/YYYY",
          currency: "USD",
        },
        workSchedule: {
          standardWorkHours: 8,
          workDaysPerWeek: 5,
          startTime: "09:00",
          endTime: "17:00",
          lunchBreakDuration: 60,
          overtimeThreshold: 40,
        },
        leave: {
          annualLeaveEntitlement: 20,
          sickLeaveEntitlement: 10,
          maternityLeaveWeeks: 12,
          paternityLeaveWeeks: 2,
          carryOverLimit: 5,
          approvalRequired: true,
        },
        payroll: {
          payFrequency: "bi-weekly",
          payPeriodStart: 1,
          taxCalculationMethod: "automatic",
          overtimeRate: 1.5,
          defaultCurrency: "USD",
          bankingDetails: true,
        },
        notifications: {
          emailNotifications: true,
          smsNotifications: false,
          leaveRequestNotifications: true,
          payrollNotifications: true,
          performanceReviewReminders: true,
          birthdayReminders: true,
        },
        security: {
          passwordPolicy: {
            minLength: 8,
            requireUppercase: true,
            requireNumbers: true,
            requireSpecialChars: true,
            expiryDays: 90,
          },
          twoFactorAuth: true,
          sessionTimeout: 30,
          ipWhitelist: ["192.168.1.0/24", "10.0.0.0/8"],
        },
        integrations: {
          emailProvider: "gmail",
          calendarIntegration: true,
          slackIntegration: true,
          teamsIntegration: false,
          apiAccess: true,
        },
      }

      setSettings(mockSettings)
      setLoading(false)
    }, 1000)
  }, [])

  const handleSave = async () => {
    setSaving(true)
    // Simulate API call
    setTimeout(() => {
      setSaving(false)
      console.log("Settings saved:", settings)
    }, 1000)
  }

  const handleReset = () => {
    console.log("Reset settings to default")
  }

  const updateSettings = (section: keyof HRSettings, field: string, value: any) => {
    if (!settings) return

    setSettings({
      ...settings,
      [section]: {
        ...settings[section],
        [field]: value,
      },
    })
  }

  const updateNestedSettings = (section: keyof HRSettings, subsection: string, field: string, value: any) => {
    if (!settings) return

    setSettings({
      ...settings,
      [section]: {
        ...settings[section],
        [subsection]: {
          ...(settings[section] as any)[subsection],
          [field]: value,
        },
      },
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!settings) return null

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">HRMS Settings</h1>
          <p className="text-muted-foreground">Configure system settings and preferences</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleReset}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Reset
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            <Save className="mr-2 h-4 w-4" />
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="leave">Leave</TabsTrigger>
          <TabsTrigger value="payroll">Payroll</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                General Settings
              </CardTitle>
              <CardDescription>Basic company information and system preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    value={settings.general.companyName}
                    onChange={(e) => updateSettings("general", "companyName", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="companyEmail">Company Email</Label>
                  <Input
                    id="companyEmail"
                    type="email"
                    value={settings.general.companyEmail}
                    onChange={(e) => updateSettings("general", "companyEmail", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="companyPhone">Company Phone</Label>
                  <Input
                    id="companyPhone"
                    value={settings.general.companyPhone}
                    onChange={(e) => updateSettings("general", "companyPhone", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select
                    value={settings.general.timezone}
                    onValueChange={(value) => updateSettings("general", "timezone", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/New_York">Eastern Time</SelectItem>
                      <SelectItem value="America/Chicago">Central Time</SelectItem>
                      <SelectItem value="America/Denver">Mountain Time</SelectItem>
                      <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="dateFormat">Date Format</Label>
                  <Select
                    value={settings.general.dateFormat}
                    onValueChange={(value) => updateSettings("general", "dateFormat", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                      <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                      <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="currency">Currency</Label>
                  <Select
                    value={settings.general.currency}
                    onValueChange={(value) => updateSettings("general", "currency", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD - US Dollar</SelectItem>
                      <SelectItem value="EUR">EUR - Euro</SelectItem>
                      <SelectItem value="GBP">GBP - British Pound</SelectItem>
                      <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="companyAddress">Company Address</Label>
                <Textarea
                  id="companyAddress"
                  value={settings.general.companyAddress}
                  onChange={(e) => updateSettings("general", "companyAddress", e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Work Schedule Settings
              </CardTitle>
              <CardDescription>Configure standard work hours and schedule policies</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="standardWorkHours">Standard Work Hours per Day</Label>
                  <Input
                    id="standardWorkHours"
                    type="number"
                    value={settings.workSchedule.standardWorkHours}
                    onChange={(e) =>
                      updateSettings("workSchedule", "standardWorkHours", Number.parseInt(e.target.value))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="workDaysPerWeek">Work Days per Week</Label>
                  <Input
                    id="workDaysPerWeek"
                    type="number"
                    value={settings.workSchedule.workDaysPerWeek}
                    onChange={(e) => updateSettings("workSchedule", "workDaysPerWeek", Number.parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="startTime">Standard Start Time</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={settings.workSchedule.startTime}
                    onChange={(e) => updateSettings("workSchedule", "startTime", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="endTime">Standard End Time</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={settings.workSchedule.endTime}
                    onChange={(e) => updateSettings("workSchedule", "endTime", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="lunchBreakDuration">Lunch Break Duration (minutes)</Label>
                  <Input
                    id="lunchBreakDuration"
                    type="number"
                    value={settings.workSchedule.lunchBreakDuration}
                    onChange={(e) =>
                      updateSettings("workSchedule", "lunchBreakDuration", Number.parseInt(e.target.value))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="overtimeThreshold">Overtime Threshold (hours/week)</Label>
                  <Input
                    id="overtimeThreshold"
                    type="number"
                    value={settings.workSchedule.overtimeThreshold}
                    onChange={(e) =>
                      updateSettings("workSchedule", "overtimeThreshold", Number.parseInt(e.target.value))
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leave" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Leave Management Settings
              </CardTitle>
              <CardDescription>Configure leave policies and entitlements</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="annualLeaveEntitlement">Annual Leave Entitlement (days)</Label>
                  <Input
                    id="annualLeaveEntitlement"
                    type="number"
                    value={settings.leave.annualLeaveEntitlement}
                    onChange={(e) => updateSettings("leave", "annualLeaveEntitlement", Number.parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="sickLeaveEntitlement">Sick Leave Entitlement (days)</Label>
                  <Input
                    id="sickLeaveEntitlement"
                    type="number"
                    value={settings.leave.sickLeaveEntitlement}
                    onChange={(e) => updateSettings("leave", "sickLeaveEntitlement", Number.parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="maternityLeaveWeeks">Maternity Leave (weeks)</Label>
                  <Input
                    id="maternityLeaveWeeks"
                    type="number"
                    value={settings.leave.maternityLeaveWeeks}
                    onChange={(e) => updateSettings("leave", "maternityLeaveWeeks", Number.parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="paternityLeaveWeeks">Paternity Leave (weeks)</Label>
                  <Input
                    id="paternityLeaveWeeks"
                    type="number"
                    value={settings.leave.paternityLeaveWeeks}
                    onChange={(e) => updateSettings("leave", "paternityLeaveWeeks", Number.parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="carryOverLimit">Carry Over Limit (days)</Label>
                  <Input
                    id="carryOverLimit"
                    type="number"
                    value={settings.leave.carryOverLimit}
                    onChange={(e) => updateSettings("leave", "carryOverLimit", Number.parseInt(e.target.value))}
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="approvalRequired"
                  checked={settings.leave.approvalRequired}
                  onCheckedChange={(checked) => updateSettings("leave", "approvalRequired", checked)}
                />
                <Label htmlFor="approvalRequired">Require approval for leave requests</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payroll" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Payroll Settings
              </CardTitle>
              <CardDescription>Configure payroll processing and calculation settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="payFrequency">Pay Frequency</Label>
                  <Select
                    value={settings.payroll.payFrequency}
                    onValueChange={(value: any) => updateSettings("payroll", "payFrequency", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="bi-weekly">Bi-weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="payPeriodStart">Pay Period Start Day</Label>
                  <Input
                    id="payPeriodStart"
                    type="number"
                    min="1"
                    max="31"
                    value={settings.payroll.payPeriodStart}
                    onChange={(e) => updateSettings("payroll", "payPeriodStart", Number.parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="taxCalculationMethod">Tax Calculation Method</Label>
                  <Select
                    value={settings.payroll.taxCalculationMethod}
                    onValueChange={(value: any) => updateSettings("payroll", "taxCalculationMethod", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="automatic">Automatic</SelectItem>
                      <SelectItem value="manual">Manual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="overtimeRate">Overtime Rate Multiplier</Label>
                  <Input
                    id="overtimeRate"
                    type="number"
                    step="0.1"
                    value={settings.payroll.overtimeRate}
                    onChange={(e) => updateSettings("payroll", "overtimeRate", Number.parseFloat(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="defaultCurrency">Default Currency</Label>
                  <Select
                    value={settings.payroll.defaultCurrency}
                    onValueChange={(value) => updateSettings("payroll", "defaultCurrency", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="GBP">GBP</SelectItem>
                      <SelectItem value="CAD">CAD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="bankingDetails"
                  checked={settings.payroll.bankingDetails}
                  onCheckedChange={(checked) => updateSettings("payroll", "bankingDetails", checked)}
                />
                <Label htmlFor="bankingDetails">Require banking details for direct deposit</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Settings
              </CardTitle>
              <CardDescription>Configure system notifications and alerts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="emailNotifications"
                    checked={settings.notifications.emailNotifications}
                    onCheckedChange={(checked) => updateSettings("notifications", "emailNotifications", checked)}
                  />
                  <Label htmlFor="emailNotifications">Enable email notifications</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="smsNotifications"
                    checked={settings.notifications.smsNotifications}
                    onCheckedChange={(checked) => updateSettings("notifications", "smsNotifications", checked)}
                  />
                  <Label htmlFor="smsNotifications">Enable SMS notifications</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="leaveRequestNotifications"
                    checked={settings.notifications.leaveRequestNotifications}
                    onCheckedChange={(checked) => updateSettings("notifications", "leaveRequestNotifications", checked)}
                  />
                  <Label htmlFor="leaveRequestNotifications">Leave request notifications</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="payrollNotifications"
                    checked={settings.notifications.payrollNotifications}
                    onCheckedChange={(checked) => updateSettings("notifications", "payrollNotifications", checked)}
                  />
                  <Label htmlFor="payrollNotifications">Payroll processing notifications</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="performanceReviewReminders"
                    checked={settings.notifications.performanceReviewReminders}
                    onCheckedChange={(checked) =>
                      updateSettings("notifications", "performanceReviewReminders", checked)
                    }
                  />
                  <Label htmlFor="performanceReviewReminders">Performance review reminders</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="birthdayReminders"
                    checked={settings.notifications.birthdayReminders}
                    onCheckedChange={(checked) => updateSettings("notifications", "birthdayReminders", checked)}
                  />
                  <Label htmlFor="birthdayReminders">Birthday reminders</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Settings
              </CardTitle>
              <CardDescription>Configure security policies and access controls</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Password Policy</h4>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="minLength">Minimum Length</Label>
                    <Input
                      id="minLength"
                      type="number"
                      value={settings.security.passwordPolicy.minLength}
                      onChange={(e) =>
                        updateNestedSettings("security", "passwordPolicy", "minLength", Number.parseInt(e.target.value))
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="expiryDays">Password Expiry (days)</Label>
                    <Input
                      id="expiryDays"
                      type="number"
                      value={settings.security.passwordPolicy.expiryDays}
                      onChange={(e) =>
                        updateNestedSettings(
                          "security",
                          "passwordPolicy",
                          "expiryDays",
                          Number.parseInt(e.target.value),
                        )
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2 mt-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="requireUppercase"
                      checked={settings.security.passwordPolicy.requireUppercase}
                      onCheckedChange={(checked) =>
                        updateNestedSettings("security", "passwordPolicy", "requireUppercase", checked)
                      }
                    />
                    <Label htmlFor="requireUppercase">Require uppercase letters</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="requireNumbers"
                      checked={settings.security.passwordPolicy.requireNumbers}
                      onCheckedChange={(checked) =>
                        updateNestedSettings("security", "passwordPolicy", "requireNumbers", checked)
                      }
                    />
                    <Label htmlFor="requireNumbers">Require numbers</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="requireSpecialChars"
                      checked={settings.security.passwordPolicy.requireSpecialChars}
                      onCheckedChange={(checked) =>
                        updateNestedSettings("security", "passwordPolicy", "requireSpecialChars", checked)
                      }
                    />
                    <Label htmlFor="requireSpecialChars">Require special characters</Label>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="twoFactorAuth"
                    checked={settings.security.twoFactorAuth}
                    onCheckedChange={(checked) => updateSettings("security", "twoFactorAuth", checked)}
                  />
                  <Label htmlFor="twoFactorAuth">Enable two-factor authentication</Label>
                </div>
                <div>
                  <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={settings.security.sessionTimeout}
                    onChange={(e) => updateSettings("security", "sessionTimeout", Number.parseInt(e.target.value))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Integration Settings
              </CardTitle>
              <CardDescription>Configure third-party integrations and API access</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="emailProvider">Email Provider</Label>
                  <Select
                    value={settings.integrations.emailProvider}
                    onValueChange={(value) => updateSettings("integrations", "emailProvider", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gmail">Gmail</SelectItem>
                      <SelectItem value="outlook">Outlook</SelectItem>
                      <SelectItem value="sendgrid">SendGrid</SelectItem>
                      <SelectItem value="mailgun">Mailgun</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="calendarIntegration"
                    checked={settings.integrations.calendarIntegration}
                    onCheckedChange={(checked) => updateSettings("integrations", "calendarIntegration", checked)}
                  />
                  <Label htmlFor="calendarIntegration">Calendar integration</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="slackIntegration"
                    checked={settings.integrations.slackIntegration}
                    onCheckedChange={(checked) => updateSettings("integrations", "slackIntegration", checked)}
                  />
                  <Label htmlFor="slackIntegration">Slack integration</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="teamsIntegration"
                    checked={settings.integrations.teamsIntegration}
                    onCheckedChange={(checked) => updateSettings("integrations", "teamsIntegration", checked)}
                  />
                  <Label htmlFor="teamsIntegration">Microsoft Teams integration</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="apiAccess"
                    checked={settings.integrations.apiAccess}
                    onCheckedChange={(checked) => updateSettings("integrations", "apiAccess", checked)}
                  />
                  <Label htmlFor="apiAccess">Enable API access</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
