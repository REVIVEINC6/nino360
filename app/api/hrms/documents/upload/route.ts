import { NextResponse } from "next/server"
import { uploadDocument } from "@/app/(dashboard)/hrms/documents/actions"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const result = await uploadDocument(body)
    return NextResponse.json(result)
  } catch (err: any) {
    console.error('API hrms upload error', err)
    return NextResponse.json({ error: err.message || 'Failed' }, { status: 500 })
  }
}
