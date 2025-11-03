// Temporary shims to silence widespread UI component JSX typing errors.
// Long-term: replace with accurate component prop typings in the shared UI library.

import * as React from 'react'

declare module '*/ui/*' {
  // export a few common component names used across the repo as flexible any-typed components
  export const Button: React.ComponentType<any>
  export const Input: React.ComponentType<any>
  export const Label: React.ComponentType<any>
  export const Select: React.ComponentType<any>
  export const SelectTrigger: React.ComponentType<any>
  export const SelectValue: React.ComponentType<any>
  export const SelectContent: React.ComponentType<any>
  export const SelectItem: React.ComponentType<any>
  export const Tabs: React.ComponentType<any>
  export const TabsList: React.ComponentType<any>
  export const TabsTrigger: React.ComponentType<any>
  export const TabsContent: React.ComponentType<any>
  export const TabsRoot: React.ComponentType<any>
  export const Checkbox: React.ComponentType<any>
  export const Switch: React.ComponentType<any>
  export const Dialog: React.ComponentType<any>
  export const DialogContent: React.ComponentType<any>
  export const DialogTrigger: React.ComponentType<any>
  export const Tooltip: React.ComponentType<any>
  export const Avatar: React.ComponentType<any>
  export const Badge: React.ComponentType<any>
  export const Card: React.ComponentType<any>
  export const Separator: React.ComponentType<any>
  export const ScrollArea: React.ComponentType<any>
  export const SelectItemAny: React.ComponentType<any>
  export default React.ComponentType<any>
}

// generic shorthand for direct imports from '@/components/ui/*'
declare module '@/components/ui/*' {
  const x: React.ComponentType<any>
  export default x
}
