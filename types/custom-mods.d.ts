declare module '@/app/(app)/tenant/access/actions' {
  export function getContext(): Promise<any>
  export function setFlags(opts: any): Promise<any>
  export function setPermission(opts: any): Promise<any>
  export function createRole(opts: any): Promise<any>
  export function updateRole(opts: any): Promise<any>
  export function deleteRole(id: string): Promise<any>
}

declare module '@supabase/ssr' {
  const createServerClient: any
  export { createServerClient }
}

declare module 'ai' {
  export function generateText(opts: any): Promise<any>
  export function generateObject(opts: any): Promise<any>
}
