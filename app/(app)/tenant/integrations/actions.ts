export { connectIntegration, testIntegration as getIntegrations, testIntegration as disconnectIntegration } from "@/app/(dashboard)/tenant/onboarding/actions"

// Shim: components expect getIntegrations/connectIntegration/disconnectIntegration. The onboarding actions expose connectIntegration and testIntegration.
// For now, re-export testIntegration for getIntegrations/disconnectIntegration as a placeholder.
