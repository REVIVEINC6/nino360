"use client"

import type React from "react"
import { TalentLayoutWrapper } from "@/components/layout/talent-layout-wrapper"

export default function TalentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <TalentLayoutWrapper>{children}</TalentLayoutWrapper>
}
