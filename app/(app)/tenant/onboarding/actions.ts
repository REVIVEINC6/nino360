export { updateOnboardingStep, completeOnboarding } from "@/app/(dashboard)/tenant/onboarding/actions"

// Shim: components import updateOnboardingStep and completeOnboarding from the (app) path.
// Re-export the implementations from the dashboard onboarding actions so client code sees the
// correct function signatures (updateOnboardingStep(current_step, data)).
