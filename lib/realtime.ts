import { supabase } from "@/lib/supabase/client"
import type { RealtimeChannel } from "@supabase/supabase-js"

interface RealtimeSubscription {
  channel: RealtimeChannel
  listeners: Map<string, (event: string, payload: any) => void>
}

class RealtimeManager {
  private subscriptions: Map<string, RealtimeSubscription> = new Map()

  subscribe(channelName: string, events: string[] = ["postgres_changes"]) {
    if (this.subscriptions.has(channelName)) {
      return this.subscriptions.get(channelName)!.channel
    }

    const channel = supabase.channel(channelName)
    const subscription: RealtimeSubscription = {
      channel,
      listeners: new Map(),
    }

    // Subscribe to postgres changes by default
    if (events.includes("postgres_changes")) {
      channel.on("postgres_changes", { event: "*", schema: "public" }, (payload) => {
        subscription.listeners.forEach((listener) => {
          listener("postgres_changes", payload)
        })
      })
    }

    // Subscribe to broadcast events
    if (events.includes("broadcast")) {
      channel.on("broadcast", { event: "*" }, (payload) => {
        subscription.listeners.forEach((listener) => {
          listener("broadcast", payload)
        })
      })
    }

    // Subscribe to presence events
    if (events.includes("presence")) {
      channel.on("presence", { event: "*" }, (payload) => {
        subscription.listeners.forEach((listener) => {
          listener("presence", payload)
        })
      })
    }

    channel.subscribe((status) => {
      console.log(`Realtime subscription ${channelName} status:`, status)
    })

    this.subscriptions.set(channelName, subscription)
    return channel
  }

  addListener(channelName: string, listener: (event: string, payload: any) => void) {
    const subscription = this.subscriptions.get(channelName)
    if (subscription) {
      const listenerId = `listener_${Date.now()}_${Math.random()}`
      subscription.listeners.set(listenerId, listener)
      return listenerId
    }
    return null
  }

  removeListener(channelName: string, listenerId: string) {
    const subscription = this.subscriptions.get(channelName)
    if (subscription) {
      subscription.listeners.delete(listenerId)
    }
  }

  unsubscribe(channelName: string) {
    const subscription = this.subscriptions.get(channelName)
    if (subscription) {
      subscription.channel.unsubscribe()
      this.subscriptions.delete(channelName)
    }
  }

  cleanup() {
    this.subscriptions.forEach((subscription, channelName) => {
      subscription.channel.unsubscribe()
    })
    this.subscriptions.clear()
  }

  // Broadcast a message to a channel
  broadcast(channelName: string, event: string, payload: any) {
    const subscription = this.subscriptions.get(channelName)
    if (subscription) {
      subscription.channel.send({
        type: "broadcast",
        event,
        payload,
      })
    }
  }

  // Track presence in a channel
  track(channelName: string, state: any) {
    const subscription = this.subscriptions.get(channelName)
    if (subscription) {
      subscription.channel.track(state)
    }
  }

  // Untrack presence in a channel
  untrack(channelName: string) {
    const subscription = this.subscriptions.get(channelName)
    if (subscription) {
      subscription.channel.untrack()
    }
  }
}

export const realtimeManager = new RealtimeManager()

// Utility functions for common realtime patterns
export function subscribeToUserProfile(userId: string, callback: (profile: any) => void) {
  const channelName = `user_profile_${userId}`
  realtimeManager.subscribe(channelName, ["postgres_changes"])

  return realtimeManager.addListener(channelName, (event, payload) => {
    if (event === "postgres_changes" && payload.table === "user_profiles") {
      if (payload.eventType === "UPDATE" && payload.new.id === userId) {
        callback(payload.new)
      }
    }
  })
}

export function subscribeToTenantUpdates(tenantId: string, callback: (data: any) => void) {
  const channelName = `tenant_${tenantId}`
  realtimeManager.subscribe(channelName, ["postgres_changes"])

  return realtimeManager.addListener(channelName, (event, payload) => {
    if (event === "postgres_changes") {
      // Filter for tenant-related tables
      const tenantTables = ["tenants", "user_profiles", "roles", "role_assignments"]
      if (tenantTables.includes(payload.table)) {
        callback(payload)
      }
    }
  })
}

export function subscribeToRoleChanges(callback: (data: any) => void) {
  const channelName = "role_changes"
  realtimeManager.subscribe(channelName, ["postgres_changes"])

  return realtimeManager.addListener(channelName, (event, payload) => {
    if (event === "postgres_changes") {
      const roleTables = ["roles", "role_assignments", "user_profiles"]
      if (roleTables.includes(payload.table)) {
        callback(payload)
      }
    }
  })
}
