import { NextResponse } from 'next/server'

// Minimal placeholder API route to satisfy build and provide a simple echo behavior.
export async function GET() {
  return NextResponse.json({ ok: true, message: 'actions API root (GET)' })
}

export async function POST(request: Request) {
  let body: unknown = null
  try {
    body = await request.json()
  } catch (e) {
    // ignore parse errors
  }
  return NextResponse.json({ ok: true, message: 'actions API root (POST)', body })
}
