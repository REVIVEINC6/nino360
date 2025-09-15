import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Profile | Nino360 Platform", // Updated from ESG OS Platform to Nino360 Platform
  description: "Manage your profile settings and preferences",
}

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
