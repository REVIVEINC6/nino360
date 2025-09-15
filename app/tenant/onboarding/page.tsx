"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle, Clock, AlertCircle, ArrowRight, ArrowLeft } from "lucide-react"

interface OnboardingStep {
  id: string
  title: string
  description: string
  status: "completed" | "current" | "pending"
  required: boolean
}

interface TenantOnboardingData {
  companyInfo: {
    name: string
    domain: string
    industry: string
    size: string
    country: string
    timezone: string
    description: string
  }
  adminUser: {
    firstName: string
    lastName: string
    email: string
    phone: string
    role: string
  }
  subscription: {
    plan: string
    billingCycle: string
    paymentMethod: string
  }
  configuration: {
    modules: string[]
    features: string[]
    integrations: string[]
  }
}

export default function TenantOnboarding() {
  const [currentStep, setCurrentStep] = useState(0)
  const [onboardingData, setOnboardingData] = useState<TenantOnboardingData>({
    companyInfo: {
      name: "",
      domain: "",
      industry: "",
      size: "",
      country: "",
      timezone: "",
      description: "",
    },
    adminUser: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      role: "admin",
    },
    subscription: {
      plan: "",
      billingCycle: "",
      paymentMethod: "",
    },
    configuration: {
      modules: [],
      features: [],
      integrations: [],
    },
  })

  const onboardingSteps: OnboardingStep[] = [
    {
      id: "company",
      title: "Company Information",
      description: "Basic company details and setup",
      status: currentStep > 0 ? "completed" : currentStep === 0 ? "current" : "pending",
      required: true,
    },
    {
      id: "admin",
      title: "Admin User Setup",
      description: "Create the primary administrator account",
      status: currentStep > 1 ? "completed" : currentStep === 1 ? "current" : "pending",
      required: true,
    },
    {
      id: "subscription",
      title: "Subscription & Billing",
      description: "Choose your plan and billing preferences",
      status: currentStep > 2 ? "completed" : currentStep === 2 ? "current" : "pending",
      required: true,
    },
    {
      id: "configuration",
      title: "System Configuration",
      description: "Select modules and features to enable",
      status: currentStep > 3 ? "completed" : currentStep === 3 ? "current" : "pending",
      required: true,
    },
    {
      id: "review",
      title: "Review & Launch",
      description: "Review settings and complete onboarding",
      status: currentStep > 4 ? "completed" : currentStep === 4 ? "current" : "pending",
      required: true,
    },
  ]

  const availableModules = [
    { id: "crm", name: "CRM", description: "Customer relationship management" },
    { id: "hrms", name: "HRMS", description: "Human resource management" },
    { id: "talent", name: "Talent", description: "Talent acquisition & management" },
    { id: "finance", name: "Finance", description: "Financial management" },
    { id: "vms", name: "VMS", description: "Vendor management system" },
  ]

  const availableFeatures = [
    { id: "ai-insights", name: "AI Insights", description: "AI-powered analytics and recommendations" },
    { id: "real-time", name: "Real-time Updates", description: "Live data synchronization" },
    { id: "mobile-app", name: "Mobile App", description: "Native mobile applications" },
    { id: "api-access", name: "API Access", description: "Full REST API access" },
    { id: "sso", name: "Single Sign-On", description: "Enterprise SSO integration" },
  ]

  const handleInputChange = (section: keyof TenantOnboardingData, field: string, value: string) => {
    setOnboardingData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }))
  }

  const handleArrayChange = (section: keyof TenantOnboardingData, field: string, value: string, checked: boolean) => {
    setOnboardingData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: checked
          ? [...(prev[section][field] as string[]), value]
          : (prev[section][field] as string[]).filter((item) => item !== value),
      },
    }))
  }

  const nextStep = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    console.log("Submitting onboarding data:", onboardingData)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    alert("Tenant onboarding completed successfully!")
  }

  const getStepIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case "current":
        return <Clock className="h-5 w-5 text-blue-600" />
      case "pending":
        return <AlertCircle className="h-5 w-5 text-gray-400" />
      default:
        return <AlertCircle className="h-5 w-5 text-gray-400" />
    }
  }

  const progress = ((currentStep + 1) / onboardingSteps.length) * 100

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tenant Onboarding</h1>
          <p className="text-gray-600 mt-1">Guide new tenants through the setup process</p>
        </div>
        <Badge variant="outline" className="px-3 py-1">
          Step {currentStep + 1} of {onboardingSteps.length}
        </Badge>
      </div>

      {/* Progress Bar */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Onboarding Progress</span>
              <span className="text-sm text-gray-600">{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Steps Navigation */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            {onboardingSteps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                    index === currentStep
                      ? "bg-blue-50 border border-blue-200"
                      : step.status === "completed"
                        ? "bg-green-50 border border-green-200"
                        : "bg-gray-50 border border-gray-200"
                  }`}
                  onClick={() => setCurrentStep(index)}
                >
                  {getStepIcon(step.status)}
                  <div className="hidden lg:block">
                    <p className="font-medium text-sm">{step.title}</p>
                    <p className="text-xs text-gray-600">{step.description}</p>
                  </div>
                </div>
                {index < onboardingSteps.length - 1 && <ArrowRight className="h-4 w-4 text-gray-400 mx-2" />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Step Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getStepIcon(onboardingSteps[currentStep].status)}
            {onboardingSteps[currentStep].title}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {currentStep === 0 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="companyName">Company Name *</Label>
                    <Input
                      id="companyName"
                      value={onboardingData.companyInfo.name}
                      onChange={(e) => handleInputChange("companyInfo", "name", e.target.value)}
                      placeholder="Enter company name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="domain">Domain *</Label>
                    <Input
                      id="domain"
                      value={onboardingData.companyInfo.domain}
                      onChange={(e) => handleInputChange("companyInfo", "domain", e.target.value)}
                      placeholder="company.example.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="industry">Industry *</Label>
                    <Select
                      value={onboardingData.companyInfo.industry}
                      onValueChange={(value) => handleInputChange("companyInfo", "industry", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="technology">Technology</SelectItem>
                        <SelectItem value="healthcare">Healthcare</SelectItem>
                        <SelectItem value="finance">Finance</SelectItem>
                        <SelectItem value="manufacturing">Manufacturing</SelectItem>
                        <SelectItem value="retail">Retail</SelectItem>
                        <SelectItem value="consulting">Consulting</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="companySize">Company Size *</Label>
                    <Select
                      value={onboardingData.companyInfo.size}
                      onValueChange={(value) => handleInputChange("companyInfo", "size", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select company size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-10">1-10 employees</SelectItem>
                        <SelectItem value="11-50">11-50 employees</SelectItem>
                        <SelectItem value="51-200">51-200 employees</SelectItem>
                        <SelectItem value="201-1000">201-1000 employees</SelectItem>
                        <SelectItem value="1000+">1000+ employees</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="country">Country *</Label>
                    <Select
                      value={onboardingData.companyInfo.country}
                      onValueChange={(value) => handleInputChange("companyInfo", "country", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="us">United States</SelectItem>
                        <SelectItem value="ca">Canada</SelectItem>
                        <SelectItem value="uk">United Kingdom</SelectItem>
                        <SelectItem value="de">Germany</SelectItem>
                        <SelectItem value="fr">France</SelectItem>
                        <SelectItem value="au">Australia</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="timezone">Timezone *</Label>
                    <Select
                      value={onboardingData.companyInfo.timezone}
                      onValueChange={(value) => handleInputChange("companyInfo", "timezone", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select timezone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="UTC-8">Pacific Time (UTC-8)</SelectItem>
                        <SelectItem value="UTC-5">Eastern Time (UTC-5)</SelectItem>
                        <SelectItem value="UTC+0">GMT (UTC+0)</SelectItem>
                        <SelectItem value="UTC+1">Central European Time (UTC+1)</SelectItem>
                        <SelectItem value="UTC+10">Australian Eastern Time (UTC+10)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <div>
                <Label htmlFor="description">Company Description</Label>
                <Textarea
                  id="description"
                  value={onboardingData.companyInfo.description}
                  onChange={(e) => handleInputChange("companyInfo", "description", e.target.value)}
                  placeholder="Brief description of your company..."
                  rows={3}
                />
              </div>
            </motion.div>
          )}

          {currentStep === 1 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={onboardingData.adminUser.firstName}
                      onChange={(e) => handleInputChange("adminUser", "firstName", e.target.value)}
                      placeholder="Enter first name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={onboardingData.adminUser.lastName}
                      onChange={(e) => handleInputChange("adminUser", "lastName", e.target.value)}
                      placeholder="Enter last name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={onboardingData.adminUser.email}
                      onChange={(e) => handleInputChange("adminUser", "email", e.target.value)}
                      placeholder="admin@company.com"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={onboardingData.adminUser.phone}
                      onChange={(e) => handleInputChange("adminUser", "phone", e.target.value)}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  <div>
                    <Label htmlFor="role">Admin Role *</Label>
                    <Select
                      value={onboardingData.adminUser.role}
                      onValueChange={(value) => handleInputChange("adminUser", "role", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="super_admin">Super Admin</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="manager">Manager</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="border-2 border-blue-200 bg-blue-50">
                  <CardHeader>
                    <CardTitle className="text-lg">Basic Plan</CardTitle>
                    <div className="text-2xl font-bold">$29/month</div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li>• Up to 50 users</li>
                      <li>• Basic modules</li>
                      <li>• Email support</li>
                      <li>• 5GB storage</li>
                    </ul>
                    <Button
                      className="w-full mt-4"
                      variant={onboardingData.subscription.plan === "basic" ? "default" : "outline"}
                      onClick={() => handleInputChange("subscription", "plan", "basic")}
                    >
                      Select Basic
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-2 border-green-200 bg-green-50">
                  <CardHeader>
                    <CardTitle className="text-lg">Professional</CardTitle>
                    <div className="text-2xl font-bold">$79/month</div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li>• Up to 200 users</li>
                      <li>• All modules</li>
                      <li>• Priority support</li>
                      <li>• 50GB storage</li>
                      <li>• API access</li>
                    </ul>
                    <Button
                      className="w-full mt-4"
                      variant={onboardingData.subscription.plan === "professional" ? "default" : "outline"}
                      onClick={() => handleInputChange("subscription", "plan", "professional")}
                    >
                      Select Professional
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-2 border-purple-200 bg-purple-50">
                  <CardHeader>
                    <CardTitle className="text-lg">Enterprise</CardTitle>
                    <div className="text-2xl font-bold">$199/month</div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li>• Unlimited users</li>
                      <li>• All modules + AI</li>
                      <li>• 24/7 support</li>
                      <li>• Unlimited storage</li>
                      <li>• Custom integrations</li>
                      <li>• SSO & advanced security</li>
                    </ul>
                    <Button
                      className="w-full mt-4"
                      variant={onboardingData.subscription.plan === "enterprise" ? "default" : "outline"}
                      onClick={() => handleInputChange("subscription", "plan", "enterprise")}
                    >
                      Select Enterprise
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="billingCycle">Billing Cycle *</Label>
                  <Select
                    value={onboardingData.subscription.billingCycle}
                    onValueChange={(value) => handleInputChange("subscription", "billingCycle", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select billing cycle" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="yearly">Yearly (20% discount)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="paymentMethod">Payment Method *</Label>
                  <Select
                    value={onboardingData.subscription.paymentMethod}
                    onValueChange={(value) => handleInputChange("subscription", "paymentMethod", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="credit_card">Credit Card</SelectItem>
                      <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                      <SelectItem value="invoice">Invoice</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === 3 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Select Modules to Enable</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {availableModules.map((module) => (
                    <Card key={module.id} className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            id={module.id}
                            checked={onboardingData.configuration.modules.includes(module.id)}
                            onChange={(e) => handleArrayChange("configuration", "modules", module.id, e.target.checked)}
                            className="rounded"
                          />
                          <div>
                            <Label htmlFor={module.id} className="font-medium cursor-pointer">
                              {module.name}
                            </Label>
                            <p className="text-sm text-gray-600">{module.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Additional Features</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {availableFeatures.map((feature) => (
                    <Card key={feature.id} className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            id={feature.id}
                            checked={onboardingData.configuration.features.includes(feature.id)}
                            onChange={(e) =>
                              handleArrayChange("configuration", "features", feature.id, e.target.checked)
                            }
                            className="rounded"
                          />
                          <div>
                            <Label htmlFor={feature.id} className="font-medium cursor-pointer">
                              {feature.name}
                            </Label>
                            <p className="text-sm text-gray-600">{feature.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === 4 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Review Your Configuration
                </h3>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-2">Company Information</h4>
                    <div className="space-y-1 text-sm">
                      <p>
                        <strong>Name:</strong> {onboardingData.companyInfo.name}
                      </p>
                      <p>
                        <strong>Domain:</strong> {onboardingData.companyInfo.domain}
                      </p>
                      <p>
                        <strong>Industry:</strong> {onboardingData.companyInfo.industry}
                      </p>
                      <p>
                        <strong>Size:</strong> {onboardingData.companyInfo.size}
                      </p>
                      <p>
                        <strong>Country:</strong> {onboardingData.companyInfo.country}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Admin User</h4>
                    <div className="space-y-1 text-sm">
                      <p>
                        <strong>Name:</strong> {onboardingData.adminUser.firstName} {onboardingData.adminUser.lastName}
                      </p>
                      <p>
                        <strong>Email:</strong> {onboardingData.adminUser.email}
                      </p>
                      <p>
                        <strong>Role:</strong> {onboardingData.adminUser.role}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Subscription</h4>
                    <div className="space-y-1 text-sm">
                      <p>
                        <strong>Plan:</strong> {onboardingData.subscription.plan}
                      </p>
                      <p>
                        <strong>Billing:</strong> {onboardingData.subscription.billingCycle}
                      </p>
                      <p>
                        <strong>Payment:</strong> {onboardingData.subscription.paymentMethod}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Configuration</h4>
                    <div className="space-y-1 text-sm">
                      <p>
                        <strong>Modules:</strong> {onboardingData.configuration.modules.join(", ") || "None selected"}
                      </p>
                      <p>
                        <strong>Features:</strong> {onboardingData.configuration.features.join(", ") || "None selected"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-yellow-600" />
                  <p className="text-sm font-medium">Ready to Launch</p>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Once you complete the onboarding, the tenant will be created and the admin user will receive login
                  credentials via email.
                </p>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={prevStep} disabled={currentStep === 0} className="gap-2 bg-transparent">
              <ArrowLeft className="h-4 w-4" />
              Previous
            </Button>

            <div className="flex gap-2">
              {currentStep < onboardingSteps.length - 1 ? (
                <Button onClick={nextStep} className="gap-2">
                  Next
                  <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button onClick={handleSubmit} className="gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Complete Onboarding
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
