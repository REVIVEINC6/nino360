import crypto from 'crypto'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import 'server-only'

export function sha256Hex(input: string | Uint8Array): string {
  const h = crypto.createHash('sha256')
  // Node's crypto accepts Uint8Array; prefer TextEncoder for strings to avoid Buffer vs ArrayBuffer type issues
  if (typeof input === 'string') h.update(new TextEncoder().encode(input))
  else h.update(input)
  return h.digest('hex')
}

export function hashData(input: string): Promise<string> {
  return Promise.resolve(sha256Hex(input))
}

export function stableStringify(obj: unknown): string {
  if (!obj || typeof obj !== 'object') return JSON.stringify(obj)
  return JSON.stringify(obj, Object.keys(obj as any).sort())
}

export function chainHash(
  prevHash: string | null,
  payload: {
    action: string
    entity?: string | null
    entityId?: string | null
    diff?: unknown
    createdAtISO?: string
  },
): string {
  const parts = [
    prevHash ?? '',
    payload.action || '',
    payload.entity || '',
    payload.entityId || '',
    payload.diff ? stableStringify(payload.diff) : '',
    payload.createdAtISO ?? new Date().toISOString(),
  ]
  return sha256Hex(parts.join('|'))
}

export function verifyHashChain(prevHash: string, expectedPrevHash: string): boolean {
  return prevHash === expectedPrevHash
}

// Flexible supabase client type to accept the real client from callers
export type SupabaseLike = any

export async function appendAuditWithClient({
  supabase,
  tenantId,
  actorUserId,
  action,
  entity,
  entityId,
  diff,
}: {
  supabase: SupabaseLike
  tenantId: string | null
  actorUserId?: string | null
  action: string
  entity?: string | null
  entityId?: string | null
  diff?: Record<string, any>
}) {
  const r = await supabase
    .from('sec.audit_logs')
    .select('hash')
    .eq('tenant_id', tenantId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  const last = r?.data
  const errLast = r?.error

  if (errLast) throw errLast

  const prev_hash = (last as any)?.hash ?? null
  const created_at = new Date().toISOString()
  const hash = chainHash(prev_hash, {
    action,
    entity: entity ?? '',
    entityId: entityId ?? '',
    diff,
    createdAtISO: created_at,
  })

  const ins = await supabase.from('sec.audit_logs').insert({
    tenant_id: tenantId,
    actor_user_id: actorUserId ?? null,
    action,
    entity: entity ?? null,
    entity_id: entityId ?? null,
    diff: diff ?? {},
    prev_hash,
    hash,
    created_at,
  })

  const insErr = ins?.error
  if (insErr) throw insErr

  return { prev_hash, hash }
}

/**
 * Server-side convenience wrapper that creates a Supabase server client
 * using cookies and delegates to appendAuditWithClient. This preserves
 * the `appendAudit` export many modules import.
 */
export async function appendAudit({
  tenantId,
  actorUserId,
  action,
  entity,
  entityId,
  diff,
}: {
  tenantId: string | null
  actorUserId?: string | null
  action: string
  entity?: string | null
  entityId?: string | null
  diff?: Record<string, any>
}) {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet: Array<{ name: string; value: string; options?: any }>) {
          cookiesToSet.forEach(({ name, value, options }: { name: string; value: string; options?: any }) =>
            cookieStore.set(name, value, options),
          )
        },
      },
    },
  )

  return appendAuditWithClient({ supabase, tenantId, actorUserId, action, entity, entityId, diff })
}
