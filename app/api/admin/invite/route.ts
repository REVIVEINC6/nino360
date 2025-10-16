import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

const schema = z.object({
  email: z.string().email(),
  role_id: z.string().uuid(),
  tenant_id: z.string().uuid(),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, role_id, tenant_id } = schema.parse(body)

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

    // Generate unique token
    const token = crypto.randomUUID() + crypto.randomUUID()

    // Create invitation
    const { data, error } = await supabase
      .from("invitations")
      .insert({
        email,
        role_id,
        tenant_id,
        token,
      })
      .select("id, token")
      .single()

    if (error) {
      console.error("[v0] Error creating invitation:", error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // TODO: Send email via edge function
    // For now, just return the invitation link
    const inviteLink = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/accept-invite?token=${data.token}`

    console.log("[v0] Invitation created:", inviteLink)

    return NextResponse.json({
      ok: true,
      invitation_id: data.id,
      invite_link: inviteLink,
    })
  } catch (error) {
    console.error("[v0] Error in invite route:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 })
  }
}
