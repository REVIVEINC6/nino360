import { createServerClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const sql = searchParams.get("sql")

  if (!sql) {
    return NextResponse.json({ error: "SQL query required" }, { status: 400 })
  }

  // Security: Only allow SELECT from rpt.* views
  if (!sql.trim().toLowerCase().startsWith("select") || !sql.includes("rpt.")) {
    return NextResponse.json({ error: "Invalid query" }, { status: 400 })
  }

  const supabase = createServerClient()
  const { data, error } = await supabase.rpc("execute_safe_query", { query_sql: sql })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (!data || data.length === 0) {
    return new NextResponse("No data", { status: 404 })
  }

  // Generate CSV
  const cols = Object.keys(data[0])
  const csv = [cols.join(","), ...data.map((row: any) => cols.map((col) => row[col]).join(","))].join("\n")

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="export-${Date.now()}.csv"`,
    },
  })
}
