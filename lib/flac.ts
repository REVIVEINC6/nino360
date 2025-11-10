import { JwtClaims } from './jwt';

export type FieldPermission = 'hidden' | 'masked' | 'read' | 'write';

// Minimal stub: in production this should query field_permissions table.
export async function applyFieldPermissions(
  claims: JwtClaims | null,
  resource: string,
  data: Record<string, any>
): Promise<Record<string, any>> {
  if (!claims) return maskAll(data);

  // Example: mask email field for demonstration if present
  const out: Record<string, any> = { ...data };
  if (resource === 'contacts' && out.email) {
    out.email = maskEmail(String(out.email));
  }
  return out;
}

function maskEmail(email: string) {
  const [local, domain] = email.split('@');
  if (!domain) return '***';
  return local.slice(0, 1) + '***@' + domain;
}

function maskAll(data: Record<string, any>) {
  const out: Record<string, any> = {};
  for (const k of Object.keys(data)) out[k] = null;
  return out;
}
