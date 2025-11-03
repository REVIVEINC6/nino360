"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { ModulesMatrix } from "./modules-matrix"
import { listModules, listPlans, listPlanModules } from "@/app/(dashboard)/admin/modules/actions"
import { Skeleton } from "@/components/ui/skeleton"
import { Package, CreditCard, CheckCircle, TrendingUp } from "lucide-react"

export function ModuleAccessManagement() {
  const [searchQuery, setSearchQuery] = useState("")
  // Typed state to avoid `never[]` inference when arrays are empty initially
  const [modules, setModules] = useState<any[]>([])
  const [plans, setPlans] = useState<any[]>([])
  const [planModules, setPlanModules] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const [modulesData, plansData, planModulesData] = await Promise.all([
          listModules(),
          listPlans(),
          listPlanModules(),
        ])
        setModules(modulesData)
        setPlans(plansData)
        setPlanModules(planModulesData)
      } catch (error) {
        console.error("[v0] Failed to load module access data:", error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  if (loading) {
    return <Skeleton className="h-[600px] w-full" />
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="backdrop-blur-xl bg-white/70 border border-white/20 rounded-xl shadow-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-linear-to-br from-indigo-500 to-purple-500">
              <Package className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Modules</p>
              <p className="text-2xl font-bold">{modules.length}</p>
            </div>
          </div>
        </div>

        <div className="backdrop-blur-xl bg-white/70 border border-white/20 rounded-xl shadow-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-linear-to-br from-purple-500 to-pink-500">
              <CreditCard className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active Plans</p>
              <p className="text-2xl font-bold">{plans.length}</p>
            </div>
          </div>
        </div>

        <div className="backdrop-blur-xl bg-white/70 border border-white/20 rounded-xl shadow-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-linear-to-br from-pink-500 to-rose-500">
              <CheckCircle className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Enabled</p>
              <p className="text-2xl font-bold">{planModules.filter((pm) => pm.enabled).length}</p>
            </div>
          </div>
        </div>

        <div className="backdrop-blur-xl bg-white/70 border border-white/20 rounded-xl shadow-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-linear-to-br from-rose-500 to-orange-500">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Coverage</p>
              <p className="text-2xl font-bold">
                {Math.round((planModules.filter((pm) => pm.enabled).length / (modules.length * plans.length)) * 100)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      <Card className="backdrop-blur-xl bg-white/70 border border-white/20 rounded-xl shadow-xl">
        <CardHeader>
          <CardTitle className="bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Module Access & Entitlements
          </CardTitle>
          <CardDescription>Configure module access permissions per subscription plan</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search plans or modules..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <ModulesMatrix modules={modules} plans={plans} planModules={planModules} />
        </CardContent>
      </Card>
    </div>
  )
}
