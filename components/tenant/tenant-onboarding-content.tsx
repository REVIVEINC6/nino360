"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Building2, Users, Settings, CheckCircle2, ArrowRight, ArrowLeft } from "lucide-react"
import { updateOnboardingStep, completeOnboarding } from "@/app/(app)/tenant/onboarding/actions"
import { useRouter } from "next/navigation"

const steps = [
  { id: 1, name: "Company Info", icon: Building2 },
  { id: 2, name: "Team Setup", icon: Users },
  { id: 3, name: "Preferences", icon: Settings },
  { id: 4, name: "Complete", icon: CheckCircle2 },
]

export function TenantOnboardingContent() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)

  const [companyData, setCompanyData] = useState({
    name: "",
    industry: "",
    size: "",
    website: "",
    description: "",
  })

  const [teamData, setTeamData] = useState({
    inviteEmails: "",
    defaultRole: "member",
  })

  const [preferencesData, setPreferencesData] = useState({
    modules: [] as string[],
    timezone: "America/New_York",
    currency: "USD",
  })

  const handleNext = async () => {
    setLoading(true)
    try {
      let data = {}
      if (currentStep === 1) data = companyData
      if (currentStep === 2) data = teamData
      if (currentStep === 3) data = preferencesData

      await updateOnboardingStep(currentStep, data)

      if (currentStep === 4) {
        await completeOnboarding()
        router.push("/tenant/dashboard")
      } else {
        setCurrentStep(currentStep + 1)
      }
    } catch (error) {
      console.error("Error updating onboarding:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => {
    setCurrentStep(Math.max(1, currentStep - 1))
  }

  const toggleModule = (module: string) => {
    setPreferencesData((prev) => ({
      ...prev,
      modules: prev.modules.includes(module) ? prev.modules.filter((m) => m !== module) : [...prev.modules, module],
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      currentStep >= step.id
                        ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                        : "bg-white/50 backdrop-blur-sm text-gray-400"
                    }`}
                  >
                    <step.icon className="w-6 h-6" />
                  </div>
                  <span className="text-sm mt-2 font-medium">{step.name}</span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-4 ${
                      currentStep > step.id
                        ? "bg-gradient-to-r from-blue-500 to-purple-500"
                        : "bg-white/50 backdrop-blur-sm"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <Card className="bg-white/70 backdrop-blur-md border-white/20 shadow-xl p-8">
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  Tell us about your company
                </h2>
                <p className="text-gray-600">Help us personalize your experience</p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Company Name *</Label>
                  <Input
                    id="name"
                    value={companyData.name}
                    onChange={(e) => setCompanyData({ ...companyData, name: e.target.value })}
                    placeholder="Acme Corporation"
                  />
                </div>

                <div>
                  <Label htmlFor="industry">Industry *</Label>
                  <Select
                    value={companyData.industry}
                    onValueChange={(value) => setCompanyData({ ...companyData, industry: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="retail">Retail</SelectItem>
                      <SelectItem value="manufacturing">Manufacturing</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="size">Company Size *</Label>
                  <Select
                    value={companyData.size}
                    onValueChange={(value) => setCompanyData({ ...companyData, size: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-10">1-10 employees</SelectItem>
                      <SelectItem value="11-50">11-50 employees</SelectItem>
                      <SelectItem value="51-200">51-200 employees</SelectItem>
                      <SelectItem value="201-500">201-500 employees</SelectItem>
                      <SelectItem value="501+">501+ employees</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={companyData.website}
                    onChange={(e) => setCompanyData({ ...companyData, website: e.target.value })}
                    placeholder="https://example.com"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={companyData.description}
                    onChange={(e) => setCompanyData({ ...companyData, description: e.target.value })}
                    placeholder="Tell us about your company..."
                    rows={4}
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  Invite your team
                </h2>
                <p className="text-gray-600">Add team members to get started</p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="emails">Email Addresses</Label>
                  <Textarea
                    id="emails"
                    value={teamData.inviteEmails}
                    onChange={(e) => setTeamData({ ...teamData, inviteEmails: e.target.value })}
                    placeholder="Enter email addresses (one per line)"
                    rows={6}
                  />
                  <p className="text-sm text-gray-500 mt-1">Enter one email address per line</p>
                </div>

                <div>
                  <Label htmlFor="role">Default Role</Label>
                  <Select
                    value={teamData.defaultRole}
                    onValueChange={(value) => setTeamData({ ...teamData, defaultRole: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="member">Member</SelectItem>
                      <SelectItem value="viewer">Viewer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  Configure preferences
                </h2>
                <p className="text-gray-600">Choose modules and settings</p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="mb-3 block">Select Modules</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {["CRM", "HRMS", "Finance", "Projects", "VMS", "Bench", "Training", "Hotlist"].map((module) => (
                      <div key={module} className="flex items-center space-x-2">
                        <Checkbox
                          id={module}
                          checked={preferencesData.modules.includes(module)}
                          onCheckedChange={() => toggleModule(module)}
                        />
                        <label htmlFor={module} className="text-sm font-medium cursor-pointer">
                          {module}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select
                    value={preferencesData.timezone}
                    onValueChange={(value) => setPreferencesData({ ...preferencesData, timezone: value })}
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
                  <Label htmlFor="currency">Currency</Label>
                  <Select
                    value={preferencesData.currency}
                    onValueChange={(value) => setPreferencesData({ ...preferencesData, currency: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="EUR">EUR (€)</SelectItem>
                      <SelectItem value="GBP">GBP (£)</SelectItem>
                      <SelectItem value="CAD">CAD ($)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="text-center space-y-6 py-8">
              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center">
                <CheckCircle2 className="w-12 h-12 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  You're all set!
                </h2>
                <p className="text-gray-600">Your workspace is ready to use</p>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t">
            <Button variant="outline" onClick={handleBack} disabled={currentStep === 1 || loading}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Button
              onClick={handleNext}
              disabled={loading}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
            >
              {currentStep === 4 ? "Get Started" : "Continue"}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
