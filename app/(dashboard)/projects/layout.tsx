import type React from "react"
import { Suspense } from "react"

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-6">
      <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
    </div>
  )
}
