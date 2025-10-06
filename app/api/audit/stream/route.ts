import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const tenantId = req.headers.get('x-tenant-id')
  if (!tenantId) return NextResponse.json({ error: 'missing_tenant' }, { status: 400 })

  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(`data: ${JSON.stringify({ message: 'connected' })}\n\n`)
      // For scaffold: send a ping every 10s
      let i = 0
      const id = setInterval(() => {
        controller.enqueue(`data: ${JSON.stringify({ ts: Date.now(), tick: ++i })}\n\n`)
      }, 10000)
      ;(controller as any).oncancel = () => clearInterval(id)
    }
  })

  return new Response(stream, { headers: { 'Content-Type': 'text/event-stream' } })
}
