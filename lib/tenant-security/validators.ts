import { z } from "zod"

export const policiesSchema = z.object({
  mfa_required: z.boolean(),
  session_max_minutes: z.number().min(5).max(1440),
  session_idle_minutes: z.number().min(5).max(1440),
  ip_allowlist: z.array(z.string()).max(100),
  password_min_length: z.number().min(8).max(128),
  password_require_symbols: z.boolean(),
  password_require_numbers: z.boolean(),
  password_require_cases: z.boolean(),
  rolePolicies: z
    .array(
      z.object({
        role: z.enum(["tenant_admin", "manager", "member"]),
        max_minutes: z.number().min(5).max(1440).optional(),
        idle_minutes: z.number().min(5).max(1440).optional(),
      }),
    )
    .optional(),
})

export const dlpSchema = z.object({
  dlp_preset: z.enum(["standard", "strict", "custom"]),
  dlp_custom: z
    .array(
      z.object({
        name: z.string().min(1).max(100),
        pattern: z.string().min(1).max(500),
        replacement: z.string().max(100).optional(),
      }),
    )
    .max(50)
    .optional(),
})

export const ssoSchema = z.object({
  enabled: z.boolean(),
  provider: z.enum(["saml", "oidc"]).optional(),
  metadata_url: z.string().url().max(2000).optional(),
  jit_provisioning: z.boolean().optional(),
})

export const secretsReminderSchema = z.object({
  provider: z.string().min(1).max(100),
})

export const auditSearchSchema = z.object({
  q: z.string().max(200).optional(),
  actor: z.string().max(200).optional(),
  action: z.string().max(100).optional(),
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
  limit: z.number().min(1).max(500).optional(),
})

// Helper to validate CIDR notation
export function isValidCIDR(cidr: string): boolean {
  const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}\/\d{1,2}$/
  const ipv6Regex = /^([0-9a-fA-F]{0,4}:){2,7}[0-9a-fA-F]{0,4}\/\d{1,3}$/

  if (!ipv4Regex.test(cidr) && !ipv6Regex.test(cidr)) {
    return false
  }

  // Additional validation for IPv4
  if (ipv4Regex.test(cidr)) {
    const [ip, mask] = cidr.split("/")
    const octets = ip.split(".").map(Number)
    const maskNum = Number(mask)

    if (octets.some((o) => o < 0 || o > 255)) return false
    if (maskNum < 0 || maskNum > 32) return false
  }

  // Additional validation for IPv6
  if (ipv6Regex.test(cidr)) {
    const maskNum = Number(cidr.split("/")[1])
    if (maskNum < 0 || maskNum > 128) return false
  }

  return true
}

// Helper to validate regex patterns (avoid catastrophic backtracking)
export function isSafeRegex(pattern: string): boolean {
  try {
    // Check for common catastrophic backtracking patterns
    const dangerousPatterns = [/(\w+\*)+/, /(\w+\+)+/, /(\w+\*\+)+/, /($$.*$$\*)+/, /($$.*$$\+)+/]

    for (const dangerous of dangerousPatterns) {
      if (dangerous.test(pattern)) {
        return false
      }
    }

    // Try to compile the regex
    new RegExp(pattern)
    return true
  } catch {
    return false
  }
}
