import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const type = searchParams.get("type") || "projects"

  const supabase = await createServerClient()

  let data: any[] = []

  switch (type) {
    case "projects":
      const { data: projects } = await supabase.from("proj.projects").select("*")
      data = projects || []
      break
    case "tasks":
      const { data: tasks } = await supabase.from("proj.tasks").select("*")
      data = tasks || []
      break
    case "milestones":
      const { data: milestones } = await supabase.from("proj.milestones").select("*")
      data = milestones || []
      break
    case "allocations":
      const { data: allocations } = await supabase.from("proj.allocations").select("*")
      data = allocations || []
      break
  }

  // Convert to CSV
  if (data.length === 0) {
    return new NextResponse("No data found", { status: 404 })
  }

  const headers = Object.keys(data[0])
  const csv = [
    headers.join(","),
    ...data.map((row) => headers.map((h) => JSON.stringify(row[h] || "")).join(",")),
  ].join("\n")

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="${type}-export.csv"`,
    },
  })
}
