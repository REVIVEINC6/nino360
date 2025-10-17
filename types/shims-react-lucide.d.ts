// Temporary shims to satisfy the TypeScript language server in the editor.
// These are intentionally permissive (use `any`) and should be removed
// once the workspace TypeScript server picks up proper type packages
// (e.g. @types/react or the framework-provided types).

declare module 'react' {
  // Minimal exports commonly used in function components
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

// Provide a very permissive JSX.IntrinsicElements so JSX is accepted in .tsx files
declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any
    }
  }
}

export {}
