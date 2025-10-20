import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  console.log("[v0] Middleware - Supabase URL exists:", !!supabaseUrl)
  console.log("[v0] Middleware - Supabase Key exists:", !!supabaseAnonKey)

  // If Supabase is not configured, allow all requests through
  if (!supabaseUrl || !supabaseAnonKey) {
    console.log("[v0] Middleware - Supabase not configured, allowing request")
    return NextResponse.next()
  }

  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
        supabaseResponse = NextResponse.next({
          request,
        })
        cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
      },
    },
  })

  // Refresh session if expired
  const {
    data: { user },
  } = await supabase.auth.getUser()

  console.log("[v0] Middleware - User authenticated:", !!user)

  // Protect vendor portal routes
  if (request.nextUrl.pathname.startsWith("/vendor") && !request.nextUrl.pathname.startsWith("/vendor/signin")) {
    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = "/vendor/signin"
      return NextResponse.redirect(url)
    }
  }

  // Protect internal routes that require authentication
  const protectedPaths = [
    "/dashboard",
    "/admin",
    "/tenant",
    "/crm",
    "/talent",
    "/bench",
    "/vms",
    "/finance",
    "/projects",
    "/reports",
    "/settings",
    "/hrms",
    "/hotlist", // Added /hotlist to protected paths
  ]
  const isProtectedPath = protectedPaths.some((path) => request.nextUrl.pathname.startsWith(path))

  if (isProtectedPath && !user) {
    const url = request.nextUrl.clone()
    url.pathname = "/signin"
    return NextResponse.redirect(url)
  }

  if ((request.nextUrl.pathname === "/signin" || request.nextUrl.pathname === "/signup") && user) {
    const url = request.nextUrl.clone()
    url.pathname = "/dashboard"
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}
