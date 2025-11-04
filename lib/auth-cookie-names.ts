const DEFAULT_COOKIE_NAMES = [
  "sb-access-token",
  "sb-refresh-token",
  "supabase-auth-token",
  "supabase-session",
  "nino360-auth",
] as const

function parseEnvNames(): string[] {
  // Safe for both Edge and Node.js runtimes
  const env = process.env.NINO_SUPABASE_COOKIE_NAMES || process.env.SUPABASE_COOKIE_NAMES || ""
  if (!env) return []
  return env
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
}

export const AUTH_COOKIE_NAMES: readonly string[] = Array.from(new Set([...DEFAULT_COOKIE_NAMES, ...parseEnvNames()]))

export default AUTH_COOKIE_NAMES
