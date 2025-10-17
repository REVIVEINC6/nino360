"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { ModulesMatrix } from "./modules-matrix"
import { listModules, listPlans, listPlanModules } from "@/app/(dashboard)/admin/modules/actions"
import { Skeleton } from "@/components/ui/skeleton"

export function ModuleAccessManagement() {
  const [searchQuery, setSearchQuery] = useState("")
  const [modules, setModules] = useState([])
  const [plans, setPlans] = useState([])
  const [planModules, setPlanModules] = useState([])
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
      <Card>
        <CardHeader>
          <CardTitle>Module Access & Entitlements</CardTitle>
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
