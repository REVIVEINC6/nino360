import { NextResponse } from 'next/server'
import { upsertDocument } from '@/app/(dashboard)/crm/actions/documents'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const result = await upsertDocument(body)
    return NextResponse.json(result)
  } catch (err: any) {
    console.error('API create document error', err)
    return NextResponse.json({ error: err.message || 'Failed' }, { status: 500 })
  }
}
