"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { Building2, Users, CreditCard, Settings, X, Check, AlertCircle, Loader2 } from "lucide-react"

interface TenantCreateModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => Promise<void>
}

const modules = [
  { id: "crm", name: "CRM", description: "Customer Relationship Management", icon: Users },
  { id: "hrms", name: "HRMS", description: "Human Resource Management", icon: Users },
  { id: "talent", name: "Talent", description: "Talent Acquisition", icon: Users },
  { id: "finance", name: "Finance", description: "Financial Management", icon: CreditCard },
  { id: "admin", name: "Admin", description: "Administration Tools", icon: Settings },
]

const plans = [
  {
    id: "starter",
    name: "Starter",
    price: 29,
    users: 10,
    features: ["Basic CRM", "Email Support", "5GB Storage"],
  },
  {
    id: "professional",
    name: "Professional",
    price: 99,
    users: 50,
    features: ["All Modules", "Priority Support", "50GB Storage", "API Access"],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 299,
    users: 500,
    features: ["Unlimited Modules", "24/7 Support", "500GB Storage", "Custom Integrations"],
  },
]

export function TenantCreateModal({ isOpen, onClose, onSubmit }: TenantCreateModalProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [currentTab, setCurrentTab] = useState("basic")
  const [formData, setFormData] = useState({
    name: "",
    domain: "",
    description: "",
    plan: "starter",
    modules: ["crm"],
    contact: {
      name: "",
      email: "",
      phone: "",
    },
    settings: {
      timezone: "UTC",
      language: "en",
      currency: "USD",
      trialDays: 14,
    },
    branding: {
      primaryColor: "#3b82f6",
      logo: "",
    },
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) newErrors.name = "Company name is required"
    if (!formData.domain.trim()) newErrors.domain = "Domain is required"
    if (!formData.contact.name.trim()) newErrors.contactName = "Contact name is required"
    if (!formData.contact.email.trim()) newErrors.contactEmail = "Contact email is required"
    if (!/\S+@\S+\.\S+/.test(formData.contact.email)) newErrors.contactEmail = "Invalid email format"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors before submitting.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      await onSubmit(formData)
      onClose()
      setFormData({
        name: "",
        domain: "",
        description: "",
        plan: "starter",
        modules: ["crm"],
        contact: { name: "", email: "", phone: "" },
        settings: { timezone: "UTC", language: "en", currency: "USD", trialDays: 14 },
        branding: { primaryColor: "#3b82f6", logo: "" },
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create tenant. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleModuleToggle = (moduleId: string) => {
    setFormData((prev) => ({
      ...prev,
      modules: prev.modules.includes(moduleId)
        ? prev.modules.filter((id) => id !== moduleId)
        : [...prev.modules, moduleId],
    }))
  }

  const selectedPlan = plans.find((p) => p.id === formData.plan)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500">
                <Building2 className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Create New Tenant</h2>
                <p className="text-sm text-gray-600">Set up a new tenant account with custom configuration</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} disabled={loading}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
            <div className="border-b px-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="basic" className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Basic Info
                </TabsTrigger>
                <TabsTrigger value="plan" className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Plan & Modules
                </TabsTrigger>
                <TabsTrigger value="contact" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Contact
                </TabsTrigger>
                <TabsTrigger value="settings" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Settings
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="p-6">
              <TabsContent value="basic" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Company Name *</Label>
                    <Input
                      id="name"
                      placeholder="Enter company name"
                      value={formData.name}
                      onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                      className={errors.name ? "border-red-500" : ""}
                    />
                    {errors.name && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.name}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="domain">Domain *</Label>
                    <div className="flex">
                      <Input
                        id="domain"
                        placeholder="company"
                        value={formData.domain}
                        onChange={(e) => setFormData((prev) => ({ ...prev, domain: e.target.value }))}
                        className={`rounded-r-none ${errors.domain ? "border-red-500" : ""}`}
                      />
                      <div className="px-3 py-2 bg-gray-100 border border-l-0 rounded-r-md text-sm text-gray-600">
                        .esgos.com
                      </div>
                    </div>
                    {errors.domain && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.domain}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Brief description of the company..."
                    value={formData.description}
                    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Timezone</Label>
                    <Select
                      value={formData.settings.timezone}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, settings: { ...prev.settings, timezone: value } }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="UTC">UTC</SelectItem>
                        <SelectItem value="America/New_York">Eastern Time</SelectItem>
                        <SelectItem value="America/Chicago">Central Time</SelectItem>
                        <SelectItem value="America/Denver">Mountain Time</SelectItem>
                        <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                        <SelectItem value="Europe/London">London</SelectItem>
                        <SelectItem value="Europe/Paris">Paris</SelectItem>
                        <SelectItem value="Asia/Tokyo">Tokyo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Language</Label>
                    <Select
                      value={formData.settings.language}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, settings: { ...prev.settings, language: value } }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="de">German</SelectItem>
                        <SelectItem value="ja">Japanese</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Currency</Label>
                    <Select
                      value={formData.settings.currency}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, settings: { ...prev.settings, currency: value } }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD ($)</SelectItem>
                        <SelectItem value="EUR">EUR (€)</SelectItem>
                        <SelectItem value="GBP">GBP (£)</SelectItem>
                        <SelectItem value="JPY">JPY (¥)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="plan" className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Select Plan</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {plans.map((plan) => (
                      <Card
                        key={plan.id}
                        className={`cursor-pointer transition-all ${
                          formData.plan === plan.id ? "ring-2 ring-blue-500 bg-blue-50" : "hover:shadow-md"
                        }`}
                        onClick={() => setFormData((prev) => ({ ...prev, plan: plan.id }))}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">{plan.name}</CardTitle>
                            {formData.plan === plan.id && (
                              <div className="p-1 rounded-full bg-blue-500">
                                <Check className="h-3 w-3 text-white" />
                              </div>
                            )}
                          </div>
                          <div className="text-2xl font-bold">
                            ${plan.price}
                            <span className="text-sm font-normal text-gray-600">/month</span>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div className="text-sm text-gray-600">Up to {plan.users} users</div>
                            <ul className="space-y-1">
                              {plan.features.map((feature, index) => (
                                <li key={index} className="text-sm flex items-center gap-2">
                                  <Check className="h-3 w-3 text-green-500" />
                                  {feature}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">Available Modules</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {modules.map((module) => {
                      const IconComponent = module.icon
                      const isSelected = formData.modules.includes(module.id)

                      return (
                        <Card
                          key={module.id}
                          className={`cursor-pointer transition-all ${
                            isSelected ? "ring-2 ring-blue-500 bg-blue-50" : "hover:shadow-md"
                          }`}
                          onClick={() => handleModuleToggle(module.id)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-lg ${isSelected ? "bg-blue-500" : "bg-gray-100"}`}>
                                <IconComponent className={`h-4 w-4 ${isSelected ? "text-white" : "text-gray-600"}`} />
                              </div>
                              <div className="flex-1">
                                <div className="font-medium">{module.name}</div>
                                <div className="text-sm text-gray-600">{module.description}</div>
                              </div>
                              <Switch checked={isSelected} onCheckedChange={() => handleModuleToggle(module.id)} />
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="contact" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="contactName">Contact Name *</Label>
                    <Input
                      id="contactName"
                      placeholder="Primary contact name"
                      value={formData.contact.name}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, contact: { ...prev.contact, name: e.target.value } }))
                      }
                      className={errors.contactName ? "border-red-500" : ""}
                    />
                    {errors.contactName && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.contactName}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contactEmail">Contact Email *</Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      placeholder="admin@company.com"
                      value={formData.contact.email}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, contact: { ...prev.contact, email: e.target.value } }))
                      }
                      className={errors.contactEmail ? "border-red-500" : ""}
                    />
                    {errors.contactEmail && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.contactEmail}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactPhone">Contact Phone</Label>
                  <Input
                    id="contactPhone"
                    placeholder="+1-555-0123"
                    value={formData.contact.phone}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, contact: { ...prev.contact, phone: e.target.value } }))
                    }
                  />
                </div>

                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="p-1 rounded-full bg-blue-500">
                        <AlertCircle className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <h4 className="font-medium text-blue-900">Important Note</h4>
                        <p className="text-sm text-blue-800 mt-1">
                          The contact person will receive the initial setup email with login credentials and
                          administrative access to the tenant account.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="trialDays">Trial Period (Days)</Label>
                    <Input
                      id="trialDays"
                      type="number"
                      min="0"
                      max="90"
                      value={formData.settings.trialDays}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          settings: { ...prev.settings, trialDays: Number.parseInt(e.target.value) || 0 },
                        }))
                      }
                    />
                    <p className="text-xs text-gray-600">Set to 0 for no trial period</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="primaryColor">Primary Brand Color</Label>
                    <div className="flex gap-2">
                      <Input
                        id="primaryColor"
                        type="color"
                        value={formData.branding.primaryColor}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            branding: { ...prev.branding, primaryColor: e.target.value },
                          }))
                        }
                        className="w-16 h-10 p-1 border rounded"
                      />
                      <Input
                        value={formData.branding.primaryColor}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            branding: { ...prev.branding, primaryColor: e.target.value },
                          }))
                        }
                        placeholder="#3b82f6"
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Security Settings</CardTitle>
                    <CardDescription>Configure security and compliance settings for this tenant</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Two-Factor Authentication</Label>
                        <p className="text-sm text-gray-600">Require 2FA for all users</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Single Sign-On (SSO)</Label>
                        <p className="text-sm text-gray-600">Enable SSO integration</p>
                      </div>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Data Encryption</Label>
                        <p className="text-sm text-gray-600">Encrypt sensitive data at rest</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Compliance</CardTitle>
                    <CardDescription>Select applicable compliance frameworks</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {["GDPR", "SOC2", "ISO27001", "HIPAA", "PCI DSS"].map((compliance) => (
                        <Badge key={compliance} variant="outline" className="cursor-pointer hover:bg-blue-50">
                          {compliance}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </Tabs>
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600">
              Plan: <span className="font-medium">{selectedPlan?.name}</span> - ${selectedPlan?.price}/month
            </div>
            <div className="text-sm text-gray-600">
              Modules: <span className="font-medium">{formData.modules.length}</span> selected
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Create Tenant
                </>
              )}
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
