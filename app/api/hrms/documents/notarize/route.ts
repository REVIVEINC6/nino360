import { NextResponse } from 'next/server'
import { notarizeDocument } from '@/app/(dashboard)/hrms/documents/actions'

export async function POST(req: Request) {
  try {
    const { documentId } = await req.json()
    const result = await notarizeDocument({ id: documentId })
    return NextResponse.json({ success: true, result })
  } catch (err: any) {
    console.error('API notarize document error', err)
    return NextResponse.json({ success: false, error: err.message || 'Failed' }, { status: 500 })
  }
}
