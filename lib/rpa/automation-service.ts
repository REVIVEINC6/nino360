type Priority = "low" | "normal" | "high"
type TaskStatus = "queued" | "running" | "completed" | "failed"

export type RpaTask = {
  id: string
  name: string
  type: string
  priority: Priority
  parameters?: Record<string, unknown>
  status: TaskStatus
  createdAt: string
  updatedAt: string
}

const store = new Map<string, RpaTask>()

function genId() {
  // Prefer crypto.randomUUID if available
  try {
    // @ts-ignore
    if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID()
  } catch {}
  return `task_${Math.random().toString(36).slice(2)}`
}

async function simulateWork(ms = 50) {
  return new Promise((res) => setTimeout(res, ms))
}

export const rpa = {
  async createTask(input: {
    name: string
    type: string
    priority?: Priority
    parameters?: Record<string, unknown>
  }): Promise<RpaTask> {
    const now = new Date().toISOString()
    const task: RpaTask = {
      id: genId(),
      name: input.name,
      type: input.type,
      priority: input.priority ?? "normal",
      parameters: input.parameters,
      status: "queued",
      createdAt: now,
      updatedAt: now,
    }
    store.set(task.id, task)
    return task
  },

  async executeTask(id: string): Promise<{ id: string; status: Exclude<TaskStatus, "queued" | "failed"> }> {
    const task = store.get(id)
    if (!task) throw new Error(`Task not found: ${id}`)
    task.status = "running"
    task.updatedAt = new Date().toISOString()
    store.set(id, task)
    await simulateWork()
    task.status = "completed"
    task.updatedAt = new Date().toISOString()
    store.set(id, task)
    return { id: task.id, status: "completed" }
  },

  async getTask(id: string): Promise<RpaTask | undefined> {
    return store.get(id)
  },
}

// Alias to support different import styles
export const automationService = rpa
export default rpa
