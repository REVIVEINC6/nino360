import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  // do not throw in module scope to avoid breaking dev server; helpers will guard
  console.warn('supabase server env not fully configured')
}

export const serverClient = createClient(SUPABASE_URL || '', SUPABASE_SERVICE_ROLE_KEY || '')

export async function getTenantIdFromRequest(req?: Request) {
  // prefer header then fall back to cookie
  try {
    if (req) {
      const h = (req.headers as any).get?.('x-tenant-id')
      if (h) return h
    }
  } catch {}
  return undefined
}

export default serverClient
