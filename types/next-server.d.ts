// Lightweight declaration to satisfy editor/TypeScript for imports from 'next/server'.
// This keeps the editor and build happy if Next's detailed types are not resolved.
// It's intentionally minimal — adjust or remove when the project's TypeScript/Next types
// are resolving correctly from node_modules.
declare module 'next/server' {
  // Minimal NextResponse placeholder — treated as `any` to avoid type errors in the editor.
  const NextResponse: any
  export { NextResponse }
  export default NextResponse
}
