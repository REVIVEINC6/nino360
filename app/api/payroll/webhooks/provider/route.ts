import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  // Minimal provider webhook handler stub
  try {
    const payload = await req.json()
    // validate signature, idempotency, etc. (omitted)
    // TODO: dispatch to server action to match provider_txn to payroll_lines
    return new Response(JSON.stringify({ ok: true }), { status: 200 })
  } catch (err) {
    return new Response(JSON.stringify({ ok: false, error: String(err) }), { status: 400 })
  }
}
