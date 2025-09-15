"use client"

import type React from "react"

import { CRMLayoutWrapper } from "@/components/layout/crm-layout-wrapper"

export default function CRMLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <CRMLayoutWrapper>{children}</CRMLayoutWrapper>
}
