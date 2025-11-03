import { NextResponse, type NextRequest } from "next/server"
// Supabase User type isn't exported from the runtime package in this environment.
// Use a lightweight any type for middleware checks to avoid hard dependency on library types.
type SupabaseUser = any
import AUTH_COOKIE_NAMES from "./lib/auth-cookie-names"
import { checkRateLimit } from "./lib/auth/security/rate-limiter-core"
import { getDeviceFingerprint } from "./lib/auth/security/device-fingerprint"
import { detectAnomalies } from "./lib/auth/security/ai-anomaly-detection"

export async function middleware(request: NextRequest) {
  // Edge-compatible middleware: avoid importing Supabase client (which bundles Node-only APIs)

  // Heuristic: only call Supabase if there is an auth-related cookie present
  const cookieList = request.cookies.getAll() || []
  const cookieNames = cookieList.map((c) => c.name)

  const hasAuthCookie = cookieNames.some((n) => AUTH_COOKIE_NAMES.includes(n))

  const clientIp = request.ip || request.headers.get("x-forwarded-for") || "unknown"
  const rateLimitKey = `middleware:${clientIp}`

  try {
    const rateLimitResult = await checkRateLimit(rateLimitKey, "api")
    if (!rateLimitResult.allowed) {
      return new NextResponse("Too Many Requests", {
        status: 429,
        headers: {
          "Retry-After": Math.ceil((rateLimitResult.resetAt.getTime() - Date.now()) / 1000).toString(),
        },
      })
    }
  } catch (error) {
    // Continue without rate limiting if it fails
  }

  // Lightweight auth signal: presence of Supabase auth cookies.
  // Precise session validation is handled in server routes/components.
  let userAuthenticated = hasAuthCookie

  // Allow enabling auth checks in development via env.
  // By default we enable auth in all environments unless explicitly turned off.
  const enableDevAuth = process.env.NEXT_PUBLIC_ENABLE_DEV_AUTH !== "0" && process.env.NEXT_PUBLIC_ENABLE_DEV_AUTH !== "false"

  if (request.nextUrl.pathname.startsWith("/vendor") && !request.nextUrl.pathname.startsWith("/vendor/signin")) {
    if (!userAuthenticated) {
      const url = request.nextUrl.clone()
      url.pathname = "/vendor/signin"
      return NextResponse.redirect(url)
    }
  }

  // For development and production, optionally redirect unauthenticated users away
  // from protected pages to the login page. This keeps dev behavior closer to prod
  // and can be toggled with NEXT_PUBLIC_ENABLE_DEV_AUTH (set to "0" or "false" to disable).
  if (enableDevAuth && !userAuthenticated) {
    // Load protected prefixes from env var (comma-separated) e.g.
    // NEXT_PUBLIC_PROTECTED_PREFIXES="/dashboard,/tenant,/admin". If not set,
    // attempt to load a JSON file at `config/protected-prefixes.json` with an
    // array of prefixes. Finally, fall back to a conservative default list.
    let protectedPrefixes: string[] = []
    const env = process.env.NEXT_PUBLIC_PROTECTED_PREFIXES
    if (env && env.trim()) {
      protectedPrefixes = env.split(",").map((s) => s.trim()).filter(Boolean)
    } else {
      try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const cfg = require("./config/protected-prefixes.json")
        if (Array.isArray(cfg)) protectedPrefixes = cfg.map((s) => String(s))
      } catch {
        // no config file: fall back to defaults
      }
    }
    if (protectedPrefixes.length === 0) {
      protectedPrefixes = ["/dashboard", "/tenant", "/admin", "/crm", "/projects", "/profile", "/settings"]
    }

    const isProtected = protectedPrefixes.some((p) => request.nextUrl.pathname === p || request.nextUrl.pathname.startsWith(p + "/"))
    if (isProtected) {
      const url = request.nextUrl.clone()
      url.pathname = "/login"
      return NextResponse.redirect(url)
    }
  }

  // If already authenticated and visiting auth pages, send to dashboard
  const authEntryPaths = new Set(["/login", "/signup", "/verify-otp"]) // add more if needed
  if (userAuthenticated && authEntryPaths.has(request.nextUrl.pathname)) {
    const nextParam = request.nextUrl.searchParams.get("next")
    const url = request.nextUrl.clone()
    url.pathname = nextParam && nextParam.startsWith("/") ? nextParam : "/dashboard"
    url.search = ""
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}
