import { createServerClient } from "@/lib/supabase/server"

export type NotificationType = "info" | "success" | "warning" | "error"
export type NotificationChannel = "in_app" | "email" | "sms" | "push"

interface NotificationConfig {
  userId: string
  title: string
  message: string
  type?: NotificationType
  channels?: NotificationChannel[]
  link?: string
  metadata?: Record<string, any>
  priority?: "low" | "medium" | "high" | "urgent"
}

export class NotificationService {
  private supabase: any

  constructor(supabase: any) {
    this.supabase = supabase
  }

  // Send notification through specified channels
  async send(config: NotificationConfig): Promise<void> {
    const channels = config.channels || ["in_app"]
    const promises = []

    if (channels.includes("in_app")) {
      promises.push(this.sendInApp(config))
    }

    if (channels.includes("email")) {
      promises.push(this.sendEmail(config))
    }

    if (channels.includes("sms")) {
      promises.push(this.sendSMS(config))
    }

    if (channels.includes("push")) {
      promises.push(this.sendPush(config))
    }

    await Promise.all(promises)
  }

  // In-app notification
  private async sendInApp(config: NotificationConfig): Promise<void> {
    await this.supabase.from("notifications").insert({
      user_id: config.userId,
      title: config.title,
      message: config.message,
      type: config.type || "info",
      link: config.link,
      metadata: config.metadata,
      priority: config.priority || "medium",
      read: false,
    })
  }

  // Email notification
  private async sendEmail(config: NotificationConfig): Promise<void> {
    // Fetch user email
    const { data: user } = await this.supabase.from("users").select("email").eq("id", config.userId).single()

    if (!user?.email) return

    // Queue email for sending
    await this.supabase.from("email_queue").insert({
      to: user.email,
      subject: config.title,
      body: config.message,
      priority: config.priority || "medium",
      metadata: config.metadata,
    })
  }

  // SMS notification (stub)
  private async sendSMS(config: NotificationConfig): Promise<void> {
    // Fetch user phone
    const { data: user } = await this.supabase.from("users").select("phone").eq("id", config.userId).single()

    if (!user?.phone) return

    // Queue SMS for sending
    await this.supabase.from("sms_queue").insert({
      to: user.phone,
      message: `${config.title}: ${config.message}`,
      priority: config.priority || "medium",
    })
  }

  // Push notification (stub)
  private async sendPush(config: NotificationConfig): Promise<void> {
    // Fetch user push tokens
    const { data: tokens } = await this.supabase.from("push_tokens").select("token").eq("user_id", config.userId)

    if (!tokens || tokens.length === 0) return

    // Queue push notifications
    const pushNotifications = tokens.map(({ token }) => ({
      token,
      title: config.title,
      body: config.message,
      data: config.metadata,
    }))

    await this.supabase.from("push_queue").insert(pushNotifications)
  }

  // Bulk notification
  async sendBulk(userIds: string[], config: Omit<NotificationConfig, "userId">): Promise<void> {
    const promises = userIds.map((userId) => this.send({ ...config, userId }))
    await Promise.all(promises)
  }

  // Mark as read
  async markAsRead(notificationId: string): Promise<void> {
    await this.supabase
      .from("notifications")
      .update({ read: true, read_at: new Date().toISOString() })
      .eq("id", notificationId)
  }

  // Mark all as read for user
  async markAllAsRead(userId: string): Promise<void> {
    await this.supabase
      .from("notifications")
      .update({ read: true, read_at: new Date().toISOString() })
      .eq("user_id", userId)
      .eq("read", false)
  }

  // Get unread count
  async getUnreadCount(userId: string): Promise<number> {
    const { count } = await this.supabase
      .from("notifications")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("read", false)

    return count || 0
  }
}

// Server action to send notification
export async function sendNotification(config: NotificationConfig) {
  "use server"

  try {
    const supabase = await createServerClient()
    const service = new NotificationService(supabase)
    await service.send(config)
    return { success: true }
  } catch (error) {
    console.error("[v0] Notification error:", error)
    return { success: false, error: "Failed to send notification" }
  }
}
