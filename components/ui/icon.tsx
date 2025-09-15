import type { SVGProps } from "react"
import * as Icons from "lucide-react"

export type IconName = keyof typeof Icons

export type IconProps = SVGProps<SVGSVGElement> & {
  title?: string
}

export function Icon({ title, ...props }: IconProps) {
  // This is a generic wrapper; prefer using specific icon components directly when possible.
  const { name, ...rest } = props as any
  const IconComp = (Icons as any)[name] as React.ComponentType<any>
  if (!IconComp) return null
  return <IconComp {...(rest as any)} aria-label={title} title={title} />
}

export default Icons
