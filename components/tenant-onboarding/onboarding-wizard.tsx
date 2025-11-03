"use client"

import { useState } from "react"
import { Stepper } from "./stepper"
import { StepShell } from "./step-shell"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { CompanyProfileStep } from "./steps/company-profile"
import { BrandingStep } from "./steps/branding"
import { PoliciesStep } from "./steps/policies"
import { IntegrationsStep } from "./steps/integrations"
import { ImportDataStep } from "./steps/import-data"
import { RolesPermissionsStep } from "./steps/roles-permissions"
import { ModulesStep } from "./steps/modules"
import { InviteUsersStep } from "./steps/invite-users"
import { ReviewLaunchStep } from "./steps/review-launch"
import { saveOnboardingProgress } from "@/app/(dashboard)/tenant/onboarding/actions"
import { useToast } from "@/hooks/use-toast"

interface OnboardingWizardProps {
  initialContext: {
    tenantId: string
    slug: string
    name: string
    currentStep: number
    completedSteps: number[]
    features: Record<string, boolean>
  }
}

const STEPS = [
  { id: 1, label: "Company Profile", description: "Basic company information and settings" },
  { id: 2, label: "Branding", description: "Customize your brand colors and logo" },
  { id: 3, label: "Policies", description: "Configure security and compliance policies" },
  { id: 4, label: "Integrations", description: "Connect external services" },
  { id: 5, label: "Import Data", description: "Import existing data from CSV/Excel" },
  { id: 6, label: "Roles & Permissions", description: "Set up user roles and permissions" },
  { id: 7, label: "Enable Modules", description: "Choose which modules to activate" },
  { id: 8, label: "Invite Users", description: "Invite team members to join" },
  { id: 9, label: "Review & Launch", description: "Review settings and launch your workspace" },
]

export function OnboardingWizard({ initialContext }: OnboardingWizardProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [currentStep, setCurrentStep] = useState(initialContext.currentStep)
  const [completedSteps, setCompletedSteps] = useState<number[]>(initialContext.completedSteps)
  const [saving, setSaving] = useState(false)

  const steps = STEPS.map((step) => ({
    ...step,
    completed: completedSteps.includes(step.id),
  }))

  const handleExit = () => {
    router.push("/tenant/dashboard")
  }

  const handleStepClick = (step: number) => {
    if (step <= currentStep || completedSteps.includes(step)) {
      setCurrentStep(step)
    }
  }

  const markStepComplete = async (stepId: number) => {
    if (!completedSteps.includes(stepId)) {
      const newCompleted = [...completedSteps, stepId]
      setCompletedSteps(newCompleted)

      // Save progress
      try {
        await saveOnboardingProgress({
          tenant_id: initialContext.tenantId,
          current_step: currentStep,
          completed_steps: newCompleted,
        })
      } catch (error) {
        console.error("[v0] Failed to save progress:", error)
      }
    }
  }

  const handleNext = async () => {
    setSaving(true)
    try {
      // Mark current step as complete
      await markStepComplete(currentStep)

      // Move to next step
      if (currentStep < 9) {
        const nextStep = currentStep + 1
        setCurrentStep(nextStep)

        await saveOnboardingProgress({
          tenant_id: initialContext.tenantId,
          current_step: nextStep,
          completed_steps: completedSteps.includes(currentStep) ? completedSteps : [...completedSteps, currentStep],
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save progress. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const renderStepContent = () => {
    const stepProps = {
      tenantId: initialContext.tenantId,
      onComplete: () => markStepComplete(currentStep),
    }

    switch (currentStep) {
      case 1:
        return <CompanyProfileStep {...stepProps} />
      case 2:
        return <BrandingStep {...stepProps} />
      case 3:
        return <PoliciesStep {...stepProps} />
      case 4:
        return <IntegrationsStep {...stepProps} />
      case 5:
        return <ImportDataStep {...stepProps} />
      case 6:
        return <RolesPermissionsStep {...stepProps} />
      case 7:
        return <ModulesStep {...stepProps} />
      case 8:
        return <InviteUsersStep {...stepProps} />
      case 9:
        return <ReviewLaunchStep {...stepProps} context={initialContext} />
      default:
        return null
    }
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">{initialContext.name}</h1>
          <p className="text-white/60 mt-1">
            Step {currentStep} of {STEPS.length} • {STEPS[currentStep - 1].description}
          </p>
        </div>
        <Button variant="ghost" onClick={handleExit} className="text-white/60 hover:text-white">
          <X className="w-5 h-5 mr-2" />
          Exit
        </Button>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Stepper Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-6">
            <Stepper steps={steps} currentStep={currentStep} onStepClick={handleStepClick} />
          </div>
        </div>

        {/* Step Content */}
        <div className="lg:col-span-3">
          <StepShell
            title={STEPS[currentStep - 1].label}
            description={STEPS[currentStep - 1].description}
            onBack={handleBack}
            onNext={handleNext}
            canGoBack={currentStep > 1}
            canGoNext={true}
            saving={saving}
          >
            {renderStepContent()}
          </StepShell>
        </div>
      </div>

      {/* Autosave Banner */}
      <div className="fixed bottom-6 right-6 backdrop-blur-xl bg-white/5 border border-white/10 rounded-lg px-4 py-2 shadow-lg">
        <p className="text-sm text-white/60">✓ Progress saved automatically</p>
      </div>
    </div>
  )
}
