import { NextRequest } from 'next/server';
import { getAuthFromHeader } from '../../lib/jwt';
import { applyFieldPermissions } from '../../lib/flac';
import { ContactUpdate } from '../../lib/schemas/contact';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const claims = getAuthFromHeader(req.headers.get('authorization') || undefined);
  const id = params.id;

  // TODO: fetch contact by id and tenant scoping
  const row = { id, display_name: 'Example', email: 'john@example.com' };
  const out = await applyFieldPermissions(claims, 'contacts', row);
  return new Response(JSON.stringify(out), { status: 200 });
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const claims = getAuthFromHeader(req.headers.get('authorization') || undefined);
  const id = params.id;
  const body = await req.json().catch(() => null);
  const parsed = ContactUpdate.safeParse({ ...body, id });
  if (!parsed.success) return new Response(JSON.stringify({ error: 'invalid_payload', details: parsed.error.format() }), { status: 400 });

  // TODO: update contact in DB with tenant check
  const { id: _ignore, ...rest } = parsed.data as any;
  const updated = { id, ...rest };
  const out = await applyFieldPermissions(claims, 'contacts', updated);
  return new Response(JSON.stringify(out), { status: 200 });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const claims = getAuthFromHeader(req.headers.get('authorization') || undefined);
  const id = params.id;

  // TODO: delete contact with tenant check
  return new Response(null, { status: 204 });
}
