// Simple in-memory sliding window rate limiter. For multi-instance deployments,
// consider a shared store (e.g., Supabase table) if strict global limits are needed.

type WindowConfig = { limit: number; windowMs: number }

const windows: Record<string, WindowConfig> = {
  api: { limit: 100, windowMs: 10_000 },
  auth: { limit: 5, windowMs: 60_000 },
  ai: { limit: 20, windowMs: 60_000 },
  bulk: { limit: 10, windowMs: 3_600_000 },
  export: { limit: 30, windowMs: 3_600_000 },
}

// key => array of timestamps (ms) within the window
const counters = new Map<string, number[]>()

function prune(list: number[], since: number) {
  let i = 0
  while (i < list.length && list[i] < since) i++
  if (i > 0) list.splice(0, i)
}

export async function rateLimit(
  identifier: string,
  type: keyof typeof windows = "api",
): Promise<{ success: boolean; limit: number; remaining: number; reset: number }> {
  const cfg = windows[type]
  const key = `ratelimit:${type}:${identifier}`
  const now = Date.now()
  const since = now - cfg.windowMs
  const arr = counters.get(key) ?? []
  prune(arr, since)

  const success = arr.length < cfg.limit
  if (success) {
    arr.push(now)
    counters.set(key, arr)
  }
  const remaining = Math.max(0, cfg.limit - arr.length)
  const reset = arr.length ? arr[0] + cfg.windowMs : now + cfg.windowMs
  return { success, limit: cfg.limit, remaining, reset }
}

export function withRateLimit<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  options: {
    type?: keyof typeof windows
    identifierFn: (...args: Parameters<T>) => string
  },
): T {
  return (async (...args: Parameters<T>) => {
    const identifier = options.identifierFn(...args)
    const type = options.type ?? "api"
    const { success, limit, remaining, reset } = await rateLimit(identifier, type)
    if (!success) throw new Error(`Rate limit exceeded. Limit: ${limit}, Remaining: ${remaining}, Reset: ${new Date(reset).toISOString()}`)
    return fn(...args)
  }) as T
}
