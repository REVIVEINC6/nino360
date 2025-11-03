import { NextResponse } from 'next/server'
import { analyzeDocument } from '@/app/(dashboard)/crm/actions/documents'

export async function POST(req: Request) {
  try {
    const { documentId } = await req.json()
    const result = await analyzeDocument(documentId)
    return NextResponse.json({ success: true, result })
  } catch (err: any) {
    console.error('API analyze document error', err)
    return NextResponse.json({ success: false, error: err.message || 'Failed' }, { status: 500 })
  }
}
