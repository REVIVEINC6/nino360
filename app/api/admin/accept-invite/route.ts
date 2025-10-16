import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

const schema = z.object({
  token: z.string(),
  user_id: z.string().uuid(),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { token, user_id } = schema.parse(body)

    const cookieStore = cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
        },
      },
    )

    // Use the database function to accept invitation
    const { data, error } = await supabase.rpc("accept_invitation", {
      _token: token,
      _user_id: user_id,
    })

    if (error) {
      console.error("[v0] Error accepting invitation:", error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    if (data && data.error) {
      return NextResponse.json({ error: data.error }, { status: 400 })
    }

    console.log("[v0] Invitation accepted successfully")

    return NextResponse.json({ ok: true, tenant_id: data?.tenant_id })
  } catch (error) {
    console.error("[v0] Error in accept-invite route:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 })
  }
}
