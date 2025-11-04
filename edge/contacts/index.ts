import { NextRequest } from 'next/server';
import { getAuthFromHeader } from '../../lib/jwt';
import { applyFieldPermissions } from '../../lib/flac';
import { ContactCreate } from '../../lib/schemas/contact';

// NOTE: This Edge handler is a minimal scaffold. Replace db calls with your DB client.
export async function GET(req: NextRequest) {
  const claims = getAuthFromHeader(req.headers.get('authorization') || undefined);

  // TODO: replace with actual DB fetch, applying tenant filter
  const rows = [
    { id: '00000000-0000-0000-0000-000000000000', display_name: 'Example Contact', email: 'jane@example.com' },
  ];

  const out = await Promise.all(rows.map((r) => applyFieldPermissions(claims, 'contacts', r)));
  return new Response(JSON.stringify(out), { status: 200 });
}

export async function POST(req: NextRequest) {
  const claims = getAuthFromHeader(req.headers.get('authorization') || undefined);
  const body = await req.json().catch(() => null);
  const parsed = ContactCreate.safeParse(body);
  if (!parsed.success) return new Response(JSON.stringify({ error: 'invalid_payload', details: parsed.error.format() }), { status: 400 });

  // In production: insert into contacts with tenant_id from claims and return created row
  const created = { id: '00000000-0000-0000-0000-000000000001', ...parsed.data };
  const out = await applyFieldPermissions(claims, 'contacts', created);
  return new Response(JSON.stringify(out), { status: 201 });
}
