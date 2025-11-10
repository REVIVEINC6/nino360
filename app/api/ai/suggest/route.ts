import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Lightweight suggestion stub. Replace with real LLM call (OpenAI, Anthropic, etc.) in prod.
    const suggestion = 'If you forgot your password, click "Forgot password" to receive a reset email. You can also try signing in with a magic link.'
    return NextResponse.json({ suggestion })
  } catch (err: any) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
