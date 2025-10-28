import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Training & LMS | Nino360",
  description: "Learning management system for workforce upskilling",
}

export default function TrainingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
