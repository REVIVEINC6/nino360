"use client"

import { ReactNode } from "react"

interface TwoPaneProps {
  header?: ReactNode
  children: ReactNode
  right: ReactNode
  fullHeight?: boolean
}

export function TwoPane({ header, children, right, fullHeight = true }: TwoPaneProps) {
  return (
    <div className={`flex ${fullHeight ? "h-screen" : "h-full"} overflow-hidden`}>
      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {header ? <div className="px-6 pt-6">{header}</div> : null}
        <div className="flex-1 overflow-auto p-6">{children}</div>
      </div>
      {/* Right Sidebar */}
      <div className="w-80 border-l bg-muted/30">{right}</div>
    </div>
  )
}
