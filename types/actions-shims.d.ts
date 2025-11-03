// Quick shim to reduce TS noise for wildcard action module imports used across the app
// These modules are frequently imported with a glob import pattern like "@/app/(app)/*/actions"
// and TypeScript can report missing exported members when the actions files export defaults or vary.

// Broad wildcard shims for action module import patterns used across the codebase.
// These are temporary and will be replaced with more precise types in the next pass.
declare module "@/app/(app)/*/actions" {
  const anyExport: any
  export default anyExport
}

declare module "@/app/(dashboard)/*/actions" {
  const anyExport: any
  export default anyExport
}

declare module "@/app/**/actions" {
  const anyExport: any
  export default anyExport
}

declare module "@/app/*/*/actions" {
  const anyExport: any
  export default anyExport
}

// Generic wildcard fallback
declare module "@/*/actions" {
  const anyExport: any
  export default anyExport
}

declare module "@/app/*/actions" {
  const anyExport: any
  export default anyExport
}
