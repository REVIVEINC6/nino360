"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Building2, Globe, User, CreditCard, CheckCircle2 } from "lucide-react"
import { createTenant } from "../actions/tenant-actions"

const steps = [
  { id: 1, name: "Company Profile", icon: Building2 },
  { id: 2, name: "Tenant Handle", icon: Globe },
  { id: 3, name: "Admin User", icon: User },
  { id: 4, name: "Plan Select", icon: CreditCard },
  { id: 5, name: "Review", icon: CheckCircle2 },
]

const regions = [
  { value: "us-east", label: "US East" },
  { value: "us-west", label: "US West" },
  { value: "eu-west", label: "EU West" },
  { value: "ap-south", label: "Asia Pacific" },
]

const timezones = [
  { value: "America/New_York", label: "Eastern Time (ET)" },
  { value: "America/Chicago", label: "Central Time (CT)" },
  { value: "America/Denver", label: "Mountain Time (MT)" },
  { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
  { value: "Europe/London", label: "London (GMT)" },
  { value: "Europe/Paris", label: "Paris (CET)" },
  { value: "Asia/Kolkata", label: "India (IST)" },
  { value: "Asia/Singapore", label: "Singapore (SGT)" },
]

const plans = [
  {
    code: "free",
    name: "Free",
    price: 0,
    interval: "month",
    features: ["Basic analytics", "Up to 5 users", "Community support"],
  },
  {
    code: "pro",
    name: "Pro",
    price: 49,
    interval: "month",
    features: ["All modules", "Unlimited users", "Priority support", "Advanced analytics"],
  },
  {
    code: "enterprise",
    name: "Enterprise",
    price: null,
    interval: "custom",
    features: ["Everything in Pro", "SSO & SAML", "24/7 support", "Custom integrations"],
  },
]

export function TenantWizard() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const leadId = searchParams.get("lead")

  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    companyName: "",
    domain: "",
    region: "us-east",
    timezone: "America/New_York",
    slug: "",
    adminName: "",
    adminEmail: "",
    planCode: "free",
    interval: "month",
  })

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    // Auto-generate slug from company name
    if (field === "companyName" && !formData.slug) {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
      setFormData((prev) => ({ ...prev, slug }))
    }
  }

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const result = await createTenant({
        ...formData,
        leadId: leadId || undefined,
      })

      if (result.success) {
        // Redirect based on plan
        if (formData.planCode === "free") {
          router.push(`/t/${result.slug}/getting-started`)
        } else {
          router.push(`/billing/checkout?plan=${formData.planCode}&interval=${formData.interval}`)
        }
      }
    } catch (error) {
      console.error("Failed to create tenant:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
                  currentStep >= step.id
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-muted bg-background text-muted-foreground"
                }`}
              >
                <step.icon className="w-5 h-5" />
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-full h-0.5 mx-2 transition-colors ${currentStep > step.id ? "bg-primary" : "bg-muted"}`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2">
          {steps.map((step) => (
            <div key={step.id} className="text-xs text-center" style={{ width: `${100 / steps.length}%` }}>
              {step.name}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <Card className="p-6 backdrop-blur-xl bg-card/50 border-white/10">
        {currentStep === 1 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Company Profile</h2>
            <p className="text-muted-foreground">Tell us about your organization</p>

            <div className="space-y-4">
              <div>
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  value={formData.companyName}
                  onChange={(e) => updateField("companyName", e.target.value)}
                  placeholder="Acme Corp"
                />
              </div>

              <div>
                <Label htmlFor="domain">Company Domain</Label>
                <Input
                  id="domain"
                  value={formData.domain}
                  onChange={(e) => updateField("domain", e.target.value)}
                  placeholder="acme.com"
                />
              </div>

              <div>
                <Label htmlFor="region">Region</Label>
                <Select value={formData.region} onValueChange={(value) => updateField("region", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {regions.map((region) => (
                      <SelectItem key={region.value} value={region.value}>
                        {region.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="timezone">Timezone</Label>
                <Select value={formData.timezone} onValueChange={(value) => updateField("timezone", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {timezones.map((tz) => (
                      <SelectItem key={tz.value} value={tz.value}>
                        {tz.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Tenant Handle</h2>
            <p className="text-muted-foreground">Choose your unique workspace URL</p>

            <div>
              <Label htmlFor="slug">Workspace Slug</Label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">app.nino360.com/t/</span>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => updateField("slug", e.target.value)}
                  placeholder="acme"
                  className="flex-1"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">Only lowercase letters, numbers, and hyphens allowed</p>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Admin User</h2>
            <p className="text-muted-foreground">Set up the primary administrator account</p>

            <div className="space-y-4">
              <div>
                <Label htmlFor="adminName">Full Name</Label>
                <Input
                  id="adminName"
                  value={formData.adminName}
                  onChange={(e) => updateField("adminName", e.target.value)}
                  placeholder="John Doe"
                />
              </div>

              <div>
                <Label htmlFor="adminEmail">Work Email</Label>
                <Input
                  id="adminEmail"
                  type="email"
                  value={formData.adminEmail}
                  onChange={(e) => updateField("adminEmail", e.target.value)}
                  placeholder="john@acme.com"
                />
              </div>
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Select Plan</h2>
            <p className="text-muted-foreground">Choose the plan that fits your needs</p>

            <div className="grid gap-4 md:grid-cols-3">
              {plans.map((plan) => (
                <Card
                  key={plan.code}
                  className={`p-4 cursor-pointer transition-all ${
                    formData.planCode === plan.code
                      ? "border-primary bg-primary/5"
                      : "border-muted hover:border-primary/50"
                  }`}
                  onClick={() => updateField("planCode", plan.code)}
                >
                  <h3 className="text-lg font-bold">{plan.name}</h3>
                  <div className="text-2xl font-bold my-2">
                    {plan.price === null ? (
                      "Contact us"
                    ) : plan.price === 0 ? (
                      "Free"
                    ) : (
                      <>
                        ${plan.price}
                        <span className="text-sm text-muted-foreground">/mo</span>
                      </>
                    )}
                  </div>
                  <ul className="space-y-2 text-sm">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </Card>
              ))}
            </div>

            {formData.planCode !== "free" && (
              <div>
                <Label>Billing Interval</Label>
                <Select value={formData.interval} onValueChange={(value) => updateField("interval", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="month">Monthly</SelectItem>
                    <SelectItem value="year">Yearly (Save 17%)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        )}

        {currentStep === 5 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Review & Create</h2>
            <p className="text-muted-foreground">Please review your information before creating your workspace</p>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Company:</span>
                <span className="font-medium">{formData.companyName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Workspace URL:</span>
                <span className="font-medium">app.nino360.com/t/{formData.slug}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Region:</span>
                <span className="font-medium">{formData.region}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Admin:</span>
                <span className="font-medium">{formData.adminEmail}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Plan:</span>
                <span className="font-medium">{plans.find((p) => p.code === formData.planCode)?.name}</span>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={handleBack} disabled={currentStep === 1 || loading}>
            Back
          </Button>

          {currentStep < steps.length ? (
            <Button onClick={handleNext} disabled={loading}>
              Next
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? "Creating..." : "Create Workspace"}
            </Button>
          )}
        </div>
      </Card>
    </div>
  )
}
