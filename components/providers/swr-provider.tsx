"use client"

import type React from "react"
import { SWRConfig } from "swr"
import { logger } from "@/lib/logger"

const swrConfig = {
  // Revalidate on focus
  revalidateOnFocus: true,

  // Revalidate on reconnect
  revalidateOnReconnect: true,

  // Dedupe requests within 2 seconds
  dedupingInterval: 2000,

  // Keep data fresh for 5 minutes
  focusThrottleInterval: 5 * 60 * 1000,

  // Retry on error
  shouldRetryOnError: true,
  errorRetryCount: 3,
  errorRetryInterval: 5000,

  // Global fetcher
  fetcher: async (url: string) => {
    const res = await fetch(url)

    if (!res.ok) {
      const error = new Error("An error occurred while fetching the data.")
      logger.error("SWR fetch error", error, { url, status: res.status })
      throw error
    }

    return res.json()
  },

  // On error callback
  onError: (error: Error, key: string) => {
    logger.error("SWR error", error, { key })
  },

  // On success callback
  onSuccess: (data: any, key: string) => {
    logger.debug("SWR success", { key, dataSize: JSON.stringify(data).length })
  },
}

export function SWRProvider({ children }: { children: React.ReactNode }) {
  return <SWRConfig value={swrConfig}>{children}</SWRConfig>
}
