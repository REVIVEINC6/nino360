"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Upload,
  Search,
  Download,
  Trash2,
  FileText,
  ImageIcon,
  File,
  Video,
  Music,
  Archive,
  Filter,
} from "lucide-react"
import { getProjectFiles, uploadProjectFile, deleteProjectFile } from "@/app/(dashboard)/projects/[id]/files/actions"
import { useEffect } from "react"
import { formatDistanceToNow } from "date-fns"

interface ProjectFilesContentProps {
  projectId: string
}

export function ProjectFilesContent({ projectId }: ProjectFilesContentProps) {
  const [files, setFiles] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [isUploading, setIsUploading] = useState(false)

  useEffect(() => {
    loadFiles()
  }, [projectId])

  async function loadFiles() {
    const data = await getProjectFiles(projectId)
    setFiles(data)
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    const formData = new FormData()
    formData.append("projectId", projectId)
    formData.append("file", file)
    formData.append("category", "general")
    formData.append("description", "")

    await uploadProjectFile(formData)
    await loadFiles()
    setIsUploading(false)
  }

  async function handleDelete(fileId: string) {
    if (!confirm("Are you sure you want to delete this file?")) return
    await deleteProjectFile(fileId, projectId)
    await loadFiles()
  }

  const filteredFiles = files.filter((file) => {
    const matchesSearch = file.file_name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || file.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const categories = ["all", "documents", "images", "videos", "other"]
  const totalSize = files.reduce((acc, file) => acc + file.file_size, 0)
  const documentCount = files.filter((f) => f.category === "documents").length
  const imageCount = files.filter((f) => f.category === "images").length

  function getFileIcon(fileType: string) {
    if (fileType.startsWith("image/")) return <ImageIcon className="h-5 w-5" />
    if (fileType.startsWith("video/")) return <Video className="h-5 w-5" />
    if (fileType.startsWith("audio/")) return <Music className="h-5 w-5" />
    if (fileType.includes("pdf") || fileType.includes("document")) return <FileText className="h-5 w-5" />
    if (fileType.includes("zip") || fileType.includes("archive")) return <Archive className="h-5 w-5" />
    return <File className="h-5 w-5" />
  }

  function formatFileSize(bytes: number) {
    if (bytes < 1024) return bytes + " B"
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
    return (bytes / (1024 * 1024)).toFixed(1) + " MB"
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Project Files
          </h2>
          <p className="text-sm text-muted-foreground mt-1">Manage project documents and files</p>
        </div>
        <div>
          <input type="file" id="file-upload" className="hidden" onChange={handleUpload} disabled={isUploading} />
          <Button asChild disabled={isUploading}>
            <label htmlFor="file-upload" className="cursor-pointer">
              <Upload className="mr-2 h-4 w-4" />
              {isUploading ? "Uploading..." : "Upload File"}
            </label>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Files</p>
              <p className="text-2xl font-bold">{files.length}</p>
            </div>
            <File className="h-8 w-8 text-blue-600" />
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Documents</p>
              <p className="text-2xl font-bold">{documentCount}</p>
            </div>
            <FileText className="h-8 w-8 text-purple-600" />
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-pink-50 to-blue-50 border-pink-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Images</p>
              <p className="text-2xl font-bold">{imageCount}</p>
            </div>
            <ImageIcon className="h-8 w-8 text-pink-600" />
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Size</p>
              <p className="text-2xl font-bold">{formatFileSize(totalSize)}</p>
            </div>
            <Archive className="h-8 w-8 text-blue-600" />
          </div>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Files Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredFiles.map((file) => (
          <Card key={file.id} className="p-4 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-blue-50 to-purple-50">
                  {getFileIcon(file.file_type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{file.file_name}</p>
                  <p className="text-xs text-muted-foreground">{formatFileSize(file.file_size)}</p>
                </div>
              </div>
            </div>

            <div className="space-y-2 mb-3">
              <Badge variant="secondary">{file.category}</Badge>
              <p className="text-xs text-muted-foreground">
                Uploaded {formatDistanceToNow(new Date(file.uploaded_at), { addSuffix: true })}
              </p>
              <p className="text-xs text-muted-foreground">by {file.uploaded_by_user?.full_name || "Unknown"}</p>
            </div>

            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                <Download className="mr-2 h-3 w-3" />
                Download
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleDelete(file.id)}>
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {filteredFiles.length === 0 && (
        <Card className="p-12 text-center">
          <File className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No files found</p>
        </Card>
      )}
    </div>
  )
}
