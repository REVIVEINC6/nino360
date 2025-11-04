import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { normalizeLeadRecord } from "@/lib/import/normalize"
import { parseCsv, parseTxt, parseXlsx, parseDocx, parsePdf } from "@/lib/import/parsers"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

type LeadRow = Partial<{
  first_name: string
  last_name: string
  email: string
  phone: string
  company: string
  title: string
  source: string
  notes: string
}>

async function parseByMime(file: File): Promise<LeadRow[]> {
  const mime = file.type || ""
  const buffer = Buffer.from(await file.arrayBuffer())

  if (mime.includes("csv") || file.name.endsWith(".csv")) return parseCsv(buffer)
  if (mime.includes("spreadsheet") || file.name.endsWith(".xlsx") || file.name.endsWith(".xls"))
    return parseXlsx(buffer)
  if (mime.includes("plain") || file.name.endsWith(".txt")) return parseTxt(buffer)
  if (mime.includes("word") || file.name.endsWith(".docx")) return parseDocx(buffer)
  if (mime.includes("pdf") || file.name.endsWith(".pdf")) return parsePdf(buffer)

  throw new Error("Unsupported file type. Please upload CSV, XLSX, TXT, DOCX, or PDF.")
}

export async function POST(req: Request) {
  try {
  const formData = await req.formData()
  const file = (formData as any).get("file") as File | null
  const source = ((formData as any).get("source") as string | null) || "import"

    if (!file) return NextResponse.json({ success: false, error: "No file uploaded" }, { status: 400 })

    const supabase = await createServerClient()

    // Authn + tenant
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()
    if (userError || !user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })

    const { data: profile } = await supabase.from("users").select("tenant_id").eq("id", user.id).single()
    if (!profile?.tenant_id)
      return NextResponse.json({ success: false, error: "No tenant context" }, { status: 403 })

    // Parse
    const rows = await parseByMime(file)
    if (!rows.length)
      return NextResponse.json({ success: false, error: "No rows found in file" }, { status: 400 })

    // Normalize and dedupe (by email if present)
    const normalized = rows
      .map((r) => normalizeLeadRecord(r, { defaultSource: source }))
      .filter((r) => r.email || r.first_name || r.last_name || r.company)

    const seen = new Set<string>()
    const deduped = normalized.filter((r) => {
      const key = (r.email || `${r.first_name} ${r.last_name} ${r.company}` || "").toLowerCase().trim()
      if (!key) return false
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })

    if (!deduped.length)
      return NextResponse.json({ success: false, error: "No valid records after parsing" }, { status: 400 })

    // Optional: check existing emails to avoid duplicates in DB
    const emails = deduped.map((d) => d.email).filter(Boolean) as string[]
    let existing: string[] = []
    if (emails.length) {
      const { data: exists } = await supabase
        .from("crm_leads")
        .select("email")
        .eq("tenant_id", profile.tenant_id)
        .in("email", emails)
      existing = (exists || []).map((e: any) => (e.email as string).toLowerCase())
    }

    const toInsert = deduped
      .filter((d) => !d.email || !existing.includes(d.email.toLowerCase()))
      .map((d) => ({ ...d, tenant_id: profile.tenant_id, created_by: user.id }))

    if (!toInsert.length) {
      return NextResponse.json(
        { success: true, inserted: 0, skipped: normalized.length, message: "All rows were duplicates" },
        { status: 200 },
      )
    }

    // Batch insert (chunk by 500)
    const chunkSize = 500
    let inserted = 0
    for (let i = 0; i < toInsert.length; i += chunkSize) {
      const chunk = toInsert.slice(i, i + chunkSize)
      const { error } = await supabase.from("crm_leads").insert(chunk)
      if (error) {
        console.error("Import insert error", error)
        return NextResponse.json(
          { success: false, error: "Failed to insert some records" },
          { status: 500 },
        )
      }
      inserted += chunk.length
    }

    return NextResponse.json(
      { success: true, inserted, skipped: normalized.length - inserted, total: normalized.length },
      { status: 200 },
    )
  } catch (error) {
    console.error("Leads import failed", error)
    return NextResponse.json({ success: false, error: "Import failed" }, { status: 500 })
  }
}
