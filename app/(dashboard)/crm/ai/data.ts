import { createServerClient } from "@/lib/supabase/server"

export async function fetchConversations() {
  try {
    const supabase = await createServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return []

    const { data: conversations, error } = await supabase
      .from("ai_conversations")
      .select("*, ai_messages(count)")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false })

    if (error) {
      console.error("Fetch conversations error:", error)
      return []
    }

    return conversations || []
  } catch (error) {
    console.error("Fetch conversations error:", error)
    return []
  }
}
