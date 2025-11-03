export async function updateNotificationSettings(settings: unknown) {
  // Proxy to tenant settings save in onboarding module
  return await import("@/app/(dashboard)/tenant/onboarding/actions").then((m) => m.saveOnboardingProgress(settings))
}

// Shim: components call updateNotificationSettings; route through onboarding's saveOnboardingProgress temporarily.
