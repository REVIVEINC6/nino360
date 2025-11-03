import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import crypto from "crypto"

export async function POST(req: NextRequest) {
  try {
    // Support either multipart FormData uploads or a JSON payload with a base64 `file` field.
    const contentType = req.headers.get("content-type") || ""
    let file: File | null = null
    let buffer: Buffer | null = null
    let filename = "upload"
    let fileType = "application/octet-stream"

    if (contentType.includes("application/json")) {
      const body = await req.json()
      if (!body?.file) return NextResponse.json({ error: "File required" }, { status: 400 })
      buffer = Buffer.from(body.file, "base64")
      filename = body.filename || body.name || filename
      fileType = body.contentType || body.type || fileType
    } else {
      // FormData path
      const formData = (await req.formData()) as any
      const fileRaw = formData.get("file")

      // runtime guard: ensure something was uploaded and that it has an arrayBuffer function
      if (!fileRaw || typeof (fileRaw as any).arrayBuffer !== "function") {
        return NextResponse.json({ error: "File required" }, { status: 400 })
      }

      file = fileRaw as File
      filename = file.name || filename
      fileType = file.type || fileType
    }

    const cookieStore = await cookies()

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

    // Upload to storage
    const path = `resumes/${crypto.randomUUID()}_${filename}`
    const uploadPayload = buffer ? buffer : await file!.arrayBuffer()
    const { error: uploadError } = await supabase.storage.from("resumes").upload(path, uploadPayload, {
      contentType: fileType,
      upsert: false,
    })

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 400 })
    }

    // Get signed URL
    const { data: urlData } = await supabase.storage.from("resumes").createSignedUrl(path, 60 * 60 * 24) // 24 hours

    // Try a lightweight, heuristic parse of the uploaded file if possible.
    async function parseText(bufferOrArrayBuffer: Buffer | ArrayBuffer) {
      try {
        // Convert to string assuming UTF-8; for PDFs we'd normally run OCR or use pdf-parse
        const buf = Buffer.isBuffer(bufferOrArrayBuffer) ? bufferOrArrayBuffer : Buffer.from(bufferOrArrayBuffer)
        const text = buf.toString("utf8")

        const emailMatch = text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)
        const phoneMatch = text.match(/\+?[0-9]{7,15}/)
        const nameMatch = text.match(/([A-Z][a-z]+)\s+([A-Z][a-z]+)/)

        const skills: string[] = []
        // Very naive skills extraction: look for common skill words
        const skillCandidates = ["JavaScript", "TypeScript", "React", "Node", "Python", "SQL", "Postgres", "AWS"]
        skillCandidates.forEach((s) => {
          if (text.includes(s)) skills.push(s)
        })

        return {
          first_name: nameMatch ? nameMatch[1] : "",
          last_name: nameMatch ? nameMatch[2] : "",
          email: emailMatch ? emailMatch[0] : "",
          phone: phoneMatch ? phoneMatch[0] : "",
          skills,
          summary: text.substring(0, 512),
          experience_years: 0,
        }
      } catch (e) {
        return { first_name: "", last_name: "", email: "", phone: "", skills: [], summary: "", experience_years: 0 }
      }
    }

    const uploadPayloadBuffer = buffer ? buffer : Buffer.from(await file!.arrayBuffer())
    const parsed = await parseText(uploadPayloadBuffer)

    return NextResponse.json({ path, signedUrl: urlData?.signedUrl, parsed })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
