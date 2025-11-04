import { type NextRequest, NextResponse } from "next/server"
import { listMembers } from "@/app/(dashboard)/tenant/actions/directory"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const tenant_id = searchParams.get("tenant_id")

  if (!tenant_id) {
    return NextResponse.json({ error: "tenant_id required" }, { status: 400 })
  }

  try {
    const rows = await listMembers(tenant_id)
    const header = ["id", "email", "full_name", "joined_at"]
    const csv = [header.join(",")]
      .concat(rows.map((r: any) => header.map((h) => `"${String(r[h] ?? "").replaceAll('"', '""')}"`).join(",")))
      .join("\n")

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="directory_${tenant_id}.csv"`,
      },
    })
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 })
  }
}
