import jwt from 'jsonwebtoken';

export type JwtClaims = {
  sub: string;
  tenant_id: string;
  roles?: string[];
  exp?: number;
};

const JWT_SECRET = process.env.JWT_SECRET || 'changeme_local_secret';

export function verifyJwt(token: string): JwtClaims | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtClaims;
    return decoded;
  } catch (e) {
    return null;
  }
}

export function getAuthFromHeader(authorization?: string) {
  if (!authorization) return null;
  const parts = authorization.split(' ');
  if (parts.length !== 2) return null;
  const scheme = parts[0];
  const token = parts[1];
  if (!/^Bearer$/i.test(scheme)) return null;
  return verifyJwt(token);
}
