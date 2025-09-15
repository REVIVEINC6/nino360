import type { NextRequest } from "next/server"
import { getUserWithTenant } from "@/lib/auth-server"
import { successResponse, errorResponse, unauthorizedResponse } from "@/lib/api-response"
import { uploadRateLimiter } from "@/lib/rate-limiter"
import { createServerSupabaseClient } from "@/lib/supabase-server"

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "application/pdf",
  "text/csv",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
]

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimitResult = await uploadRateLimiter.checkLimit(request)
    if (!rateLimitResult.allowed) {
      return errorResponse("Upload rate limit exceeded", 429)
    }

    const userContext = await getUserWithTenant()
    if (!userContext) {
      return unauthorizedResponse()
    }

    const { user, userData } = userContext
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return errorResponse("No file provided", 400)
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return errorResponse("File size exceeds 10MB limit", 400)
    }

    // Validate file type
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return errorResponse("File type not allowed", 400)
    }

    const supabase = await createServerSupabaseClient()

    // Generate unique filename
    const fileExt = file.name.split(".").pop()
    const fileName = `${userData.tenant_id}/${user.id}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`

    // Upload file to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage.from("uploads").upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
    })

    if (uploadError) {
      console.error("File upload error:", uploadError)
      return errorResponse("Failed to upload file", 500)
    }

    // Get public URL
    const { data: urlData } = supabase.storage.from("uploads").getPublicUrl(fileName)

    // Store file metadata
    const { data: fileRecord, error: recordError } = await supabase
      .from("file_uploads")
      .insert({
        tenant_id: userData.tenant_id,
        user_id: user.id,
        filename: file.name,
        file_path: fileName,
        file_size: file.size,
        file_type: file.type,
        public_url: urlData.publicUrl,
      })
      .select()
      .single()

    if (recordError) {
      console.error("File record error:", recordError)
      // Clean up uploaded file
      await supabase.storage.from("uploads").remove([fileName])
      return errorResponse("Failed to save file record", 500)
    }

    // Log file upload
    await supabase.from("audit_logs").insert({
      tenant_id: userData.tenant_id,
      user_id: user.id,
      action: "file_uploaded",
      resource_type: "file",
      resource_id: fileRecord.id,
      details: {
        filename: file.name,
        file_size: file.size,
        file_type: file.type,
        ip_address: request.ip,
      },
    })

    return successResponse(
      {
        id: fileRecord.id,
        filename: file.name,
        url: urlData.publicUrl,
        size: file.size,
        type: file.type,
      },
      "File uploaded successfully",
    )
  } catch (error) {
    console.error("Upload error:", error)
    return errorResponse("Internal server error", 500)
  }
}
