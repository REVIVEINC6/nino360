"use client"

import type React from "react"

import { DualSidebarLayout } from "@/components/layout/dual-sidebar-layout"

export default function ProjectManagementLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <DualSidebarLayout currentModule="project-management">{children}</DualSidebarLayout>
}
