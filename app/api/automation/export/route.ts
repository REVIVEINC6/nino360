import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const type = searchParams.get("type") || "alerts"

  const supabase = await createServerClient()

  try {
    let data: any[] = []

    if (type === "alerts") {
      const { data: alerts } = await supabase
        .from("auto.alerts")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1000)
      data = alerts || []
    } else if (type === "executions") {
      const { data: executions } = await supabase
        .from("auto.executions")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1000)
      data = executions || []
    }

    // Convert to CSV
    if (data.length === 0) {
      return new NextResponse("No data to export", { status: 404 })
    }

    const headers = Object.keys(data[0])
    const csv = [
      headers.join(","),
      ...data.map((row) =>
        headers
          .map((header) => {
            const value = row[header]
            if (value === null || value === undefined) return ""
            if (typeof value === "object") return JSON.stringify(value)
            return `"${String(value).replace(/"/g, '""')}"`
          })
          .join(","),
      ),
    ].join("\n")

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="${type}-${new Date().toISOString()}.csv"`,
      },
    })
  } catch (error) {
    console.error("[v0] Export error:", error)
    return new NextResponse("Export failed", { status: 500 })
  }
}
