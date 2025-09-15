"use client"

import type { ReactNode } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"
import { DashboardContent } from "@/components/dashboard-content"
import { CRMModule } from "@/components/modules/crm-module"
import { TalentModule } from "@/components/modules/talent-module"
import { BenchModule } from "@/components/modules/bench-module"
import { HotlistModule } from "@/components/modules/hotlist-module"
import { HRMSModule } from "@/components/modules/hrms-module"
import { FinanceModule } from "@/components/modules/finance-module"
import { VMSModule } from "@/components/modules/vms-module"
import { TrainingModule } from "@/components/modules/training-module"
import { TenantModule } from "@/components/modules/tenant-module"
import { AdminModule } from "@/components/modules/admin-module"
import { SettingsModule } from "@/components/modules/settings-module"

interface MainContentProps {
  children: ReactNode
  className?: string
}

export function MainContent({ children, className }: MainContentProps) {
  const pathname = usePathname()
  const [isLoading, setIsLoading] = useState(true)
  const [isOnline, setIsOnline] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Extract current module from pathname
  const pathSegments = pathname.split("/").filter(Boolean)
  const currentModule = pathSegments[0] || "dashboard"
  const currentPage = pathname

  // Handle online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  // Simulate loading state
  useEffect(() => {
    setIsLoading(true)
    setError(null)

    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [pathname])

  // Error boundary simulation
  const handleError = (error: Error) => {
    console.error("Main content error:", error)
    setError(error.message)
    setIsLoading(false)
  }

  // Get the appropriate module component
  const getModuleComponent = () => {
    try {
      switch (currentModule) {
        case "dashboard":
          return <DashboardContent />
        case "crm":
          return <CRMModule />
        case "talent":
          return <TalentModule />
        case "bench":
          return <BenchModule />
        case "hotlist":
          return <HotlistModule />
        case "hrms":
          return <HRMSModule />
        case "finance":
          return <FinanceModule />
        case "vms":
          return <VMSModule />
        case "training":
          return <TrainingModule />
        case "tenant":
          return <TenantModule />
        case "admin":
          return <AdminModule />
        case "settings":
          return <SettingsModule />
        default:
          return (
            <div className="flex items-center justify-center h-96">
              <Card className="w-96 bg-white/60 backdrop-blur-sm border-white/20 shadow-xl">
                <CardContent className="flex flex-col items-center justify-center p-8 text-center">
                  <AlertCircle className="h-12 w-12 text-orange-500 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Module Not Found</h3>
                  <p className="text-muted-foreground">The requested module "{currentModule}" could not be found.</p>
                </CardContent>
              </Card>
            </div>
          )
      }
    } catch (error) {
      handleError(error as Error)
      return null
    }
  }

  // Loading skeleton
  const LoadingSkeleton = () => (
    <div className="space-y-6 p-6">
      <div className="space-y-2">
        <div className="h-8 w-64 bg-gray-200 rounded animate-pulse" />
        <div className="h-4 w-96 bg-gray-200 rounded animate-pulse" />
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white/60 backdrop-blur-sm border-white/20 rounded animate-pulse">
            <div className="p-6">
              <div className="space-y-3">
                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                <div className="h-8 w-16 bg-gray-200 rounded animate-pulse" />
                <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="bg-white/60 backdrop-blur-sm border-white/20 rounded animate-pulse">
          <div className="p-6">
            <div className="h-64 w-full bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
        <div className="bg-white/60 backdrop-blur-sm border-white/20 rounded animate-pulse">
          <div className="p-6">
            <div className="h-64 w-full bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  )

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-96 p-6">
        <div className="w-full max-w-md bg-white/60 backdrop-blur-sm border-white/20 shadow-xl rounded animate-pulse">
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <div className="h-12 w-12 text-red-500 mb-4 bg-gray-200 rounded animate-pulse" />
            <div className="text-lg font-semibold mb-2">Something went wrong</div>
            <div className="text-muted-foreground mb-4">{error}</div>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <motion.main
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={cn(
        "flex-1 overflow-auto bg-gradient-to-br from-white/40 to-blue-50/40 backdrop-blur-sm",
        "scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent",
        className,
      )}
    >
      <div className="min-h-full p-6">{isLoading ? <LoadingSkeleton /> : children || getModuleComponent()}</div>
      {/* Offline Banner */}
      {!isOnline && (
        <div className="m-4 border-orange-200 bg-orange-50 rounded animate-pulse">
          <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
          <div className="text-muted-foreground">You're currently offline. Some features may not be available.</div>
        </div>
      )}

      {/* Online Status Indicator */}
      <div className="fixed bottom-4 right-4 z-50">
        <div
          className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium shadow-lg backdrop-blur-sm ${
            isOnline
              ? "bg-green-100/80 text-green-800 border border-green-200"
              : "bg-red-100/80 text-red-800 border border-red-200"
          }`}
        >
          {isOnline ? <div className="h-4 w-4 bg-green-500 rounded" /> : <div className="h-4 w-4 bg-red-500 rounded" />}
          {isOnline ? "Online" : "Offline"}
        </div>
      </div>
    </motion.main>
  )
}
