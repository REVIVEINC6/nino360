import { createServerClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")

  // Prepare the redirect response first so we can attach cookies to it
  const redirectResponse = NextResponse.redirect(new URL("/dashboard", request.url))

  if (code) {
    const supabase = await createServerClient()

    try {
      await supabase.auth.exchangeCodeForSession(code)
    } catch (e) {
      // If exchange fails, redirect to login with an error param
      const failUrl = new URL("/login", request.url)
      failUrl.searchParams.set("error", "auth_failed")
      return NextResponse.redirect(failUrl)
    }
  }

  // Return the redirect response which has had Supabase cookies attached (if any)
  return redirectResponse
}
