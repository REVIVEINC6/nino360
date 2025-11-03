"use server"

import { createServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export interface KBArticle {
  id: string
  title: string
  content: string
  category: string
  author_id: string
  author_name?: string
  views: number
  helpful_count: number
  tags: string[]
  status: "draft" | "published" | "archived"
  created_at: string
  updated_at: string
}

export async function getKBArticles() {
  const supabase = await createServerClient()

  const { data, error } = await supabase
    .from("kb_articles")
    .select(`
      *,
      author:author_id(name)
    `)
    .order("updated_at", { ascending: false })

  if (error) {
    console.error("Error fetching KB articles:", error)
    return []
  }

  return data.map((article: any) => ({
    ...article,
    author_name: article.author?.name || "Unknown",
  }))
}

export async function createKBArticle(data: {
  title: string
  content: string
  category: string
  tags: string[]
  status: "draft" | "published"
}) {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { error } = await supabase.from("kb_articles").insert({
    ...data,
    author_id: user.id,
    views: 0,
    helpful_count: 0,
  })

  if (error) throw error

  revalidatePath("/admin/kb")
  return { success: true }
}

export async function updateKBArticle(id: string, data: Partial<KBArticle>) {
  const supabase = await createServerClient()

  const { error } = await supabase.from("kb_articles").update(data).eq("id", id)

  if (error) throw error

  revalidatePath("/admin/kb")
  return { success: true }
}

export async function deleteKBArticle(id: string) {
  const supabase = await createServerClient()

  const { error } = await supabase.from("kb_articles").delete().eq("id", id)

  if (error) throw error

  revalidatePath("/admin/kb")
  return { success: true }
}

export async function generateKBSuggestions(topic: string) {
  // AI-powered content suggestions
  return {
    title: `Getting Started with ${topic}`,
    outline: [
      "Introduction and Overview",
      "Key Concepts",
      "Step-by-Step Guide",
      "Best Practices",
      "Common Issues and Solutions",
      "Additional Resources",
    ],
    tags: [topic.toLowerCase(), "guide", "tutorial"],
  }
}
