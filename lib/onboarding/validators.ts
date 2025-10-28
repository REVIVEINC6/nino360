import { z } from "zod"

// Step 1: Profile
export const profileSchema = z.object({
  name: z.string().min(2, "Company name must be at least 2 characters"),
  region: z.string().min(2, "Region is required"),
  timezone: z.string().min(1, "Timezone is required"),
  domain: z
    .string()
    .regex(/^[a-z0-9-]{3,63}$/, "Domain must be lowercase alphanumeric with hyphens, 3-63 characters")
    .optional(),
})

export type ProfileInput = z.infer<typeof profileSchema>

// Step 2: Branding
export const brandingSchema = z.object({
  logoFile: z.string().optional(), // base64 or URL
  colorPrimary: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, "Invalid hex color")
    .optional(),
  colorAccent: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, "Invalid hex color")
    .optional(),
})

export type BrandingInput = z.infer<typeof brandingSchema>

// Step 3: Policies
export const policiesSchema = z.object({
  securityMd: z.string().min(10, "Security policy is required"),
  privacyMd: z.string().min(10, "Privacy policy is required"),
  usageMd: z.string().min(10, "Usage policy is required"),
})

export type PoliciesInput = z.infer<typeof policiesSchema>

// Step 4: Integrations
export const integrationSchema = z.object({
  provider: z.enum(["google_calendar", "email", "slack"]),
  tokenOrWebhook: z.string().min(1, "Token or webhook URL is required"),
})

export type IntegrationInput = z.infer<typeof integrationSchema>

// Step 5: Import
export const importSchema = z.object({
  kind: z.enum(["contacts", "candidates"]),
  file: z.string(), // base64 CSV content
})

export type ImportInput = z.infer<typeof importSchema>

// Step 6: Role Matrix
export const roleMatrixSchema = z.object({
  grants: z.array(
    z.object({
      roleKey: z.string(),
      permissionKey: z.string(),
      allowed: z.boolean(),
    }),
  ),
})

export type RoleMatrixInput = z.infer<typeof roleMatrixSchema>

// Step 7: Feature Flags
export const featureFlagsSchema = z.object({
  flags: z.record(z.string(), z.boolean()),
})

export type FeatureFlagsInput = z.infer<typeof featureFlagsSchema>

// Step 8: Invites
export const invitesSchema = z.object({
  invites: z.array(
    z.object({
      email: z.string().email("Invalid email address"),
      role: z.string().min(1, "Role is required"),
    }),
  ),
})

export type InvitesInput = z.infer<typeof invitesSchema>
