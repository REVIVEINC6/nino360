"use client"

import useSWR from "swr"
import { getDirectory } from "@/app/(dashboard)/hrms/employees/actions"
import { getAttendance } from "@/app/(dashboard)/hrms/attendance/actions"
import { getHRMSDashboardKPIs } from "@/app/(dashboard)/hrms/dashboard/actions"

// SWR fetcher wrapper for server actions
async function fetcher<T>(action: () => Promise<{ success: boolean; data?: T; error?: string }>) {
  const result = await action()
  if (!result.success) {
    throw new Error(result.error || "Failed to fetch data")
  }
  return result.data
}

// Hook for employee directory with SWR caching
export function useEmployeeDirectory(filters: Parameters<typeof getDirectory>[0]) {
  return useSWR(["employees-directory", JSON.stringify(filters)], () => fetcher(() => getDirectory(filters)), {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    dedupingInterval: 5000, // 5 seconds
  })
}

// Hook for attendance data with SWR caching
export function useAttendanceData(filters: Parameters<typeof getAttendance>[0]) {
  return useSWR(["attendance-data", JSON.stringify(filters)], () => fetcher(() => getAttendance(filters)), {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    dedupingInterval: 5000,
  })
}

// Hook for HRMS dashboard KPIs with SWR caching
export function useHRMSDashboardKPIs() {
  return useSWR("hrms-dashboard-kpis", () => fetcher(getHRMSDashboardKPIs), {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    dedupingInterval: 30000, // 30 seconds
    refreshInterval: 60000, // Refresh every minute
  })
}

// Hook for real-time updates using Supabase subscriptions
export function useRealtimeEmployees() {
  const { data, mutate } = useEmployeeDirectory({ page: 1, pageSize: 20 })

  // TODO: Add Supabase realtime subscription here
  // useEffect(() => {
  //   const channel = supabase
  //     .channel('hrms-employees-changes')
  //     .on('postgres_changes', {
  //       event: '*',
  //       schema: 'public',
  //       table: 'hrms_employees'
  //     }, () => {
  //       mutate() // Revalidate on changes
  //     })
  //     .subscribe()
  //
  //   return () => { supabase.removeChannel(channel) }
  // }, [mutate])

  return { data, mutate }
}

// Hook for performance data with SWR caching
export function usePerformanceData() {
  const {
    data: goals,
    error: goalsError,
    isLoading: goalsLoading,
  } = useSWR(
    "performance-goals",
    async () => {
      // Fetch from performance actions when available
      return []
    },
    {
      revalidateOnFocus: false,
      refreshInterval: 30000,
    },
  )

  const {
    data: reviews,
    error: reviewsError,
    isLoading: reviewsLoading,
  } = useSWR(
    "performance-reviews",
    async () => {
      // Fetch from performance actions when available
      return { pending: 0, completed: 0, avgRating: "N/A", ratingChange: 0 }
    },
    {
      revalidateOnFocus: false,
      refreshInterval: 30000,
    },
  )

  const {
    data: feedback,
    error: feedbackError,
    isLoading: feedbackLoading,
  } = useSWR(
    "performance-feedback",
    async () => {
      // Fetch from performance actions when available
      return { activeCycles: 0, responseRate: 0 }
    },
    {
      revalidateOnFocus: false,
      refreshInterval: 30000,
    },
  )

  return {
    goals,
    reviews,
    feedback,
    isLoading: goalsLoading || reviewsLoading || feedbackLoading,
    error: goalsError || reviewsError || feedbackError,
  }
}

// Hook for compensation data with SWR caching
export function useCompensationData() {
  const {
    data: bands,
    error: bandsError,
    isLoading: bandsLoading,
  } = useSWR(
    "compensation-bands",
    async () => {
      // Fetch from compensation actions when available
      return []
    },
    {
      revalidateOnFocus: false,
      refreshInterval: 60000,
    },
  )

  const {
    data: cycles,
    error: cyclesError,
    isLoading: cyclesLoading,
  } = useSWR(
    "compensation-cycles",
    async () => {
      // Fetch from compensation actions when available
      return { nextReview: "Not scheduled", cycleType: "Annual", budgetAllocated: "$0" }
    },
    {
      revalidateOnFocus: false,
      refreshInterval: 60000,
    },
  )

  const {
    data: adjustments,
    error: adjustmentsError,
    isLoading: adjustmentsLoading,
  } = useSWR(
    "compensation-adjustments",
    async () => {
      // Fetch from compensation actions when available
      return []
    },
    {
      revalidateOnFocus: false,
      refreshInterval: 30000,
    },
  )

  return {
    bands,
    cycles,
    adjustments,
    isLoading: bandsLoading || cyclesLoading || adjustmentsLoading,
    error: bandsError || cyclesError || adjustmentsError,
  }
}

// Hook for benefits data with SWR caching
export function useBenefitsData() {
  const {
    data: plans,
    error: plansError,
    isLoading: plansLoading,
  } = useSWR(
    "benefits-plans",
    async () => {
      // Fetch from benefits actions when available
      return []
    },
    {
      revalidateOnFocus: false,
      refreshInterval: 60000,
    },
  )

  const {
    data: enrollment,
    error: enrollmentError,
    isLoading: enrollmentLoading,
  } = useSWR(
    "benefits-enrollment",
    async () => {
      // Fetch from benefits actions when available
      return {
        period: "No active enrollment period",
        eligible: 0,
        enrolled: 0,
        pending: 0,
        participationRate: 0,
      }
    },
    {
      revalidateOnFocus: false,
      refreshInterval: 60000,
    },
  )

  const {
    data: claims,
    error: claimsError,
    isLoading: claimsLoading,
  } = useSWR(
    "benefits-claims",
    async () => {
      // Fetch from benefits actions when available
      return []
    },
    {
      revalidateOnFocus: false,
      refreshInterval: 30000,
    },
  )

  return {
    plans,
    enrollment,
    claims,
    isLoading: plansLoading || enrollmentLoading || claimsLoading,
    error: plansError || enrollmentError || claimsError,
  }
}
