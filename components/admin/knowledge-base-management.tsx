"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, BookOpen, Eye, ThumbsUp, Edit, Trash2, Sparkles, FileText } from "lucide-react"
import { motion } from "framer-motion"
import {
  getKBArticles,
  createKBArticle,
  updateKBArticle,
  deleteKBArticle,
  generateKBSuggestions,
  type KBArticle,
} from "@/app/(dashboard)/admin/kb/actions"
import { toast } from "sonner"

export function KnowledgeBaseManagement() {
  const [search, setSearch] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [articles, setArticles] = useState<KBArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editingArticle, setEditingArticle] = useState<KBArticle | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "docs",
    tags: "",
    // API may return 'archived' as well; allow it in the form state to avoid type mismatch
    status: "draft" as "draft" | "published" | "archived",
  })

  useEffect(() => {
    loadArticles()
  }, [])

  async function loadArticles() {
    setLoading(true)
    const data = await getKBArticles()
    setArticles(data)
    setLoading(false)
  }

  async function handleCreate() {
    try {
      await createKBArticle({
        ...formData,
        // ensure status matches the action's expected union (cast safely)
        status: formData.status as "draft" | "published",
        tags: formData.tags.split(",").map((t) => t.trim()),
      })
      toast.success("Article created successfully")
      setCreateDialogOpen(false)
      setFormData({ title: "", content: "", category: "docs", tags: "", status: "draft" })
      loadArticles()
    } catch (error) {
      toast.error("Failed to create article")
    }
  }

  async function handleUpdate() {
    if (!editingArticle) return
    try {
      await updateKBArticle(editingArticle.id, {
        ...formData,
        status: formData.status as "draft" | "published",
        tags: formData.tags.split(",").map((t) => t.trim()),
      })
      toast.success("Article updated successfully")
      setEditingArticle(null)
      setFormData({ title: "", content: "", category: "docs", tags: "", status: "draft" })
      loadArticles()
    } catch (error) {
      toast.error("Failed to update article")
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this article?")) return
    try {
      await deleteKBArticle(id)
      toast.success("Article deleted successfully")
      loadArticles()
    } catch (error) {
      toast.error("Failed to delete article")
    }
  }

  async function handleAISuggestions() {
    const suggestions = await generateKBSuggestions(formData.title || "New Topic")
    setFormData((prev) => ({
      ...prev,
      title: suggestions.title,
      content: suggestions.outline.join("\n\n"),
      tags: suggestions.tags.join(", "),
    }))
    toast.success("AI suggestions generated")
  }

  const filteredArticles = articles.filter((article) => {
    const matchesSearch = article.title.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = filterCategory === "all" || article.category === filterCategory
    return matchesSearch && matchesCategory
  })

  const stats = {
    total: articles.length,
    published: articles.filter((a) => a.status === "published").length,
    totalViews: articles.reduce((sum, a) => sum + a.views, 0),
    avgHelpful:
      articles.length > 0 ? Math.round(articles.reduce((sum, a) => sum + a.helpful_count, 0) / articles.length) : 0,
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: "Total Articles", value: stats.total, icon: FileText, color: "from-blue-500 to-cyan-500" },
          { label: "Published", value: stats.published, icon: BookOpen, color: "from-green-500 to-emerald-500" },
          { label: "Total Views", value: stats.totalViews, icon: Eye, color: "from-purple-500 to-pink-500" },
          { label: "Avg Helpful", value: stats.avgHelpful, icon: ThumbsUp, color: "from-orange-500 to-red-500" },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="glass-card border-white/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg bg-linear-to-br ${stat.color}`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Search and Filters */}
      <Card className="glass-card border-white/20">
        <CardHeader>
          <CardTitle>Knowledge Base Articles</CardTitle>
          <CardDescription>Documentation, playbooks, and training materials</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-1 gap-2">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search articles..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="docs">Documentation</SelectItem>
                  <SelectItem value="playbooks">Playbooks</SelectItem>
                  <SelectItem value="training">Training</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Article
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create Knowledge Base Article</DialogTitle>
                  <DialogDescription>Add a new article to your knowledge base</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Title</Label>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Article title"
                    />
                  </div>
                  <div>
                    <Label>Category</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData({ ...formData, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="docs">Documentation</SelectItem>
                        <SelectItem value="playbooks">Playbooks</SelectItem>
                        <SelectItem value="training">Training</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Content</Label>
                    <Textarea
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      placeholder="Article content (Markdown supported)"
                      rows={8}
                    />
                  </div>
                  <div>
                    <Label>Tags (comma-separated)</Label>
                    <Input
                      value={formData.tags}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                      placeholder="guide, tutorial, getting-started"
                    />
                  </div>
                  <div>
                    <Label>Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value: "draft" | "published") => setFormData({ ...formData, status: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button variant="outline" onClick={handleAISuggestions} className="w-full bg-transparent">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate AI Suggestions
                  </Button>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreate}>Create Article</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Articles Table */}
      <Card className="glass-card border-white/20">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Views</TableHead>
                <TableHead>Helpful</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : filteredArticles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    <BookOpen className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No articles found. Create your first knowledge base article to get started.</p>
                  </TableCell>
                </TableRow>
              ) : (
                filteredArticles.map((article) => (
                  <TableRow key={article.id}>
                    <TableCell className="font-medium">{article.title}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{article.category}</Badge>
                    </TableCell>
                    <TableCell>{article.author_name}</TableCell>
                    <TableCell>
                      <Badge variant={article.status === "published" ? "default" : "secondary"}>{article.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {article.views}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <ThumbsUp className="h-3 w-3" />
                        {article.helpful_count}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingArticle(article)
                            setFormData({
                              title: article.title,
                              content: article.content,
                              category: article.category,
                              // guard: tags might already be a string or an array from the API
                              tags: Array.isArray(article.tags) ? article.tags.join(", ") : String(article.tags ?? ""),
                              status: article.status,
                            })
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(article.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={!!editingArticle} onOpenChange={(open) => !open && setEditingArticle(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Article</DialogTitle>
            <DialogDescription>Update the article details</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
            </div>
            <div>
              <Label>Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="docs">Documentation</SelectItem>
                  <SelectItem value="playbooks">Playbooks</SelectItem>
                  <SelectItem value="training">Training</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Content</Label>
              <Textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={8}
              />
            </div>
            <div>
              <Label>Tags (comma-separated)</Label>
              <Input value={formData.tags} onChange={(e) => setFormData({ ...formData, tags: e.target.value })} />
            </div>
            <div>
              <Label>Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: "draft" | "published") => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingArticle(null)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate}>Update Article</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
