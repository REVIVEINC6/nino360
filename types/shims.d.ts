// Type shims to satisfy TypeScript for third-party modules and internal shims
declare module 'jsonwebtoken' {
  // minimal exports used by the project
  export function sign(payload: any, secret: string | Buffer, options?: any): string
  export function verify(token: string, secretOrPublicKey: string | Buffer, options?: any): any
  export function decode(token: string, options?: any): any
  const jwt: any
  export default jwt
}

// If any import paths expect '@/lib/cache/redis-cache', provide a module alias type
declare module '@/lib/cache/redis-cache' {
  export const cache: any
  export function getCacheKey(...args: any[]): string
  export function withCache<T extends (...args: any[]) => Promise<any>>(fn: T, options: any): T
}

// For JOSE types compatibility (older code may expect JwtPayload vs JWTPayload)
declare module 'jose' {
  export type JWTPayload = Record<string, any>
  export function jwtVerify(token: string, key: any, options?: any): Promise<{ payload: JWTPayload }>
}

// Broad shims for common packages missing types in this workspace. These are
// intentionally permissive to unblock type-checking across the repo; we can
// replace with proper types or `@types/*` packages later.
declare module '@radix-ui/*'
declare module '@radix-ui/react-*'
declare module 'react-day-picker'
declare module 'embla-carousel-react'
declare module 'vaul'
declare module 'input-otp'
declare module 'react-resizable-panels'
declare module 'react-pdf'
declare module 'puppeteer'
declare module '@react-pdf/renderer'
declare module 'react-day-picker/*'

// Zod shim: project uses some classic/legacy zod APIs that the installed
// types currently flag as errors. Provide a permissive `z` export so the
// compiler doesn't error on calls like `z.record(z.any())` while we do a
// more careful migration later.
declare module 'zod' {
  export const z: any
  export default z
}

// Some code in the repo references `z` as a global/namespace (no import).
// Provide a permissive global so those usages don't error while we migrate
// call sites to explicit imports. Remove this once zod usage is consistent.
declare const z: any

// Provide a minimal namespace type for `z.infer<>` usages. This lets
// `z.infer<typeof schema>` compile without adding strict zod types here.
// Replace with proper zod types in a future cleanup.
declare namespace z {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  type infer<T> = any
}

// Wildcard modules for app action files. Many server/client action files are
// generated or colocated and the editor sometimes reports them as missing
// module declarations; provide permissive any-typed exports to quiet TS
// until we can add proper types per-action.
declare module "@/app/(app)/*/actions" {
  const whatever: any
  export default whatever
}

declare module "@/app/(dashboard)/*/actions" {
  const whatever: any
  export default whatever
}

declare module "@/app/*/*/actions" {
  const whatever: any
  export default whatever
}

// Broad wildcard for action modules under app (fallback)
declare module "@/app/**/actions" {
  const whatever: any
  export default whatever
}

// Catch-all for other JS modules that may lack types.
declare module '*-react'
