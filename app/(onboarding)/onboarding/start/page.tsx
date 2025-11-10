"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  Building2,
  Globe,
  Clock,
  User,
  Mail,
  CreditCard,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

const STEPS = [
  { id: 1, title: "Company Profile", icon: Building2 },
  { id: 2, title: "Tenant Handle", icon: Globe },
  { id: 3, title: "Admin User", icon: User },
  { id: 4, title: "Select Plan", icon: CreditCard },
  { id: 5, title: "Review", icon: CheckCircle2 },
]

const PLANS = [
  { code: "free", name: "Free", price: 0 },
  { code: "pro", name: "Pro", price: 49 },
  { code: "enterprise", name: "Enterprise", price: null },
]

const REGIONS = [
  { value: "us-east", label: "US East" },
  { value: "us-west", label: "US West" },
  { value: "eu-west", label: "Europe West" },
  { value: "ap-south", label: "Asia Pacific" },
]

const TIMEZONES = [
  { value: "America/New_York", label: "Eastern Time (ET)" },
  { value: "America/Chicago", label: "Central Time (CT)" },
  { value: "America/Denver", label: "Mountain Time (MT)" },
  { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
  { value: "Europe/London", label: "London (GMT)" },
  { value: "Asia/Kolkata", label: "India (IST)" },
]

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    company_name: "",
    domain: "",
    region: "us-east",
    timezone: "America/New_York",
    tenant_slug: "",
    admin_name: "",
    admin_email: "",
    plan_code: "pro",
    interval: "month",
  })
  const router = useRouter()
  const { toast } = useToast()

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    // Auto-generate slug from company name
    if (field === "company_name" && !formData.tenant_slug) {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
      setFormData((prev) => ({ ...prev, tenant_slug: slug }))
    }
  }

  const validateStep = () => {
    switch (currentStep) {
      case 1:
        if (!formData.company_name || !formData.domain) {
          toast({
            title: "Missing information",
            description: "Please fill in all required fields",
            variant: "destructive",
          })
          return false
        }
        break
      case 2:
        if (!formData.tenant_slug || !/^[a-z0-9-]{3,}$/.test(formData.tenant_slug)) {
          toast({
            title: "Invalid slug",
            description: "Slug must be at least 3 characters and contain only lowercase letters, numbers, and hyphens",
            variant: "destructive",
          })
          return false
        }
        break
      case 3:
        if (!formData.admin_name || !formData.admin_email) {
          toast({
            title: "Missing information",
            description: "Please provide admin user details",
            variant: "destructive",
          })
          return false
        }
        break
    }
    return true
  }

  const handleNext = () => {
    if (validateStep()) {
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length))
    }
  }

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/tenants/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) throw new Error(data.message || "Failed to create tenant")

      toast({
        title: "Tenant created!",
        description: "Your organization has been set up successfully",
      })

      // Redirect based on plan
      if (formData.plan_code === "free") {
        router.push(`/t/${formData.tenant_slug}/getting-started`)
      } else {
        router.push(`/billing/checkout?plan=${formData.plan_code}&interval=${formData.interval}`)
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create tenant",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {STEPS.map((step, index) => {
              const Icon = step.icon
              const isActive = currentStep === step.id
              const isCompleted = currentStep > step.id

              return (
                <div key={step.id} className="flex items-center flex-1">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${
                        isCompleted
                          ? "bg-green-500 border-green-500"
                          : isActive
                            ? "bg-purple-600 border-purple-600"
                            : "bg-white/5 border-white/20"
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="h-6 w-6 text-white" />
                      ) : (
                        <Icon className={`h-6 w-6 ${isActive ? "text-white" : "text-white/40"}`} />
                      )}
                    </div>
                    <span
                      className={`text-xs mt-2 text-center ${isActive ? "text-white font-medium" : "text-white/60"}`}
                    >
                      {step.title}
                    </span>
                  </div>
                  {index < STEPS.length - 1 && (
                    <div
                      className={`flex-1 h-0.5 mx-2 ${isCompleted ? "bg-green-500" : "bg-white/20"} transition-all`}
                    />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Form Content */}
        <Card className="glass-panel border-white/10 p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Step 1: Company Profile */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Company Profile</h2>
                    <p className="text-white/60">Tell us about your organization</p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="company_name" className="text-white/80">
                        Company Name *
                      </Label>
                      <Input
                        id="company_name"
                        value={formData.company_name}
                        onChange={(e) => updateFormData("company_name", e.target.value)}
                        placeholder="Acme Corp"
                        className="bg-white/5 border-white/10 text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="domain" className="text-white/80">
                        Company Domain *
                      </Label>
                      <Input
                        id="domain"
                        value={formData.domain}
                        onChange={(e) => updateFormData("domain", e.target.value)}
                        placeholder="acme.com"
                        className="bg-white/5 border-white/10 text-white"
                      />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="region" className="text-white/80">
                          <Globe className="inline h-4 w-4 mr-2" />
                          Region
                        </Label>
                        <select
                          id="region"
                          value={formData.region}
                          onChange={(e) => updateFormData("region", e.target.value)}
                          className="w-full h-10 px-3 rounded-md bg-white/5 border border-white/10 text-white"
                        >
                          {REGIONS.map((region) => (
                            <option key={region.value} value={region.value}>
                              {region.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="timezone" className="text-white/80">
                          <Clock className="inline h-4 w-4 mr-2" />
                          Timezone
                        </Label>
                        <select
                          id="timezone"
                          value={formData.timezone}
                          onChange={(e) => updateFormData("timezone", e.target.value)}
                          className="w-full h-10 px-3 rounded-md bg-white/5 border border-white/10 text-white"
                        >
                          {TIMEZONES.map((tz) => (
                            <option key={tz.value} value={tz.value}>
                              {tz.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Tenant Handle */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Tenant Handle</h2>
                    <p className="text-white/60">Choose your unique workspace URL</p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="tenant_slug" className="text-white/80">
                        Workspace Slug *
                      </Label>
                      <div className="flex items-center gap-2">
                        <span className="text-white/60">app.nino360.com/t/</span>
                        <Input
                          id="tenant_slug"
                          value={formData.tenant_slug}
                          onChange={(e) => updateFormData("tenant_slug", e.target.value)}
                          placeholder="acme"
                          className="bg-white/5 border-white/10 text-white flex-1"
                        />
                      </div>
                      <p className="text-xs text-white/40">
                        Must be 3+ characters, lowercase letters, numbers, and hyphens only
                      </p>
                    </div>

                    <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
                      <p className="text-sm text-white/80">
                        Your workspace will be accessible at:
                        <br />
                        <span className="text-purple-400 font-mono">
                          https://app.nino360.com/t/{formData.tenant_slug || "your-slug"}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Admin User */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Admin User</h2>
                    <p className="text-white/60">Set up the primary administrator account</p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="admin_name" className="text-white/80">
                        <User className="inline h-4 w-4 mr-2" />
                        Full Name *
                      </Label>
                      <Input
                        id="admin_name"
                        value={formData.admin_name}
                        onChange={(e) => updateFormData("admin_name", e.target.value)}
                        placeholder="John Doe"
                        className="bg-white/5 border-white/10 text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="admin_email" className="text-white/80">
                        <Mail className="inline h-4 w-4 mr-2" />
                        Work Email *
                      </Label>
                      <Input
                        id="admin_email"
                        type="email"
                        value={formData.admin_email}
                        onChange={(e) => updateFormData("admin_email", e.target.value)}
                        placeholder="john@acme.com"
                        className="bg-white/5 border-white/10 text-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Select Plan */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Select Plan</h2>
                    <p className="text-white/60">Choose the plan that fits your needs</p>
                  </div>

                  <div className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-3">
                      {PLANS.map((plan) => (
                        <button
                          key={plan.code}
                          onClick={() => updateFormData("plan_code", plan.code)}
                          className={`p-6 rounded-lg border-2 transition-all text-left ${
                            formData.plan_code === plan.code
                              ? "border-purple-500 bg-purple-500/20"
                              : "border-white/10 bg-white/5 hover:border-purple-500/50"
                          }`}
                        >
                          <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                          <div className="text-2xl font-bold text-white mb-4">
                            {plan.price !== null ? `$${plan.price}/mo` : "Custom"}
                          </div>
                          {formData.plan_code === plan.code && <CheckCircle2 className="h-5 w-5 text-green-400" />}
                        </button>
                      ))}
                    </div>

                    {formData.plan_code !== "free" && (
                      <div className="flex items-center gap-2 p-1 rounded-lg bg-white/5 border border-white/10 w-fit">
                        <button
                          onClick={() => updateFormData("interval", "month")}
                          className={`px-4 py-2 rounded-md transition-all ${
                            formData.interval === "month" ? "bg-purple-600 text-white" : "text-white/60"
                          }`}
                        >
                          Monthly
                        </button>
                        <button
                          onClick={() => updateFormData("interval", "year")}
                          className={`px-4 py-2 rounded-md transition-all ${
                            formData.interval === "year" ? "bg-purple-600 text-white" : "text-white/60"
                          }`}
                        >
                          Yearly (Save 17%)
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 5: Review */}
              {currentStep === 5 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Review & Create</h2>
                    <p className="text-white/60">Confirm your details before creating your workspace</p>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                      <h3 className="text-sm font-medium text-white/60 mb-2">Company</h3>
                      <p className="text-white">{formData.company_name}</p>
                      <p className="text-white/60 text-sm">{formData.domain}</p>
                    </div>

                    <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                      <h3 className="text-sm font-medium text-white/60 mb-2">Workspace</h3>
                      <p className="text-white font-mono">app.nino360.com/t/{formData.tenant_slug}</p>
                    </div>

                    <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                      <h3 className="text-sm font-medium text-white/60 mb-2">Admin</h3>
                      <p className="text-white">{formData.admin_name}</p>
                      <p className="text-white/60 text-sm">{formData.admin_email}</p>
                    </div>

                    <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                      <h3 className="text-sm font-medium text-white/60 mb-2">Plan</h3>
                      <p className="text-white">
                        {PLANS.find((p) => p.code === formData.plan_code)?.name}
                        {formData.plan_code !== "free" && ` (${formData.interval === "month" ? "Monthly" : "Yearly"})`}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex gap-4 mt-8">
            {currentStep > 1 && (
              <Button
                onClick={handleBack}
                variant="outline"
                className="flex-1 border-white/10 bg-white/5 hover:bg-white/10 text-white"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            )}

            {currentStep < STEPS.length ? (
              <Button
                onClick={handleNext}
                className="flex-1 bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
              >
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1 bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    Create Workspace
                    <CheckCircle2 className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
