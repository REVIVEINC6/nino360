"use client"

import { useState, useCallback, useEffect } from "react"

export function useRealtime() {
  const [isConnected, setIsConnected] = useState(true)
  const [subscriptions, setSubscriptions] = useState<Map<string, Function>>(new Map())

  const subscribe = useCallback((channel: string, callback: Function) => {
    setSubscriptions((prev) => new Map(prev).set(channel, callback))
  }, [])

  const unsubscribe = useCallback((channel: string) => {
    setSubscriptions((prev) => {
      const newMap = new Map(prev)
      newMap.delete(channel)
      return newMap
    })
  }, [])

  // Mock connection status
  useEffect(() => {
    const interval = setInterval(() => {
      setIsConnected(Math.random() > 0.1) // 90% uptime simulation
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  return {
    isConnected,
    subscribe,
    unsubscribe,
  }
}
