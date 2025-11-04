import { NextResponse } from "next/server"
import { exportOpportunitiesCsv } from "@/app/(dashboard)/crm/analytics/actions"

export async function GET() {
  const { csv } = await exportOpportunitiesCsv()
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="opportunities.csv"`,
    },
  })
}
