import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "File required" }, { status: 400 })
    }

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookies().get(name)?.value
          },
        },
      },
    )

    // Upload to storage
    const path = `resumes/${crypto.randomUUID()}_${file.name}`
    const { error: uploadError } = await supabase.storage.from("resumes").upload(path, await file.arrayBuffer(), {
      contentType: file.type,
      upsert: false,
    })

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 400 })
    }

    // Get signed URL
    const { data: urlData } = await supabase.storage.from("resumes").createSignedUrl(path, 60 * 60 * 24) // 24 hours

    // TODO: Call AI parse resume function
    // For now, return mock parsed data
    const parsed = {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      skills: [],
      summary: "",
      experience_years: 0,
    }

    return NextResponse.json({
      path,
      signedUrl: urlData?.signedUrl,
      parsed,
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
