"use client"

import type React from "react"
import { HRMSLayoutWrapper } from "@/components/layout/hrms-layout-wrapper"

export default function HRMSLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <HRMSLayoutWrapper>{children}</HRMSLayoutWrapper>
}
