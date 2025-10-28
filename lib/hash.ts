import crypto from "crypto"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import "server-only"

export function sha256Hex(input: string): string {
  return crypto.createHash("sha256").update(input).digest("hex")
}

export function hashData(input: string): Promise<string> {
  return Promise.resolve(sha256Hex(input))
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
    prevHash ?? "",
    payload.action || "",
    payload.entity || "",
    payload.entityId || "",
    payload.diff ? stableStringify(payload.diff) : "",
    payload.createdAtISO ?? new Date().toISOString(),
  ]
  return sha256Hex(parts.join("|"))
}

export function stableStringify(obj: unknown): string {
  if (!obj || typeof obj !== "object") return JSON.stringify(obj)
  return JSON.stringify(obj, Object.keys(obj as any).sort())
}

export function verifyHashChain(prevHash: string, expectedPrevHash: string, recordData: string): boolean {
  // Verify that the previous hash matches what's expected
  if (prevHash !== expectedPrevHash) {
    return false
  }

  // Additional verification could be done here to recompute the hash
  // from the record data and compare it to the stored hash
  return true
}

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

  const { data: last, error: errLast } = await supabase
    .from("audit_logs")
    .select("hash")
    .eq("tenant_id", tenantId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle()

  if (errLast) throw errLast

  const prev_hash = last?.hash ?? null
  const created_at = new Date().toISOString()
  const hash = chainHash(prev_hash, {
    action,
    entity: entity ?? "",
    entityId: entityId ?? "",
    diff,
    createdAtISO: created_at,
  })

  const { error: insErr } = await supabase.from("audit_logs").insert({
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

  if (insErr) throw insErr

  return { prev_hash, hash }
}
