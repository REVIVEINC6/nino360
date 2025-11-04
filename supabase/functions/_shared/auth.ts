import { JWTPayload, jwtVerify } from 'jose'

export interface AuthContext {
  tenantId: string
  userId: string
  roles: string[]
}

export async function verifyAuth(authorization?: string): Promise<AuthContext> {
  if (!authorization) throw new Error('Missing Authorization header')
  const token = authorization.replace(/^Bearer\s+/i, '')
  const publicKey = process.env.JWT_PUBLIC_KEY
  if (!publicKey) throw new Error('JWT_PUBLIC_KEY not configured')
  const { payload } = await jwtVerify(token, new TextEncoder().encode(publicKey))
  const p = payload as JWTPayload
  const tenantId = String(p['tenant_id'] || '')
  const userId = String(p['sub'] || '')
  const roles = (p['roles'] as string[]) || []
  if (!tenantId) throw new Error('Missing tenant_id in token')
  return { tenantId, userId, roles }
}
