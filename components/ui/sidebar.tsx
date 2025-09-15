"use client"

import * as React from "react"
import { PanelLeft } from "lucide-react"

import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { TooltipProvider } from "@/components/ui/tooltip"

type SidebarContextType = {
  open: boolean
  setOpen: (open: boolean) => void
  isMobile: boolean
  toggle: () => void
}

const SidebarContext = React.createContext<SidebarContextType | undefined>(undefined)

export function useSidebar() {
  const ctx = React.useContext(SidebarContext)
  if (!ctx) throw new Error("useSidebar must be used within SidebarProvider")
  return ctx
}

export const SidebarProvider: React.FC<React.PropsWithChildren<{ defaultOpen?: boolean }>> = ({
  defaultOpen = true,
  children,
}) => {
  const isMobile = useIsMobile()
  const [open, setOpen] = React.useState<boolean>(defaultOpen)
  const toggle = React.useCallback(() => setOpen((o) => !o), [])

  return (
    <SidebarContext.Provider value={{ open, setOpen, isMobile, toggle }}>
      <TooltipProvider delayDuration={0}>{children}</TooltipProvider>
    </SidebarContext.Provider>
  )
}

export const Sidebar: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ children, className }) => {
  return <aside className={cn("w-64 bg-white", className)}>{children}</aside>
}

export const SidebarTrigger: React.FC<{ className?: string }> = ({ className }) => {
  const { toggle } = useSidebar()

  return (
    <Button variant="ghost" size="icon" className={cn("h-7 w-7", className)} onClick={toggle}>
      <PanelLeft />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  )
}

export const SidebarInset: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ children, className }) => {
  return <main className={cn("flex-1 flex flex-col min-w-0", className)}>{children}</main>
}

export default Sidebar
