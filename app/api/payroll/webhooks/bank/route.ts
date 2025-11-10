import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    // parse uploaded statement (CSV/OFX) from body/form-data
    // TODO: schedule importBankStatement server action
    return new Response(JSON.stringify({ ok: true }), { status: 200 })
  } catch (err) {
    return new Response(JSON.stringify({ ok: false, error: String(err) }), { status: 400 })
  }
}
