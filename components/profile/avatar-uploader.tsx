"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload, Loader2 } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { uploadAvatar } from "@/app/(app)/profile/actions"

interface AvatarUploaderProps {
  currentUrl?: string
  fullName: string
}

export function AvatarUploader({ currentUrl, fullName }: AvatarUploaderProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState(currentUrl)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const initials = fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string)
    }
    reader.readAsDataURL(file)

    // Upload
    setIsUploading(true)
    const formData = new FormData()
    formData.append("file", file)

    const result = await uploadAvatar(formData)

    if (result.error) {
      toast({
        title: "Upload failed",
        description: result.error,
        variant: "destructive",
      })
      setPreviewUrl(currentUrl)
    } else {
      toast({
        title: "Avatar updated",
        description: "Your profile picture has been updated",
      })
      setPreviewUrl(result.avatar_url)
    }

    setIsUploading(false)
  }

  return (
    <div className="flex items-center gap-4">
      <Avatar className="h-24 w-24 ring-2 ring-[#8B5CF6]/20">
        <AvatarImage src={previewUrl || "/placeholder.svg"} />
        <AvatarFallback className="text-2xl bg-gradient-to-br from-[#4F46E5] to-[#8B5CF6]">{initials}</AvatarFallback>
      </Avatar>
      <div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          disabled={isUploading}
        />
        <Button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          variant="outline"
          className="bg-white/5 border-white/10 hover:bg-white/10"
        >
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Change Avatar
            </>
          )}
        </Button>
        <p className="text-xs text-muted-foreground mt-2">JPG, PNG or GIF. Max 2MB.</p>
      </div>
    </div>
  )
}
