"use client"

import useSWR, { type SWRConfiguration } from "swr"
import { logger } from "@/lib/logger"

/**
 * Custom hook for fetching and caching data with SWR
 *
 * @example
 * const { data, error, isLoading, mutate } = useCachedData(
 *   '/api/users',
 *   { revalidateOnFocus: false }
 * )
 */
export function useCachedData<T>(key: string | null, options?: SWRConfiguration<T>) {
  const { data, error, isLoading, isValidating, mutate } = useSWR<T>(key, options)

  return {
    data,
    error,
    isLoading,
    isValidating,
    mutate,
    isError: !!error,
  }
}

/**
 * Hook for fetching data with automatic retry and error handling
 */
export function useCachedDataWithRetry<T>(key: string | null, options?: SWRConfiguration<T>) {
  return useCachedData<T>(key, {
    ...options,
    shouldRetryOnError: true,
    errorRetryCount: 3,
    errorRetryInterval: 5000,
    onError: (error) => {
      logger.error("Data fetch error", error, { key })
      options?.onError?.(error, key || "", {} as any)
    },
  })
}

/**
 * Hook for fetching data with optimistic updates
 */
export function useCachedDataWithOptimistic<T>(key: string | null, options?: SWRConfiguration<T>) {
  const { data, mutate, ...rest } = useCachedData<T>(key, options)

  const optimisticUpdate = async (updater: (current: T | undefined) => T, revalidate = true) => {
    // Optimistically update the data
    await mutate(updater(data), {
      revalidate,
      optimisticData: updater(data),
      rollbackOnError: true,
    })
  }

  return {
    data,
    mutate,
    optimisticUpdate,
    ...rest,
  }
}
