import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const type = searchParams.get("type") || "vendors"

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
    let filename = "export.csv"

    switch (type) {
      case "vendors":
        const { data: vendors } = await supabase.from("vms.tenant_vendors").select("*, vendor:vms.vendor_orgs(*)")
        data = vendors || []
        filename = "vendors.csv"
        break
      case "submissions":
        const { data: submissions } = await supabase.from("vms.submissions").select("*")
        data = submissions || []
        filename = "submissions.csv"
        break
      case "invoices":
        const { data: invoices } = await supabase.from("vms.invoices").select("*")
        data = invoices || []
        filename = "invoices.csv"
        break
    }

    // Convert to CSV
    if (data.length === 0) {
      return NextResponse.json({ error: "No data to export" }, { status: 404 })
    }

    const headers = Object.keys(data[0])
    const csv = [
      headers.join(","),
      ...data.map((row) => headers.map((h) => JSON.stringify(row[h] || "")).join(",")),
    ].join("\n")

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
