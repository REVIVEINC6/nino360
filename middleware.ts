import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  if (
    request.nextUrl.pathname.startsWith("/_next") ||
    request.nextUrl.pathname.startsWith("/api/health") ||
    request.nextUrl.pathname.startsWith("/api/docs") ||
    request.nextUrl.pathname.startsWith("/api/auth") ||
    request.nextUrl.pathname.includes(".") ||
    request.nextUrl.pathname === "/login" ||
    request.nextUrl.pathname === "/register" ||
    request.nextUrl.pathname === "/"
  ) {
    return NextResponse.next()
  }

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Lightweight check: do not import Node-only Supabase SDK inside middleware (Edge runtime).
  // Instead, check for presence of an auth cookie and redirect to login when missing.
  // Note: this is a pragmatic check to avoid Edge runtime incompatibilities. For full
  // token verification, perform verification server-side (API route or server component).
  const possibleCookieNames = ["sb-access-token", "sb:token", "supabase-auth-token"]
  const hasAuthCookie = possibleCookieNames.some((name) => Boolean(request.cookies.get(name)))

  if (!hasAuthCookie) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("redirect", request.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  return response
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
