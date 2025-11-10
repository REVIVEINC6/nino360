import { NextResponse } from 'next/server'
import { deleteAccount } from '@/app/(dashboard)/crm/actions/accounts'

export async function POST(req: Request) {
  try {
    const { id } = await req.json()
    const result = await deleteAccount(id)
    return NextResponse.json(result)
  } catch (err: any) {
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 })
  }
}
