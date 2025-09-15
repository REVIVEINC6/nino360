"use client"

import type React from "react"
import { AdminLayoutWrapper } from "@/components/layout/admin-layout-wrapper"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AdminLayoutWrapper>{children}</AdminLayoutWrapper>
}
