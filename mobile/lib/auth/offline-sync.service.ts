import AsyncStorage from "@react-native-async-storage/async-storage"
import NetInfo from "@react-native-community/netinfo"
import { supabase } from "./mobile-auth.service"

interface OfflineAction {
  id: string
  type: string
  payload: any
  timestamp: number
  retryCount: number
}

const OFFLINE_QUEUE_KEY = "offline_action_queue"
const MAX_RETRY_COUNT = 3

// Queue offline actions
export async function queueOfflineAction(type: string, payload: any): Promise<void> {
  try {
    const queue = await getOfflineQueue()

    const action: OfflineAction = {
      id: `${Date.now()}-${Math.random()}`,
      type,
      payload,
      timestamp: Date.now(),
      retryCount: 0,
    }

    queue.push(action)
    await AsyncStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(queue))
  } catch (error) {
    console.error("[v0] Error queuing offline action:", error)
  }
}

// Get offline queue
async function getOfflineQueue(): Promise<OfflineAction[]> {
  try {
    const queueStr = await AsyncStorage.getItem(OFFLINE_QUEUE_KEY)
    return queueStr ? JSON.parse(queueStr) : []
  } catch (error) {
    console.error("[v0] Error getting offline queue:", error)
    return []
  }
}

// Process offline queue
export async function processOfflineQueue(): Promise<void> {
  try {
    const netInfo = await NetInfo.fetch()

    if (!netInfo.isConnected) {
      console.log("[v0] No internet connection, skipping offline queue processing")
      return
    }

    const queue = await getOfflineQueue()
    const failedActions: OfflineAction[] = []

    for (const action of queue) {
      try {
        await processAction(action)
      } catch (error) {
        console.error("[v0] Error processing action:", error)

        action.retryCount++

        if (action.retryCount < MAX_RETRY_COUNT) {
          failedActions.push(action)
        }
      }
    }

    await AsyncStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(failedActions))
  } catch (error) {
    console.error("[v0] Error processing offline queue:", error)
  }
}

// Process individual action
async function processAction(action: OfflineAction): Promise<void> {
  switch (action.type) {
    case "UPDATE_PROFILE":
      await supabase.from("user_profiles").update(action.payload.updates).eq("user_id", action.payload.userId)
      break

    case "LOG_SECURITY_EVENT":
      await supabase.from("auth_security_events").insert(action.payload)
      break

    default:
      console.warn("[v0] Unknown action type:", action.type)
  }
}

// Setup network listener
export function setupOfflineSync(): void {
  NetInfo.addEventListener((state) => {
    if (state.isConnected) {
      console.log("[v0] Network connected, processing offline queue")
      processOfflineQueue()
    }
  })
}

// Clear offline queue
export async function clearOfflineQueue(): Promise<void> {
  await AsyncStorage.removeItem(OFFLINE_QUEUE_KEY)
}
