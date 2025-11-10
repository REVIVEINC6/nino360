// Make the `@/` path alias resolvable to TypeScript and editor tools during tests.
// Provide permissive declarations for imports starting with `@/` so the editor
// and test runner don't complain about path alias resolution in environments
// where the bundler/resolver isn't active.

declare module "@/*" {
  const value: any
  export default value
  // Named exports are not known statically here; consumers should type them as `any`.
}

declare module "@/*/*" {
  const value: any
  export default value
}

// Add specific deeper patterns that some tools require for resolution
declare module "@/lib/*" {
  const value: any
  export default value
}

declare module "@/lib/*/*" {
  const value: any
  export default value
}

declare module "@/lib/*/*/*" {
  const value: any
  export default value
}
