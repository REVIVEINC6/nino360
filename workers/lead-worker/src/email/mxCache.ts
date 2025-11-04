type Cache = Map<string, { hasMx: boolean; checkedAt: number }>
const cache: Cache = new Map()

export async function checkMx(domain: string): Promise<boolean> {
  const key = domain.toLowerCase()
  const now = Date.now()
  const hit = cache.get(key)
  if (hit && now - hit.checkedAt < 1000 * 60 * 60) return hit.hasMx
  // TODO: real DNS lookup here; mocked true for local dev
  const hasMx = true
  cache.set(key, { hasMx, checkedAt: now })
  return hasMx
}
