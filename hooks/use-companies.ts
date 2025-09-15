"use client"

import { useState, useEffect, useCallback } from "react"
import { useApi } from "@/hooks/use-api"

interface Company {
  id: string
  name: string
  industry: string
  revenue_range: string
  employee_count: string
  ownership_type: string
  hq_city: string
  hq_country: string
  website: string
  phone: string
  email: string
  linkedin_url: string
  description: string
  status: "customer" | "prospect" | "strategic" | "partner" | string
  primary_location?: {
    city?: string
    country?: string
    address?: string
  }
  is_pinned: boolean
  engagement_score: number
  total_value: number
  deal_count: number
  contact_count: number
  owner_name: string
  last_engagement_date: string
  logo_url: string
  ai_insights?: any
  blockchain_verified: boolean
  rpa_automation_enabled: boolean
  created_at: string
  updated_at: string
}

interface CompaniesFilters {
  search?: string
  industry?: string
  revenue?: string
  status?: string
  owner?: string
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: "asc" | "desc"
}

export function useCompanies(initialFilters: CompaniesFilters = {}) {
  const { get, post, put, delete: del, loading, error } = useApi()
  const [companies, setCompanies] = useState<Company[]>([])
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
    totalPages: 0,
  })
  const [filters, setFilters] = useState<CompaniesFilters>(initialFilters)

  const fetchCompanies = useCallback(async () => {
    try {
      const params = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          params.append(key, value.toString())
        }
      })

      const response = await get(`/crm/companies?${params.toString()}`)
      if (response.success) {
        setCompanies(response.data || [])
        setPagination((prev) => ({ ...prev, ...(response.pagination || {}) }))
      }
    } catch (err) {
      console.error("Failed to fetch companies:", err)
    }
  }, [filters, get])

  const createCompany = useCallback(
    async (companyData: Partial<Company>) => {
      try {
        const response = await post("/crm/companies", companyData)
        if (response.success) {
          await fetchCompanies() // Refresh the list
          return response.data
        }
        throw new Error(response.error || "Failed to create company")
      } catch (err) {
        console.error("Failed to create company:", err)
        throw err
      }
    },
    [post, fetchCompanies],
  )

  const updateCompany = useCallback(
    async (id: string, companyData: Partial<Company>) => {
      try {
        const response = await put(`/crm/companies/${id}`, companyData)
        if (response.success) {
          await fetchCompanies() // Refresh the list
          return response.data
        }
        throw new Error(response.error || "Failed to update company")
      } catch (err) {
        console.error("Failed to update company:", err)
        throw err
      }
    },
    [put, fetchCompanies],
  )

  const deleteCompany = useCallback(
    async (id: string) => {
      try {
        const response = await del(`/crm/companies/${id}`)
        if (response.success) {
          await fetchCompanies() // Refresh the list
          return true
        }
        throw new Error(response.error || "Failed to delete company")
      } catch (err) {
        console.error("Failed to delete company:", err)
        throw err
      }
    },
    [del, fetchCompanies],
  )

  const getCompany = useCallback(
    async (id: string) => {
      try {
        const response = await get(`/crm/companies/${id}`)
        if (response.success) {
          return response.data
        }
        throw new Error(response.error || "Failed to fetch company")
      } catch (err) {
        console.error("Failed to fetch company:", err)
        throw err
      }
    },
    [get],
  )

  const getAIInsights = useCallback(
    async (id: string) => {
      try {
        const response = await get(`/crm/companies/${id}/ai-insights`)
        if (response.success) {
          return response.data
        }
        throw new Error(response.error || "Failed to fetch AI insights")
      } catch (err) {
        console.error("Failed to fetch AI insights:", err)
        throw err
      }
    },
    [get],
  )

  const exportCompanies = useCallback(async (companyIds?: string[], format: "csv" | "json" = "csv") => {
    try {
      const params = new URLSearchParams()
      if (companyIds && companyIds.length > 0) {
        params.append("ids", companyIds.join(","))
      }
      params.append("format", format)

      const response = await fetch(`/api/crm/companies/export?${params.toString()}`)

      if (format === "csv") {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `companies-export-${new Date().toISOString().split("T")[0]}.csv`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      } else {
        const data = await response.json()
        return data
      }
    } catch (err) {
      console.error("Failed to export companies:", err)
      throw err
    }
  }, [])

  const importCompanies = useCallback(
    async (file: File) => {
      try {
        const formData = new FormData()
        formData.append("file", file)

        const response = await fetch("/api/crm/companies/import", {
          method: "POST",
          body: formData,
        })

        const data = await response.json()

        if (data.success) {
          await fetchCompanies() // Refresh the list
          return data
        }
        throw new Error(data.error || "Failed to import companies")
      } catch (err) {
        console.error("Failed to import companies:", err)
        throw err
      }
    },
    [fetchCompanies],
  )

  const updateFilters = useCallback((newFilters: Partial<CompaniesFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }))
  }, [])

  const resetFilters = useCallback(() => {
    setFilters(initialFilters)
  }, [initialFilters])

  // Fetch companies when filters change
  useEffect(() => {
    fetchCompanies()
  }, [fetchCompanies])

  return {
    companies,
    pagination,
    filters,
    loading,
    error,
    fetchCompanies,
    createCompany,
    updateCompany,
    deleteCompany,
    getCompany,
    getAIInsights,
    exportCompanies,
    importCompanies,
    updateFilters,
    resetFilters,
  }
}
