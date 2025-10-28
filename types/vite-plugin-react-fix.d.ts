// Temporary ambient declarations to mask problematic upstream types in @vitejs/plugin-react
// This file provides minimal, compatible types that satisfy the TS compiler for our build.

declare module '@vitejs/plugin-react' {
  import type { Plugin } from 'vite'

  type BabelOptions = any
  type Options = any
  type ReactBabelOptions = any

  interface ViteReactPluginApi extends Plugin {}

  const viteReact: (opts?: Options) => ViteReactPluginApi
  const viteReactForCjs: (opts?: Options) => ViteReactPluginApi
  export type { BabelOptions, Options, ReactBabelOptions, ViteReactPluginApi }
  export default viteReact
  export { viteReactForCjs }
}
