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
  // Common icons used in the codebase (loose typing to silence editor errors)
  export const Sparkles: any
  export const TrendingUp: any
  export const AlertCircle: any
  export const Target: any
  export const Users: any
  export const UserPlus: any
  export const UserMinus: any
  export const Calendar: any
  export const Clock: any
  export const FileText: any
  export const AlertTriangle: any
  export const Ticket: any
  export const MoreHorizontal: any
  export const Eye: any
  export const Edit: any
  export const Loader2: any
  export const Building2: any
  export const Plus: any
  export const Mail: any
  export const X: any
  export const MapPin: any
  export const Settings: any
  export const DollarSign: any
  export const Shield: any
  export const ChevronRight: any
  export const ArrowLeft: any
  export const ArrowRight: any
  export const CheckIcon: any
  export const CalendarIcon: any
  export const SearchIcon: any
  export const XIcon: any
  export const ChevronRightIcon: any
  export const CircleIcon: any
  export const ExternalLink: any
}
