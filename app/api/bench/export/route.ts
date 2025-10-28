import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const type = searchParams.get("type") || "consultants"
  const q = searchParams.get("q") || ""

  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: (
        {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, opts: any) {
            return cookieStore.set(name, value, opts)
          },
        } as unknown
      ) as any,
    },
  )

  try {
    let data: any[] = []
    let headers: string[] = []

    if (type === "consultants") {
      let query = supabase.from("bench.consultants").select("*")
      if (q) {
        query = query.textSearch("search_tsv", q, { type: "plain" })
      }
      const { data: rows } = await query
      data = rows || []
      headers = [
        "ID",
        "Name",
        "Email",
        "Phone",
        "WA",
        "Location",
        "Primary Skill",
        "Skills",
        "Experience",
        "Rate",
        "Status",
        "Availability",
      ]
    } else if (type === "submissions") {
      const { data: rows } = await supabase.from("bench.submissions").select("*")
      data = rows || []
      headers = ["ID", "Consultant ID", "Client", "Job Ref", "Pay Rate", "Bill Rate", "Status", "Submitted"]
    } else if (type === "placements") {
      const { data: rows } = await supabase.from("bench.placements").select("*")
      data = rows || []
      headers = ["ID", "Consultant ID", "Client", "Project", "Start Date", "End Date", "Pay Rate", "Bill Rate", "Type"]
    }

    // Generate CSV
    const csv = [
      headers.join(","),
      ...data.map((row) => {
        if (type === "consultants") {
          return [
            row.id,
            `"${row.first_name} ${row.last_name}"`,
            row.email,
            row.phone || "",
            row.work_authorization || "",
            row.location || "",
            row.primary_skill || "",
            `"${(row.skills || []).join(", ")}"`,
            row.experience_years || "",
            row.current_rate || "",
            row.status,
            row.availability_date || "",
          ].join(",")
        } else if (type === "submissions") {
          return [
            row.id,
            row.consultant_id,
            row.client_name || "",
            row.job_ref || "",
            row.pay_rate || "",
            row.bill_rate || "",
            row.status,
            row.submission_date,
          ].join(",")
        } else {
          return [
            row.id,
            row.consultant_id,
            row.client_name,
            row.project_name || "",
            row.start_date,
            row.end_date || "",
            row.pay_rate || "",
            row.bill_rate || "",
            row.employment_type,
          ].join(",")
        }
      }),
    ].join("\n")

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="bench-${type}-${Date.now()}.csv"`,
      },
    })
  } catch (error) {
    console.error("[v0] Export error:", error)
    return NextResponse.json({ error: "Export failed" }, { status: 500 })
  }
}
