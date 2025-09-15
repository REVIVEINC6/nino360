"use client"

import { useState, useEffect } from "react"
import type {
  BillingAccount,
  BillingStats,
  SubscriptionPlan,
  Invoice,
  ChurnRiskTenant,
  RevenueProjection,
} from "@/lib/types/billing"

export function useBilling() {
  const [accounts, setAccounts] = useState<BillingAccount[]>([])
  const [stats, setStats] = useState<BillingStats | null>(null)
  const [plans, setPlans] = useState<SubscriptionPlan[]>([])
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [churnRisk, setChurnRisk] = useState<ChurnRiskTenant[]>([])
  const [projections, setProjections] = useState<RevenueProjection[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchBillingData = async () => {
    try {
      setLoading(true)
      setError(null)

      const [accountsRes, statsRes, plansRes, churnRes, projectionsRes] = await Promise.all([
        fetch("/api/billing/accounts"),
        fetch("/api/billing/stats"),
        fetch("/api/billing/plans"),
        fetch("/api/billing/churn-risk"),
        fetch("/api/billing/projections"),
      ])

      if (!accountsRes.ok || !statsRes.ok || !plansRes.ok || !churnRes.ok || !projectionsRes.ok) {
        throw new Error("Failed to fetch billing data")
      }

      const [accountsData, statsData, plansData, churnData, projectionsData] = await Promise.all([
        accountsRes.json(),
        statsRes.json(),
        plansRes.json(),
        churnRes.json(),
        projectionsRes.json(),
      ])

      setAccounts(accountsData.accounts || [])
      setStats(statsData.stats)
      setPlans(plansData.plans || [])
      setChurnRisk(churnData.tenants || [])
      setProjections(projectionsData.projections || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const updateBillingAccount = async (accountId: string, updates: Partial<BillingAccount>) => {
    try {
      const response = await fetch(`/api/billing/accounts/${accountId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      })

      if (!response.ok) {
        throw new Error("Failed to update billing account")
      }

      const updatedAccount = await response.json()
      setAccounts((prev) => prev.map((acc) => (acc.id === accountId ? updatedAccount.account : acc)))

      // Refresh stats after update
      const statsRes = await fetch("/api/billing/stats")
      if (statsRes.ok) {
        const statsData = await statsRes.json()
        setStats(statsData.stats)
      }

      return updatedAccount
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : "Failed to update account")
    }
  }

  const createSubscriptionPlan = async (planData: Omit<SubscriptionPlan, "id" | "created_at" | "updated_at">) => {
    try {
      const response = await fetch("/api/billing/plans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(planData),
      })

      if (!response.ok) {
        throw new Error("Failed to create subscription plan")
      }

      const newPlan = await response.json()
      setPlans((prev) => [...prev, newPlan.plan])
      return newPlan
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : "Failed to create plan")
    }
  }

  const updateSubscriptionPlan = async (planId: string, updates: Partial<SubscriptionPlan>) => {
    try {
      const response = await fetch(`/api/billing/plans/${planId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      })

      if (!response.ok) {
        throw new Error("Failed to update subscription plan")
      }

      const updatedPlan = await response.json()
      setPlans((prev) => prev.map((plan) => (plan.id === planId ? updatedPlan.plan : plan)))
      return updatedPlan
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : "Failed to update plan")
    }
  }

  const generateInvoice = async (tenantId: string) => {
    try {
      const response = await fetch("/api/billing/invoices/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tenant_id: tenantId }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate invoice")
      }

      return await response.json()
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : "Failed to generate invoice")
    }
  }

  const addCredit = async (tenantId: string, amount: number, reason: string) => {
    try {
      const response = await fetch("/api/billing/credits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tenant_id: tenantId, amount, reason }),
      })

      if (!response.ok) {
        throw new Error("Failed to add credit")
      }

      // Refresh accounts to show updated credit balance
      await fetchBillingData()
      return await response.json()
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : "Failed to add credit")
    }
  }

  const exportBillingData = async (format: "csv" | "json" = "csv") => {
    try {
      const response = await fetch(`/api/billing/export?format=${format}`)

      if (!response.ok) {
        throw new Error("Failed to export billing data")
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `billing-data-${new Date().toISOString().split("T")[0]}.${format}`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : "Failed to export data")
    }
  }

  useEffect(() => {
    fetchBillingData()
  }, [])

  return {
    accounts,
    stats,
    plans,
    invoices,
    churnRisk,
    projections,
    loading,
    error,
    refetch: fetchBillingData,
    updateBillingAccount,
    createSubscriptionPlan,
    updateSubscriptionPlan,
    generateInvoice,
    addCredit,
    exportBillingData,
  }
}
