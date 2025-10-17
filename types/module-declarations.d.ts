// Minimal module declarations to satisfy the TypeScript language server
// until proper types are resolved from node_modules.
declare module 'react' {
  export function useState<T = any>(initial?: T): [T, (v: any) => void]
  export function useEffect(...args: any[]): any
  export function useTransition(): [boolean, (cb: any) => void]
  const React: any
  export default React
}

declare module 'lucide-react' {
  const AnyIcon: any
  export default AnyIcon
  export const Sparkles: any
  export const TrendingUp: any
  export const AlertCircle: any
  export const Target: any
}
